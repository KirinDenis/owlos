/*
Встроеный скрипт. 

Менеджер:
scriptCreate(name, sourceCode)
- создать скрипт (имя, source code):
-- вызывает компиляция, если нет ошибок, сохраняет данные и байт код в файл с именем скрипта. Иначе возвращает ошибку. Добавляет Свойства в запись о скриптах. 

scriptRun(name)
- запускает скрипт - имя. 
-- скрипт выполняется инструкция за инструкций, перед выполнением инструкции создается файл scriptName.inrun, который удаляется после выполнения инструкции (или в него IP)
   если перед выполнением файл содержит IP - иснтрукция вызвала фатальный сбой контроллера - script останавливается и переходит в режим "ошиба исполненния"
-- при запуске контроллера все скрипты с состоянием Run - автоматически запускаются. 

scriptStop(name)
- останавливает выполнение скрипта. 

scriptCreate(name, sourceCode)
- замена - создает и перекомпилирует скрипт с таким же именем. 
--если скрипт исполнялся - останавливает и ждет Run

scriptDelete(name)
- удаляет скрипт. 

Поддерживается много скриптов, исполнение паралельно. 
Свойства скрипта:
- Имя (оно же имя файла)
Состояния:
- исполняется. 
- остановлен. 
- ошибка компиляции. 
- ошибка исполнения. 


Квантование:
- сколько инструкций можно выполнить за один Loop

API для доступа к переменным - к текущему состоянию
*/


#include <Arduino.h>

#include "DeviceManager.h"
#include "..\..\UnitProperties.h"

#define heapLimit 5000 //5kb of heap must be free 

#define scriptSize 4
#define codeSize 100
#define dataSize 100

#define stopCode 0
#define sumCode 1
#define writeCode 2
#define gotoCode 3
#define ifupperCode 4
#define getpropCode 5
#define setpropCode 6

#define stopStatus 0
#define runStatus 1
#define compilerErrorStatus 2
#define runtimeErrorStatus 3

struct Instruction
{
	int type = stopCode;
	int arg1Addr;
	int arg2Addr;
	int arg3Addr;
	int resultAddr;
};

typedef struct Variable
{
	int type;
	char *name;
	char *value;

};

typedef struct Script
{
	String name;
	String byteCode;
	int status = stopStatus;
	int ip = -1;           //instruction pointer
	int codeCount = 0;
	int dataCount = 0;
	int timeQuant = 1; // -1 forever
	int quantCounter = 0;

	Instruction* code;
	Variable* data;
};

int scriptCount = -1;

Script scripts[scriptSize];

//Script managment's functions -------------------------------

void scriptsReset(int index) {
	if ((index < 0) || (index > scriptSize - 1)) return;
	filesWriteInt(scripts[index].name + ".rf", -1); //escapre RF flag 
	scripts[index].name = "";
	scripts[index].byteCode = "";
	scripts[index].status = stopStatus;
	scripts[index].ip = -1;
	scripts[index].codeCount = 0;
	scripts[index].dataCount = 0;
	scripts[index].timeQuant = 2;
	scripts[index].quantCounter = 0;
	free(scripts[0].code);
	free(scripts[0].data);
	return;
}

int scriptsGetByIndex(String name) {

	for (int i = 0; i < scriptSize; i++)
	{
		if (scripts[i].name == name)
		{
			return i;
		}
	}
	return -1;
}

bool scriptsSave() {
	String result = "";
	for (int i = 0; i < scriptSize; i++) {
		if (scripts[i].name.length() != 0) { //zero string - script deleted
			result += "script:" + scripts[i].name + "\r";
			result += "status=" + String(scripts[i].status) + "\r";
			result += "bytecode=" + String(scripts[i].byteCode) + "\r";
			result += "codecount=" + String(scripts[i].codeCount) + "\r";
			result += "datacount=" + String(scripts[i].dataCount) + "\r";
			result += "timequant=" + String(scripts[i].timeQuant) + "\r";
		}
	}
	return filesWriteString("scripts", result);
}



bool scriptsDelete(String name) {
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		scriptsReset[index];
		return true;
	}
	return false;
}

bool scriptsStop(String name) {
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		scripts[index].status = stopStatus;
		return true;
	}
	return false;
}

bool scriptsRun(String name) {
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		scripts[index].status = runStatus;
		return true;
	}
	return false;
}


