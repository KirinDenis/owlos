[Setup]
AppName=OWLOS Air Quality
LicenseFile="..\LICENSE"
AppVersion=1.1
WizardStyle=modern
DefaultDirName={autopf}\OWLOS Air Quality
DefaultGroupName=OWLOS Air Quality
DisableProgramGroupPage=yes
DisableWelcomePage=no
UninstallDisplayIcon={app}..\OWLOSAirQuality\bin\Release\net5.0-windows\OWLOSAirQuality.exe
Compression=lzma2
SolidCompression=yes
OutputBaseFilename=OWLOSAirQualityUX
OutputDir="..\"

[CustomMessages]
AppName=OWLOS Air Quality
LaunchProgram=Start OWLOS Air Quality after finishing installation

[Files]
Source: "..\DOTNETCore50Installer\bin\Release\DOTNETCore50Installer.dll"; DestDir: "{app}"; CopyMode: alwaysoverwrite;  Flags: ignoreversion;
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

[Code]
const
  MB_ICONINFORMATION = $40;

// Importing a Unicode Windows API function.
function MessageBox(hWnd: Integer; lpText, lpCaption: String; uType: Cardinal): Integer;
external 'MessageBoxW@user32.dll stdcall';

function  GetNETCoreVersion():Integer;
external 'GetNETCoreVersion@files:DOTNETCore50Installer.dll stdcall setuponly';

procedure  InstallNETCore50();
external 'InstallNETCore50@files:DOTNETCore50Installer.dll stdcall setuponly';


function NextButtonClick(CurPage: Integer): Boolean;
var
  hWnd: Integer;
  NETVersion: Integer;
begin
  if CurPage = wpWelcome then begin
    hWnd := StrToInt(ExpandConstant('{wizardhwnd}'));

    NETVersion := GetNETCoreVersion();

    if NETVersion < 5 then 
    begin
       InstallNETCore50();
    end;

    //FOR DEBUG
    //MessageBox(hWnd, IntToStr(NETVersion), 'MessageBoxA', MB_OK or MB_ICONINFORMATION);

  end;
  Result := True;
end;

[Icons]
Name: "{group}\OWLOS Air Quality"; Filename: "{app}\OWLOSAirQuality.exe"

[Run]
Filename: "{app}\OWLOSAirQuality.exe"; Description: {cm:LaunchProgram,{cm:AppName}}; Flags: nowait postinstall skipifsilent