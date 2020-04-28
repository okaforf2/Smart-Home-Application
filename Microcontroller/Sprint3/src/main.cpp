#include <Arduino.h>
#include <ArduinoJson.h>
#include <analogWrite.h>
#include <Servo.h>

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#include "mqttcert.h"


int led = 25;
bool ledOn = false;
int ledIntensity = 255;
int sensor = 33;
String dataToSend;
int sensorval = 0;
int valueReturned;
int timerMax = 60;
long timerSecond = 0;
const double ledPower = 0.0818;
double ledPowerUsed = 0;
double powerUsed = 0;
int ledTimer = 0;

int LDRPin = 32;
float LDRReadVal = 0;
float LDRCalcVal = 0;
float lightIntensity = 0;

int soundSensorPort = 34;
float soundSensorReading = 0;
float soundSensorVal = 0;
float soundValAvg = 0;
int servoPin = 26;

    float average = 0;
    float savedValues[30];
    int counter = 0;

bool alarmSet = true;
bool doorSet = false;
int doorPin = 27;
float soundSensorUpperLimit = 0;

int buzzerPin = 12;


WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);
Servo myServo;

long lastMsgTimer = 0;
const int onboardLED = 2; // GPIO2 (D2) on the DOIT-ESP32-DevKitV1
const int LEDLightPort = 32;

// The receivedCallback() function will be invoked when this client receives data about the subscribed topic:
 void receivedCallback(char* topic, byte* payload, unsigned int length) 
 {
    Serial.print("\nMessage received on topic:  ");
    Serial.print(topic);
    Serial.print("  Message reads:  ");

    //Example json reading data and outputting to console
    DynamicJsonDocument doc(1024);
    String input = ((char *)payload); 
    Serial.println(input);
    deserializeJson(doc, input);
    JsonObject obj = doc.as<JsonObject>();
    String type = obj["type"];
    int state = obj["state"];
    String val = obj["val"];
    Serial.println(type);

    if(type.equals("light")){
   //     if(val.equals("intensity")){
            switch(state){
                case 0: ledIntensity = 0;
                        ledPowerUsed = 0;
                break;
                case 1: ledIntensity = 64;
                        ledPowerUsed = ledPower/4;
                break;
                case 2: ledIntensity = 127;
                        ledPowerUsed = ledPower/2;
                break;
                case 3: ledIntensity = 192;
                        ledPowerUsed = ledPower * 3/4;
                break;
                case 4: ledIntensity = 255;
                        ledPowerUsed = ledPower;
                break;
            }
            if (ledOn == true){
                analogWrite(led, lightIntensity);
        }
    //    }
     /*   else if (val.equals("timer")){
             switch(state){
                case 0: timerMax = 15;
                break;
                case 1: timerMax = 30;
                break;
                case 2: timerMax = 45;
                break;
                case 3: timerMax = 60;
                break;
                case 4: timerMax = 75;
                break;
             }
        } */
    }
    else if(type.equals("alarm")){
        switch(state){
            case 0: alarmSet = false;
            break;
            case 1: alarmSet = true;
            break;
        }
    }
    else if(type.equals("door")){
        switch(state){
            case 0:
            // myServo.write(0);
            doorSet = false;
            break;
            case 1:
            // myServo.write(45);
            doorSet = true;
            break;
        }
    }

    Serial.println();
}

// The mqttConnect() function will attempt to connect to MQTT and subscribe to a topic feed:
void mqttConnect() {
    while (!mqttClient.connected()) {

        Serial.print("In mqttConnect(), connecting...  ");

        if (mqttClient.connect(MQTT_CLIENT_ID, MQTT_USERNAME.c_str(), MQTT_PASSWORD)) {
            Serial.println("...connected to mqtt server!");
            Serial.print("Subscribing to topic:  ");
            Serial.println(MQTT_TOPIC_NAME_SUBSCRIBE.c_str());

            // Subscribe topic with default QoS 0
            // Let's just subscribe to the same feed we are publishing to, to see if our message gets recorded.
            mqttClient.subscribe(MQTT_TOPIC_NAME_SUBSCRIBE.c_str());

        } else {
            Serial.println("...mqttConnect() failed, status code =");
            Serial.println(mqttClient.state());
            Serial.println("try again in 5 seconds...");
            delay(5000); // Wait 5 seconds before retrying
        }
    }
}

void setup() {
    pinMode(onboardLED, OUTPUT);
    pinMode(led, OUTPUT);
    pinMode(doorPin, OUTPUT);
    pinMode(buzzerPin, OUTPUT);
    pinMode(sensor, INPUT);
    pinMode(soundSensorPort, INPUT);
    pinMode(LDRPin, INPUT);
    analogWriteResolution(led, 12);
    myServo.attach(servoPin);

    Serial.begin(9600);
    Serial.println();
    Serial.println();
    Serial.println("Hello MQTT program");
    Serial.print("Attempting to connect to WiFi SSID:  ");
    Serial.println(WIFI_SSID);
    Serial.print("Connecting");
    
    // We start by connecting to a WiFi network
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address:  ");
    Serial.println(WiFi.localIP());

    Serial.println("Setting up MQTT...");
    
    // We need a certificate in order to do a __secure__ TLS/SSL connection to our server
    espClient.setCACert(CA_CERT);

    // Port 1883 is reserved with IANA for use with MQTT.
    // TCP/IP port 8883 is also registered, for using MQTT over SSL.
    // help url:  http://www.iotsharing.com/2017/08/how-to-use-esp32-mqtts-with-mqtts-mosquitto-broker-tls-ssl.html
    mqttClient.setServer(MQTT_SERVER, 8883); // Port 8883 for MQTT over SSL.

    // The receivedCallback() function will be invoked when this client receives the subscribed topic:
    mqttClient.setCallback(receivedCallback);
}

