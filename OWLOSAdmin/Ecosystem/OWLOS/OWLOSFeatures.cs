/* ----------------------------------------------------------------------------
OWLOS DIY Open Source OS for building IoT ecosystems
Copyright 2019, 2020, 2021 by:
- Vitalii Glushchenko (cehoweek@gmail.com)
- Denys Melnychuk (meldenvar@gmail.com)
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace OWLOSThingsManager.Ecosystem.OWLOS
{
    public class OWLOSFeatures
    {
        private Dictionary<string, string> Features = new Dictionary<string, string>();
        
        public string Version { get; set; } = string.Empty;        
        public string Build { get; set; } = string.Empty;        
        public string Board { get; set; } = string.Empty;        
        public string FileSystem { get; set; } = string.Empty;        
        public string Debug { get; set; } = string.Empty;        
        public string Log { get; set; } = string.Empty;        
        public string ESP { get; set; } = string.Empty;        
        public string WiFiAP { get; set; } = string.Empty;        
        public string WiFiST { get; set; } = string.Empty;        
        public string WiFiSTSSID { get; set; } = string.Empty;        
        public string WiFiSTConnected { get; set; } = string.Empty;        
        public string WiFiSTIP { get; set; } = string.Empty;        
        public string HTTPSecureServer { get; set; } = string.Empty;        
        public string HTTPServer { get; set; } = string.Empty;        
        public string HTTPServerST { get; set; } = string.Empty;        
        public string HTTPServerAP { get; set; } = string.Empty;        
        public string HTTPClient { get; set; } = string.Empty;        
        public string OTA { get; set; } = string.Empty;        
        public string MQTTBroker { get; set; } = string.Empty;        
        public string MQTTBrokerNetwork { get; set; } = string.Empty;        
        public string MQTTBrokerConnected { get; set; } = string.Empty;        
        public string UART { get; set; } = string.Empty;        
        public string Drivers { get; set; } = string.Empty;        
        public string Actuator { get; set; } = string.Empty;        
        public string Sensor { get; set; } = string.Empty;        
        public string DHT { get; set; } = string.Empty;        
        public string LCD { get; set; } = string.Empty;        
        public string Stepper { get; set; } = string.Empty;        
        public string Script { get; set; } = string.Empty;


        public async Task<bool> ParseFeatures(string featuresSource)
        {
            List<string> featuresRaw = featuresSource.Split('\n').ToList();
        
            foreach (string featureProp in featuresRaw)
            {
                if (featureProp.IndexOf("=") != -1)
                {
                    string key = featureProp.Substring(0, featureProp.IndexOf("="));
                    string value = featureProp.Substring(featureProp.IndexOf("=") + 1);
                    if (Features.FirstOrDefault(c => c.Key.Equals(key)).Key == null)
                    {
                       continue;
                    }
                    Features.Add(key, value);
                }
                else
                if (featureProp.IndexOf(":") != -1)
                {
                    string key = featureProp.Substring(0, featureProp.IndexOf(":"));
                    string value = featureProp.Substring(featureProp.IndexOf(":") + 1);
                    Features.Add(key, value);
                }
                else
                {
                    continue;
                }
            }

            for (int i=0; i < Features.Count; i++)
            {
                Type t = this.GetType();

                PropertyInfo featureProp = t.GetProperty(Features.ElementAt(i).Key);
                if (featureProp != null)
                {
                    featureProp.SetValue(this, Features.ElementAt(i).Value);
                }
            }


            return true;
        }
    }
}
