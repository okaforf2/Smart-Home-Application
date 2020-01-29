// Dr Paul Lunn - Coventry University
// 17/06/2019
// ESP32 Blink test

#include <Arduino.h>

const int SERIAL_0_SPEED = 9600;
const int ON_BOARD_LED = 2;

// The setup() function is called once at the beginning of the program
// and is used to initalise the system
void setup()
{
  pinMode(ON_BOARD_LED, OUTPUT); // initialize digital pin ON_BOARD_LED as an output.

  Serial.begin(SERIAL_0_SPEED);       // begin serial link
  Serial.println("ESP32 Blink Test"); // print text onto screen via serial link
}

// The loop() function runs over and over again forever
void loop()
{
  digitalWrite(ON_BOARD_LED, HIGH); // turn the LED on
  delay(250);                      // wait for a second
  digitalWrite(ON_BOARD_LED, LOW);  // turn the LED off by making the voltage LOW
  delay(250);                      // wait for a second
}