//Instruction managment functions ------------------------------
int pushInstruction(int index, int addr, int type, int arg1Addr, int arg2Addr, int arg3Addr, int resultAddr) {

	Instruction* instruction = (Instruction *)malloc(sizeof(Instruction));
	instruction->type = sumCode;
	instruction->arg1Addr = arg1Addr;
	instruction->arg2Addr = arg2Addr;
	instruction->arg3Addr = arg3Addr;
	instruction->resultAddr = resultAddr;
	scripts[index].code[addr] = *instruction;

	return 1;
}

int pushData(int index, String name, String value) {

	scripts[index].data[scripts[index].dataCount].name = (char *)malloc(sizeof(char) * (name.length() + 1));
	strcpy(scripts[index].data[scripts[index].dataCount].name, name.c_str());

	scripts[index].data[scripts[index].dataCount].value = (char *)malloc(sizeof(char) * (value.length() + 1));
	strcpy(scripts[index].data[scripts[index].dataCount].value, value.c_str());


	//	scripts[index].data[scripts[index].dataCount].name = _name;
	//	scripts[index].data[scripts[index].dataCount].value = _value;

	return scripts[index].dataCount++;
}

int getDataAddr(int index, String name) {
	String _name;
	for (int i = 0; i < scripts[index].dataCount; i++) {
		_name = *scripts[index].data[i].name;
		if (_name == name) {
			return i;
		}
	}
	return -1;
}

//--------------------------------------------------------------------------------------------------------
//instructions
int addSum(int index, int addr, int arg1Addr, int arg2Addr, int resultAddr) {
	scripts[index].code[addr].type = sumCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].resultAddr = resultAddr;
	return 1;
}

int runSum(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != sumCode) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	////Serial.println("-->" + String(value1));
	////Serial.println("-->" + String(value2));
	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());
	String result = String(arg1 + arg2);
	////Serial.println("-->" + String(result));

	strcpy(scripts[index].data[scripts[index].code[ip].resultAddr].value, result.c_str());

	////Serial.println("!->" + String(scripts[index].code[ip].arg1Addr));
	////Serial.println("!->" + String(scripts[index].code[ip].arg2Addr));
	////Serial.println("!->" + String(scripts[index].code[ip].resultAddr));
	////Serial.println("2!->" + String(scripts[index].data[scripts[index].code[ip].arg1Addr].value));
	////Serial.println("2!->" + String(scripts[index].data[scripts[index].code[ip].arg2Addr].value));
	////Serial.println("2!->" + String(scripts[index].data[scripts[index].code[ip].resultAddr].value));

	return ++ip;
}

int addWrite(int index, int addr, int arg1Addr) {
	scripts[index].code[addr].type = writeCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	return 1;
}

int runWrite(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != writeCode) return -1;

	Serial.println(String(scripts[index].data[scripts[index].code[ip].arg1Addr].value));

	return ++ip;
}

int addGoto(int index, int addr, int arg1Addr) {
	scripts[index].code[addr].type = gotoCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	return 1;
}

int runGoto(int index) {
	int ip = scripts[index].ip;
	////Serial.println("-- goto: " + String(scripts[index].code[ip].arg1Addr));
	if (scripts[index].code[ip].type != gotoCode) return -1;
	return scripts[index].code[ip].arg1Addr;
}

int addIfupper(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	scripts[index].code[addr].type = ifupperCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runIfupper(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != ifupperCode) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());
	if (arg1 > arg2) {
		return scripts[index].code[ip].arg3Addr;
	}
	else {
		return ++ip;
	}
}

int addGetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	scripts[index].code[addr].type = getpropCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runGetProp(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != getpropCode) return -1;

	String deviceId = scripts[index].data[scripts[index].code[ip].arg1Addr].value;	
	String deviceProp = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	
	String value = devicesGetDeviceProperty(deviceId, deviceProp);
	
	if ((value.length() == 0) || (value ==  WrongPropertyName)) //then try get this property from unit
	{
		value = unitOnMessage(unitGetTopic() + "/get" + deviceProp, "", NoTransportMask);	
	}
	
	if ((value.length() == 0) || (value == WrongPropertyName))
	{
		return -1; //temporary
	}	
	strcpy(scripts[index].data[scripts[index].code[ip].arg3Addr].value, value.c_str());
	
	return ++ip;
}

int addSetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	scripts[index].code[addr].type = setpropCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runSetProp(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != setpropCode) return -1;
	
	String deviceId = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String deviceProp = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	String value = scripts[index].data[scripts[index].code[ip].arg3Addr].value;

	String result = devicesSetDeviceProperty(deviceId, deviceProp, value);
	
	if ((result.length() == 0) || (result == WrongPropertyName)) //try set unit property
	{
		result = unitOnMessage(unitGetTopic() + "/set" + deviceProp, value, NoTransportMask);	
	}
	
	if ((result.length() == 0) || (result == WrongPropertyName))
	{
		return -1;
	}
	
	return ++ip;
}


//--------------------------------------------------------------------------------------------------------
//Executor and Compiler
bool executeInstruction(int index) {
	int ip = scripts[index].ip;
	//Serial.println("CODE -->" + String(ip));
	switch (scripts[index].code[ip].type)
	{
	case stopCode: //default
		scripts[index].ip = -1;
		break;
	case sumCode:
		scripts[index].ip = runSum(index);
		break;
	case writeCode:
		scripts[index].ip = runWrite(index);
		break;
	case gotoCode:
		scripts[index].ip = runGoto(index);
		break;
	case ifupperCode:
		scripts[index].ip = runIfupper(index);
		break;
	case getpropCode:
		scripts[index].ip = runGetProp(index);
		break;
	case setpropCode:
		scripts[index].ip = runSetProp(index);
		break;
	default:
		scripts[index].ip = -1;
	}
	//Serial.println("CODE --<" + String(scripts[index].ip));
	if (scripts[index].ip != -1) return true;
	else
		return false;
}

bool scriptsRun() {
	for (int i = 0; i < scriptSize; i++)
	{
		if (scripts[i].name.length() != 0)
		{
			if (scripts[i].status == runStatus)
			{
				scripts[i].quantCounter = 0;
				while (true)
				{
					int lastInstructionCode = filesReadInt(scripts[i].name + ".rf"); //run flag					
					if (lastInstructionCode != -1) //loose last instruction TODO: use the value for debug
					{
						scripts[i].status = runtimeErrorStatus;
						break;
					}
					filesWriteInt(scripts[i].name + ".rf", scripts[i].ip); //up RF flag (store last instruction)
					bool result = executeInstruction(i);
					filesWriteInt(scripts[i].name + ".rf", -1); //escapre RF flag 
					if (!result)
					{
						scripts[i].status = stopStatus;
						break;
					}
					scripts[i].quantCounter++;
					if (scripts[i].quantCounter > scripts[i].timeQuant) break;
				}
			}
		}
	}
	return true;
}

