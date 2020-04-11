/* ----------------------------------------------------------------------------
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
--------------------------------------------------------------------------------------*/

/*
PinManager - реализует программный интерфейс между функциями доступа к физическим контактным разъемам (Pins) предоставляемыми "Arduino" библиотеками и драйверами OWLOS.
Задачи PinManager:
- управление назначением, режимами работы и доступом к Pin со стороны драйверов.
- предоставление данных о количестве доступных Pin на микроконтроллере на котором запущена OWLOS, а так же данных о типах и режимах работы Pin.

//---------------------------------------------------------------------------------------------------------------------------------------
//ВНИМАНИЕ!
//Важно:
//МЫ НЕ ПРОПАГАНДИРУЕМ ГОРЯЧУЮ ЗАМЕНУ УСТРОЙСТВ НА МИКРОКОНТРОЛЛЕРЕ! МЫ ПРОТИВ ЭТОГО!
//ЕСЛИ ВЫ ОШИБЛИС С ИМЕНЕМ ПИНА - выключите ваш микроконтроллер, отключите устройство, включите заново, укажите правильный пин, выключите
//микроконтроллер - подключите устройство. В противном случае вы рискуете "сжечь" пин или микроконтроллер целиком. Особенно это важно для
//пинов работающих в режиме OUTPUT.
//---------------------------------------------------------------------------------------------------------------------------------------

Указатель Pin * pins содержит ссылку на динамический массив с данными о пинах. Так как на разных типах микроконтроллеров разное количество пинов, 
массив с данными создается динамически, при вызове DriverManager.Init() - до загрузки драйверов. 
Данные пина:
	String name = ""             - название пина, обычно используется то что напечатано на плате микроконтроллера
	int mode = -1;               - режим работы пина Output, Input, Input-Pull Up
	uint16_t pinTypes = NO_MASK; - маски типа пина - определяют назначение (возможности) конкретного пина 
	                             - например DIGITAL_IO OR SDA - пин может быть использован для цифрового ввода-вывода, а также как канел SDA шины I2C
	uint16_t extendPinTypes = NO_MASK; - расширенные маски пина - pinTypes всего 16bit (16 типов) на практики типов горазда больше, маску пришлось расширить. 
	int8_t GPIONumber = -1;   - программный номер пина, для использования с "Arduino".digital/analog-read/write функцией
	int8_t chipNumber = -1;   - номер пина на физическом чипе ESPxxxx
	int8_t neighbourPin = -1; - пин-сосед используется для шин, таких как I2C или SPI - так как некоторые контроллеры поддерживают несколько шин, например две шины I2C - 
	                          - то SDA/SCL пины ссылаются на парные(соседские) им пины. 
	String location = "";     - физическое положение пина на конкретном типе платы микроконтроллера, например r10 - десятый пин справа, l4 - четвертый пин слева, используется для прорисовки в UI. 

Данные драйвера о пине"
	String name = "";       - название пина. 
	int GPIONumber = -1;    - программный номер пина
	String driverId;        -  id подключенного драйвера
	uint16_t driverPinType; -  хранит тип пина драйвера, у самого пина может быть множество типов (назначений) - драйвер выбирает один. 
	int8_t driverPinIndex;  -  индекс пина подключенного к нему драйвера, например ActuatorDriver.PIN_INDEX0 - первый пин драйвера актуатора
	int driverI2CAddr;      -  адрес I2C для подчинённого устройства (если это I2C шина)
	String SDAPinName;      - I2C SDA пин, если текущий пин это I2C адрес - тут указывается пин SDA канала к которому применим этот адрес

Примечания:
- Один пин может быть использован множеством драйверов, так например пины VCC33 или GND - по этой причине, данные о пинах хранятся в отдельной структуре. (это ускоряет вычисления)
- Адреса устройств на шинах (интерфейсах) таких как I2C программно рассматриваются как разновидность пинов. Так например I2C адрес принадлежит пину с GPIONumber=-1 и на одном таком пине 
  может быть множество I2C адресов, с условием что они уникальны и соответствуют размерности I2C адреса. 
*/

#include <core_version.h>
#include "PinManager.h"

#ifdef ARDUINO_ESP32_RELEASE_1_0_4
//Сторонняя библиотека реализующая analogWrite() функцию для ESP32
#include "../libraries/ESP32_AnalogWrite/src/analogWrite.h"
#endif

//Количество доступных пинов
int pinCount = 0;
//Количество пинов занятых драйверами
int driverPinCount = 0;
//Указатель на динамический массив с данными о пинах. Функция void initPins() - инициализирует этот массив один раз, при старте OWLOS - считается что пины не могут изменится в микроконтроллере "на лету"
Pin * pins = nullptr;
//Указатель на динамический массив с данными о драйверах использующих пины
DriverPin * driverPins = nullptr;

