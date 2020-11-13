/*

Ready IoT Solution - OWLOS
Copyright 2019, 2020 by:
- Konstantin Brul (konstabrul@gmail.com)
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of Ready IoT Solution - OWLOS

OWLOS is free software : you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

OWLOS is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with OWLOS. If not, see < https://www.gnu.org/licenses/>.

GitHub: https://github.com/KirinDenis/owlos

(Этот файл — часть Ready IoT Solution - OWLOS.

OWLOS - свободная программа: вы можете перераспространять ее и/или изменять
ее на условиях Стандартной общественной лицензии GNU в том виде, в каком она
была опубликована Фондом свободного программного обеспечения; версии 3
лицензии, любой более поздней версии.

OWLOS распространяется в надежде, что она будет полезной, но БЕЗО ВСЯКИХ
ГАРАНТИЙ; даже без неявной гарантии ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ
ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ.
Подробнее см.в Стандартной общественной лицензии GNU.

Вы должны были получить копию Стандартной общественной лицензии GNU вместе с
этой программой. Если это не так, см. <https://www.gnu.org/licenses/>.)

   ____       _        _____     _____      _      U _____ u
U | __")u U  /"\  u   |_ " _|   |_ " _|    |"|     \| ___"|/
 \|  _ \/  \/ _ \/      | |       | |    U | | u    |  _|"
  | |_) |  / ___ \     /| |\     /| |\    \| |/__   | |___
  |____/  /_/   \_\   u |_|U    u |_|U     |_____|  |_____|
 _|| \\_   \\    >>   _// \\_   _// \\_    //  \\   <<   >>
(__) (__) (__)  (__) (__) (__) (__) (__)  (_")("_) (__) (__)
  _   _       _        __  __     ____       _____   U _____ u    ____
 |'| |'|  U  /"\  u  U|' \/ '|u  / __"| u   |_ " _|  \| ___"|/ U |  _"\ u
/| |_| |\  \/ _ \/   \| |\/| |/ <\___ \/      | |     |  _|"    \| |_) |/
U|  _  |u  / ___ \    | |  | |   u___) |     /| |\    | |___     |  _ <
 |_| |_|  /_/   \_\   |_|  |_|   |____/>>   u |_|U    |_____|    |_| \_\
 //   \\   \\    >>  <<,-,,-.     )(  (__)  _// \\_   <<   >>    //   \\_
(_") ("_) (__)  (__)  (./  \.)   (__)      (__) (__) (__) (__)  (__)  (__)

  .-')                 _  .-')                _ (`-.   .-') _
 ( OO ).              ( \( -O )              ( (OO  ) (  OO) )
(_)---\_)    .-----.   ,------.    ,-.-')   _.`     \ /     '._
/    _ |    '  .--./   |   /`. '   |  |OO) (__...--'' |'--...__)
\  :` `.    |  |('-.   |  /  | |   |  |  \  |  /  | | '--.  .--'
 '..`''.)  /_) |OO  )  |  |_.' |   |  |(_/  |  |_.' |    |  |
.-._)   \  ||  |`-'|   |  .  '.'  ,|  |_.'  |  .___.'    |  |
\       / (_'  '--'\   |  |\  \  (_|  |     |  |         |  |
 `-----'     `-----'   `--' '--'   `--'     `--'         `--'
 //ANSII ART MAKE WITH USING http://patorjk.com/software/taag/#p=testall&h=0&f=Ghost&t=Battle%20Hamster%20Script

Battle Hamster Script

Скрипт поддерживает:
- выполнение нескольких скриптов одновременно.
- динамическую - загрузку, компиляцию, выполнение, остановку - без перезагрузки микроконтроллера.
- квантование выполнения инструкций каждого скрипта отдельно (сколько инструкций за один loop())
- хранение скриптов и их свойств в файлах.
- загрузку скриптов при старте микроконтроллера.
- остановку скрипта если тот привел к сбою микроконтроллера (при старте и загрузки скриптов такой скрипт выполнятся не будет)
- динамическое распределение памяти для хранения и выполнения скриптов.
- редактирование, замену скрипта.
- удаление скриптов.
- доступ к свойствам драйвер подключенных к микроконтроллеру на чтение-запись. (без перезапуска микроконтроллера (драйвера могут добавляется динамически))

Зачем нужен скрипт менеджер, возможные сценарии использования:
"Классика" программирования микроконтроллера выглядит так - подключить драйвера к PIN, написать (найти) библиотеки программно обслуживающие драйвера,
написать код реализующий логический уровень взаимодействия драйвер. Например, для реализации проекта "умной" лампочки, вам понадобится реле, датчик освещенности, датчик движения - подключить их к микроконтроллеру - это придется делать в любом случае,
с OWLOS или без нее :)

Написать код на C/C++ считывающий показания датчиков, анализирующий и значения и принимающий решение - включить или выключить лампочку (через реле).
Вы все это проделали - "прошили" контроллера и теперь при уровне освещенности менее 300 единиц включается свет.
- Если вас не устраивает уровень 300 вы возвращаетесь к исходному коду, изменяете 300 на 200, после чего снимаете микроконтроллер, "перепрошиваете" и возвращаете все на место.
- Если вы хотите еще реле или геркон или DHT - вы каждый раз повторяете эти действия - переписываете, снимаете, перепрошивает
(оцените ESP8266 OTA - это сильно облегчит жизнь https://randomnerdtutorials.com/esp8266-ota-updates-with-arduino-ide-over-the-air/)

- Любое изменение в логике работы вашего проекта, потребует в самом лучшем случае изменение кода прошивки и перепроверки контроллера, что само по себе интересно первые раз 50, потом
превращается в рутину и начинает утомлять.

- Если вы захотите управлять лампочкой через сеть, в своем приложение - изучите как работать с WiFi, выберите протокол HTTP или MQTT или разработайте свой, найдите, напишите сервер,
реализуйте клиентское приложение с UI, отладке все, предусмотрите возможность выбора другой сети WiFi или используйте ESP8266 в режиме WiFi точки доступа - поверьте это все очень
интересные задачи и займут уйму времени. (Посмотрите исходный код OWLOS - как это делаем мы, найдите неточности и ошибки, помогите нам их исправить и сделать OWLOS еще надежнее)

Тоже самое с OWLOS:
- Соберите схему, подключите драйвера.
- Зайдите в OWLOS UI, укажите какие драйвера были подключены. Теперь вы можете управлять подключенными драйверами через сеть.
- В OWLOS UI скрипт редакторе опишите логику взаимодействия драйвер:

Скрипт состоит с двух блоков. Первый - определение необходимого числа переменных, второй непосредственное исполнение операций (инструкций). При использование оператора перехода на строку,
нулевой строкой считается строка начала блока выполнения операций (инструкций).

Пример байт кода (проверяет значение освещенности и если освещенность выше заданной отключает освещение):

	var _light=0                                  // определение переменной _light и присвоение ей значения 0. Первый блок, в данном примере он состоит всего из одной строки
	getDriverProp lightsensor, light, _light      //получить текущие показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light. Начало второго блока. Эта строка считается "нулевой" для оператора перехода goto
	ifupper _light, 300, 4                        //если показания освещенности более 300 единиц выполнить инструкцию из строки 4
	setprop relay, data, 1                        //переходим сюда, если показания освещенности меньше или равны 300, замыкаем (включаем) реле с ID relay
	goto 0                                        //переход на строку 0 для проверки показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light
	setprop relay, data, 0                        //мы перешли сюда из 3 строки, если освещенность выше 300 ( _light > 300 ) - размыкаем (выключаем) реле
	goto 0                                        //переход на строку 0 для проверки показания освещенности light с сенсора с ID lightsensor и записать этого значение в переменную _light

- Изменяйте сценарий, изменяйте логику, добавляйте новые драйвера, добавляйте новые микроконтроллеры.
*/

#include "ScriptService.h"
#ifdef USE_SCRIPT