bool scriptsCompile(int index) {

	scripts[index].ip = 0;
	scripts[index].codeCount = 0;
	scripts[index].dataCount = 0;

	String prog = "";
	String lineDelimiter = "\n";
	String argDelimiter = ",";

	int linePos = 0;
	String command;

	//calculate code and data size 
	int _dataCount = 10; //reserve one 
	int _codeCount = 10; //reserve one 
	String byteCode = scripts[index].byteCode;
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{
		command = byteCode.substring(0, linePos);
		if (command.indexOf("var ") == 0) _dataCount++;
		else
			_codeCount++;
		byteCode.remove(0, linePos + lineDelimiter.length());
	}

	if ((ESP.getFreeHeap() - heapLimit) < (sizeof(Instruction) * _codeCount + sizeof(Variable) * _dataCount))
	{
		//out of heap
		return false;
	}

	//Serial.println("-->" + String(_codeCount));
	//Serial.println("-->" + String(_dataCount));

	scripts[index].code = (Instruction*)malloc(sizeof(Instruction) * _codeCount);

	scripts[index].data = (Variable*)malloc(sizeof(Variable) * _dataCount);

	//return to parse code
	linePos = 0;
	byteCode = scripts[index].byteCode;
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{
		command = byteCode.substring(0, linePos);

		if (command.indexOf("var ") == 0) //variable
		{
			//Serial.println("->" + command);
			String varArg = command.substring(4, command.length());
			String varName = varArg.substring(0, varArg.indexOf('='));
			String varValue = varArg.substring(varArg.indexOf('=') + 1);
			//Serial.println("-->var " + varName + " " + varValue);
			pushData(index, varName, varValue);
		}
		else //Instruction parsin section
		{

			String instruction = command.substring(0, command.indexOf(" ") + 1);
			String args = command.substring(command.indexOf(" ") + 1) + argDelimiter;
			int argPos = 0;
			int argCount = 0;
			String arg;
			String arg1;
			String arg2;
			String arg3;
			while ((argPos = args.indexOf(argDelimiter)) != -1)
			{
				arg = args.substring(0, argPos);
				switch (argCount)
				{
				case 0: arg1 = arg; break;
				case 1: arg2 = arg; break;
				case 2: arg3 = arg; break;
				}
				argCount++;
				args.remove(0, argPos + argDelimiter.length());
			}

			if (instruction.indexOf("sum ") == 0) //sum
			{
				//Serial.println("->" + instruction);
				//Serial.println("-->Sum" + arg1 + arg2 + arg3);
				addSum(index, scripts[index].codeCount, getDataAddr(index, arg1), getDataAddr(index, arg2), getDataAddr(index, arg3));
				scripts[index].codeCount++;
			}
			else
				if (instruction.indexOf("write ") == 0) //write
				{
					//Serial.println("->" + instruction);
					//Serial.println("-->write" + arg1);
					addWrite(index, scripts[index].codeCount, getDataAddr(index, arg1));
					scripts[index].codeCount++;
				}
				else
					if (instruction.indexOf("goto ") == 0) //goto
					{
						//Serial.println("->" + instruction);
						//Serial.println("-->goto" + arg1);
						addGoto(index, scripts[index].codeCount, std::atoi(arg1.c_str()));
						scripts[index].codeCount++;
					}
					else
						if (instruction.indexOf("ifupper ") == 0) //ifupper
						{
							//Serial.println("->" + instruction);
							//Serial.println("-->ifupper" + arg1 + arg2 + arg3);
							addIfupper(index, scripts[index].codeCount, getDataAddr(index, arg1), getDataAddr(index, arg2), std::atoi(arg3.c_str()));
							scripts[index].codeCount++;
						}
						else
							if (instruction.indexOf("getprop ") == 0) //getprop
							{
								//Serial.println("->" + instruction);
								//Serial.println("-->getprop" + arg1 + arg2 + arg3);
								int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
								int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
								addGetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, getDataAddr(index, arg3));
								scripts[index].codeCount++;
							}
							else
								if (instruction.indexOf("setprop ") == 0) //setprop
								{
									//Serial.println("->" + instruction);
									//Serial.println("-->setprop" + arg1 + arg2 + arg3);
									int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
									int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
									addSetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, getDataAddr(index, arg3));
									scripts[index].codeCount++;
								}

		}

		byteCode.remove(0, linePos + lineDelimiter.length());
	}
	return true;
}

bool scriptsCreate(String name, String byteCode) {
	int index = -1;
	for (int i = 0; i < scriptSize; i++)
	{
		if ((scripts[i].name == name) || (scripts[i].name.length() == 0))
		{
			index = i;
			break;
		}
	}

	if (index == -1) {
		if (scriptCount >= scriptSize - 2) return false;
		scriptCount++;
		index = scriptCount;
	}
	scriptsReset[index];	
	scripts[index].name = name;
	filesWriteInt(scripts[index].name + ".rf", -1); //escapre RF flag 
	scripts[index].byteCode = byteCode;

	if (scriptsCompile(index))
	{
		scripts[index].status = runStatus;
	}
	else
	{
		scripts[index].status = compilerErrorStatus;
	}
	return true;
}

bool scriptsLoad() {
	scriptCount = -1;
	String result = filesReadString("scripts");
	if (!result) return false;

	String lineDelimiter = "\r";
	String scriptDelimiter = ":";
	String keyDelimiter = "=";
	int linePos = 0;
	String line;

	while ((linePos = result.indexOf(lineDelimiter)) != -1)
	{
		line = result.substring(0, linePos);
		//Serial.println(line);

		if (line.indexOf("script:") == 0) //script section
		{
			String scriptName = line.substring(line.indexOf(scriptDelimiter) + 1);
			scriptCount++;
			scriptsReset[scriptCount];
			scripts[scriptCount].name = scriptName;
			//Serial.println("name:" + scriptName);
		}
		else //key section
		{
			String key = line.substring(0, line.indexOf(keyDelimiter));
			String value = line.substring(line.indexOf(keyDelimiter) + 1);

			if (key == "status") scripts[scriptCount].status = std::atoi(value.c_str());
			else
				if (key == "bytecode") {
					scripts[scriptCount].byteCode = value;
					scriptsCompile(scriptCount);
				}
				else
					if (key == "codecount")  scripts[scriptCount].codeCount = std::atoi(value.c_str());
					else
						if (key == "datacount")  scripts[scriptCount].dataCount = std::atoi(value.c_str());
						else
							if (key == "timequant")  scripts[scriptCount].timeQuant = std::atoi(value.c_str());
		}
		result.remove(0, linePos + lineDelimiter.length());
	}
	return true;
}



