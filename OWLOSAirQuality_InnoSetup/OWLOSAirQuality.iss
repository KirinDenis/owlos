
[Setup]
AppName=OWLOS Air Quality
LicenseFile="..\LICENSE"
AppVersion=1.1
WizardStyle=modern
DefaultDirName={autopf}\OWLOS Air Quality
DefaultGroupName=OWLOS Air Quality
UninstallDisplayIcon={app}..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.exe
Compression=lzma2
SolidCompression=yes
OutputBaseFilename=OWLOSAirQualityUX
OutputDir="..\"

[CustomMessages]
AppName=OWLOS Air Quality
LaunchProgram=Start OWLOS Air Quality after finishing installation

[Files]
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.exe"; DestDir: "{app}"; CopyMode: alwaysoverwrite;  Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\Newtonsoft.Json.dll"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.deps.json"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.dll"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.exe"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.pdb"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.runtimeconfig.dev.json"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.runtimeconfig.json"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSDTOs.dll"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;
Source: "..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSDTOs.pdb"; DestDir: "{app}"; CopyMode: alwaysoverwrite;   Flags: ignoreversion;

[Icons]
Name: "{group}\OWLOS Air Quality"; Filename: "{app}\OWLOSAirQuality.exe"

[Run]
Filename: "{app}\OWLOSAirQuality.exe"; Description: {cm:LaunchProgram,{cm:AppName}}; Flags: nowait postinstall skipifsilent