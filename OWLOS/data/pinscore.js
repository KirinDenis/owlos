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

//--------------------------------------------------------------------------------------------------------------------------------------------------
// Этот класс реализует объектную модель понов микроконтроллера.
// 
// Перед началом изучения этого класса - вызовите API getpinmap и изучите формат передачи
// свойств драйвер: http://yournodeurl:yournodeport/getapinmap (например http://192.168.1.10:8084/getapinmap)

// Примечания:
// "парсинг" - синтаксический анализ https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7
// "распарсить" - подвергнуть синтаксическому анализу
// "event" - событие
// "pin" - контакт микроконтроллера (ножка)


var pins = {
  
     //Массив подписчиков на событие onNew  пина контроллера
     _onnew: [],
     doOnNew: function (pin) {
         for (var key in pins._onnew) {
             pins._onnew[key](pin);
         }
     },
 
     //Добавление подсписчиков события onNew
     set onNew(onnew) {
         pins._onnew.push(onnew);
     },
 
       //Массив подписчиков на событие onDelete пина контроллера 
     _ondelete: [],
     doOnDelete: function (pin) {
         for (var key in pins._ondelete) {
             pins._ondelete[key](pin);
         }
     },
 
     //Добавление подсписчиков события onDelete
     set onDelete(ondelete) {
         pins._ondelete.push(ondelete);
     },
 
  
    //вызывается внешним кодом (смотрите index.js)
    refresh: function ( node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getpinmap", this.refreshResult, node);
    },

    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error")==0) {
            node.networkStatus = NET_ONLINE;
            //если запрос был выполнен удачно, парсим новые данные об драйверах, изменяем свойства drivers[] и добавляем новые driver если они появились
            //перед изучением парсинга, посмотрите результат API getalldriversproperties как текст
            //!-> asyncReciever это этот же класс drivers!
            pins.parsePins(httpResult, node);

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse")!=-1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            node.pins = "";
        }
    },

    //-------------------------------------------------------------------------------------------------------------
    
    ////получить объект Pin по его GPIO номеру
    getPinByGPIONumber: function (GPIONumber, host) {
          var node = config.getNodeByHost(host);
          if (node == undefined) return undefined;
          for (var i = 0; i < node.pins.length; i++) {
               if (node.pins[i].gpio === GPIONumber) {
               return node.pins[i];
               }                
            }
         return undefined;
    },

    //-------------------------------------------------------------------------------------------------------------
    //парсинг (синтаксический разбор) свойств пина и информации о подключенных драйверах контактам микроконтроллера - смотрите refresh()
    //этот метод будет вызываться множество раз, по этой причине он не только создает драйвера и их свойства
    //а так же проверяет было ли драйвер создано и как изменились его свойства после предыдущего парсинга
    parsePins: function (httpResult, node) {
        //первичный парсинг, помещаем строку пришедшую от HTTPClient в массив строк, разделяя по "\n"

        if(node.pins != undefined )
        {
          for (var pinIndex in node.pins) {
            node.pins[pinIndex].deleted = true; //все удалены перед началом парсинга      
          }
        }
        
        var recievedPinsProperties = httpResult.split("\n");
        
        if (recievedPinsProperties !== "") {//если первичный парсинг удался
            
            var pin = undefined; //сбрасываем будущий объект со свойствами пина 
            
            for (var i = 0; i < recievedPinsProperties.length; i++) {//перечисляем все строки в HTTPResult 
               
                if (recievedPinsProperties[i] === "") continue; //если строка пуста, берем следующею
                //--> разбор pin
                
                if (recievedPinsProperties[i].indexOf("name:")==0) { //если заголовок драйвера найден                    
                    
                    //сохраняем собранный pin
                    if( pin != undefined){
                        this.addPin(pin,node); 
                        this.doOnNew(pin); //вызов обработчика события OnNew
                        pin = undefined; 
                    }
                  
                    //извлекаем Name очередного пина
                    var name = recievedPinsProperties[i].split(":")[1];

                    pin = this.createPin(name, node);
                    
                }
                //--> разбор свойств pin
                else {//если текущая строка не является объявлением очередного пина, значит эта строка со свойством и значением свойства от последнего найденного драйвера
                    //свойства драйвер должны быть в формате [PropertyName]=[PropertyValue]
                    //где:
                    //PropertyName - название свойства(уникальное в рамках одного пина)
                    //PropertyValue - значение этого свойства

                    //вторичный парсинг, помещаем строку в массив, разделяя по "=", первый элемент название, второй значение 
                    
                    var propertyName = recievedPinsProperties[i].split("=")[0];
                    
                    var propertyValue = recievedPinsProperties[i].split("=")[1];
        
                    if (pin[propertyName] != undefined) {//если такое свойство уже существует                        
                         pin[propertyName] = propertyValue; //меняем значение свойства на новое
                    }
                }
            } 

             //сохраняем собранный pin
            if( pin != undefined){
                this.addPin(pin,node); 
                this.doOnNew(pin); //вызов обработчика события OnNew
                pin = undefined; 
            }

            var deleted = false;
            while (!deleted) {
                deleted = true;
                for (var pinsIndex in node.pins) { //удаляем удаленные на стороне ноды 
                  
                     if (node.pins[pinsIndex].deleted === true) {
                        this.doOnDelete(node.pins[pinsIndex]); //вызов обработчика события OnDelete
                        node.pins.splice(pinsIndex, 1);
                        deleted = false;
                       break;
                    }
                }
            }
        }
    }, //ENDOF parse pins

    addPin: function( _pin, node){
        
       var addOrNot = true;
                 
       if(node.pins.length >0){

            for(var pinIndex in node.pins){ 

                if( (node.pins[pinIndex].name ==_pin.name) && (node.pins[pinIndex].deleted === false)){
                        
                    addOrNot = false;
                        
                    if(node.pins[pinIndex].location != _pin.location) {
                        
                        addOrNot = true;
                       
                        for(var newPinIndex in node.pins){

                            if((node.pins[newPinIndex].location == _pin.location)&&(node.pins[newPinIndex].deleted === false)){
                             addOrNot = false;
                            }
                                
                        }
                        
                    }
                }  
            
            }
        }
             
        if(addOrNot){
            node.pins.push(_pin);
        }

    },  


    createPin: function(_name, node) {

        pin = { //создаем новый объект представляющий драйвер
            name: _name, //навастриваем уникальный ID драйвера, для идентификации объекта с драйверм в будущем
            nodenickname: node.nodenickname,
            host: node.host,
            mode: -1,
            pintypes: 0,
            extendPinTypes: 0,
            gpio: -1,
            chipnumber: -1,
            neighbourPin: -1,
            location: '',
            deleted: false,
        }; //новый объект для драйвера сформирован        
        return pin;
    },
 
}

