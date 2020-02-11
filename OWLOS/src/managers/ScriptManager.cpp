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

#define scriptSize 4

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

struct Variable
{
	String name;
	String value;

};

struct Script
{
	String name;
	String byteCode;
	int status = stopStatus;
	int ip = -1;           //instruction pointer
	int codeCount = 0;
	int dataCount = 0;
	int timeQuant = 1; // -1 forever
	int quantCounter = 0;

	Instruction code[50];
	Variable data[50];
};

int scriptCount = -1;

Script scripts[scriptSize];

//Script managment's functions -------------------------------

void scriptsReset(int index) {
	if ((index < 0) || (index > scriptSize - 1)) return;
	scripts[index].name = "";
	scripts[index].byteCode = "";
	scripts[index].status = stopStatus;
	scripts[index].ip = -1;
	scripts[index].codeCount = 0;
	scripts[index].dataCount = 0;
	scripts[index].timeQuant = 1;
	scripts[index].quantCounter = 0;
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
int setInstruction(int index, int addr, Instruction instruction) {
	scripts[index].code[addr] = instruction;
	return 1;
}

int pushData(int index, String name, String value) {
	scripts[index].data[scripts[index].dataCount].name = name;
	scripts[index].data[scripts[index].dataCount].value = value;
	return scripts[index].dataCount++;
}

int getDataAddr(int index, String name) {
	for (int i = 0; i < scripts[index].dataCount; i++) {
		if (scripts[index].data[i].name == name) {
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
	float arg1 = std::atof(scripts[index].data[scripts[index].code[ip].arg1Addr].value.c_str());
	float arg2 = std::atof(scripts[index].data[scripts[index].code[ip].arg2Addr].value.c_str());
	scripts[index].data[scripts[index].code[ip].resultAddr].value = arg1 + arg2;
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

	Serial.println(scripts[index].data[scripts[index].code[ip].arg1Addr].value);

	return ++ip;
}

int addGoto(int index, int addr, int arg1Addr) {
	scripts[index].code[addr].type = gotoCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	return 1;
}

int runGoto(int index) {
	int ip = scripts[index].ip;
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
	float arg1 = std::atof(scripts[index].data[scripts[index].code[ip].arg1Addr].value.c_str());
	float arg2 = std::atof(scripts[index].data[scripts[index].code[ip].arg2Addr].value.c_str());
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

	String deviceProp = devicesGetDeviceProperty(scripts[index].data[scripts[index].code[ip].arg1Addr].value, scripts[index].data[scripts[index].code[ip].arg2Addr].value);
	if (deviceProp.length() == 0) //then try get this property from unit
	{
		deviceProp = unitOnMessage(unitGetTopic() + "/get" + scripts[index].data[scripts[index].code[ip].arg2Addr].value, "", NoTransportMask);
	}

	if (deviceProp.length() == 0)
	{
		return -1; //temporary
	}
	scripts[index].data[scripts[index].code[ip].arg3Addr].value = deviceProp;

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


	String result = devicesSetDeviceProperty(scripts[index].data[scripts[index].code[ip].arg1Addr].value, scripts[index].data[scripts[index].code[ip].arg2Addr].value, scripts[index].data[scripts[index].code[ip].arg3Addr].value);

	if (result.length() == 0) //try set unit property
	{
		result = unitOnMessage(unitGetTopic() + "/set" + scripts[index].data[scripts[index].code[ip].arg2Addr].value, scripts[index].data[scripts[index].code[ip].arg3Addr].value, NoTransportMask);
	}

	if (result.length() == 0)
	{
		return -1;
	}

	return ++ip;
}


//--------------------------------------------------------------------------------------------------------
//Executor and Compiler
bool executeInstruction(int index) {
	int ip = scripts[index].ip;
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

	String byteCode = scripts[index].byteCode;
	scripts[index].ip = 0;
	scripts[index].codeCount = 0;
	scripts[index].dataCount = 0;
	String prog = "";
	String lineDelimiter = "\n";
	String argDelimiter = ",";
	int linePos = 0;
	String command;
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{
		command = byteCode.substring(0, linePos);

		if (command.indexOf("var ") == 0) //variable
		{
			Serial.println("->" + command);
			String varArg = command.substring(4, command.length());
			String varName = varArg.substring(0, varArg.indexOf('='));
			String varValue = varArg.substring(varArg.indexOf('=') + 1);
			Serial.println("-->var " + varName + " " + varValue);
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
				Serial.println("->" + instruction);
				Serial.println("-->Sum" + arg1 + arg2 + arg3);
				addSum(index, scripts[index].codeCount, getDataAddr(index, arg1), getDataAddr(index, arg2), getDataAddr(index, arg3));
				scripts[index].codeCount++;
			}
			else
				if (instruction.indexOf("write ") == 0) //write
				{
					Serial.println("->" + instruction);
					Serial.println("-->write" + arg1);
					addWrite(index, scripts[index].codeCount, getDataAddr(index, arg1));
					scripts[index].codeCount++;
				}
				else
					if (instruction.indexOf("goto ") == 0) //goto
					{
						Serial.println("->" + instruction);
						Serial.println("-->goto" + arg1);
						addGoto(index, scripts[index].codeCount, std::atoi(arg1.c_str()));
						scripts[index].codeCount++;
					}
					else
						if (instruction.indexOf("ifupper ") == 0) //ifupper
						{
							Serial.println("->" + instruction);
							Serial.println("-->ifupper" + arg1 + arg2 + arg3);
							addIfupper(index, scripts[index].codeCount, getDataAddr(index, arg1), getDataAddr(index, arg2), std::atoi(arg3.c_str()));
							scripts[index].codeCount++;
						}
						else
							if (instruction.indexOf("getprop ") == 0) //getprop
							{
								Serial.println("->" + instruction);
								Serial.println("-->getprop" + arg1 + arg2 + arg3);
								int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
								int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
								addGetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, getDataAddr(index, arg3));
								scripts[index].codeCount++;
							}
							else
								if (instruction.indexOf("setprop ") == 0) //setprop
								{
									Serial.println("->" + instruction);
									Serial.println("-->setprop" + arg1 + arg2 + arg3);
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
		Serial.println(line);

		if (line.indexOf("script:") == 0) //script section
		{
			String scriptName = line.substring(line.indexOf(scriptDelimiter) + 1);
			scriptCount++;
			scriptsReset[scriptCount];
			scripts[scriptCount].name = scriptName;
			Serial.println("name:" + scriptName);
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
	scriptsCreate("script1", "var a=10\nvar b=10\nvar c=10000\nsum a,b,b\nwrite b\nifupper b,c,99\ngoto 0\n");
	scriptsCreate("script2", "var a=10\nvar b=10\nvar w=10\nvar c=10000\nsum a,b,b\nwrite b\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	scriptsCreate("script3", "var a=10\nvar b=10\nvar w=10\nvar c=10000\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	scriptsCreate("script4", "var t=0\nvar h=0\nvar a=0\nvar v=1\nvar hlimit=40\ngetprop dht,temperature,t\ngetprop dht,humidity,h\nwrite t\nwrite h\nifupper hlimit,h,0\nsetprop rele,data,v\ngoto 0\n");
	scriptsSave();
	//scriptsLoad();

}