//Декодирование масок типов пина в строку. Очень полезно для UI, человеку неудобно работать с битовыми масками. 
String decodePinTypes(uint16_t pinType) {

	String decodedPinTypes;

	if (pinType & DIGITAL_I_MASK) { decodedPinTypes += "DIGITAL_I,"; }

	if (pinType & DIGITAL_O_MASK) { decodedPinTypes += " DIGITAL_O,"; }

	if (pinType & ANALOG_I_MASK) { decodedPinTypes += " ANALOG_I,"; }

	if (pinType & ANALOG_O_MASK) { decodedPinTypes += " ANALOG_O,"; }

	if (pinType & SDA_MASK) { decodedPinTypes += " SDA,"; }

	if (pinType & SCL_MASK) { decodedPinTypes += " SCL,"; }

	if (pinType & I2CADDR_MASK) { decodedPinTypes += " I2C_ADDR,"; }

	if (pinType & VCC5_MASK) { decodedPinTypes += " VCC5,"; }

	if (pinType & VCC33_MASK) { decodedPinTypes += " VCC33,"; }

	if (pinType & GND_MASK) { decodedPinTypes += " GND,"; }

	if (!(pinType | NO_MASK)) { decodedPinTypes += " UNKNOWN_PIN_TYPE,"; }

	if (decodedPinTypes.length() > 0) {

		decodedPinTypes = decodedPinTypes.substring(0, decodedPinTypes.length() - 1);
	}
	else {
		decodedPinTypes += "UNKNOWN_PIN_TYPE";
	}
	return decodedPinTypes;
}

//Возвращает данные о количестве и состояние всех пинов и драйверов в текстовом виде. Используется RESTful API и для отладки. 
String getPinMap()
{
	String result = "";
	DriverPin * _driverPins = nullptr; //сюда будут помещены драйвера занимающие конкретный пин
	int _count = 0;

	//перебор всех пинов
	for (int i = 0; i < pinCount; i++)
	{
		result += "name:" + pins[i].name + "\n";
		result += "mode=" + String(pins[i].mode) + "\n";
		result += "pintypes=" + String(pins[i].pinTypes) + "\n";
		result += "decodedpintypes=" + decodePinTypes(pins[i].pinTypes) + "\n";
		result += "gpio=" + String(pins[i].GPIONumber) + "\n";
		result += "chipnumber=" + String(pins[i].chipNumber) + "\n";
		result += "neighbourpin=" + String(pins[i].neighbourPin) + "\n";
		result += "location=" + pins[i].location + "\n";
		//получить все драйвера занявшие пин pins[i].GPIONumber
		_count = getDriverPinsByGPIONumber(pins[i].GPIONumber, &_driverPins);
		//если есть драйвера занявшие пин - добавить данные о них в результат функции
		if (_count > 0)
		{
			for (int j = 0; j < _count; j++)
			{
				result += "driverid:" + _driverPins[j].driverId + "\n";
				result += "driverpintype=" + String(_driverPins[j].driverPinType) + "\n";
				result += "driverpintypedecoded=" + decodePinTypes(_driverPins[j].driverPinType) + "\n";
				result += "driverpinindex=" + String(_driverPins[j].driverPinIndex) + "\n";
				result += "drivei2caddr=" + String(_driverPins[j].driverI2CAddr) + "\n";
			}
			//удаляем полученные данные о драйверах 
			delete[] _driverPins;
		}
	}
	return result;
}

//функция возвращает TRUE если тип пина pinType может быть использован с пином с масками pinTypes
bool pinTypeSupported(uint16_t pinTypes, uint16_t pinType)
{
	return (pinTypes & pinType);
}

//функция возвращает ссылку на структуру с данными пина с именем pinName если пин с таким именем существует, иначе nullptr
Pin * getPinByName(String pinName)
{
	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].name.equals(pinName))
		{
			return &pins[i];
		}
	}
	return nullptr;
}

//функция возвращает ссылку на структуру с данными пина с номером GPIONumber если пин с таким именем существует, иначе nullptr
Pin * getPinByGPIONumber(int GPIONumber)
{
	for (int i = 0; i < pinCount; i++)
	{
		if (pins[i].GPIONumber == GPIONumber)
		{
			return &pins[i];
		}
	}
	return nullptr;

}

//функция возвращает ссылку на структуру с данными пина занятого драйвером с идентификатором driverId и внутренним номером пина driverPinIndex, иначе nullptr
//ВНИМАНИЕ - ссылку на структуру Pin, а не на структуру DriverPin! Данные пина, а не драйвера. 
Pin * getPinByDriverId(String  driverId, int driverPinIndex)
{
	DriverPin * _driverPin = getDriverPinByDriverId(driverId, driverPinIndex);
	if (_driverPin == nullptr) return nullptr;
	return getPinByGPIONumber(_driverPin->GPIONumber);
}