void loop() {

    mqttConnect();

    // this function will listen for incoming subscribed topic processes and invoke receivedCallback()
    mqttClient.loop();
        long now = millis();    

        sensorval = digitalRead(sensor);

        soundSensorReading = analogRead(soundSensorPort);
        soundSensorVal = soundSensorReading / 4096 ;
        //Serial.print("Sound: ");
        //Serial.println(soundSensorVal);

        //Simulate door being locked.
        if(doorSet == true){
            digitalWrite(doorPin, HIGH);
        }
        if(doorSet == false){
            digitalWrite(doorPin, LOW);
        }

        //Does action every second
        if(((now - timerSecond) / 1000) > 1) {
            timerSecond = now;
            Serial.println(sensorval);
            if (ledOn) {powerUsed = powerUsed + ledPowerUsed;}
           

            savedValues[counter] = soundSensorVal;
            average = 0;
    
            for(int i = 0; i < 30; i++){
                average = average + savedValues[i];
            }
            average = average/30;
            soundSensorUpperLimit = average * 1.75;

            Serial.print("avg: ");
            Serial.println(average);
            counter = counter + 1;
            if(counter == 30){
                counter = 0;
                Serial.println("Has reset average counter");
            }
            /* Checking for if acting on recieving alarm setting from front end.
            if(alarmSet == true){
                Serial.print("Alarm is set");
            }
            else if(alarmSet == false){
                Serial.print("Alarm is not set");
            }
            if(doorAlarmSet == true){
                Serial.print("door alarm is set");
            }
            else if(doorAlarmSet == false){
                Serial.print("dooralarm is not set");
            }
            */
        }    

        //LDR reading.
        LDRReadVal = analogRead(LDRPin);
        LDRCalcVal = ((LDRReadVal / 4096) - 0.5) * 2 ;
        lightIntensity = ledIntensity * LDRCalcVal;

        if (sensorval == HIGH)
        {
        ledTimer = now;
        analogWrite(led, lightIntensity);
        ledOn = true;
       // Serial.println("Movement detected");  
        }   

       //Buzzer code   
       if(alarmSet == true){
            if((soundSensorVal > soundSensorUpperLimit) || (sensorval == HIGH)){
                digitalWrite(buzzerPin, LOW);   // turn the Buzz ON
                //Serial.println("Buzzer turned on correctly of the most incourse of action.");
            }
            else{

                digitalWrite(buzzerPin, HIGH);   // turn the LED/Buzz OFF
            }
        }
        if(alarmSet == false){
            digitalWrite(buzzerPin,HIGH);
        }



        //Led timer:
        if((now - ledTimer) / 1000 > timerMax){
            ledOn = false;
            analogWrite(led, 0);
        //    Serial.println("Timer finished");
        }


    // we send a reading every 10 secs
    // we count until 5 secs reached to avoid blocking program (instead of using delay())
    
    if (now - lastMsgTimer > 30000) {
        lastMsgTimer = now;
        
        /*
        soundSensorReading = analogRead(soundSensorPort);
        soundSensorVal = (soundSensorReading / 4096) * 3;
        Serial.print(soundSensorVal);
        Serial.print("Sound: ");
        Serial.print(soundSensorVal);

        savedValues[counter] = soundSensorVal;
        average = 0;
    
        for(int i = 0; i < 30; i++){
            average = average + savedValues[i];
        }
        average = average/30;

        Serial.print("avg: ");
        Serial.print(average);
        counter = counter + 1;
        if(counter == 30){
            counter = 0;
        }
        */


        dataToSend = powerUsed;
        powerUsed = 0;
        // just convert time stamp to a c-string and send as data:
        // dataToSend could be a sensor reading instead
        Serial.println();
        Serial.print("Publishing data:  ");
        Serial.println(dataToSend);
        mqttClient.publish(MQTT_TOPIC_NAME_PUBLISH.c_str(), dataToSend.c_str());
    }
} 
/*
float averageCalculator(float readValue, int averageSpread){
    float average;
    float savedValues[averageSpread];
    int counter;

    savedValues[counter] = readValue;
    average = 0;
    
    for(int i = 0; i < averageSpread; i++){
        average = average + savedValues[i];
    }
    average = average/averageSpread;

    Serial.print("avg: ");
    Serial.print(average);
    counter = counter + 1;
    if(counter == averageSpread){
        counter = 0;
    }
    return average;
}
*/