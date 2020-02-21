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

Скрипт состоит с двух блоков. Первый - определение необходимого числа переменных, второй непосредственное исполнение операций (инструкций). При использований оператора перехода на строку,
нулевой строкой считается строка начала блока выполнения операций (инструкций).

Пример байт кода (проверяет значение освещенности и если освещенность выше заданной отключает освещение):

	var _light=0                                  // опреление переменной _light и присвоение ей значения 0. Первый блок, в данном примере он состоит всего из одной строки
	getDeviceProp lightsensor, light, _light      //получить текущие показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light. Начало второго блока. Эта строка считается "нулевой" для оператора перехода goto
	ifupper _light, 300, 4                        //если показания освещенности более 300 единиц выполнить инструкцию из строки 4
	setprop rele, data, 1                         //переходим сюда, если показания освещенности меньше или равны 300, замыкаем (включаем) реле с ID rele
	goto 0                                        //переход на строку 0 для проверки показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light
	setprop rele, data, 0                         //мы перешли сюда из 3 строки, если освещенность выше 300 ( _light > 300 ) - размыкаем (выключаем) реле
	goto 0                                        //переход на строку 0 для проверки показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light

- Изменяйте сценарий, изменяйте логику, добавляйте новые устройства, добавляейте новые микроконтроллеры.

*/

#include <Arduino.h>
#include "DeviceManager.h"
#include "..\..\UnitProperties.h"

#define heapLimit 5000 //не компилировать и не загружать скрипт если количество heap после этого станет меньше 5Kb 
#define FLT_EPSILON 1.0E-6 //определение точности вычислений
#define FLT_MAX     3.40282347E+38F
#define FLT_MIN     1.17549435E-38F

#define scriptSize 10 //сколько скриптов можно загрузить одновременно

//коды инструкций для байт-кода
#define stopCode 0
#define sumCode 1
#define writeCode 2
#define gotoCode 3
#define ifupperCode 4
#define getpropCode 5
#define setpropCode 6
#define subCode 7
#define multCode 8
#define devCode 9
#define letCode 10
#define iflowerCode 11
#define ifequalCode 12
//статусы скрипта 
#define stopStatus 0  //скрипт остановлен не выполняется
#define runStatus 1   //скрипт выполняется
#define compilerErrorStatus 2 //ошибка компиляции скрипта
#define runtimeErrorStatus 3 //ошибка выполнения скрипта (возможно был фатальный сбой, не возобновляейте выполнение такого скрипта, без проверки). 
#define debugStatus 4