var driverPins = {

  
    //Массив подписчиков на событие onNew у пина драйвера 
    _onnew: [],

    doOnNew: function (driverPin) {
        for (var key in driverPins._onnew) {
            driverPins._onnew[key](driverPin);
        }
    },

    //Добавление слушателей события onNew
    set onNew(onnew) {
        driverPins._onnew.push(onnew);
    },

      //Массив подписчиков на событие onDelete у пина драйвера 
    _ondelete: [],
    
    doOnDelete: function (driverPin) {
        for (var key in driverPins._ondelete) {
            driverPins._ondelete[key](driverPin);
        }
    },

    //Добавление слушателей события onDelete
    set onDelete(ondelete) {
        driverPins._ondelete.push(ondelete);
    },

    


    refresh: function (node) {
        node.networkStatus = NET_REFRESH;
        // асинхронный HTTP запрос
        // this.refreshResult - метод который будет вызван HTTPClient-ом по окончанию асинхронного запроса
        // this - ссылка на экземпляр этого объекта        
        httpGetAsyncWithReciever(node.host + "getdriverpin", this.refreshResult, node);
    },
    
    //вызывается асинхронным HTTPClient по окончанию запроса, указан как параметр в httpGetAsyncWithReciever, смотрите this.refresh()
    //httpResult - результат запроса
    //asyncReciever - ссылка на объект сделавший запрос (этот метод будет вызван в контексте другого потока, для него this. это другой объект - занимательный мир JS)
    //мы не можем использовать this, для обращения к методам этого объекта, поэтому заведомо передали себе ссылку на себя "asyncReciever"
    refreshResult: function (httpResult, node) {
        //HTTPClient добавляет строку "%error" в начало Response если запрос не был завешен HTTPCode=200 или произошел TimeOut
        if (!httpResult.indexOf("%error")==0) {
            node.networkStatus = NET_ONLINE;
            //если запрос был выполнен удачно, парсим новые данные об драйверах, изменяем свойства drivers[] и добавляем новые driver если они появились
            //перед изучением парсинга, посмотрите результат API getalldriversproperties как текст
            //!-> asyncReciever это этот же класс drivers!
            driverPins.parseDriverPin(httpResult, node);

        }
        else { //если HTTPClient вернул ошибку, сбрасываемый предыдущий результат
            if (httpResult.indexOf("reponse")!=-1) {
                node.networkStatus = NET_ERROR;
            }
            else {
                node.networkStatus = NET_OFFLINE;
            }
            node.driversPins = "";
        }
    },
     
    parseDriverPin: function (httpResult, node) {

        if(node.driversPins.length > 0)
        {
          for (var DriverPinIndex in node.driversPins) {
            node.driversPins[DriverPinIndex].deleted = true; //все удалены перед началом парсинга      
          }
        }
        
        var recievedDriverPins = httpResult.split("\n");


        if (recievedDriverPins !== "") {//если первичный парсинг удался

            var driverPin = undefined;
            var driverId = undefined;

            for (var i = 0; i <recievedDriverPins.length; i++) {//перечисляем все строки в HTTPResult 
                      
                if (recievedDriverPins[i] === "") continue; //если строка пуста, берем следующею
             
                if (recievedDriverPins[i].indexOf("driverid:") == 0) { //если заголовок драйвера найден                    
                    //Добавляем собранный пин драйвера 
                    if (driverPin != undefined) {
                        node.driversPins.push(driverPin);
                        this.doOnNew(driverPin); //вызов обработчика события OnNew
                    }
                   
                    driverId = recievedDriverPins[i].split(":")[1];
                    driverPin =  this.addDriverPin(driverId,node);
                   
                }
                else {
                    if (driverPin == undefined) continue;               
                    var splitterPos = recievedDriverPins[i].indexOf("=");
                    if (splitterPos != -1) {
                        var key = recievedDriverPins[i].slice(0, splitterPos);
                        var value = recievedDriverPins[i].slice(splitterPos + 1, recievedDriverPins[i].lenght);
                        if (driverPin[key] != undefined) {
                            driverPin[key] = value;
                        }
                    }
                }
            }

            if (driverPin != undefined) {
                node.driversPins.push(driverPin);
                this.doOnNew(driverPin); //вызов обработчика события OnNew
            }
        }

        var deleted = false;
        while (!deleted) {
            deleted = true;
            for (var driverPinsIndex in node.driversPins) { //удаляем удаленные на стороне ноды 
              
                 if (node.driversPins[driverPinsIndex].deleted === true) {
                    this.doOnDelete(node.driversPins[driverPinsIndex]); //вызов обработчика события OnDelete
                    node.driversPins.splice(driverPinsIndex, 1);
                    deleted = false;
                   break;
                }
            }
        }

    },
   
    addDriverPin: function (_driverId, _node) {
        driverPin = {
            driverId: _driverId,
            name: "",
            node: _node,
            driverpintype: 0,
            driverpintypedecoded: "",
            driverpinindex:-1,
            driveri2caddr: -1,
            driversdapinname:"",
            deleted: false, 
        };

        return driverPin;
    },

}