//функция проверяет может ли драйвер с типом пина pinType, занять пин с именем pinName
//аргумент SDAPinName используется для I2C адресов, во всех остальных случаях - пустая строка. 
//
//Если драйверу можно занять пин, функция вернет пустую строку, если нет - сообщение о том почему 
//пин не может быть занят. 
//
//Эта функция используется при создании драйвера, а так же в том случае если драйвер "хочет" поменять пин динамически, 
//без перезагрузки микроконтроллера. Последнее, чаще всего происходит в том случае когда пользователь собрал схему, "прописал" драйвера, 
//и позже заметил что ошибся с указанием имени пина в драйвере. 
//---------------------------------------------------------------------------------------------------------------------------------------
//ВНИМАНИЕ!
//Важно:
//МЫ НЕ ПРОПАГАНДИРУЕМ ГОРЯЧУЮ ЗАМЕНУ УСТРОЙСТВ НА МИКРОКОНТРОЛЛЕРЕ! МЫ ПРОТИВ ЭТОГО!
//ЕСЛИ ВЫ ОШИБЛИС С ИМЕНЕМ ПИНА - выключите ваш микроконтроллер, отключите устройство, включите заново, укажите правильный пин, выключите 
//микроконтроллер - подключите устройство. В противном случае вы рискуете "сжечь" пин или микроконтроллер целиком. Особенно это важно для 
//пинов работающих в режиме OUTPUT.
//---------------------------------------------------------------------------------------------------------------------------------------
//
//Примечания:
//Основная задача этой функции оценить занят ли пин другим драйвером и если да - может ли текущий драйвер работать параллельно с 
//существующим. При этом функция должна оценить подходит ли тип пина драйвера pinType для использования с указанным пином. 
String _checkDriverPin(String pinName, uint16_t pinType, String SDAPinName)
{
	
	DriverPin * _driverPins = nullptr; //указатель на драйвера занявшие пин, будет использован ниже. 
	int _count = 0; //количество драйверов занявших пин
	
	Pin * pin = getPinByName(pinName); //узнаем существует ли физически пин с таким именем 
	if (pin == nullptr) //если пин не существует
	{		
		//check it is I2C address pinName = ADDR0xNN
		//возможно это I2C адрес подчинённого устройства, в данной реализации для драйвера адрес программно представлен пином с маской типа I2CADDR_MASK
		if (pinType & I2CADDR_MASK) //если физического пина нет, а требуемый пин должен содержать маску I2CADDR_MASK то это I2C адрес
		{			
			if (!SDAPinName.length()) //если не указан пин SDA канала для этого I2C адреса
			{				
				return "I2C address can't be select before SDA pin\n"; //возвращаем ошибку
			}
			//пробуем выпарсить численное значение адреса из строки I2C адреса (формат ADDR0xNN - где NN шестнадцатеричное значение адреса)
			//при этом учитываем размерность значения адреса I2C, в данной реализации не более 7 бит. При этом неприемлем адрес 0х00. 
			int _addr = parseI2CAddr(pinName);		
			if (_addr <= 0)//если не удалось получить значение адреса или это значение не приемлемо для 7 бит I2C адреса. 
			{				
				return "bad I2C address " + pinName + "\n"; //возвращаем ошибку
			}
			//Узнаем существуют ли еще I2C адреса используемые другими драйверами			
			_count = getDriverPinsByPinType(pinType, &_driverPins);
			
			if (_count > 0) //да, уже есть I2C адреса 
			{
				//перебираем все существующие адреса, на одной I2C шине они не должны повторятся
				for (int i = 0; i < _count; i++)
				{
					if ((_driverPins[i].driverI2CAddr == _addr) && (_driverPins[i].SDAPinName.equals(SDAPinName)))
					{
						//если адрес уже занят другим драйвером для указанного SDA канала
						//подготавливаем сообщение об ошибке
						String result = "I2C address " + pinName + " is busy of " + _driverPins->driverId + " driver on " + SDAPinName + " SDA channel\n";
						//удаляем массив драйверов
						delete[] _driverPins;
						//выходим, возвращаем ошибку
						return result;
					}
				}
				//удаляем массив драйверов
				delete[] _driverPins;
			}
			//I2C адрес соответствует требованию 7 бит I2C адреса и не занят для шины с указанным SDA каналом. 
			//возвращаем пустую строку (ОК), выходим
			return "";
		}
		else //пин не существует и не является I2C адресом - возвращаем ошибку, выходим. 
		{
			return "pin " + pinName + " doesn't exists\n";
		}
	}
	else //Пин с именем pinName существует 
	{
		//проверяем сколько драйверов уже заняли этот пин и что это за драйвера
		_count = getDriverPinsByGPIONumber(pin->GPIONumber, &_driverPins);

		if (_count > 0) //если пин кем то занят
		{
			//Если пин занят и текущий пин драйвера это не I2C пин и не питание 
			if (((pinType & SDA_MASK) || (pinType & SCL_MASK) || (pinType & VCC5_MASK) || (pinType & VCC33_MASK) || (pinType & GND_MASK)) == 0)
			{
				//формируем сообщение об ошибке
				String result = "pin " + pinName + " busy by " + _driverPins[0].driverId + " as pin index " + String(_driverPins[0].driverPinIndex) + "\n";
				//удаляем массив
				delete[] _driverPins;
				//возвращаем ошибку
				return result;
			}
			//удаляем массив 
			delete[] _driverPins;
//TODO: Сделать проверку если пин I2C но физический пин занят как цифровой пин другим драйвером
		}
		//проверяем - соответствует ли выбранный тип пина - поддерживаемым выбранным пином
		if (!pinTypeSupported(pin->pinTypes, pinType))
		{
			return "pin " + pinName + " not compatable with type " + decodePinTypes(pinType) + "\n"; //если нет - возвращаем ошибку
		}
		Serial.println("check 8");
	}
	//драйвер может использовать этот пин, возвращаем пустую строчку
	return "";
}

