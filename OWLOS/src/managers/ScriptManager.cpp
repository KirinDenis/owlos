/*

  Ready IoT Solution OWLOS
  (c) Konstantin Brul, Vitalii Glushchenko, Denys Melnychuk, Denis Kirin

Встроеный скрипт.

Менеджер поддерживает:
- выполнение нескольких скриптов одновременно.
- динамическую - загрузку, компиляцию, выполнение, остановку - без перезагрузки микроконтроллера.
- квантование выполнения инструкций каждого скрипта отдельно (сколько инструкций за один loop())
- хранение скриптов и их свойств в файлах.
- загрузку скриптов при старте микроконтроллера.
- останувку скрипта если тот привел к сбою микроконтроллера (при старте и загрузки скриптов такой скрипт выполнятся не будет)
- динамическое распределение памяти для хранения и выполнения скриптов.
- редактирование, замену скрипта.
- удаление скриптов.
- доступ к свойствам устройств подключеных к микроконтроллеру на чтение-запись. (без перезапуска микроконтроллера (устройства могут добавляется динамически))

Зачем нужен скрипт менеджер, возможные сценарии использования:
"Классика" программирования микроконтроллера выглядит так - подключить устройства к PIN, написать (найти) библиотеки программно обслуживающие устройства,
написать код реализующий логический уровень взаимодействия устройств.
Например, для реализации проекта "умной" лампочки, вам понадобится реле, датчик освещенности, датчик движения - подключить их к микроконтроллеру - это прийдется делать в любом случае,
с OWL OS или без нее :)

Написать код на C/C++ считывающий показания датчиков, анализирующий и значения и принимающий решение - включить или выключить лампочку (через реле).
Вы все это проделали - "прошили" контроллера и теперь при уровне освещености менее 300 единиц включается свет.
- Если вас не устраивает уровень 300 вы возвращаетесь к исходному коду, изменяете 300 на 200, после чего снимаете микроконтроллер, "перепрошиваете" и возвращаете все на место.
- Если вы хотите еще реле или геркон или DHT - вы каждый раз повторяете эти действия - переписываете, снимаете, перепрошивает
(оцените ESP8266 OTA - это сильно облегчит жизнь https://randomnerdtutorials.com/esp8266-ota-updates-with-arduino-ide-over-the-air/)

- Любое изменение в логике работы вашего проекта, потребует в самом лучшем случае изменение кода прошивки и перепровки контроллера, что само по себе интересно первые раз 50, потом
превращается в рутину и начинает утомлять.

- Если вы захотите управлять лампочкой через сеть, в своем приложение - изучите как работать с WiFi, выберите протокол HTTP или MQTT или разработайте свой, найдите, напишите сервер,
реализуйте клиентское приложение с UI, отладте все, предусмотрите возможность выбора другой сети WiFi или используйте ESP8266 в режиме WiFi точки доступа - поверте это все очень
интересные задачи и займут уйму времени. (Посмотрите исходный код OWL OS - как это делаем мы, найдите неточности и ошибки, помогите нам их исправить и сделать OWL OS еще надежнее)

Тоже самое с OWL OS:
- Соберите схему, подключите устройства.
- Зайдите в OWL OS UI, укажите какие устройства были подключены. Теперь вы можете упралять подключенными устройствами через сетъ.
- В OWL OS UI скрипт редакторе опишите логику взаимодействия устройств:

  1 getDeviceProp lightsensor, light, _light  //получить текущие показания сенсора с ID lightsensor
  2 ifupper _light, 300, 5                    //если показани показания более 300 единиц выполнить инструкцию из строки 5
  3 setDeviceProp rele, data, 0               //если показания меньше равны 300 выключить реле с ID rele
  4 goto 1                                    //проверить показания lightsensor сново
  5 setDeviceProp rele, data, 1               //мы перешли сюда из 3 строки, если light > 300 - включаем реле
  6 goto 1                                    //проверить показания lightsensor сново

- Изменяйте сценарий, изменяйте логику, добавляйте новые устройства, добавляейте новые микроконтроллеры.

*/

