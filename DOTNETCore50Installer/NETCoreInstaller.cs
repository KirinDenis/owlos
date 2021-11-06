/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Denis Kirin (deniskirinacs@gmail.com)

This file is part of OWLOS DIY Open Source OS for building IoT ecosystems

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

(Этот файл — часть OWLOS DIY Open Source OS for building IoT ecosystems.

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

using RGiesecke.DllExport;
using System;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;


namespace DOTNETCore50Installer
{
    public class NETCoreInstaller
    {
        /// <summary>
        /// Detect installed NET Core version (major).
        /// The method for NET Framework applications and library when you need to know are the NETCore application running is possible 
        /// For NETCore application simple use Environment.Version Property
        /// </summary>
        /// <returns>
        /// NET Core version or error code:
        /// -1: some exception
        /// -2: not installed or wrong dotnet prompt
        /// -3: access file system problems
        /// </returns>
        [DllExport("GetNETCoreVersion", CallingConvention = CallingConvention.StdCall)]
        public static int GetNETCoreVersion()
        {
            try
            {
                //we need create and run .cmd file to make console output redirection to file with using ">" operator (OLD GOOD MS DOS)
                string cmdFileName = Path.GetTempFileName() + ".cmd";
                string versionFileName = Path.GetTempFileName();

                //like: cmd dotnet --version with console output redirection to file "versionFileName"
                //full command id: cmd dotnet --version >> "versionFileName"                
                File.WriteAllText(cmdFileName, "dotnet --version > " + versionFileName);

                System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo
                {
                    WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden,
                    WorkingDirectory = Path.GetDirectoryName(cmdFileName),
                    FileName = cmdFileName
                };

                System.Diagnostics.Process process = new System.Diagnostics.Process
                {
                    StartInfo = startInfo
                };
                process.Start();
                process.WaitForExit();

                //after success dotnet --version >> "tempFileName", the "tempFileName" file must be exists and contains NET Core version 
                if (File.Exists(versionFileName))
                {
                    string versionsinfo = File.ReadAllText(versionFileName);
                    File.Delete(versionsinfo);
                    //only major version is interested
                    versionsinfo = versionsinfo.Substring(0, versionsinfo.IndexOf("."));
                    int version = -2;
                    int.TryParse(versionsinfo, out version);
                    return version;
                }
                return -3;
            }
            catch
            {
                return -1;
            }
        }

        /// <summary>
        /// Installing NET Core 5.0
        /// </summary>
        /// <returns></returns>
        [DllExport("InstallNETCore50", CallingConvention = CallingConvention.StdCall)]
        public static void InstallNETCore50()
        {
            string exeFileName = Path.GetTempFileName() + ".exe";
            WebClient webClient = new WebClient();
            webClient.DownloadFile("https://download.visualstudio.microsoft.com/download/pr/334f5618-b0fa-474c-b55e-1d10c9142161/61eb66bf79d0e6cf36f894a5fe847634/dotnet-runtime-5.0.9-win-x86.exe", exeFileName);

            System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo
            {
                FileName = exeFileName
            };

            System.Diagnostics.Process process = new System.Diagnostics.Process
            {
                StartInfo = startInfo
            };
            process.Start();
            process.WaitForExit();
        }
        
    }
}