String checkDriverPin(String pinName, uint16_t pinType)
{
	return _checkDriverPin(pinName, pinType, "");
}

String _setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType, String SDAPinName)
{
	Serial.println("set driver pin 1");
	DriverPin * _driverPin = getDriverPinByDriverId(driverId, driverPinIndex);
	if (_driverPin != nullptr)
	{		
		pinType = _driverPin->driverPinType;
		SDAPinName = _driverPin->SDAPinName;
		Serial.println("set re type " + String(pinType));
	}
	String result = _checkDriverPin(pinName, pinType, SDAPinName);
	Serial.println("set driver pin 2");
	if (result.length() != 0)
	{
		return result;
	}
	Serial.println("set driver pin 3");
	Pin * pin = getPinByName(pinName);
	Serial.println("set driver pin 4");
	
	Serial.println("set driver pin 5");

	if (_driverPin != nullptr)
	{
		Serial.println("set driver pin 6");
		if (pin != nullptr) //driver pin exists and new pin exists //D, A, VCCx or GND
		{
			Serial.println("set driver pin 61");
			//set drive to other pin
			_driverPin->name = pinName;
			_driverPin->GPIONumber = pin->GPIONumber;
			return "";
		}
		else //I2C change address 
		{
			Serial.println("set driver pin 62");
			Serial.println(String(pinType));
			if ((pinType & I2CADDR_MASK) == NO_MASK)
			{
				Serial.println("set driver pin 63");
				return "the pin not exists and pin type not address\n";
			}
			Serial.println("set driver pin 64");
			//change I2C address or channel 
			_driverPin->name = pinName;
			_driverPin->driverI2CAddr = parseI2CAddr(pinName);
			_driverPin->SDAPinName = SDAPinName;
			Serial.println("set driver pin 65");
			return "";
		}
	}
	else //new driver pin 
	{
		Serial.println("set driver pin 7");
		if (pin != nullptr) //driver pin not exists create new 
		{
			Serial.println("set driver pin 71");
			DriverPin driverPin;
			driverPin.name = pin->name;
			driverPin.GPIONumber = pin->GPIONumber;
			driverPin.driverId = driverId;
			driverPin.driverPinType = pinType;
			driverPin.driverPinIndex = driverPinIndex;
			addDriverPin(driverPin);
			return "";
		}
		else //new I2C address 
		{
			if ((pinType & I2CADDR_MASK) == NO_MASK)
			{
				return "the pin not exists and pin type not address\n";
			}
			Serial.println("set driver pin 72");
			DriverPin driverPin;
			driverPin.name = pinName;
			driverPin.GPIONumber = -1;
			driverPin.driverId = driverId;
			driverPin.driverPinType = pinType;
			driverPin.driverPinIndex = driverPinIndex;
			Serial.println("set driver pin 73");
			driverPin.driverI2CAddr = parseI2CAddr(pinName);
			driverPin.SDAPinName = SDAPinName;
			addDriverPin(driverPin);
			return "";
		}
	}
	Serial.println("set driver pin 8");
	return "bad pinName, type or driverId\n";


}

String setDriverPin(String pinName, String driverId, uint16_t driverPinIndex, uint16_t pinType)
{
	return _setDriverPin(pinName, driverId, driverPinIndex, pinType, "");
}