//байт-код одной инструкции
typedef struct Instruction
{
	int type = stopCode; //код инструкции, по умолчаю Stop - такая иснтрукция оставит скрипт - script[..].status = stopStatus
	int arg1Addr;        //адрес первого аргумета
	int arg2Addr;        //адрес второго аргумета  
	int arg3Addr;
	int resultAddr;      //адрес результата   
	int lineNumber;
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
	int debugLineNumber = -1;
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
	//	free(scripts[0].code);
	//	free(scripts[0].data);
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

String scriptsGetAll() {
	String result = "";
	String valueName = "";
	String value = "";
	for (int i = 0; i < scriptSize; i++) {
		if (scripts[i].name.length() != 0) { //zero string - script deleted			
			result += "script:" + scripts[i].name + "\r";
			result += "status=" + String(scripts[i].status) + "\r";
			result += "debuglinenumber=" + String(scripts[i].debugLineNumber) + "\r";
			result += "bytecode=" + String(scripts[i].byteCode) + "\r";
			result += "codecount=" + String(scripts[i].codeCount) + "\r";
			result += "datacount=" + String(scripts[i].dataCount) + "\r";
			result += "timequant=" + String(scripts[i].timeQuant) + "\r";
			result += "ip=" + String(scripts[i].ip) + "\r";
			result += "variables=\n";			
			for (int j = 0; j < scripts[i].dataCount; j++) {
				valueName = scripts[i].data[j].name;
				value = scripts[i].data[j].value;				
				result += valueName + "=" + value + "\n";
			}
			result += "\r";

		}
	}

	return result;
}

String scriptsGetAllClean() {
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
	return result;
}

bool scriptsSave() {
	return filesWriteString("scripts", scriptsGetAllClean());
}

bool scriptsDelete(String name) {
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		scriptsReset(index);
		scriptsSave();
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
	char *array;	
	array = (char *)malloc(sizeof(char) * (str.length() + 1));	
	strcpy(array, str.c_str());	
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
	
	if (scripts[index].data[scripts[index].dataCount].name != nullptr)
	{
		// free(scripts[index].data[scripts[index].dataCount].name);
	}	
	scripts[index].data[scripts[index].dataCount].name = stringToArray(name);
	

	if (scripts[index].data[scripts[index].dataCount].value != nullptr)
	{
		//	free(scripts[index].data[scripts[index].dataCount].value);
	}
	scripts[index].data[scripts[index].dataCount].value = stringToArray(value);

	return scripts[index].dataCount++;
}

int getDataAddr(int index, String name) {
	String _name;
	for (int i = 0; i < scripts[index].dataCount; i++) {
		_name = scripts[index].data[i].name;
		if (_name == name) {
			return i;
		}
	}
	return -1;
}

//--------------------------------------------------------------------------------------------------------
//instructions
int addLet(int index, int addr, int resultAddr, int arg1Addr, int lineNumber) {
	scripts[index].code[addr].type = letCode;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runLet(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != letCode) return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(value1);

	return ++ip;
}


int addSum(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber) {
	scripts[index].code[addr].type = sumCode;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runSum(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != sumCode) return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());

	String result = String(arg1 + arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}


int addSub(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber) {
	scripts[index].code[addr].type = subCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runSub(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != subCode) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());
	String result = String(arg1 - arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}


int addMult(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber) {
	scripts[index].code[addr].type = multCode;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runMult(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != multCode) return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());

	//проверка выйдет ли результат умножения arg1 за arg2 за размер float
	if (arg1 != 0.0f) {
		
		float argForCheckMax = FLT_MAX / arg1;
		float argForCheckMin = FLT_MIN / arg1;
	
		if ((argForCheckMin > arg2) || (argForCheckMax < arg2)) return -1;
	}
	
	String result = String(arg1*arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}


int addDev(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber) {
	scripts[index].code[addr].type = devCode;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runDev(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != devCode) return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());

	//Проверка на ноль делителя
	if (arg2 == 0.0f) return -1;

	////Если  -1< agr2 < 1 проверяем не выйдет ли результат деления за float
	 if ((arg2 > -1) && (arg2 < 1)) {
	  float argCheckMax = FLT_MAX * arg2;
	  float argCheckMin = FLT_MIN * arg2;      
	  if ((arg1 > argCheckMax) || (arg1 < argCheckMin)) return -1;
	 }
	
    String result = String(arg1/arg2);
	
	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}


int addWrite(int index, int addr, int arg1Addr, int lineNumber) {
	scripts[index].code[addr].type = writeCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runWrite(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != writeCode) return -1;

	Serial.println(String(scripts[index].data[scripts[index].code[ip].arg1Addr].value));

	return ++ip;
}

int addGoto(int index, int addr, int arg1Addr, int lineNumber) {
	scripts[index].code[addr].type = gotoCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runGoto(int index) {
	int ip = scripts[index].ip;

	if (scripts[index].code[ip].type != gotoCode) return -1;
	if (scripts[index].code[ip].arg1Addr == -1) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	int arg1 = std::atoi(value1.c_str());	
	return arg1;
}

int addIfupper(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber) {
	scripts[index].code[addr].type = ifupperCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
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
		if (scripts[index].code[ip].arg3Addr == -1) return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = std::atoi(value3.c_str());
		return arg3;

	}
	else {
		return ++ip;
	}
}