#include <Arduino.h>

#include "DeviceManager.h"
#include "..\..\UnitProperties.h"

#define heapLimit 5000 //не компилировать и не загружать скрипт если количество heap после этого станет меньше 5Kb 

#define scriptSize 10 //сколько скриптов можно загрузить одновременно

//коды инструкций для байт-кода
#define stopCode 0
#define sumCode 1
#define writeCode 2
#define gotoCode 3
#define ifupperCode 4
#define getpropCode 5
#define setpropCode 6
//статусы скрипта 
#define stopStatus 0  //скрипт остановлен не выполняется
#define runStatus 1   //скрипт выполняется
#define compilerErrorStatus 2 //ошибка компиляции скрипта
#define runtimeErrorStatus 3 //ошибка выполнения скрипта (возможно был фатальный сбой, не возобновляейте выполнение такого скрипта, без проверки). 

//байт-код одной инструкции
typedef struct Instruction
{
	int type = stopCode; //код инструкции, по умолчаю Stop - такая иснтрукция оставит скрипт - script[..].status = stopStatus
	int arg1Addr;        //адрес первого аргумета
	int arg2Addr;        //адрес второго аргумета  
	int arg3Addr;
	int resultAddr;      //адрес результата   
};
//переменная для байт-кода инструкций arg1Addr..arg2Addr - адреса таких переменых в массиве script[..].data (сегмент данных)
typedef struct Variable
{
	int type;   //тип переменой
	char *name; //имя переменой
	char *value;//значение переменой
};
//запись одного скрипта 
typedef struct Script
{
	String name;       //имя (уникально)
	String byteCode;   //исходный байт-код (assembler)
	int status = stopStatus; //текущий статус выполнения
	int ip = -1;           //Instruction Point - указатель выполняемой инструкции в script[..].data (сегмент кода)
	int codeCount = 0;     //количество инструкций
	int dataCount = 0;     //количество переменных
	int timeQuant = 1;     //квант времени выполнения - количество инструкций за один loop() микроконтроллера для этого скрипта 
	int quantCounter = 0;  //счетчик отработанных квантов времени, кога > timeQuant выполнение прерывается до следующего loop()

	Instruction* code;    //сегмент кода, по этому указателю, последовательно хранятся инструкции байт-кода скрипта 
	Variable* data;       //сегмен данных, хранит указатель на все переменые используемые скриптом
};

/* Архитектура -------------------------------------------------------------------------------------------------------------------------------------------------
Script.code массив состоящий из структур (записей) Instruction, формирует адресное пространство байт-кода
Каждая инструкция идентифицируется своим полем Instruction.type
Поле Script.ip - указатель инструкций, содержит адрес текущей исполняемой инструкции в Script.code.
В момент исполнения инструкция может изменять Script.ip, таким образом указывая адрес следующей инструкции.

Например:
- в независимости от результата выполнения инструкции sum (суммирование), следующей инструкцие будет Script.ip+1
- в свою очередь инструкция goto (безусловный переход) изменит Script.ip на адрес указанный в ее аргументе.

Script.data массив хранящий все переменые скрипта описаные струцтурой Variable - одна ячейка одна переменая.
Аргументы инструкций (arg1addr, arg2addr...) содержат адреса переменых из Script.data, таким образом- значительно упращается реализация управлением памятью,
а варианты использования инструкций становятся более гибкими.

Интерпретация инструкций:
- каждая инструкция интерпретируется двумя функциями addNNN и runNNN (где NNN имя инструкции).
- addNNN размещает инструкцию в Script.code по определенному адресу (адрес инструкции) в Script.code, адрес передается в качестве аргумента функции addNNN. Так же addNNN размещает
аргументы инструкции в Script.data, при этом адреса аргументов инструкции в Script.data сохраняются в записи самой инструкции в Script.code.
- runNNN интерпретирует выполнение действий инструкции и выбирает следующий Script.ip
- глобальные функции executeInstruction и scriptsRun работают совместно:
-- executeInstruction декодирует Instruction.type текущей инструкции указанной Script.ip и вызывает соответствующею этому типу инструкции runNNN - который в свою очередь возвращает
   следущий script.ip (для следующей инструкции) или (важно) -1 если произошла ошибка выполнения инструкции. Фунцкия executeInstruction возвращает истину (true) если инструкцию
   удалось выполнить (script.ip не равен -1), или ложь (false) если не удалось выполнить инструкцию.
-- scriptRun последовательно вызывает executeInstruction до тех пока очередной вызов не вернет ложь, в этом случае выполнения скрипта прекращается.

					   script.data[var1,     var2,    var3 ... varBBB]
											  ^        ^
                                              |        |

script.code[inst1(arg1addr, arg2addr), inst2(arg1addr, arg2addr), inst3(..), inst4(..) ... instZZZ(..)]
										^
										| script.ip (current instruction is inst2)

----------------------------------------------------------------------------------------------------------------------------------------------------
*/