#ifdef USE_DRIVERS
#include "DriverService.h"
#endif

#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#endif

#include "FileService.h"

#define SCRIPT_ID "script"
//Уберите комментарий этот флаг что бы включить трасерт (Tracert)
//#define SCRIPT_TRACERT

#define HEAP_LIMIT 5000	   //не компилировать и не загружать скрипт если количество heap после этого станет меньше 5Kb
#define FLT_EPSILON 1.0E-6 //определение точности вычислений
#define FLT_MAX 3.40282347E+38F
#define FLT_MIN 1.17549435E-38F

#define SCRIPT_SIZE 10 //сколько скриптов можно загрузить одновременно

//статусы скрипта
#define STOP_STATUS 0		   //скрипт остановлен не выполняется
#define RUN_STATUS 1		   //скрипт выполняется
#define COMPILE_ERROR_STATUS 2 //ошибка компиляции скрипта
#define RUNTIME_ERROR_STATUS 3 //ошибка выполнения скрипта (возможно был фатальный сбой, не возобновляйте выполнение такого скрипта, без проверки).
#define DEBUG_STATUS 4		   //скрип в режиме отладки, пошаговое исполнение инструкций
#define CRITICAL_RUN_STATUS 5  //тоже что и RUN_STATUS, но в случае перезагрузки модуля и взведения аварийного флага в файле [scriptName].rf != -1 скрипт продолжит исполнение

//byteCode коды инструкций (смотрите структуру Instruction поле type)
#define STOP_INSTRUCTION 0b00000000
#define IF_UPPER_INSTRUCTION 0b00000001
#define IF_LOWER_INSTUCTION 0b00000010
#define IF_EQUAL_INSTUCTION 0b00000011
#define GOTO_INSTRUCTION 0b00000100
#define LET_INSTRUCTION 0b00000101
#define ADD_INSTRUCTION 0b00000110
#define SUB_INSTRUCTION 0b00000111
#define MULT_INSTRUCTION 0b00001000
#define DEV_INSTRUCTION 0b00001001
#define GET_DRIVER_PROPERTY_INSTRUCTION 0b00001011
#define SET_DRIVER_PROPERTY_INSTRUCTION 0b00001100
#define SERIAL_OUT_INSTRUCTION 0b00001101

//определения управляющих переменных и переменных опций компиляции
#define STOP_IF_DEVICE_NOTREADY "STOP_IF_DEVICE_NOTREADY" //если в скрипте будет определена переменная с таким именем и драйвер не готово - программа остановится

//байт-код одной инструкции
struct Instruction
{
	byte type = STOP_INSTRUCTION; //код инструкции, по умолчанию Stop - такая инструкция оставит скрипт - script[..].status = STOP_STATUS
	int arg1Addr;				  //адрес первого аргумент
	int arg2Addr;				  //адрес второго аргумент
	int arg3Addr;				  //адрес третьего аргумент
	int resultAddr;				  //адрес результата
	int lineNumber;				  //хранит номер строки инструкции в исходном коде - нужен для UI пошаговой отладки
};
//переменная для байт-кода инструкций arg1Addr..arg2Addr - адреса таких переменных в массиве script[..].data (сегмент данных)
struct Variable
{
	byte type;	 //тип переменой
	char *name;	 //имя переменой
	char *value; //значение переменой
};
//структура данных для одного скрипта
struct Script
{
	String name;			   //имя (уникально)
	String byteCode;		   //исходный код (assembler)
	byte status = STOP_STATUS; //текущий статус выполнения
	bool firstTime = false;
	int ip = -1;			  //Instruction Point - указатель выполняемой инструкции в script[..].data (сегмент кода)
	int debugLineNumber = -1; //строка в исходном коде соответствующая текущей выполняемой инструкции из Script.ip
	int codeCount = 0;		  //количество инструкций
	int dataCount = 0;		  //количество переменных
	int timeQuant = 1;		  //квант времени выполнения - количество инструкций за один loop() микроконтроллера для этого скрипта
	int quantCounter = 0;	  //счетчик отработанных квантов времени, когда > timeQuant выполнение прерывается до следующего loop()

	Instruction *code; //сегмент кода, по этому указателю, последовательно хранятся инструкции байт-кода скрипта
	Variable *data;	   //сегмент данных, хранит указатель на все переменные используемые скриптом
};

//количество загруженных скриптов.
int scriptCount = -1;

//массив со структурами Script. Одновременно может исполнятся независимо до SCRIPT_SIZE скриптов
Script scripts[SCRIPT_SIZE];

//Синтаксические определители
#define CODE_LINE_DELIMITER "\n" //делитель строк
#define CODE_ARGS_DELIMITER ","	 //делитель аргументов инструкций
#define STRUCTURE_LINE_DELIMITER "\r"
#define STRUCTURE_SCRIPT_DELIMITER ":"
#define STRUCTURE_KEY_DELIMITER "="

