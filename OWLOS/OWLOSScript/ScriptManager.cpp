#include <Arduino.h>

#define stopCode 0
#define sumCode 1
#define writeCode 2
#define gotoCode 3
#define ifupperCode 4

int timeQuant = 100; // -1 forever
int quantCounter = 0;

struct Instruction
{
	int type = stopCode;
	int arg1Addr;
	int arg2Addr;
	int resultAddr;
};

struct Variable
{
	String name;
	float value;
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

int pushData(String name, int value) {
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
	data[code[ip].resultAddr].value = data[code[ip].arg1Addr].value + data[code[ip].arg2Addr].value;
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
			pushData(varName, std::atof(varValue.c_str()));
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
					if (instruction.indexOf("goto ") == 0) //write
					{
						Serial.println("->" + instruction);
						Serial.println("-->goto" + arg1);
						addGoto(codeCount, std::atoi(arg1.c_str()));
						codeCount++;
					}

		}

		program.remove(0, linePos + lineDelimiter.length());
	}

}

void scriptCompile()
{
	String program = "var a=10\nvar b=10\nsum a,b,b\nwrite b\ngoto 0\n";
	parser(program);
}