void testCompile()
{

	Serial.println(ESP.getFreeHeap());
	scriptsCreate("script1", "var a=10\nvar b=10\nvar c=10000\nsum a,b,b\nsum a,b,b\nsum a,b,b\nwrite b\nifupper b,c,99\ngoto 0\n");
	Serial.println(ESP.getFreeHeap());
	scriptsCreate("script2", "var a=10\nvar b=10\nvar w=10\nvar c=10000\nsum a,b,b\nwrite b\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	Serial.println(ESP.getFreeHeap());
	scriptsCreate("script3", "var a=10\nvar b=10\nvar w=10\nvar c=10000\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	Serial.println(ESP.getFreeHeap());
	scriptsCreate("script4", "var t=0\nvar h=0\nvar a=0\nvar v=1\nvar hlimit=40\ngetprop dht,temperature,t\ngetprop dht,humidity,h\nwrite t\nwrite h\nifupper hlimit,h,0\nsetprop rele,data,v\ngoto 0\n");
	Serial.println(ESP.getFreeHeap());

	scriptsSave();
	//Serial.println(ESP.getFreeHeap());
	//scriptsLoad();


	/*
	//Serial.println("A");

	scripts[0].codeCount = 100;
	scripts[0].dataCount = 100;
	//while (true)
	{
		//Serial.println(ESP.getFreeHeap());
		scripts[0].code = (Instruction*)malloc(sizeof(Instruction) * scripts[0].codeCount);
		scripts[0].data = (Variable*)malloc(sizeof(Variable) * scripts[0].dataCount);
		//Serial.println(ESP.getFreeHeap());
		//Serial.println("B2");
		int index = 0;
		for (int addr = 0; addr < scripts[0].codeCount; addr++) {

			scripts[index].code[addr].type = sumCode;
			scripts[index].code[addr].arg1Addr = 222 + addr;
			scripts[index].code[addr].arg2Addr = 333 + addr;
			scripts[index].code[addr].resultAddr = 444 + addr;
			//Serial.println("B3");
			scripts[index].data[addr].type = addr;
			//Serial.println("B31");
			scripts[index].data[addr].name = "name" + String(addr);
			scripts[index].data[addr].value = "value123123" + String(addr);
			//Serial.println("B4");

			//addSum(0, i, 10, 20, 40);
			//pushData(0, "123", "1233");
		}


		for (int addr = 0; addr < scripts[0].codeCount; addr++) {

			//Serial.println(String(scripts[index].code[addr].type));
			//Serial.println(String(scripts[index].code[addr].arg1Addr));
			//Serial.println(String(scripts[index].code[addr].arg2Addr));
			//Serial.println(String(scripts[index].code[addr].resultAddr));

			//Serial.println(scripts[index].data[addr].name);
			//Serial.println(scripts[index].data[addr].value);
			//addSum(0, i, 10, 20, 40);
			//pushData(0, "123", "1233");
		}

		//Serial.println("C");
		//Serial.println("-->" + String(sizeof(scripts[0])));
		//Serial.println("-->" + String(sizeof(scripts[0].code)));
		//Serial.println("-->" + String(sizeof(scripts[0].code[0])));

		//Serial.println(ESP.getFreeHeap());
		free(scripts[0].code);
		free(scripts[0].data);
	}
	*/

	/*
	//Serial.println("-->" + String(sizeof(scripts[0])));
	//Serial.println(ESP.getFreeHeap());
	scripts[0].code = (Instruction*)malloc(sizeof(Instruction) * 1000);
	//Serial.println(ESP.getFreeHeap());
	//realloc((Instruction*)scripts[0].code, sizeof(Instruction) * 10);
	//Serial.println("-->" + String(sizeof(scripts[0])));
	//Serial.println("-->" + String(sizeof(scripts[0].code)));
	//Serial.println("-->" + String(sizeof(scripts[0].code[0])));
	//Serial.println("-->" + String(sizeof(scripts[0].code[2])));

	free(scripts[0].code);
	//Serial.println(ESP.getFreeHeap());
	Instruction i;
	i.arg1Addr = 123;
	scripts[0].code[999].arg1Addr = 123;
	//Serial.println("-->" + String(scripts[0].code[999].arg1Addr));


	//Serial.println("B2");
	for (int i = 0; i < 999; i++) {
		addSum(0, i, 10, 20, 40);
		//Serial.println("C");
	}
	*/
}

