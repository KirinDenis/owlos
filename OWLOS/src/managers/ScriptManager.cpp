#include <Arduino.h>

#include "DeviceManager.h"
#include "..\..\UnitProperties.h"

#define stopCode 0
#define sumCode 1
#define writeCode 2
#define gotoCode 3
#define ifupperCode 4
#define getpropCode 5
#define setpropCode 6

int timeQuant = 1; // -1 forever
int quantCounter = 0;

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

Instruction code[100];
Variable data[100];

int ip; //instruction pointer
int codeCount = 0;
int dataCount = 0;

int setInstruction(int addr, Instruction instruction) {
	code[addr] = instruction;
	Serial.println(code[0].type);
	return 1;
}

int pushData(String name, String value) {
	data[dataCount].name = name;
	data[dataCount].value = value;
	return dataCount++;
}

int getDataAddr(String name) {	
	for (int i = 0; i < dataCount; i++) {
		if (data[i].name == name) {
			return i;
		}
	}
	return -1;
}

//--------------------------------------------------------------------------------------------------------
//instructions
int addSum(int addr, int arg1Addr, int arg2Addr, int resultAddr) {
	code[addr].type = sumCode;
	code[addr].arg1Addr = arg1Addr;
	code[addr].arg2Addr = arg2Addr;
	code[addr].resultAddr = resultAddr;
	return 1;
}

int runSum(int ip) {
	if (code[ip].type != sumCode) return -1;
	float arg1 = std::atof(data[code[ip].arg1Addr].value.c_str());
	float arg2 = std::atof(data[code[ip].arg2Addr].value.c_str());
	data[code[ip].resultAddr].value = arg1 + arg2;
	return ++ip;
}

int addWrite(int addr, int arg1Addr) {
	code[addr].type = writeCode;
	code[addr].arg1Addr = arg1Addr;
	return 1;
}

int runWrite(int ip) {
	if (code[ip].type != writeCode) return -1;
	Serial.println(data[code[ip].arg1Addr].value);
	return ++ip;
}

int addGoto(int addr, int arg1Addr) {
	code[addr].type = gotoCode;
	code[addr].arg1Addr = arg1Addr;
	return 1;
}

int runGoto(int ip) {
	if (code[ip].type != gotoCode) return -1;
	return code[ip].arg1Addr;
}