//количество загруженных скриптов. 
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

char* stringToArray(String str)
{
	//free(array);
	//Serial.println("-->get 1");
	char *array;
	//Serial.println("-->get 2");
	array = (char *)malloc(sizeof(char) * (str.length() + 1));
	//Serial.println("-->get 3");
	strcpy(array, str.c_str());
	//Serial.println("-->get 4");
	return array;
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
	//Serial.println("-->push data 1");
	if (scripts[index].data[scripts[index].dataCount].name != nullptr)
	{
	 // free(scripts[index].data[scripts[index].dataCount].name);
    }
	//Serial.println("-->push data 2");
	scripts[index].data[scripts[index].dataCount].name = stringToArray(name);
	//Serial.println("-->push data 3");

	if (scripts[index].data[scripts[index].dataCount].value != nullptr)
	{
	//	free(scripts[index].data[scripts[index].dataCount].value);
	}
	scripts[index].data[scripts[index].dataCount].value = stringToArray(value);
	//Serial.println("-->push data 4");
	//scripts[index].data[scripts[index].dataCount].name = (char *)malloc(sizeof(char) * (name.length() + 1));
	//strcpy(scripts[index].data[scripts[index].dataCount].name, name.c_str());

	//scripts[index].data[scripts[index].dataCount].value = (char *)malloc(sizeof(char) * (value.length() + 1));
	//strcpy(scripts[index].data[scripts[index].dataCount].value, value.c_str());


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


	//TODO RELOCATE FOR scripts[index].data[scripts[index].code[ip].resultAddr].value
	//strcpy(scripts[index].data[scripts[index].code[ip].resultAddr].value, result.c_str());

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);


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

	if ((value.length() == 0) || (value == WrongPropertyName)) //then try get this property from unit
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
	free(scripts[index].code);
	free(scripts[index].data);
	//TODO: Free momery for code data
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
	//byteCode = "var a=10\nvar b=10\nvar c=10000\nsum a,b,b\nsum a,b,b\nsum a,b,b\nwrite b\nifupper b,c,99\ngoto 0\n";
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
	//Serial.println("script index" + String(index));
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
	
	//Serial.println(ESP.getFreeHeap());
	scriptsCreate("script1", "var a=10\nvar b=10\nvar c=10000\nsum a,b,b\nsum a,b,b\nsum a,b,b\nwrite b\nifupper b,c,99\ngoto 0\n");
	//Serial.println(ESP.getFreeHeap());
	//scriptsCreate("script2", "var a=10\nvar b=10\nvar w=10\nvar c=10000\nsum a,b,b\nwrite b\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	//Serial.println(ESP.getFreeHeap());
	//scriptsCreate("script3", "var a=10\nvar b=10\nvar w=10\nvar c=10000\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n");
	//Serial.println(ESP.getFreeHeap());
	//scriptsCreate("script4", "var t=0\nvar h=0\nvar a=0\nvar v=1\nvar hlimit=40\ngetprop dht,temperature,t\ngetprop dht,humidity,h\nwrite t\nwrite h\nifupper hlimit,h,0\nsetprop rele,data,v\ngoto 0\n");
	//Serial.println(ESP.getFreeHeap());

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

