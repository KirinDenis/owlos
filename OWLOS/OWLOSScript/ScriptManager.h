int addInstruction();
int pushData(int value);
int addSum(int addr, int arg1Addr, int arg2Addr, int resultAddr);
int addWrite(int addr, int arg1Addr);
int addGoto(int addr, int arg1Addr);
bool scriptRun();
void scriptCompile();