int addIfupper(int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	code[addr].type = ifupperCode;
	code[addr].arg1Addr = arg1Addr;
	code[addr].arg2Addr = arg2Addr;
	code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runIfupper(int ip) {
	if (code[ip].type != ifupperCode) return -1;
	float arg1 = std::atof(data[code[ip].arg1Addr].value.c_str());
	float arg2 = std::atof(data[code[ip].arg2Addr].value.c_str());
	if (arg1 > arg2) {
		return code[ip].arg3Addr;
	}
	else {
		return ++ip;
	}	
}

int addGetProp(int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	code[addr].type = getpropCode;
	code[addr].arg1Addr = arg1Addr;
	code[addr].arg2Addr = arg2Addr;
	code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runGetProp(int ip) {
	if (code[ip].type != getpropCode) return -1;
	String deviceProp = devicesGetDeviceProperty(data[code[ip].arg1Addr].value, data[code[ip].arg2Addr].value);
	if (deviceProp.length() == 0) //then try get this property from unit 
	{
		deviceProp = unitOnMessage(unitGetTopic() + "/get" + data[code[ip].arg2Addr].value, "", NoTransportMask);
	}

	if (deviceProp.length() == 0) 
	{
		return -1; //temporary
	}
	data[code[ip].arg3Addr].value = deviceProp;
    return ++ip;
}

int addSetProp(int addr, int arg1Addr, int arg2Addr, int arg3Addr) {
	code[addr].type = setpropCode;
	code[addr].arg1Addr = arg1Addr;
	code[addr].arg2Addr = arg2Addr;
	code[addr].arg3Addr = arg3Addr;
	return 1;
}

int runSetProp(int ip) {
	if (code[ip].type != setpropCode) return -1;
	Serial.println("->" + data[code[ip].arg1Addr].value);
	Serial.println("->" + data[code[ip].arg2Addr].value);
	Serial.println("->" + data[code[ip].arg3Addr].value);
	String result = devicesSetDeviceProperty(data[code[ip].arg1Addr].value, data[code[ip].arg2Addr].value, data[code[ip].arg3Addr].value);
	Serial.println("->" + result);
	if (result.length() == 0) //try set unit property
	{
		result = unitOnMessage(unitGetTopic() + "/set" + data[code[ip].arg2Addr].value, data[code[ip].arg3Addr].value, NoTransportMask);
	}

	if (result.length() == 0)
	{
		return -1; 
	}
	
	return ++ip;
}


//--------------------------------------------------------------------------------------------------------
//Executor and Compiler 
bool executeInstruction() {
	switch (code[ip].type)
	{
	case stopCode: //default
		ip = -1;
		break;
	case sumCode:
		ip = runSum(ip);
		break;
	case writeCode:
		ip = runWrite(ip);
		break;
	case gotoCode:
		ip = runGoto(ip);
		break;
	case ifupperCode:
		ip = runIfupper(ip);
		break;
	case getpropCode:
		ip = runGetProp(ip);
		break;
	case setpropCode:
		ip = runSetProp(ip);
		break;
	default:
		ip = -1;
	}
	if (ip != -1) return true;
	else
		return false;
}

bool scriptRun() {
	quantCounter = 0;
	while (true)
	{
		bool result = executeInstruction();
		if (!result) break;
		quantCounter++;
		if (quantCounter > timeQuant) break;
	}
	return true;
}

bool parser(String program) {
	ip = 0;
	codeCount = 0;
	dataCount = 0;
	String prog = "";

	String lineDelimiter = "\n";
	String argDelimiter = ",";
	int linePos = 0;
	String command;
	while ((linePos = program.indexOf(lineDelimiter)) != -1)
	{
		command = program.substring(0, linePos);

		if (command.indexOf("var ") == 0) //variable
		{
			Serial.println("->" + command);
			String varArg = command.substring(4, command.length());
			String varName = varArg.substring(0, varArg.indexOf('='));
			String varValue = varArg.substring(varArg.indexOf('=') + 1);
			Serial.println("-->var " + varName + " " + varValue);
			pushData(varName, varValue);
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
				addSum(codeCount, getDataAddr(arg1), getDataAddr(arg2), getDataAddr(arg3));
				codeCount++;
			}
			else 
				if (instruction.indexOf("write ") == 0) //write
				{
					Serial.println("->" + instruction);
					Serial.println("-->write" + arg1);
					addWrite(codeCount, getDataAddr(arg1));
					codeCount++;
				}
				else
					if (instruction.indexOf("goto ") == 0) //goto
					{
						Serial.println("->" + instruction);
						Serial.println("-->goto" + arg1);
						addGoto(codeCount, std::atoi(arg1.c_str()));
						codeCount++;
					}
					else
						if (instruction.indexOf("ifupper ") == 0) //ifupper
						{
							Serial.println("->" + instruction);
							Serial.println("-->ifupper" + arg1 + arg2 + arg3);
							addIfupper(codeCount, getDataAddr(arg1), getDataAddr(arg2), std::atoi(arg3.c_str()));
							codeCount++;
						}
						else
							if (instruction.indexOf("getprop ") == 0) //getprop
							{
								Serial.println("->" + instruction);
								Serial.println("-->getprop" + arg1 + arg2 + arg3);
								int arg1Addr = pushData(arg1 + String(codeCount), arg1);
								int arg2Addr = pushData(arg2 + String(codeCount), arg2);
								addGetProp(codeCount, arg1Addr, arg2Addr, getDataAddr(arg3));
								codeCount++;
							}
							else
								if (instruction.indexOf("setprop ") == 0) //setprop
								{
									Serial.println("->" + instruction);
									Serial.println("-->setprop" + arg1 + arg2 + arg3);
									int arg1Addr = pushData(arg1 + String(codeCount), arg1);
									int arg2Addr = pushData(arg2 + String(codeCount), arg2);
									addSetProp(codeCount, arg1Addr, arg2Addr, getDataAddr(arg3));
									codeCount++;
								}

		}

		program.remove(0, linePos + lineDelimiter.length());
	}

}

void scriptCompile()
{
	//String program = "var a=10\nvar b=10\nvar c=10000\nsum a,b,b\nwrite b\nifupper b,c,99\ngoto 0\n";
	//String program = "var a=10\nvar b=10\nvar w=10\nvar c=10000\nsum a,b,b\nwrite b\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n";
	//String program = "var a=10\nvar b=10\nvar w=10\nvar c=10000\ngetprop wifi,wifirssi,w\nwrite w\ngoto 0\n";
	String program = "var t=0\nvar h=0\nvar a=0\nvar v=1\nvar hlimit=40\ngetprop dht,temperature,t\ngetprop dht,humidity,h\nwrite t\nwrite h\nifupper hlimit,h,0\nsetprop rele,data,v\ngoto 0\n";
	
	parser(program);
}