/* Архитектура -------------------------------------------------------------------------------------------------------------------------------------------------
Script.code массив состоящий из структур (записей) Instruction, формирует адресное пространство байт-кода
Каждая инструкция идентифицируется своим полем Instruction.type
Поле Script.ip - указатель инструкций, содержит адрес текущей исполняемой инструкции в Script.code.
В момент исполнения инструкция может изменять Script.ip, таким образом указывая адрес следующей инструкции.

Например:
- в независимости от результата выполнения инструкции sum (суммирование), следующей инструкции будет Script.ip+1
- в свою очередь инструкция goto (безусловный переход) изменит Script.ip на адрес указанный в ее аргументе.

Script.data массив хранящий все переменные скрипта описанные, каждая из которых описана структурой Variable - одна ячейка одна переменная.
Аргументы инструкций (arg1addr, arg2addr...) содержат адреса переменных из Script.data, таким образом- значительно упрощается реализация управлением памятью,
а варианты использования инструкций становятся более гибкими.

Интерпретация инструкций:
- каждая инструкция интерпретируется двумя функциями addNNN и runNNN (где NNN имя инструкции).
- addNNN размещает инструкцию в Script.code по определенному адресу (адрес инструкции) в Script.code, адрес передается в качестве аргумента функции addNNN. Так же addNNN размещает
аргументы инструкции в Script.data, при этом адреса аргументов инструкции в Script.data сохраняются в записи самой инструкции в Script.code.
- runNNN интерпретирует выполнение действий инструкции и выбирает следующий Script.ip
- глобальные функции executeInstruction и scriptsRun работают совместно:
-- executeInstruction декодирует Instruction.type текущей инструкции указанной Script.ip и вызывает соответствующею этому типу инструкции runNNN - который в свою очередь возвращает
   следующий script.ip (для следующей инструкции) или (важно) -1 если произошла ошибка выполнения инструкции. Функция executeInstruction возвращает истину (true) если инструкцию
   удалось выполнить (script.ip не равен -1), или ложь (false) если не удалось выполнить инструкцию.
-- scriptRun последовательно вызывает executeInstruction до тех пока очередной вызов не вернет ложь, в этом случае выполнения скрипта прекращается.

					   script.data[var1,     var2,    var3 ... varBBB]
											  ^        ^
											  |        |

script.code[inst1(arg1addr, arg2addr), inst2(arg1addr, arg2addr), inst3(..), inst4(..) ... instZZZ(..)]
										^
										| script.ip (current instruction is inst2)

----------------------------------------------------------------------------------------------------------------------------------------------------

Функции делятся на три основные группы:
- функции управления исполнением скриптов
	Отвечают за ВСЕ скрипты - хранение, удаление, загрузка, выгрузка, получение данных о состоянии скриптов (исполняется, остановлен, ошибка)
- функции инструкций
	Реализуют исполнение байт-кода каждой отдельной инструкции, а так же отвечают за размещение инструкций и данных в сегментах code и data
- функции исполнения инструкций
	Реализуют компиляцию исходного кода в байт-кода, исполнение байт-кода, контролируют ошибки исполнения и отладку

Секция функций управления исполнением скриптов ------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------
Сбрасывает (очищает) указанную запись скрипта в массиве скриптов
Параметр int index - индекс скрипта в массиве
Ничего не возвращает true если запись очищена, false если индекс ошибочен
-----------------------------------------------------------------------------*/
bool scriptsReset(int index)
{
	if ((index < 0) || (index > SCRIPT_SIZE - 1))
		return false;								//если вышли за размер массива
	filesWriteInt(scripts[index].name + ".rf", -1); //очищаем файл флажок аварийной остановки скрипта, если в этом файлы не -1 скрипт не будет исполняться
	//сбрасываем поля записи
	scripts[index].name = "";
	scripts[index].byteCode = "";
	scripts[index].status = STOP_STATUS;
	scripts[index].firstTime = false;
	scripts[index].ip = -1;
	scripts[index].codeCount = 0;
	scripts[index].dataCount = 0;
	scripts[index].timeQuant = 1;
	scripts[index].quantCounter = 0;
	//на данном этапе, было выяснено что ESP8266 освобождение heap free() вызывает непредвиденные сбои, пока не используется
	//TODO: найти безопасный способ освобождения кучи
	//	free(scripts[0].code);
	//	free(scripts[0].data);
	return true;
}
/*-----------------------------------------------------------------------------
Возвращает индекс записи скрипта с именем name
Параметр String name - имя искомого скрипта (уникально)
Возвращает индекс скрипта или -1 если скрипт с таким именем не существует
-----------------------------------------------------------------------------*/
int scriptsGetByIndex(String name)
{
	//последовательно перебираем все скрипты в массиве
	//НЕ ИСПОЛЬЗУЕМ scriptCount - скрипты в середине массива могут быть удалены, поэтому:
	//scriptCount - количество загруженных скриптов
	//SCRIPT_SIZE - размер всего массива с записями скриптов
	//
	//Пример:
	//Scripts[Sript0Structure, Sript1Structure,(..deleted..),(..deleted),Sript4Structure..Sript(SCRIPT_SIZE-1)Structure]
	//в этом массиве 4 скрипта, с индексами 0,1,4 и SCRIPT_SIZE-1 (в массивах индекс первого элемента равен 0)
	//при этом scriptCount = 4, а SCRIPT_SIZE количеству всех элементов массива, например десяти.
	//если мы ошибочно сделаем цикл for по scriptCount-1, мы не достигнем Sript4Structure и Sript(SCRIPT_SIZE-1)Structure элементов массива
	for (int i = 0; i < SCRIPT_SIZE; i++)
	{
		if (scripts[i].name == name) //если имя из параметра совпадает с именем скрипта
		{
			return i; //возвращаем индекс найденного скрипта
		}
	}
	return -1; //попадем сюда если ничего не нашли - возвращаем -1
}
/*-----------------------------------------------------------------------------
Возвращает данные о состоянии всех скриптов в текстовом формате, используется для
передачи данных UI (для примера смотрите scriptscore.js)
Параметров нет
Возвращает данные или пустую строку если нет скриптов
-----------------------------------------------------------------------------*/
String scriptsGetAll()
{
	//ВАЖНО: поля скрипта и их значения разделяются "=", строки с полями "\r",
	//в свою очередь строки исходного кода скрипта и состояния переменных разделяются "\n"
	//что позволяет легко хранить и парсить обе структуры в одном файле (строке)
	String result = "";
	String valueName = "";
	String value = "";
	for (int i = 0; i < SCRIPT_SIZE; i++)
	{ //перебираем все записи
		if (scripts[i].name.length() != 0)
		{ //если имя скрипта не пустая строка, добавляем данные о скрипте в строку
			result += "script:" + scripts[i].name + "\r";
			result += "status=" + String(scripts[i].status) + "\r";
			result += "debuglinenumber=" + String(scripts[i].debugLineNumber) + "\r";
			result += "bytecode=" + String(scripts[i].byteCode) + "\r"; //!САМ исходный построчно код разделен "\n"
			result += "codecount=" + String(scripts[i].codeCount) + "\r";
			result += "datacount=" + String(scripts[i].dataCount) + "\r";
			result += "timequant=" + String(scripts[i].timeQuant) + "\r";
			result += "ip=" + String(scripts[i].ip) + "\r";
			result += "variables=\n";
			//собираем данные о переменных и их значениях
			for (int j = 0; j < scripts[i].dataCount; j++)
			{
				valueName = scripts[i].data[j].name;
				value = scripts[i].data[j].value;
				result += valueName + "=" + value + "\n"; //переменные разделяются по "\n"
			}
			result += "\r";
		}
	}
	return result;
}
/*-----------------------------------------------------------------------------
Тоже что и scriptsGetAll(), но в более сжатом формате, используется для хранения
скриптов в файле.
Параметров нет
Возвращает данные или пустую строку если нет скриптов
-----------------------------------------------------------------------------*/
String scriptsGetAllClean()
{
	String result = "";
	for (int i = 0; i < SCRIPT_SIZE; i++)
	{
		if (scripts[i].name.length() != 0)
		{ //zero string - script deleted
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
/*-----------------------------------------------------------------------------
Собирает данные о скриптах и сохраняет их в файл с именем "scripts"
Параметров нет
Возвращает true если удалось записать данные в файл, false в случае ошибки
-----------------------------------------------------------------------------*/
bool scriptsSave()
{
	return filesWriteString("scripts", scriptsGetAllClean());
}
/*-----------------------------------------------------------------------------
Останавливает и удаляет указанный скрипт, перезаписывает файл хранящий
данные о скриптах.
Параметр String name имя удаляемого скрипта
Возвращает true если удалось удалить скрипт с таким именем, false если скрипт
не существует
-----------------------------------------------------------------------------*/
bool scriptsDelete(String name)
{
	int index = scriptsGetByIndex(name); //узнаем существует ли скрипт с таким именем
	if (index != -1)					 //если существует index != -1
	{
		scriptCount--;
		scriptsReset(index);  //очищаем запись скрипта
		return scriptsSave(); //сохраняем скрипты, если удалось сохранить scriptsSave() вернет true
	}
	return false; //не удалось удалить, возвращаем false
}
/*-----------------------------------------------------------------------------
Останавливает указанный скрипт, похожа на scriptsDelete(..), но скрипт останется в
памяти и его исполнение может быть возобновлено позже.
Остановленный скрипт не возобновит работу после перезагрузки контроллера.
Параметр String name имя останавливаемого скрипта
Возвращает true если удалось остановить скрипт с таким именем, false если скрипт
не существует
-----------------------------------------------------------------------------*/
bool scriptsStop(String name)
{
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		//устанавливаем статус скрипта в STOP_STATUS, с таким статусом инструкции скрипта
		//исполнятся не будут
		scripts[index].status = STOP_STATUS;
		return scriptsSave(); //сохраняем скрипты
	}
	return false;
}
/*-----------------------------------------------------------------------------
Возобновляет выполнение остановленного скрипта, похожа на scriptsStop(..)
При перезапуске контроллера такой скрипт автоматически будет запущен
Критические ошибки в момент исполнения - остановят этот скрипт, сбросив
значение флажка scripts[index].status
Параметр String name имя запускаемого скрипта
Возвращает true если удалось запустить скрипт, false если нет
-----------------------------------------------------------------------------*/
bool scriptsRun(String name)
{
	int index = scriptsGetByIndex(name);
	if (index != -1)
	{
		scripts[index].ip = 0;				//сбрасываем указатель инструкции на первую инструкцию
		scripts[index].status = RUN_STATUS; //инструкции скрипта с таким статусом продолжат исполнение
		return scriptsSave();				//сохраняем скрипты
	}
	return false;
}

//Секция функций инструкций ------------------------------------------------------------------------------------------------------
/*-----------------------------------------------------------------------------
Размещает в heap массив char[], получает указатель на созданный массив,
переносит символы из строки str в созданный массив
Параметр String srt строка с символами
Возвращает указатель на массив char[] с символами входящей строки
-----------------------------------------------------------------------------*/
char *stringToArray(String str)
{
	//TODO: есть идея, передавать в будущем указатель на предыдущий массив char[], но пока не выяснено, не работает free()  вызывает сбой (через раз)
	char *array;											   //указатель на массив
	array = (char *)malloc(sizeof(char) * (str.length() + 1)); //просим heap размером str под указатель
	strcpy(array, str.c_str());								   //копируем символы
	return array;
}
/*-----------------------------------------------------------------------------
Помещает переменную name и ее данные в сегмент данных (data[])
Параметры:
- int index индекс скрипта (определят какому скрипту принадлежит переменная)
- String name имя переменной
- String value значение переменной
Возвращает resultIndex индекс переменной в сегменте данных, полный адрес переменной:
scripts[index].data[resultIndex]
Возвращает индекс добавленной переменой
-----------------------------------------------------------------------------*/
int pushData(int index, String name, String value)
{
	/*
	так как данная функция размещает переменные последовательно - от индекса 0 до dataCount
	изначально, при первом обращении
	scripts[index].dataCount = 0 - переменных нет
	после первого обращения
	scripts[index].dataCount = 1 - одна переменная есть
	поэтому в реализации pushData(..) scripts[index].dataCount используется как указатель
	следующей переменной.

	Компилятор при первом проходе подсчитывает общее количество переменных в скрипте,
	После чего запрашивает у heap нужное количество памяти для scripts[index].data[..]
	По этой причине scripts[index].dataCount может быть использован для индексации
	внутри scripts[index].data[..]

	!ЭТУ ФУНКЦИЮ ИСПОЛЬЗУЕТ ТОЛЬКО КОМПИЛЯТОР - и он отвечает за размер и индексацию внутри
	массива scripts[index].data[..]

	Когда в скрипте было указано
	var a=10, то имя переменой будет "a", а значение "10"
	TODO: тип переменных
	*/
	//переносим имя переменой
	scripts[index].data[scripts[index].dataCount].name = stringToArray(name);
	//переносим ее данные
	scripts[index].data[scripts[index].dataCount].value = stringToArray(value);

	/*
	!Очень коварный момент, на самом деле эта функция возвращает индекс в сегменте данных куда
	только что была добавлена переменная scripts[index].data[scripts[index].dataCount]
	При этом после scripts[index].dataCount увеличится на 1 и станет указывать количество переменных
	(или индекс свободного места под следующею переменную в данном контексте)

	return ++scripts[index].dataCount; -> с начало увеличит счетчик на 1, а потом вернет значение
	return scripts[index].dataCount++; -> с начало вернет значение, а потом увеличит счетчик на 1

	"казнить нельзя помиловать" от операторов return и ++
	*/
	return scripts[index].dataCount++;
}
/*-----------------------------------------------------------------------------
Возвращает индекс переменой в сегменте данных указанного скрипта по ее имени
Параметры:
- int index индекс скрипта
- String name имя переменной
Возвращает индекс переменной или -1 если переменной с таким именем не существует
-----------------------------------------------------------------------------*/
int getDataAddr(int index, String name)
{
	String _name; //из за того что для хранения имен и значений сегмент данных data[..] использует
				  //указатели на массивы char[] в динамической памяти, мы не рискнули делать прямое сравнение
				  //name или name.c_str() с scripts[index].data[i].name
	for (int i = 0; i < scripts[index].dataCount; i++)
	{										 //перебираем все переменные
		_name = scripts[index].data[i].name; //переносим имя переменой в строку
		if (_name == name)
		{			  //сравниваем имена
			return i; //если нашли переменную с таким именем возвращаем ее индекс
		}
	}
	return -1; //если не нашли
}

//--------------------------------------------------------------------------------------------------------
//ИНСТРУКЦИИ
/*-----------------------------------------------------------------------------
Добавляет инструкцию let в сегмент кода. <переменная><=><переменная|значение>
Параметры:
- int index индекс скрипта
- int addr адрес инструкции
- int resultAddr адрес в сегменте данных для хранения аргумента result
- int arg1Addr адрес в сегменте данных для хранения аргумента addr
- int lineNumber номер строки в исходном коде скрипта
Возвращает единицу
-----------------------------------------------------------------------------*/
int addLet(int index, int addr, int resultAddr, int arg1Addr, int lineNumber)
{
	scripts[index].code[addr].type = LET_INSTRUCTION;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runLet(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != LET_INSTRUCTION)
		return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(value1);

	return ++ip;
}
//<переменная><=><переменная|значение><+><переменная|значение>
int addSum(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber)
{
	scripts[index].code[addr].type = ADD_INSTRUCTION;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runSum(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != ADD_INSTRUCTION)
		return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());

	String result = String(arg1 + arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}
//<переменная><=><переменная|значение><-><переменная|значение>
int addSub(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber)
{
	scripts[index].code[addr].type = SUB_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runSub(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != SUB_INSTRUCTION)
		return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());
	String result = String(arg1 - arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}

//<переменная><=><переменная|значение><*><переменная|значение>
int addMult(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber)
{
	scripts[index].code[addr].type = MULT_INSTRUCTION;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runMult(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != MULT_INSTRUCTION)
		return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());

	//проверка выйдет ли результат умножения arg1 за arg2 за размер float
	if (arg1 != 0.0f)
	{

		float argForCheckMax = FLT_MAX / arg1;
		float argForCheckMin = FLT_MIN / arg1;

		if ((argForCheckMin > arg2) || (argForCheckMax < arg2))
			return -1;
	}

	String result = String(arg1 * arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}
//<переменная><=><переменная|значение><\><переменная|значение>
int addDev(int index, int addr, int resultAddr, int arg1Addr, int arg2Addr, int lineNumber)
{
	scripts[index].code[addr].type = DEV_INSTRUCTION;
	scripts[index].code[addr].resultAddr = resultAddr;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runDev(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != DEV_INSTRUCTION)
		return -1;

	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());

	//Проверка на ноль делителя
	if (arg2 == 0.0f)
		return -1;

	////Если  -1< agr2 < 1 проверяем не выйдет ли результат деления за float
	if ((arg2 > -1) && (arg2 < 1))
	{
		float argCheckMax = FLT_MAX * arg2;
		float argCheckMin = FLT_MIN * arg2;
		if ((arg1 > argCheckMax) || (arg1 < argCheckMin))
			return -1;
	}

	String result = String(arg1 / arg2);

	free(scripts[index].data[scripts[index].code[ip].resultAddr].value);
	scripts[index].data[scripts[index].code[ip].resultAddr].value = stringToArray(result);

	return ++ip;
}

//<write ><переменная>
int addWrite(int index, int addr, int arg1Addr, int lineNumber)
{
	scripts[index].code[addr].type = SERIAL_OUT_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runWrite(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != SERIAL_OUT_INSTRUCTION)
		return -1;

	Serial.println(String(scripts[index].data[scripts[index].code[ip].arg1Addr].value));

	return ++ip;
}
//<goto ><метка>
int addGoto(int index, int addr, int arg1Addr, int lineNumber)
{
	scripts[index].code[addr].type = GOTO_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runGoto(int index)
{
	int ip = scripts[index].ip;

	if (scripts[index].code[ip].type != GOTO_INSTRUCTION)
		return -1;
	if (scripts[index].code[ip].arg1Addr == -1)
		return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	int arg1 = atoi(value1.c_str());
	return arg1;
}

int addIfupper(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber)
{
	scripts[index].code[addr].type = IF_UPPER_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runIfupper(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != IF_UPPER_INSTRUCTION)
		return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());
	if (arg1 > arg2)
	{
		if (scripts[index].code[ip].arg3Addr == -1)
			return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = atoi(value3.c_str());
		return arg3;
	}
	else
	{
		return ++ip;
	}
}

int addIflower(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber)
{
	scripts[index].code[addr].type = IF_LOWER_INSTUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runIflower(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != IF_LOWER_INSTUCTION)
		return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());
	if (arg1 < arg2)
	{
		if (scripts[index].code[ip].arg3Addr == -1)
			return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = atoi(value3.c_str());
		return arg3;
	}
	else
	{
		return ++ip;
	}
}