//https://github.com/arduino/Arduino/issues/4606
int getPinMode(uint32_t pin)
{

	if ((pin >= NUM_DIGITAL_PINS) || (pin < 0)) return (-1);

	uint32_t bit = digitalPinToBitMask(pin);
	uint32_t port = digitalPinToPort(pin);
	volatile uint32_t *reg = portModeRegister(port);
	if (*reg & bit) return (OUTPUT);

	volatile uint32_t *out = portOutputRegister(port);
	return ((*out & bit) ? INPUT_PULLUP : INPUT);
}

String setDriverPinMode(String driverId, int driverPinIndex, int mode)
{
	Pin * pin = getPinByDriverId(driverId, driverPinIndex);
	if (pin == nullptr)
	{
		return "driverId " + driverId + " or pin index " + String(driverPinIndex) + " doesn't exists";
	}

	pinMode(pin->GPIONumber, mode);
	pin->mode = getPinMode(pin->GPIONumber);
	if (pin->mode == mode)
	{
		return "";
	}

	return "can't switch pin mode for:" + driverId + " pin:" + String(driverPinIndex) + " to mode=:" + String(mode);
}

String driverPinWrite(String driverId, int driverPinIndex, int data)
{

	DriverPin * _driverPin = getDriverPinByDriverId(driverId, driverPinIndex);
	if (_driverPin != nullptr)

	{
		int mode = getPinMode(_driverPin->GPIONumber);
		if (mode == OUTPUT)
		{
			if (_driverPin->GPIONumber & ANALOG_O_MASK)
			{
#ifdef ARDUINO_ESP32_RELEASE_1_0_4
				analogWrite(_driverPin->GPIONumber, 1024); //TODO Define here 1024
#else	
				analogWrite(_driverPin->GPIONumber, data);
#endif
			}
			else
			{
				if (data == 0)
				{
					digitalWrite(_driverPin->GPIONumber, LOW);
				}
				else
				{
					digitalWrite(_driverPin->GPIONumber, HIGH);
				}
			}
			return "";
	}

		return "can't write pin mode for:" + driverId + " pin:" + String(_driverPin->driverPinIndex) + " to data=:" + String(data);
}
	return "driverId " + driverId + " or pin index " + String(driverPinIndex) + " doesn't exists";
}


//Digital or A nalog read - write 
int driverPinRead(String driverId, int driverPinIndex)
{

	DriverPin * driverPin = getDriverPinByDriverId(driverId, driverPinIndex);
	if (driverPin != nullptr)
	{
		if (getPinMode(driverPin->GPIONumber) == INPUT)
		{
			if (driverPin->driverPinType & ANALOG_I_MASK)
			{
				return analogRead(driverPin->GPIONumber);
			}
			else
			{
				return digitalRead(driverPin->GPIONumber);
			}
		}
	}
	return -1;
}

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0
int pinNameToValue(String pinName)
{
	if (pinName.equals("D0")) return D0;
	if (pinName.equals("D1")) return D1;
	if (pinName.equals("D2")) return D2;
	if (pinName.equals("D3")) return D3;
	if (pinName.equals("D4")) return D4;
	if (pinName.equals("D5")) return D5;
	if (pinName.equals("D6")) return D6;
	if (pinName.equals("D7")) return D7;
	if (pinName.equals("D8")) return D8;
#ifdef ARDUINO_ESP8266_NODEMCU
	if (pinName.equals("D9")) return D9;
	if (pinName.equals("D10")) return D10;
#endif
	if (pinName.equals("A0")) return A0;
	return -1;
}
#endif

int addPin(Pin pin)
{
	pinCount++;

	Pin * newPinsPtr = new Pin[pinCount];
	Pin * tempPinsPtr = pins;
	pins = newPinsPtr;

	for (int i = 0; i < pinCount - 1; i++)
	{
		pins[i] = tempPinsPtr[i];
	}

	pins[pinCount - 1] = pin;
	pins[pinCount - 1].mode = getPinMode(pins[pinCount - 1].GPIONumber);

	if (tempPinsPtr != nullptr)
	{
		delete[] tempPinsPtr;
	}

	return pinCount;
}

//Drivers pins ---------------------------------------------------------------------
int addDriverPin(DriverPin driverPin)
{
	driverPinCount++;

	DriverPin * newDriverPins = new DriverPin[driverPinCount];
	DriverPin * tempDriverPins = driverPins;
	driverPins = newDriverPins;

	for (int j = 0; j < driverPinCount - 1; j++)
	{
		driverPins[j] = tempDriverPins[j];
	}

	driverPins[driverPinCount - 1] = driverPin;

	if (tempDriverPins != nullptr)
	{
		delete[] tempDriverPins;
	}
	return driverPinCount;
}

