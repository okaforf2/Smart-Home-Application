// Chris Bass - Coventry University
// 13/04/2019
// Secure encrypted MQTT with TLS/SSL using the ESP32 esp32doit-devkit-v1
// main.cpp
// This program provides an example of sending and receiving data via the MQTT publish-subscribe protocol

#include <Arduino.h>
#include <ArduinoJson.h>
#include <analogWrite.h>

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

#include "mqttcert.h"


int led = 25;
int sensor = 33;
String dataToSend;
int sensorval = 0;
int valueReturned;
int timerMax = 0;
int timerCurrent = 0;
//int valueRecieved;


//int valueToReturn();
//String functionToReturnValStatus();


WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

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
    String somethingToMakeItRun = obj["type"];
    String state = obj["state"];
    int val = obj["val"];
    Serial.println(somethingToMakeItRun);

    if(somethingToMakeItRun.equals("light")){
        if(state.equals("intensity")){
            switch(val){
                case 0: analogWrite(led, 0);
                break;
                case 1: analogWrite(led, 64);
                break;
                case 2: analogWrite(led, 127);
                break;
                case 3: analogWrite(led, 192);
                break;
                case 4: analogWrite(led, 255);
                break;
            }
        }
        else if (state.equals("timer")){
             switch(val){
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
    pinMode(sensor, INPUT);
    //pinMode(LEDLightPort, OUTPUT);
    //digitalWrite(LEDLightPort, LOW);
    analogWriteResolution(led, 12);

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

    /*
    analogWrite(led, 255);
    delay(1000);
    analogWrite(led, 128);
    delay(1000);
    analogWrite(led, 40);
    delay(2500);
    analogWrite(led, 0);
    delay(1000);
    */
    mqttConnect();

    // this function will listen for incoming subscribed topic processes and invoke receivedCallback()
    mqttClient.loop();

    if(valueReturned == 1){

        sensorval = digitalRead(sensor);
        delay(5000);
        Serial.println(sensorval);
  
  
        if (sensorval == HIGH) 
        {
        digitalWrite(led, HIGH);
        delay(1000);
        dataToSend = "Movement detected!";
        }
     
        else 
        {
        digitalWrite(led, LOW);
        delay(100);
        dataToSend = "No movement detected!";
        }  


    }

    else if(valueReturned == 0){

        dataToSend = "YEE!";
        digitalWrite(led, LOW);

        

    }

    // we send a reading every 10 secs
    // we count until 5 secs reached to avoid blocking program (instead of using delay())
    long now = millis();
    if (now - lastMsgTimer > 5000) {
        lastMsgTimer = now;


        // just convert time stamp to a c-string and send as data:
        // dataToSend could be a sensor reading instead
        Serial.println();
        Serial.print("Publishing data:  ");
        Serial.println(dataToSend);
        mqttClient.publish(MQTT_TOPIC_NAME_PUBLISH.c_str(), dataToSend.c_str());
    }
} 