int addIfequal(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber)
{
	scripts[index].code[addr].type = IF_EQUAL_INSTUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runIfequal(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != IF_EQUAL_INSTUCTION)
		return -1;
	String value1 = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String value2 = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	float arg1 = atof(value1.c_str());
	float arg2 = atof(value2.c_str());
	if (arg1 == arg2)
	{
		if (scripts[index].code[ip].arg3Addr == -1)
			return -1;
		String value3 = scripts[index].data[scripts[index].code[ip].arg3Addr].value;
		int arg3 = atoi(value3.c_str());
		return arg3;
	}
	else
	{
		return ++ip;
	}
}
//<getprop ><драйвер><свойство_драйвера><переменная>
int addGetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber)
{
	scripts[index].code[addr].type = GET_DRIVER_PROPERTY_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runGetProp(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != GET_DRIVER_PROPERTY_INSTRUCTION)
		return -1;

	String driverId = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String driverProp = scripts[index].data[scripts[index].code[ip].arg2Addr].value;

#ifdef USE_DRIVERS
	String value = driversGetDriverProperty(driverId, driverProp);
#else
	String value = NOT_AVAILABLE;
#endif

	if ((value.length() == 0) || (value == WRONG_PROPERTY_NAME)) //then try get this property from node
	{
#ifdef USE_ESP_DRIVER
		value = nodeOnMessage(nodeGetTopic() + "/get" + driverProp, "", NO_TRANSPORT_MASK);
#endif
	}

	if (((value.length() == 0) || (value == WRONG_PROPERTY_NAME)) && (getDataAddr(index, STOP_IF_DEVICE_NOTREADY) != -1))
	{
		return -1; //temporary
	}
	strcpy(scripts[index].data[scripts[index].code[ip].arg3Addr].value, value.c_str());

	return ++ip;
}
//<setprop ><драйвер><свойство_драйвера><переменная|значение>
int addSetProp(int index, int addr, int arg1Addr, int arg2Addr, int arg3Addr, int lineNumber)
{
	scripts[index].code[addr].type = SET_DRIVER_PROPERTY_INSTRUCTION;
	scripts[index].code[addr].arg1Addr = arg1Addr;
	scripts[index].code[addr].arg2Addr = arg2Addr;
	scripts[index].code[addr].arg3Addr = arg3Addr;
	scripts[index].code[addr].lineNumber = lineNumber;
	return 1;
}

