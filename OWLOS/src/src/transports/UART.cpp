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

#include "UART.h"

#ifdef USE_ESP_DRIVER
#include "../drivers/ESPDriver.h"
#ifdef USE_DRIVERS
#include "../services/DriverService.h"
#endif
#endif

#ifdef USE_UART

#define OK_ANSWER "OK: "
#define PUBLISH_ANSWER "PUB: "
#define CANCEL_ANSWER "CANCEL: "
#define ERROR_ANSWER "ERROR: "

#define TOKENS_SIZE 10

void UARTSend(String topic, String payload)
{
    Serial.print(PUBLISH_ANSWER + topic + " " + payload + "\n");
}

void UARTSendError(String payload)
{
    Serial.print(ERROR_ANSWER);
    Serial.print("\n");
    Serial.print(payload + "\n");
    Serial.print("\n");
}

void UARTSendOK(String payload)
{
    Serial.print(OK_ANSWER);
    Serial.print("\n");
    Serial.print(payload + "\n");
    Serial.print("\n");
}

void UARTRecv()
{
    if (Serial.available())
    {
        //TODO byte by byte read until \n
        String command = Serial.readStringUntil('\r');

        if (command.length() > 0)
        {
            command.replace("\n", "");
            //--- Tokenize command
            String token[TOKENS_SIZE];
            int count = 0;
            while (command.indexOf(" ") != -1)
            {
                if (count > TOKENS_SIZE - 2)
                {
                    break;
                }
                token[count] = command.substring(0, command.indexOf(" "));
                command.replace(token[count] + " ", "");
                count++;
            }

            command.replace(" ", "");
            token[count] = command;
            count++;
            //--- ENDOF Tokenize command

            for (int i = 0; i < count; i++)
            {
                debugOut("UART " + String(i), token[i]);
            }

            if ((count > 0) && (token[0].length() > 0))
            {
                token[0].toLowerCase();

                if (token[0].equals("at+adp?"))
                {
                    UARTSendOK(driversGetAllDriversProperties());
                }
                else if (token[0].equals("at+fl?"))
                {
                    UARTSendOK(filesGetList(""));
                }
                else if (token[0].equals("at+f?"))
                {
                    if (count > 1)
                    {
                        UARTSendOK(filesReadString(token[1]));
                    }
                    else
                    {
                        UARTSendError("bad or missing file name");
                    }
                }
                else if (token[0].equals("at+dp?"))
                {
                    if (count > 2)
                    {
                        String result = driversGetDriverProperty(token[1], token[2]);
                        if (result.length() == 0) //then try get this property from node
                        {
                            result = nodeOnMessage(nodeGetTopic() + "/get" + token[2], "", NoTransportMask);
                        }

                        if (result.length() == 0)
                        {
                            UARTSendError("wrong driver id: " + token[1] + " use GetDriversId API to get all drivers list");
                        }
                        else if (result.equals(NotAvailable))
                        {
                            UARTSendError("driver property: " + token[2] + " set as NOT Available");
                        }
                        else if (result.equals(WrongPropertyName))
                        {
                            UARTSendError("driver property: " + token[2] + " not exists");
                        }
                        else
                        {
                            UARTSendOK(result);
                        }
                    }
                    else
                    {
                        UARTSendError("bad or missing parameter");
                    }
                }
                else if (token[0].equals("at+dp"))
                {
                    if (count > 3)
                    {

                        String driverResult = driversSetDriverProperty(token[1], token[2], token[3]);
                        if (driverResult.equals("1") || driverResult.length() == 0)
                        {
                            UARTSendOK("");
                        }
                        else
                        {
                            if ((driverResult.indexOf(WrongDriverName) > -1) || (driverResult.indexOf(WrongPropertyName) > -1))
                            {
                                String result = nodeOnMessage(nodeGetTopic() + "/set" + token[2], token[3], NoTransportMask);
                                if ((result.length() == 0) || (result.equals("0")))
                                {
                                    UARTSendError(driverResult + " [or] wrong node property: " + token[2]);
                                }
                                else
                                {
                                    if (result.equals("1"))
                                    {
                                        UARTSendOK("");
                                    }
                                    else
                                    {
                                        UARTSendError(driverResult + " [or] " + result);
                                    }
                                }
                            }
                            else
                            {

                                UARTSendError(driverResult);
                            }
                        }
                    }
                    else
                    {
                        UARTSendError("bad or missing parameter");
                    }
                }

                /*
                String result = WrongNodePropertyName;
#ifdef USE_ESP_DRIVER
                //result = nodeOnMessage(topic, command, NoTransportMask);
#endif

#ifdef USE_DRIVERS
                if (result.equals(WrongNodePropertyName))
                {
                    //            driversCallback(topic, command);
                }
#endif
*/
            }
            else
            {
                UARTSendError("empty command");
            }
        }
    }
}
#endif
