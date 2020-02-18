import paho.mqtt.client as mqtt
import config_settings
import database_functions
import ssl
import os
import mysql.connector

print("Program Started")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'mqtt.crt')

database_functions.initial_setup()

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code "+str(rc))

    client.subscribe("302CEM/RABBIT/helloWorld")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.username_pw_set(username=config_settings.MQTTusername,password=config_settings.MQTTpassword)
client.on_connect = on_connect
client.on_message = on_message
client.tls_set(filename, tls_version=ssl.PROTOCOL_TLSv1_2)

client.connect("mqtt.coventry.ac.uk", 8883, 60)

client.loop_forever()