int runSetProp(int index)
{
	int ip = scripts[index].ip;
	if (scripts[index].code[ip].type != SET_DRIVER_PROPERTY_INSTRUCTION)
		return -1;

	String driverId = scripts[index].data[scripts[index].code[ip].arg1Addr].value;
	String driverProp = scripts[index].data[scripts[index].code[ip].arg2Addr].value;
	String value = scripts[index].data[scripts[index].code[ip].arg3Addr].value;

#ifdef USE_DRIVERS
	String result = driversSetDriverProperty(driverId, driverProp, value);
#else
	String result = "0";
#endif

	if ((result.length() == 0) || (result == WRONG_PROPERTY_NAME)) //try set node property
	{
#ifdef USE_ESP_DRIVER
		result = nodeOnMessage(nodeGetTopic() + "/set" + driverProp, value, NO_TRANSPORT_MASK);
#endif
	}

	if (((value.length() == 0) || (value == WRONG_PROPERTY_NAME)) && (getDataAddr(index, STOP_IF_DEVICE_NOTREADY) != -1))
	{
		return -1;
	}

	return ++ip;
}

//Секция функций компиляции и исполнения инструкций скриптов ---------------------------------------------------------------------------------------
bool executeInstruction(int index)
{
	int ip = scripts[index].ip;
	switch (scripts[index].code[ip].type)
	{
	case STOP_INSTRUCTION: //default
		scripts[index].ip = -1;
		break;
	case LET_INSTRUCTION:
		scripts[index].ip = runLet(index);
		break;
	case ADD_INSTRUCTION:
		scripts[index].ip = runSum(index);
		break;
	case SUB_INSTRUCTION:
		scripts[index].ip = runSub(index);
		break;
	case MULT_INSTRUCTION:
		scripts[index].ip = runMult(index);
		break;
	case DEV_INSTRUCTION:
		scripts[index].ip = runDev(index);
		break;
	case SERIAL_OUT_INSTRUCTION:
		scripts[index].ip = runWrite(index);
		break;
	case GOTO_INSTRUCTION:
		scripts[index].ip = runGoto(index);
		break;
	case IF_UPPER_INSTRUCTION:
		scripts[index].ip = runIfupper(index);
		break;
	case IF_LOWER_INSTUCTION:
		scripts[index].ip = runIflower(index);
		break;
	case IF_EQUAL_INSTUCTION:
		scripts[index].ip = runIfequal(index);
		break;
	case GET_DRIVER_PROPERTY_INSTRUCTION:
		scripts[index].ip = runGetProp(index);
		break;
	case SET_DRIVER_PROPERTY_INSTRUCTION:
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

bool scriptsRun()
{
	for (int i = 0; i < SCRIPT_SIZE; i++)
	{
		if (scripts[i].name.length() != 0)
		{
#ifdef SCRIPT_TRACERT
#ifdef DEBUG
			debugOut(SCRIPT_ID, "script: " + scripts[i].name + " status: " + String(scripts[i].status) + " quants: " + String(scripts[i].timeQuant));
#endif
#endif

			if ((scripts[i].status == RUN_STATUS) || (scripts[i].status == CRITICAL_RUN_STATUS))
			{
				scripts[i].quantCounter = 0;
				while (true)
				{
					if (scripts[i].firstTime)
					{
						int lastInstructionCode = filesReadInt(scripts[i].name + ".rf"); //run flag
#ifdef SCRIPT_TRACERT
#ifdef DEBUG
						debugOut(SCRIPT_ID, "-> LI: " + String(lastInstructionCode));
#endif
#endif
						scripts[i].firstTime = false;
						if (lastInstructionCode != -1) //loose last instruction TODO: use the value for debug
						{
							if (scripts[i].status != CRITICAL_RUN_STATUS)
							{
								scripts[i].status = RUNTIME_ERROR_STATUS;
								break;
							}
						}
					}
#ifdef SCRIPT_TRACERT
#ifdef DEBUG
					debugOut(SCRIPT_ID, "-> addr: " + String(scripts[i].ip));
#endif
#endif
					filesWriteInt(scripts[i].name + ".rf", scripts[i].ip); //up RF flag (store last instruction)
					bool result = executeInstruction(i);
#ifndef SCRIPT_TRACERT
					filesWriteInt(scripts[i].name + ".rf", -1); //escapre RF flag
#else
					bool fwResult = filesWriteInt(scripts[i].name + ".rf", -1); //escapre RF flag
#ifdef DEBUG
					debugOut(SCRIPT_ID, "fwResult: " + String(fwResult));
#endif
#ifdef DEBUG
					debugOut(SCRIPT_ID, "<- addr: " + String(scripts[i].ip));
#endif
#endif
					if (!result)
					{
						scripts[i].status = STOP_STATUS;
#ifdef SCRIPT_TRACERT
#ifdef DEBUG
						debugOut(SCRIPT_ID, "stop by instruction result");
#endif
#endif
						break;
					}
					scripts[i].quantCounter++;
#ifdef SCRIPT_TRACERT
#ifdef DEBUG
					debugOut(SCRIPT_ID, "quants counter: " + String(scripts[i].quantCounter));
#endif
#endif
					if (scripts[i].quantCounter >= scripts[i].timeQuant)
						break;
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
			if (scripts[index].status == DEBUG_STATUS)
			{
				bool result = executeInstruction(index);

				if (!result)
				{
					scripts[index].status = STOP_STATUS;
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
		scripts[index].status = DEBUG_STATUS;
		scripts[index].ip = 0;
		return true;
	}
	return false;
}
/*-----------------------------------------------------------------------------
Вспомогательная функция, удаляет комментарий из строки исходного кода скрипта 
Используется компилятором scriptsCompile(..)
- Комментарии обозначены символами "//"
- В одной строке может быть один комментарий
- Все что после символов комментария компилятор "не видит"
Параметр:
String str одна строка исходного кода
Результат: содержимое строки str до начала комментария, без "//" например:
str -> a = a + 1 //increment value of variable a
result -> a = a + 1
-----------------------------------------------------------------------------*/
String clearComment(String str)
{
	if (str.indexOf("//") == -1)
		return str;
	return str.substring(0, str.indexOf("//"));
}
/*-----------------------------------------------------------------------------
Вспомогательная функция, удаляет пробелы и табуляции в одной строчке кода 
скрипта. 
Используется компилятором scriptsCompile(..)
Опционально может удалять пробелы и табуляции только в начале строки. 
Параметры:
String str одна строка исходного кода
bool atBegin флажок - если true удаляются пробелы и табуляции только в начале строки, 
если false - все встреченные пробелы и табуляции в строке str
Результат: содержимое строки str без пробелов и табуляций
-----------------------------------------------------------------------------*/
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
	for (unsigned int i = 0; i < str.length(); i++)
	{
		if ((atBegin && (!stopClean)) || !atBegin)
		{
			if (str[i] == spaceChar)
				continue;
			if (str[i] == tabChar)
				continue;
		}
		stopClean = true;
		cleanString += str[i];
	}
	return cleanString;
}
/*-----------------------------------------------------------------------------
Компилятор скрипта в байт код. Производит синтаксический разбор исходного кода
скрипта в три прохода.
Первый проход - подсчитывает количество инструкций и переменных (данных),
вычисляет необходимый размер сегмента кода code[] и сегмента данных data[]
Второй проход - выбирает метки перехода (Labels:)
Третий проход - разбирает исходный код и декодирует инструкции и переменные
переносим их в сегменты.
Параметр:
- int index индекс скрипта
Возвращает пустую строку если компиляция прошла успешно, строку с сообщением
об ошибке если компиляция не удалась.
-----------------------------------------------------------------------------*/
String scriptsCompile(int index)
{
	String result = ""; //строка с результатом, по умолчанию пуста, ошибок не было

	scripts[index].ip = 0;		  //сбрасывает указатель инструкций
	scripts[index].codeCount = 0; //сбрасывает счетчик инструкций
	scripts[index].dataCount = 0; //сбрасывает счетчик переменных (данных)
	free(scripts[index].code);	  //освобождает heap сегмента кода
	free(scripts[index].data);	  //освобождает heap сегмента данных

	int linePos = 0; //сбрасываем указатель текущей разбираемой строки скрипта
	String command;	 //буфер для разбора строк

	//Первый проход, подсчитываем необходимый размер сегментов кода и данных ----------------------------------------------------------------------------------
	int _dataCount = 10; //резервируем место для инструкций
	int _codeCount = 10; //резервируем место для данных
	//^^^так поступать не совсем "честно", мы заведомо даем себе возможность ошибиться на какое то количество инструкций и данных
	//   но в таком виде это работает надежнее
	String byteCode = scripts[index].byteCode + CODE_LINE_DELIMITER; //создаем рабочую копию скрипта, добавляем конец строки - пользователь вероятнее всего
																	 //не поставил enter после последней инструкции
	while ((linePos = byteCode.indexOf(CODE_LINE_DELIMITER)) != -1)	 //выбираем из кода скрипта строку за строкой (пока в тексте есть хотя бы один символ конца строки)
	{
		command = clearSpace(byteCode.substring(0, linePos), true); //удаляем пробелы и табуляции в начале строки
		if (command.length() != 0)									//если строка не пуста
		{
			if ((command.indexOf("var ") == 0) || (command.indexOf(":") > 0))
				_dataCount++; //если строка содержит слово "var" или символ ":" - это переменная или метка
			else
			{
				_codeCount++; //иначе в строке инструкция
							  //эти инструкции создают две переменные для хранения своих аргументов
							  //при этом математические операторы могут использовать переменные в качестве аргументов, и память для них будет зарезервирована в var
							  //однако анализ займет процессорное время, а это значит компиляция будет более медленнее, по этой причине жертвуем памятью и выигрываем
							  //в скорости резервируя место для двух аргументов
							  //например a=b+c не требует еще памяти в data[], однако a=100+20 требует резервирования места под две переменных
				if ((command.indexOf("getprop ") == 0) ||
					(command.indexOf("if ") == 0) //if goto инструкция тоже может создать две переменных, даже в случае if 10 > 20 goto begin (это соответствует синтаксису)
					||
					((command.indexOf("=") > 0) && ((command.indexOf("+") > 0) || (command.indexOf("-") > 0) || (command.indexOf("/") > 0) || (command.indexOf("*") > 0)))) //для математических операторов
																																											//^^ в строке есть оператор "=" и один из математических операторов
				{
					_dataCount += 2;
				}
				else if (command.indexOf("setprop ") == 0) //эта инструкция своими аргументами может занять до трех переменных
				{
					_dataCount += 3;
				}
			}
		}
		//вырезаем обработанною строку из копии исходного кода скрипта
		byteCode.remove(0, linePos + 1); //"1" длина разделителя "\n"
	}									 //берем следующею строку

#ifdef USE_ESP_DRIVER
	// проверим не выйдет ли полученный байт код за установленные пределы heap памяти
	if ((ESP.getFreeHeap() - HEAP_LIMIT) < (sizeof(Instruction) * _codeCount + sizeof(Variable) * _dataCount))
	{
		//байт код переполнит память, отказываемся от компиляции
		return "out of heap";
	}
#endif
	//выделяем память в heap для сегмента кода и данных
	scripts[index].code = (Instruction *)malloc(sizeof(Instruction) * _codeCount);
	scripts[index].data = (Variable *)malloc(sizeof(Variable) * _dataCount);

	//Второй проход: выборка label (меток) для перехода --------------------------------------------------------------------------------------------------------------
	//метко считается строка соответствующая синтаксису <имя_метки><:> где имя_метки уникально
	//данные метке - имя и адрес сохраняются в сегменте данных
	//адрес метки - количество инструкций от начала сегмента кода (адрес первой инструкции 0)
	//инструкции переходов goto, if goto - находят свою метку по имени в сегменте данных и получают
	//адрес следующей инструкции (адрес перехода) из data[..].value метки
	_codeCount = 0; // будет использован как счетчик инструкций
	linePos = 0;
	byteCode = scripts[index].byteCode + CODE_LINE_DELIMITER;		//новая копия кода скрипта
	while ((linePos = byteCode.indexOf(CODE_LINE_DELIMITER)) != -1) //разбор строк скрипта так же как и при подсчете размере выделяемой памяти
	{
		command = clearSpace(byteCode.substring(0, linePos), true);
		if (command.length() != 0)
		{
			if (command.indexOf(":") > 0) //если встретили метку
			{
				String labelName = command.substring(0, command.indexOf(':')); //получаем имя метки
				pushData(index, labelName, String(_codeCount));				   //помещаем метку в сегмент данных, _codeCount - адрес инструкции после метки
																			   //пример:
																			   //нашли c=1, нет "var ", тогда _codeCount++ == 1 (адрес следующей инструкции), адрес c=1 == 0
																			   //нашли begin:, метка, помещаем в сегмент данных data[..].name="begin" data[..].value="1" (метка не инструкция, у нее нет адреса для IP)
																			   //нашли a=c+3, не переменная, _codeCount++ == 2, при этом адрес инструкции a=c+3 == 1
																			   //нашли goto begin, не переменная, использует метку begin, value которой "1" - переходим к инструкции по адресу 1 -> a=c+3
			}
			else if (command.indexOf("var ") == -1) //не переменная и не метка
			{
				_codeCount++; //значит была инструкция, адрес следующей _codeCount++
			}
		}
		byteCode.remove(0, linePos + 1); //удаляем очередную разобранную строку
	}

	//Третий проход: компиляция - декодирование инструкций, размещение байт кода инструкций в сегменте кода, декодирование переменных размещение в сегменте данных
	//Перебор строк кода реализован так же как при первом и втором проходе - создаем копию кода скрипта, идем строка за строкой, вырезаем пройденные строки
	linePos = 0;
	int lineCount = 0;
	byteCode = scripts[index].byteCode + CODE_LINE_DELIMITER;
	while ((linePos = byteCode.indexOf(CODE_LINE_DELIMITER)) != -1) //разбор на строки так же как и при первых двух проходах
	{
		command = clearSpace(byteCode.substring(0, linePos), true);	 //удаляем пробелы и табуляции в начале строки
		lineCount++;												 //первая строчка в исходном коде (это значение так же используется при пошаговой отладке, для навигации в тексте исходного кода скрипта на стороне UI)
		if ((command.length() != 0) && (command.indexOf(":") == -1)) //если строка пуста или строка содержит метку, пропускаем ее (метки мы выбрали во время второго прохода)
		{
			if (command.indexOf("var ") == 0) //если в строке переменная, разберем ее синтаксис и поместим в сегмент данных. Синтаксис <var ><имя_переменной><=><значение_переменной>
			{
				String varArg = command.substring(command.indexOf(" ") + 1);				  //отделяем <имя_переменной><=><значение_переменной>
				String varName = clearSpace(varArg.substring(0, varArg.indexOf('=')), false); //отделяем  <имя_переменной> и удаляем пробелы и табуляции
				String varValue = varArg.substring(varArg.indexOf('=') + 1);				  //отделяем <значение_переменной> (НЕ УБИРАЕМ ПРОБЕЛЫ, возможно это var a=Hello World)
				pushData(index, varName, varValue);											  //помещаем переменную в сегмент данных
			}
			else //Instruction parsin section
			{
				//парсер математических выражений ---------------------------------------------------------------------------
				if ((command.indexOf("=") > 0) && (command.indexOf("if ") != 0)) //если есть символ "=" и это уже точно не var значит это выражение +,-,\ или * И ЭТО НЕ ИНСТРУКЦИЯ IF GOTO
				{
					//TODO учесть возможность отрицательных значений т.е. знак "-" перед значением!!!!
					//синтаксис математических выражений:
					//<переменная><=><переменная|значение>[<+|-|\|*><переменная|значение>]
					//^^^обязательно переменная, обязательно знак равенства, обязательно переменная или числовое значение [возможна вторая часть, если она есть обязательно математический оператор
					//<+|-|\|*>,обязательно переменная или значение]
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

					if (args.indexOf("+") > 0)
					{
						mathOperator = '+';
					}
					else if (args.indexOf("-") > 0)
					{
						mathOperator = '-';
					}
					else if (args.indexOf("/") > 0)
					{
						mathOperator = '/';
					}
					else if (args.indexOf("*") > 0)
					{
						mathOperator = '*';
					}

					if (mathOperator == 0x00) //если не нашли математический оператор
					{
						//оператор "=" есть но нет математического оператора в правой части, возможно это инструкция let
						//синтаксис <переменная><=><переменная|значение>
						//в этом случае вся вторая часть выражения либо переменная, либо числовое значение
						int argsAddr = getDataAddr(index, args);
						if (argsAddr == -1) //переменная для не указана, возможно это численное выражение, например b=77
						{
							float argsfloat = args.toFloat();
							if (argsfloat == 0)
							{
								args = "0";
							}
							argsAddr = pushData(index, "args" + String(lineCount), args); //создаем переменную для аргумента, сохраняем адрес
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

						if (arg1Addr == -1) //переменная для первого аргумента не указана, возможно это численное выражение a=100+b
						{
							float arg1float = arg1.toFloat();
							if (arg1float == 0)
							https: //www.arduino.cc/reference/en/language/variables/data-types/string/functions/tofloat/ //не число
							{
								//придется считать такой аргумент числом равным 0
								//иначе мы не может делать выражения вида a = 0 -> 0.toFloat() == 0 ошибка
								arg1 = "0";
							}
								arg1Addr = pushData(index, "arg1" + String(lineCount), arg1); //создаем переменную для аргумента, сохраняем адрес
						}

						if (arg2Addr == -1) //переменная для второго аргумента не указана, возможно это численное выражение a=100+b, и да - возможно a=100+50
						{
							float arg2float = arg2.toFloat();
							if (arg2float == 0)
							{
								arg2 = "0";
							}
							arg2Addr = pushData(index, "arg2" + String(lineCount), arg2);
						}

						//результат и оба аргумента определены, компилируем в нужную инструкцию
						if (mathOperator == '+')
						{
							addSum(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount);
						}
						else if (mathOperator == '-')
						{
							addSub(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount);
						}
						else if (mathOperator == '*')
						{
							addMult(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount);
						}
						else if (mathOperator == '/')
						{
							addDev(index, scripts[index].codeCount, resultAddr, arg1Addr, arg2Addr, lineCount);
						}
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
					if (command.indexOf("goto") == -1) //проверяем есть ли оператор "goto" в конструкции "if goto"
					{
						result = "wrong GOTO in IF instruction at line: " + String(lineCount);
						break;
					}

					String args = command.substring(command.indexOf(" ") + 1);							//отделяем if -> <переменная|значение><">"|"<|"="><переменная|значение><goto><метка>
					args = clearSpace(args.substring(0, args.indexOf("goto")), false);					//отделяем аргументы и оператор -> <переменная|значение><">"|"<|"="><переменная|значение>
					String gotoArg = clearSpace(command.substring(command.indexOf("goto") + 4), false); //отделяем goto и метку -> <goto><метка>

					int gotoAddr = getDataAddr(index, gotoArg); //проверяем существует ли метка описанная в goto
					if (gotoAddr == -1)
					{
						result = "bad label name for GOTO at IF instruction at line: " + String(lineCount);
						break;
					}

					String ifOperator = ""; //ищем какой условный оператор использован
					if (args.indexOf(">") > 0)
					{
						ifOperator = ">";
					}
					else if (args.indexOf("<") > 0)
					{
						ifOperator = "<";
					}
					else if (args.indexOf("=") > 0)
					{
						ifOperator = "=";
					}
					else
					{ //не удалось найти или распознать использованный оператор
						result = "wrong operator > or < or = in IF instruction at line: " + String(lineCount);
						break;
					}
					//условный оператор известен, разделяем по нему аргументы
					String arg1 = args.substring(0, args.indexOf(ifOperator));
					String arg2 = args.substring(args.indexOf(ifOperator) + 1);
					//если в качестве аргументов указаны переменные, ищем их адреса
					int arg1Addr = getDataAddr(index, arg1);
					int arg2Addr = getDataAddr(index, arg2);

					if (arg1Addr == -1) //переменная для первого аргумента не указана, возможно это численное выражение if 100 < a goto begin
					{
						float arg1float = arg1.toFloat();
						if (arg1float == 0)
						{
							arg1 = "0";
						}
						arg1Addr = pushData(index, "arg1" + String(lineCount), arg1);
					}

					if (arg2Addr == -1) //переменная для второго аргумента не указана, возможно это численное выражение a=100+b, и да - возможно a=100+50
					{
						float arg2float = arg2.toFloat();
						if (arg2float == 0)
						{
							arg2 = "0";
						}
						arg2Addr = pushData(index, "arg2" + String(lineCount), arg2);
					}
					//все аргументы установлены, создаем соответствующею инструкцию
					if (ifOperator == ">")
					{
						addIfupper(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
					}
					else if (ifOperator == "<")
					{
						addIflower(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
					}
					else if (ifOperator == "=")
					{
						addIfequal(index, scripts[index].codeCount, arg1Addr, arg2Addr, gotoAddr, lineCount);
					}

					scripts[index].codeCount++;
				} //ENDOF парсер условного перехода IF GOTO --------------------------------------------------------------------
				//парсеры остальных инструкций
				else
				{
					//для всех инструкций ниже, справедлив синтаксис <имя_инструкции><аргумент_1>[<,аргумент_2>[<,аргумент_3>..[<,аргумент_N>]]]
					//данная реализация пока ограничена тремя аргументами
					String instruction = command.substring(0, command.indexOf(" ") + 1);			 //отделяем название <имя_инструкции>
					String args = command.substring(command.indexOf(" ") + 1) + CODE_ARGS_DELIMITER; //для упрощения разбора, добавляем "," после последнего аргумента
					//парсим аргументы инструкции, мы не знаем сколько их
					int argPos = 0;
					int argCount = 0;
					String arg = "";
					String arg1 = "";
					String arg2 = "";
					String arg3 = "";
					while ((argPos = args.indexOf(CODE_ARGS_DELIMITER)) != -1)
					{
						arg = args.substring(0, argPos);
						switch (argCount)
						{
						case 0:
							arg1 = arg;
							break; //найден первый аргумент
						case 1:
							arg2 = arg;
							break; //второй
						case 2:
							arg3 = arg;
							break; //третий
						}
						argCount++;					//запоминаем количество найденных аргументов
						args.remove(0, argPos + 1); //"1" размер CODE_ARGS_DELIMITER ","
					}
					//далее ищем какую же инструкцию и ее аргументы мы распарсили выше
					if (instruction.indexOf("write ") == 0) //write
					{
						addWrite(index, scripts[index].codeCount, getDataAddr(index, arg1), lineCount);
						scripts[index].codeCount++;
					}
					else if (instruction.indexOf("goto ") == 0) //goto
					{
						addGoto(index, scripts[index].codeCount, getDataAddr(index, arg1), lineCount);
						scripts[index].codeCount++;
					}
					else if (instruction.indexOf("getprop ") == 0) //getprop
					{
						int arg1Addr = pushData(index, arg1 + String(scripts[index].codeCount), arg1);
						int arg2Addr = pushData(index, arg2 + String(scripts[index].codeCount), arg2);
						addGetProp(index, scripts[index].codeCount, arg1Addr, arg2Addr, getDataAddr(index, arg3), lineCount);
						scripts[index].codeCount++;
					}
					else if (instruction.indexOf("setprop ") == 0) //setprop
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
					{ //<имя_инструкции> не распознано, возвращаем ошибку, останавливаем компиляцию
						result = "bad instruction at line: " + String(lineCount);
						break;
					}
				} //ENFOF парсеры остальных инструкций ------------------------------------------------------------------------------
			}
		}
		byteCode.remove(0, linePos + 1); //вырезаем разобранную строчку кода, переходим к следующей
	}

	//компиляция окончена или прервана, возвращаем результат, если не пустая строка - произошла ошибка компиляции
	return result;
}
/*-----------------------------------------------------------------------------
Создает новый скрипт или заменяет существующей с именем name
- скрипт будет откомпилирован
- если компиляция прошла удачно, скрипт будет запущен
- сбрасывает статус скрипта (если был скрипт с таким именем ранее) - хороший 
способ оперативной отладки и исправления ошибок. Пользователь на стороне UI,
редактирует исходный кода скрипта и вызывает scriptsCreate(..) каждый раз 
когда желает достичь результата. Если в коде ошибки или скрипт не может быть 
запущен по каким то причинам пользователю сообщат об этом. 
- если достаточно памяти виртуальной машины и даже если скрипт не удалось 
откомпилировать и\или запустить - скрипт будет сохранен в файле на стороне 
микроконтроллера. 
- если запуск скрипта приведет к фатальному сбою микроконтроллера, при 
перезагрузке скрипт будет подгружен из файла, но не будет запущен автоматически, 
статус такого скрипта будет изменен на "привел к критическому сбою", пользователь 
может "перезапустить" такой скрипт после восстановления 
микроконтроллера, осознавая все риски. 
Параметры:
String name имя скрипта 
String byteCode исходный код скрипта 
Результат:
Пустая строка если скрипт удалось сохранить и скомпилировать, иначе 
строка с описанием ошибки
-----------------------------------------------------------------------------*/
String scriptsCreate(String name, String byteCode)
{
	String result = "";
	int index = -1;
	for (int i = 0; i < SCRIPT_SIZE; i++)
	{
		if ((scripts[i].name == name) || (scripts[i].name.length() == 0))
		{
			index = i;
			break;
		}
	}

	if (index == -1)
	{
		if (scriptCount >= SCRIPT_SIZE - 2)
			return "VM scripts limit is owerflow (limit=" + String(SCRIPT_SIZE) + " scripts)";
		scriptCount++;
		index = scriptCount;
	}
	scriptsReset(index);
	scripts[index].name = name;
	scripts[index].firstTime = false;
	filesWriteInt(scripts[index].name + ".rf", -1); //escapre RF flag
	scripts[index].byteCode = byteCode;

	result = scriptsCompile(index);
	if (result.length() == 0)
	{
		scripts[index].status = RUN_STATUS;
	}
	else
	{
		scripts[index].status = COMPILE_ERROR_STATUS;
	}
	scriptsSave();
	return result;
}
/*-----------------------------------------------------------------------------
Загружает записи всех скриптов из файла (из flash микроконтроллера)
- для всех загруженных скриптов вызывается scriptsCompile(..) для пере компиляции. 
- если перед сохранением у скрипта был установлен статус х_RUN_STATUS скрипт 
будет запущен. При этом, исполнитель инструкций scriptsRun() не будет продолжать 
исполнение скрипта, если его исполнение привело к сбою - статус такого скрипта 
будет автоматически сброшен в scriptsRun()
- пользователь может продолжить исполнение остановленного скрипта. 
Параметров нет
Результат, вернет true если удалось загрузить, false если нет
-----------------------------------------------------------------------------*/
bool scriptsLoad()
{
	scriptCount = -1;
	String result = filesReadString("scripts");
	if (!result)
		return false;

	int linePos = 0;
	String line;

	while ((linePos = result.indexOf(STRUCTURE_LINE_DELIMITER)) != -1)
	{
		line = result.substring(0, linePos);

		if (line.indexOf("script:") == 0) //script section
		{
			String scriptName = line.substring(line.indexOf(STRUCTURE_SCRIPT_DELIMITER) + 1);
			scriptCount++;
			scriptsReset(scriptCount);
			scripts[scriptCount].name = scriptName;
			scripts[scriptCount].firstTime = true;
		}
		else //key section
		{
			String key = line.substring(0, line.indexOf(STRUCTURE_KEY_DELIMITER));
			String value = line.substring(line.indexOf(STRUCTURE_KEY_DELIMITER) + 1);

			if (key == "status")
				scripts[scriptCount].status = atoi(value.c_str());
			else if (key == "bytecode")
			{
				scripts[scriptCount].byteCode = value;
				scriptsCompile(scriptCount);
			}
			else if (key == "codecount")
				scripts[scriptCount].codeCount = atoi(value.c_str());
			else if (key == "datacount")
				scripts[scriptCount].dataCount = atoi(value.c_str());
			else if (key == "timequant")
				scripts[scriptCount].timeQuant = atoi(value.c_str());
		}
		result.remove(0, linePos + 1);
	}
	return true;
}

/*-----------------------------------------------------------------------------
Используется для тестов разработчиками OWLOS
-----------------------------------------------------------------------------*/
void testCompile()
{
	//Put some code for non UI tests
}
#endif