void deleteDriverPin(String driverId, int driverPinIndex)
{
	//TODO: pinMode(pinDriverInfo.GPIONumber, INPUT);
	DriverPin * _driverPin = getDriverPinByDriverId(driverId, driverPinIndex);

	if (_driverPin == nullptr) return;

	driverPinCount--;

	DriverPin * newDriverPins = new DriverPin[driverPinCount];
	DriverPin * tempDriverPins = driverPins;
	driverPins = newDriverPins;

	int count = 0;
	for (int j = 0; j < driverPinCount; j++)
	{
		if (&tempDriverPins[j] != _driverPin)
		{
			driverPins[count] = tempDriverPins[j];
			count++;
		}
	}


	if (tempDriverPins != nullptr)
	{
		delete[] tempDriverPins;
	}

	return;
}


//дать количество пинов задействованных под драйвер 
int getDriverPinsCount(String driverId)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].driverId.equals(driverId))
		{
			_count++;
		}
	}
	return _count;
}

DriverPin * getDriverPinByDriverId(String driverId, int driverPinIndex)
{
	Serial.println("getDriverPinByDriverId");
	Serial.println(driverId);
	Serial.println(String(driverPinIndex));
	for (int i = 0; i < driverPinCount; i++)
	{
		Serial.println("-----------------");
		Serial.println(driverPins[i].driverId);
		Serial.println(driverPins[i].driverPinIndex);

		if ((driverPins[i].driverId.equals(driverId)) && (driverPins[i].driverPinIndex == driverPinIndex))
		{
			return &driverPins[i];
		}
	}

	return nullptr;
}

bool copyDriverPins(DriverPin dest, DriverPin source)
{

	dest.name = source.name;
	dest.GPIONumber = source.GPIONumber;
	dest.driverId = source.driverId;
	dest.driverPinType = source.driverPinType;
	dest.driverPinIndex = source.driverPinIndex;
	dest.driverI2CAddr = source.driverI2CAddr;
	dest.SDAPinName = source.SDAPinName;

	return true;
}


//все драйвера у которых есть пины указанного типа
int getDriverPinsByPinType(int pinType, DriverPin ** _driverPins)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].driverPinType & pinType)
		{
			_count++;
		}
	}
	if (_count > 0)
	{

		DriverPin * __driverPins = new DriverPin[_count];
		_count = 0;
		for (int i = 0; i < driverPinCount; i++)
		{
			if (driverPins[i].driverPinType & pinType)
			{
				__driverPins[_count] = driverPins[i];
				_count++;
			}
		}
		*_driverPins = __driverPins;
	}
	return _count;
}

/*
 Serial.println("g1");

   Pin * __pin = new Pin[pinCount];
  //* _pin = new Pin[pinCount];
	Serial.println("g2");
	for (int i = 0; i < pinCount; i++)
	{
	  Serial.println("g3");
		 __pin[i] = pinsPtr[i];
	}
	* _pin = __pin;
	Serial.println("g4");
}

*/

//все драйвера которые используют этот пин
int getDriverPinsByGPIONumber(int GPIONumber, DriverPin  **_driverPins)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].GPIONumber == GPIONumber)
		{
			_count++;
		}
	}
	if (_count > 0)
	{

		DriverPin * __driverPins = new DriverPin[_count];
		_count = 0;
		for (int i = 0; i < driverPinCount; i++)
		{
			if (driverPins[i].GPIONumber == GPIONumber)
			{
				__driverPins[_count] = driverPins[i];
				_count++;
			}
		}
		*_driverPins = __driverPins;
	}
	return _count;
}

int getDriverPinsByDriverId(String driverId, DriverPin ** _driverPins)
{
	int _count = 0;
	for (int i = 0; i < driverPinCount; i++)
	{
		if (driverPins[i].driverId == driverId)
		{
			_count++;
		}
	}
	if (_count > 0)
	{

		DriverPin * __driverPins = new DriverPin[_count];
		_count = 0;
		for (int i = 0; i < driverPinCount; i++)
		{
			if (driverPins[i].driverId == driverId)
			{
				__driverPins[_count] = driverPins[i];
				_count++;
			}
		}
		*_driverPins = __driverPins;
	}
	return _count;
}



int parseI2CAddr(String addrStr)
{
	if (addrStr.indexOf("ADDR0x") < 0)
	{
		return -1;
	}

	addrStr = addrStr.substring(String("ADDR").length());
	int _addr = (int)strtol(&addrStr[0], NULL, 16);
	if ((_addr <= 0x00) || (_addr > 0xF0)) //I2C 7-bit addresses supported and can't be zero
	{
		return -1;
	}
	return _addr;
}


