import mysql.connector
import config_settings

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
        print("Database and tables created successfully")
    else:
        print("Databases already exist")