int addIflower(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber) {
	scripts[index].code[addr].type = iflowerCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runIflower(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != iflowerCode) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());
	if (arg1 < arg2) {
		if (scripts[index].code[ip].arg3Addr == -1) return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = std::atoi(value3.c_str());
		return arg3;
	}
	else {
		return ++ip;
	}
}

int addIfequal(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber) {
	scripts[index].code[addr].type = ifequalCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runIfequal(int index) {
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != ifequalCode) return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = std::atof(value1.c_str());
	float arg2 = std::atof(value2.c_str());
	if (arg1 == arg2) {
		if (scripts[index].code[ip].arg3Addr == -1) return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = std::atoi(value3.c_str());
		return arg3;
	}
	else {
		return ++ip;
	}
}


int addGetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber) {
	scripts[index].code[addr].type = getpropCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
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

int addSetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber) {
	scripts[index].code[addr].type = setpropCode;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
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
	switch (scripts[index].code[ip].type)
	{
	case stopCode: //default
		scripts[index].ip = -1;
		break;
	case letCode:
		scripts[index].ip = runLet(index);
		break;
	case sumCode:
		scripts[index].ip = runSum(index);
		break;
	case subCode:
		scripts[index].ip = runSub(index);
		break;
	case multCode:
		scripts[index].ip = runMult(index);
		break;
	case devCode:
		scripts[index].ip = runDev(index);
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
	case iflowerCode:
		scripts[index].ip = runIflower(index);
		break;
	case ifequalCode:
		scripts[index].ip = runIfequal(index);
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

		
	if (scripts[index].ip != -1)
	{
		scripts[index].debugLineNumber = scripts[index].code[scripts[index].ip].lineNumber;
		return true;
	}
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

String scriptsDebugNext(String name) 
{
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{

		if (scripts[index].name.length() != 0)
		{
			if (scripts[index].status == debugStatus)
			{
				bool result = executeInstruction(index);

				if (!result)
				{
					scripts[index].status = stopStatus;
				}
			}
		}
		return scriptsGetAll();
	}
	return "";
}

bool scriptsStartDebug(String name)
{	
	int index = scriptsGetByIndex(name);	
	if (index != -1)
	{
		scripts[index].status = debugStatus;
		scripts[index].ip = 0;
		return true;
	}
	return false;
}


String clearComment(String str)
{
	if (str.indexOf("//") == -1) return str;
	return str.substring(0, str.indexOf("//"));
}

String clearSpace(String str, bool atBegin)
{
	if (atBegin)
	{
		str = clearComment(str);
	}
	String cleanString = "";
	bool stopClean = !atBegin;
	char spaceChar = 0x20;
	char tabChar = 0x09;
	for (int i = 0; i < str.length(); i++) {
		if ((atBegin && (!stopClean)) || !atBegin)
		{
			if (str[i] == spaceChar) continue;
			if (str[i] == tabChar) continue;
		}
		stopClean = true;
		cleanString += str[i];
	}
	return cleanString;
}



//return empty string if OK, else setring with error code
String scriptsCompile(int index) {
	String result = ""; //no error
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
	String byteCode = scripts[index].byteCode + "\n";
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{
		command = clearSpace(byteCode.substring(0, linePos), true);
		if (command.length() != 0)
		{


			if ((command.indexOf("var ") == 0) || (command.indexOf(":") > 0)) _dataCount++;
			else
			{
				_codeCount++;
				//эти инструкции создают две переменные для хранения своих аргументов
				//при этом математические операторы могут использовать переменные в качестве аргументов, и память для них будет зарезервирована в var 
				//однако анализ займет процессорное время, а это значит компиляция будет более медленее, по этой причине жертвуем памятью и выигрываем 
				//в скорости резирвируя место для двух аргументов 
				//например a=b+c не требует еще памяти в data[], однако a=100+20 требует резервирования места под две переменных
				if ((command.indexOf("getprop ") == 0)
					||
					(command.indexOf("if ") == 0) //if goto инструкция тоже может создать две переменных, даже в случае if 10 > 20 goto begin (это соответсвует синтаксису)
					||
					((command.indexOf("=") > 0) && ((command.indexOf("+") > 0) || (command.indexOf("-") > 0) || (command.indexOf("/") > 0) || (command.indexOf("*") > 0)))) //для математических операторов
					//^^ в строке есть оператор "=" и один из математических операторов
				{
					_dataCount += 2;
				}
				else
					if (command.indexOf("setprop ") == 0)
					{
						_dataCount += 3;
					}

			}
		}
		byteCode.remove(0, linePos + lineDelimiter.length());
	}

	if ((ESP.getFreeHeap() - heapLimit) < (sizeof(Instruction) * _codeCount + sizeof(Variable) * _dataCount))
	{
		//out of heap
		return "out of heap";
	}


	scripts[index].code = (Instruction*)malloc(sizeof(Instruction) * _codeCount);
	scripts[index].data = (Variable*)malloc(sizeof(Variable) * _dataCount);

	//выборка label (меток) для перехода
	_codeCount = 0;
	linePos = 0;
	byteCode = scripts[index].byteCode + "\n";
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{

		command = clearSpace(byteCode.substring(0, linePos), true);
		if (command.length() != 0)
		{
			if (command.indexOf(":") > 0)
			{
				String labelName = command.substring(0, command.indexOf(':'));
				pushData(index, labelName, String(_codeCount));
			}
			else
				if (command.indexOf("var ") == -1)
				{
					_codeCount++;
				}

		}
		byteCode.remove(0, linePos + lineDelimiter.length());
	}


	//return to parse code
	linePos = 0;
	int lineCount = 0;
	byteCode = scripts[index].byteCode + "\n";
	while ((linePos = byteCode.indexOf(lineDelimiter)) != -1)
	{
		command = clearSpace(byteCode.substring(0, linePos), true);
		lineCount++;
		if ((command.length() != 0) && (command.indexOf(":") == -1))
		{

			if (command.indexOf("var ") == 0) //variable
			{
				String varArg = command.substring(4, command.length());
				String varName = clearSpace(varArg.substring(0, varArg.indexOf('=')), false);
				String varValue = varArg.substring(varArg.indexOf('=') + 1);

				pushData(index, varName, varValue);
			}
			else //Instruction parsin section
			{
				//парсер математических выражений ---------------------------------------------------------------------------
				if ((command.indexOf("=") > 0) && (command.indexOf("if ") != 0)) //если есть символ "=" и это уже точно не var значит это выражение +,-,\ или * И ЭТО НЕ ИНСТРУКЦИЯ IF GOTO
				{
					//TODO учесть возможность отрицательных значений т.е. знак "-" перед значением!!!!
					//синтаксис математических выражений:
					//<переменная><=><переменная|значение>[<+|-|\|*><переменная|значение>]					
					//^^^обязательно переменная, обязательно знак развенства, обязательно переменая или числовое значение [возможна вторая часть, если она есть обязательно математический оператор
					//<+|-|\|*>,обезательно переменная или значение]
					//без второго аргумента это инструкция let (присвоить a=100, b=c)

					String resultArg = clearSpace(command.substring(0, command.indexOf("=")), false); //переменная для сохранения результата (левая часть выражения)
					int resultAddr = getDataAddr(index, resultArg);
					if (resultAddr == -1) // нет переменной для сохранения результата, ошибка, обрываем компиляцию
					{
						result = "result variable no exists at line: " + String(lineCount);
						break;
					}
					//парсим правую часть (аргументы)
					String args = clearSpace(command.substring(command.indexOf("=") + 1), false);
					//ищем математических оператор
					char mathOperator = 0x00; // 0x00 если не найдем 
				
					if (args.indexOf("+") > 0) { mathOperator = '+'; }
					else
						if (args.indexOf("-") > 0) { mathOperator = '-'; }
					else
						if (args.indexOf("/") > 0) { mathOperator = '/'; }
					else
						if (args.indexOf("*") > 0) { mathOperator = '*'; }
					

					if (mathOperator == 0x00) //если не нашли математический оператор
					{
						//оператор "=" есть но нет математического оператора в правой части, возможно это инструкция let
						//синтаксис <переменная><=><переменная|значение>
						//в этом случае вся вторая часть выражения либо переменная, либо числовое значение
						int argsAddr = getDataAddr(index, args);
						if (argsAddr == -1) //переменная для не указана, возможно это численое выражение, например b=77 
						{
							float argsfloat = args.toFloat();
							if (argsfloat == 0) { args = "0"; }
							argsAddr = pushData(index, "args" + String(lineCount), args); //создаем переменую для аргумента, сохраняем адрес
						}
						addLet(index, scripts[index].codeCount, resultAddr, argsAddr, lineCount);
					}
					else
					{
						//парсим первый и второй параметр выражения зная математический оператор (разрезаем на arg1[mathOperator]arg2 --> a+b c-100 2*x)
						String arg1 = clearSpace(args.substring(0, args.indexOf(mathOperator)), false);
						String arg2 = clearSpace(args.substring(args.indexOf(mathOperator) + 1), false);
						//если в качестве аргументов указаны переменные, ищем их адреса
						int arg1Addr = getDataAddr(index, arg1);
						int arg2Addr = getDataAddr(index, arg2);

						if (arg1Addr == -1) //переменная для первого аргумента не указана, возможно это численое выражение a=100+b
						{
							float arg1float = arg1.toFloat();
							if (arg1float == 0) https://www.arduino.cc/reference/en/language/variables/data-types/string/functions/tofloat/ //не число
							{
								//прейдется считать такой аргумент числом равным 0
								//иначе мы не может делать выражения вида a = 0 -> 0.toFloat() == 0 ошибка 
								arg1 = "0";
							}
							arg1Addr = pushData(index, "arg1" + String(lineCount), arg1); //создаем переменую для аргумента, сохраняем адрес
						}

						if (arg2Addr == -1) //переменная для второго аргумента не указана, возможно это численое выражение a=100+b, и да - возможно a=100+50
						{
							float arg2float = arg2.toFloat();
							if (arg2float == 0)
							{
								arg2 = "0";
							}
							arg2Addr = pushData(index, "arg2" + String(lineCount), arg2);
						}

						//результат и оба аргумента определены, компилируем в нужную инструкцию
						if (mathOperator == '+') { addSum(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount); }
						else
							if (mathOperator == '-') { addSub(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount); }
						else
							if (mathOperator == '*') { addMult(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount); }
						else
							if (mathOperator == '/') { addDev(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount); }
					    else
							{ //такого не должно случится, но если что то совсем пошло не так
								result = "bad expression at line: " + String(lineCount);
								break;

							}
					}
					scripts[index].codeCount++;
				} //ENDOF парсер математических выражений
				//парсер условного перехода IF GOTO ---------------------------------------------------------------------------
				else
					//<if><переменная|значение><">"|"<|"="><переменная|значение><goto><метка>
					if (command.indexOf("if ") == 0)
					{
						if (command.indexOf("goto") == -1)
						{
							result = "wrong GOTO in IF instruction at line: " + String(lineCount);
							break;
						}

						String args = command.substring(command.indexOf(" ") + 1);
						args = clearSpace(args.substring(0, args.indexOf("goto")), false);
						String gotoArg = clearSpace(command.substring(command.indexOf("goto") + 4), false);

						int gotoAddr = getDataAddr(index, gotoArg);
						if (gotoAddr == -1)
						{
							result = "bad label name for GOTO at IF instruction at line: " + String(lineCount);
							break;
						}

						String ifOperator = "";
						if (args.indexOf(">") > 0) { ifOperator = ">"; }
						else
							if (args.indexOf("<") > 0) { ifOperator = "<"; }
							else
								if (args.indexOf("=") > 0) { ifOperator = "="; }
								else
								{
									result = "wrong operator > or < or = in IF instruction at line: " + String(lineCount);
									break;
								}

						String arg1 = args.substring(0, args.indexOf(ifOperator));
						String arg2 = args.substring(args.indexOf(ifOperator) + 1);
						//если в качестве аргументов указаны переменные, ищем их адреса
						int arg1Addr = getDataAddr(index, arg1);
						int arg2Addr = getDataAddr(index, arg2);

						if (arg1Addr == -1) //переменная для первого аргумента не указана, возможно это численое выражение if 100 < a goto begin
						{
							float arg1float = arg1.toFloat();
							if (arg1float == 0) { arg1 = "0"; }
							arg1Addr = pushData(index, "arg1" + String(lineCount), arg1);
						}

						if (arg2Addr == -1) //переменная для второго аргумента не указана, возможно это численое выражение a=100+b, и да - возможно a=100+50
						{
							float arg2float = arg2.toFloat();
							if (arg2float == 0) { arg2 = "0"; }
							arg2Addr = pushData(index, "arg2" + String(lineCount), arg2);
						}
						//все аргументы установлены, создаем соответсвующею инструкцию 
						if (ifOperator == ">") {
							addIfupper(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
						}
						else
							if (ifOperator == "<") {
								addIflower(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
							}
							else
								if (ifOperator == "=") {
									addIfequal(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
								}

						scripts[index].codeCount++;
					}//ENDOF парсер условного перехода IF GOTO --------------------------------------------------------------------
					//парсеры остальных инструкций 
					else
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

						if (instruction.indexOf("write ") == 0) //write
						{
							addWrite(index, scripts[index].codeCount, getDataAddr(index, arg1), lineCount);
							scripts[index].codeCount++;
						}
						else
							if (instruction.indexOf("goto ") == 0) //goto
							{
								addGoto(index, scripts[index].codeCount, getDataAddr(index, arg1), lineCount);
								scripts[index].codeCount++;
							}
							else
								if (instruction.indexOf("getprop ") == 0) //getprop
								{
									int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
									int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
									addGetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, getDataAddr(index, arg3), lineCount);
									scripts[index].codeCount++;
								}
								else
									if (instruction.indexOf("setprop ") == 0) //setprop
									{
										int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
										int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
										int arg3Addr = getDataAddr(index, arg3);
										if (arg3Addr == -1)
										{
											arg3Addr = pushData(index, "arg3" + String(lineCount), arg3);
										}
										addSetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, arg3Addr, lineCount);
										scripts[index].codeCount++;
									}
									else
									{
										result = "bad instruction at line: " + String(lineCount);
										break;
									}
					} //ENFOF парсеры остальных инструкций ------------------------------------------------------------------------------
			}
		}

		byteCode.remove(0, linePos + lineDelimiter.length());
	}
	return result;
}

String scriptsCreate(String name, String byteCode) {
	String result = "";
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
		if (scriptCount >= scriptSize - 2) return "VM scripts limit is owerflow (limit=" + String(scriptSize) + " scripts)";
		scriptCount++;
		index = scriptCount;
	}	
	scriptsReset(index);
	scripts[index].name = name;
	filesWriteInt(scripts[index].name + ".rf", -1); //escapre RF flag 
	scripts[index].byteCode = byteCode;

	result = scriptsCompile(index);
	if (result.length() == 0)
	{
		scripts[index].status = runStatus;
	}
	else
	{
		scripts[index].status = compilerErrorStatus;
	}
	scriptsSave();
	return result;
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
	
		if (line.indexOf("script:") == 0) //script section
		{
			String scriptName = line.substring(line.indexOf(scriptDelimiter) + 1);
			scriptCount++;
			scriptsReset(scriptCount);
			scripts[scriptCount].name = scriptName;	
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
 //Put some code for non UI tests
}