void initPins()
{
	Pin pin;

#ifdef ARDUINO_ESP8266_RELEASE_2_5_0

	pin.name = "D0";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 4;
	pin.location = "l1";
	addPin(pin);

	pin.name = "D1";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK | SCL_MASK;
	pin.chipNumber = 20;
	pin.location = "l2";
	addPin(pin);

	pin.name = "D2";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK | SDA_MASK;
	pin.chipNumber = 19;
	pin.location = "l3";
	addPin(pin);

	pin.name = "D3";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 18;
	pin.location = "l4";
	addPin(pin);

	pin.name = "D4";
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.chipNumber = 17;
	pin.location = "l5";
	addPin(pin);

	pin.name = "VCC33";
	pin.pinTypes = VCC33_MASK;
	pin.GPIONumber = -1;
	pin.location = "l6";
	addPin(pin);

	pin.name = "GND";
	pin.pinTypes = GND;
	pin.GPIONumber = -1;
	pin.location = "l7";
	addPin(pin);

	pin.name = "D5";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 5;
	pin.location = "l8";
	addPin(pin);

	pin.name = "D6";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 6;
	pin.location = "l9";
	addPin(pin);

	pin.name = "D7";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 7;
	pin.location = "l10";
	addPin(pin);

	pin.name = "D8";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.chipNumber = 16;
	pin.location = "l11";
	addPin(pin);

	pin.name = "RX";
	pin.GPIONumber = -1;
	pin.pinTypes = NO_MASK;
	pin.extendPinType = RXD_EXTEND_MASK;
	pin.chipNumber = 21;
	pin.location = "l12";
	addPin(pin);

	pin.name = "TX";
	pin.GPIONumber = -1;
	pin.pinTypes = NO_MASK;
	pin.extendPinType = TXD_EXTEND_MASK;
	pin.chipNumber = 22;
	pin.location = "l13";
	addPin(pin);

	pin.name = "GND";
	pin.pinTypes = GND;
	pin.GPIONumber = -1;
	pin.location = "l14";
	addPin(pin);

	pin.name = "VCC33";
	pin.pinTypes = VCC33_MASK;
	pin.GPIONumber = -1;
	pin.location = "l15";
	addPin(pin);

	pin.name = "A0";
	pin.GPIONumber = pinNameToValue(pin.name);
	pin.pinTypes = ANALOG_I_MASK;
	pin.extendedPinTypes = TOUCH_EXTEND_MASK;
	pin.chipNumber = 2;
	pin.location = "r1";
	addPin(pin);

#endif


#ifdef ARDUINO_ESP32_RELEASE_1_0_4


	pin.GPIONumber = -1;
	pin.pinTypes = GND_MASK;	
	pin.name = "GND";
	pin.chipNumber = -1;
	pin.location = "r1";
	addPin(pin);

	pin.GPIONumber = 23;	
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = SPI_MOSI_EXTEND_MASK;
	pin.name = "IO23";
	pin.chipNumber = 36;
	pin.location = "r2";
	addPin(pin);

	pin.GPIONumber = 22;
	pin.pinTypes = DIGITAL_IO_MASK | SCL_MASK;
	pin.extendPinTypes = RST_EXTEND_MASK;
	pin.neighbourPin = 4;
	pin.name = "IO22";
	pin.chipNumber = 39;
	pin.location = "r3";
	addPin(pin);

	pin.GPIONumber = 1;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = TXD_EXTEND_MASK;
	pin.neighbourPin = 2;
	pin.name = "TXD0";
	pin.chipNumber = 41;
	pin.location = "r4";
	addPin(pin);

	pin.GPIONumber = 3;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = RXD_EXTEND_MASK;
	pin.neighbourPin = 2;
	pin.name = "RXD0";
	pin.chipNumber = 40;
	pin.location = "r5";
	addPin(pin);

	pin.GPIONumber = 21;
	pin.pinTypes = DIGITAL_IO_MASK | SDA_MASK;
	pin.neighbourPin = 1;
	pin.name = "IO21";
	pin.chipNumber = 42;
	pin.location = "r6";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes =GND_MASK;
	pin.name = "GND";
	pin.location = "r7";
	addPin(pin);

	pin.GPIONumber = 19;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = SPI_MISO_EXTEND_MASK;
	pin.name = "IO19";
	pin.chipNumber = 38;
	pin.location = "r8";
	addPin(pin);

	pin.GPIONumber = 18;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = SPI_SCK_EXTEND_MASK;
	pin.name = "IO18";
	pin.chipNumber = 35;
	pin.location = "r9";
	addPin(pin);

	pin.GPIONumber = 5;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = SPI_SS_EXTEND_MASK;
	pin.name = "IO5";
	pin.chipNumber = 34;
	pin.location = "r10";
	addPin(pin);

	pin.GPIONumber = 17;
	pin.pinTypes = DIGITAL_IO_MASK;
	pin.extendPinTypes = TXD_EXTEND_MASK;
	pin.name = "IO17";
	pin.chipNumber = 27;
	pin.location = "r11";
	addPin(pin);

	pin.GPIONumber = 4;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO4";
	pin.chipNumber = 24;
	pin.location = "r12";
	addPin(pin);

	pin.GPIONumber = 0;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO0";
	pin.chipNumber = 23;
	pin.location = "r13";
	addPin(pin);

	pin.GPIONumber = 2;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO2";
	pin.chipNumber = 22;
	pin.location = "r14";
	addPin(pin);

	pin.GPIONumber = 15;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO15";
	pin.chipNumber = 21;
	pin.location = "r15";
	addPin(pin);

	pin.GPIONumber = 8;
	pin.pinTypes = NO_MASK;
	pin.name = "SD1";
	pin.chipNumber = 33;
	pin.location = "r16";
	addPin(pin);

	pin.GPIONumber = 7;
	pin.pinTypes = NO_MASK;
	pin.name = "SD0";
	pin.chipNumber = 32;
	pin.location = "r17";
	addPin(pin);

	pin.GPIONumber = 6;
	pin.pinTypes = NO_MASK;
	pin.name = "CLK";
	pin.chipNumber = 31;
	pin.location = "r18";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes = VCC33_MASK;
	pin.name = "VCC33";
	pin.chipNumber = -1;
	pin.location = "l0";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes = RESET_MASK;
	pin.name = "RESET";
	pin.chipNumber = 9;
	pin.location = "l1";
	addPin(pin);

	pin.GPIONumber = 36;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_I_MASK;
	pin.name = "SVP";
	pin.chipNumber = 5;
	pin.location = "l2";
	addPin(pin);

	pin.GPIONumber = 39;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_I_MASK;
	pin.name = "SVN";
	pin.chipNumber = 8;
	pin.location = "l3";
	addPin(pin);

	pin.GPIONumber = 34;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_I_MASK;
	pin.name = "IO34";
	pin.chipNumber = 10;
	pin.location = "l4";
	addPin(pin);

	pin.GPIONumber = 35;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_I_MASK;
	pin.name = "IO35";
	pin.chipNumber = 11;
	pin.location = "l5";
	addPin(pin);

	pin.GPIONumber = 32;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO32";
	pin.chipNumber = 12;
	pin.location = "l6";
	addPin(pin);

	pin.GPIONumber = 33;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO33";
	pin.chipNumber = 13;
	pin.location = "l7";
	addPin(pin);

	pin.GPIONumber = 25;
	pin.pinTypes = ANALOG_IO_MASK | DIGITAL_IO_MASK;	
	pin.name = "IO25";
	pin.chipNumber = 14;
	pin.location = "l8";
	addPin(pin);

	pin.GPIONumber = 26;
	pin.pinTypes = ANALOG_IO_MASK | DIGITAL_IO_MASK;
	pin.name = "IO26";
	pin.chipNumber = 15;
	pin.location = "l9";
	addPin(pin);

	pin.GPIONumber = 27;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO27";
	pin.chipNumber = 16;
	pin.location = "l10";
	addPin(pin);

	pin.GPIONumber = 14;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO14";
	pin.chipNumber = 17;
	pin.location = "l11";
	addPin(pin);

	pin.GPIONumber = 18;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO18";
	pin.chipNumber = 18;
	pin.location = "l12";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes = GND_MASK;	
	pin.name = "GND";
	pin.chipNumber = -1;
	pin.location = "l13";
	addPin(pin);

	pin.GPIONumber = 13;
	pin.pinTypes = ANALOG_I_MASK | DIGITAL_IO_MASK;
	pin.extendPinTypes = TOUCH_EXTEND_MASK;
	pin.name = "IO13";
	pin.chipNumber = 20;
	pin.location = "l14";
	addPin(pin);

	pin.GPIONumber = 9;
	pin.pinTypes = NO_MASK;	
	pin.name = "SD2";
	pin.chipNumber = 28;
	pin.location = "l15";
	addPin(pin);

	pin.GPIONumber = 10;
	pin.pinTypes = NO_MASK;
	pin.name = "SD3";
	pin.chipNumber = 29;
	pin.location = "l16";
	addPin(pin);

	pin.GPIONumber = 11;
	pin.pinTypes = NO_MASK;
	pin.name = "CMD";
	pin.chipNumber = 30;
	pin.location = "l17";
	addPin(pin);

	pin.GPIONumber = -1;
	pin.pinTypes = VCC5_MASK;
	pin.name = "VCC5";
	pin.chipNumber = -1;
	pin.location = "l18";
	addPin(pin);

#endif






}


