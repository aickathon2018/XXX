import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import threading
import time

cred = credentials.Certificate("xxxx-3bcf1-firebase-adminsdk-tudu6-a4eeea4874.json")
firebase_admin.initialize_app(cred, {'databaseURL' : 'https://xxxx-3bcf1.firebaseio.com/'})

def compare(a, b):
    if a == b:
        return 0
    else:
        return 1
    
ref = firebase_admin.db.reference('order')

Cnt = 0
userid = []
pastData = []
presentData = []

pastData = ref.get()
print(pastData)

while True:  
    presentData = ref.get()

    if compare(presentData, pastData) == 1:
        NewOrder = ref.get()
        try:
            NoNewOrder = len(pastData)
            count = 0
            for info in NewOrder:
                if Cnt == 0:
                    userid.append(NewOrder[info]['userid'])
                    orderid.append(NewOrder[info]['key'])
                else:
                    if count >= NoNewOrder:
                        userid.append(NewOrder[info]['userid'])
                        orderid.append(NewOrder[info]['key'])
                    count += 1
                    
            print(userid)
        except:
            for info in NewOrder:
                userid.append(NewOrder[info]['userid'])
                print(userid)
                
        Cnt = 1
    else:
        print("NOP")

    pastData = presentData
