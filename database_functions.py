import mysql.connector
import config_settings
import datetime

def initial_setup():
    found_database=False;
    
    mydb = mysql.connector.connect(
        host="localhost",
        user=config_settings.DBusername,
        passwd=config_settings.DBpassword
    )

    mycursor = mydb.cursor()

    mycursor.execute("SHOW DATABASES")

    for x in mycursor:
        if(x[0] == "py_db"):
            found_database=True

    print(found_database)

    if(not found_database):
        mycursor.execute("CREATE DATABASE py_db")
        print("Successfuly created database py_db")

        mydb = mysql.connector.connect(
            host="localhost",
            user=config_settings.DBusername,
            passwd=config_settings.DBpassword,
            database="py_db"
        )

        mycursor = mydb.cursor()
        
        mycursor.execute("CREATE TABLE Messages (id INT AUTO_INCREMENT PRIMARY KEY, time DATETIME NOT NULL, value VARCHAR(255))")
        mycursor.execute("CREATE TABLE History  (id INT AUTO_INCREMENT PRIMARY KEY, time DATETIME NOT NULL, value VARCHAR(255))")
        mycursor.execute("CREATE TABLE Light    (id INT AUTO_INCREMENT PRIMARY KEY, state INT NOT NULL, auto_off_timer INT NOT NULL")
        print("Database and tables created successfully")
    else:
        print("Databases already exist")

def return_db():
    mydb = mysql.connector.connect(
        host="localhost",
        user=config_settings.DBusername,
        passwd=config_settings.DBpassword,
        database="py_db"
    )

    return mydb

def insert_message(message):

    mydb = return_db()
    mycursor = mydb.cursor()

    current_date = datetime.datetime.now()

    sql = "INSERT INTO Messages (time, value) VALUES (%s, %s)"
    val = (current_date, message)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, "record inserted")
