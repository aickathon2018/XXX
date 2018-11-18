import requests
import json
import cv2
import numpy as np
import time
font = cv2.FONT_HERSHEY_SIMPLEX

# Open the input movie file
input_movie = cv2.VideoCapture("CAR_PLATE.mp4")
length = int(input_movie.get(cv2.CAP_PROP_FRAME_COUNT))

# Create an output movie file (make sure resolution/frame rate matches input video!)
fourcc = cv2.VideoWriter_fourcc(*'XVID')
output_movie = cv2.VideoWriter('output.avi', fourcc, 25.00, (1920, 1080))

# Initialize some variables
frame_number = 0

while True:
    # Grab a single frame of video
    ret, frame = input_movie.read()
    frame_number += 1
    cv2.imwrite("a.jpg",frame)
        # Quit when the input video file ends
    if not ret:
        break

    # Path of image
    file = "C:\\Users\\Pc User\\Desktop\\AIKACTHON\\NUMBER PLATE\\a.jpg"

    accessKey = "df33516c8bd0f41f0a29"
    secretKey = "3e338bc328fda4d7cc7a3fd50927673f9f609b86"

    # access_key and secret_key
    data = {'access_key': accessKey,
        'secret_key': secretKey}
     
    filename = {'filename': open(file,'rb')}
    r = requests.post('https://lpr.recoqnitics.com/detect', files = filename, data=data)
    content = json.loads(r.content)
    
    print(content)
    if len(content['licensePlates']) != 0:
        x = content['licensePlates'][0]['boundingBox']['x']
        y = content['licensePlates'][0]['boundingBox']['y']
        w = content['licensePlates'][0]['boundingBox']['w']
        h = content['licensePlates'][0]['boundingBox']['h']
        LPN = content['licensePlates'][0]['licensePlateNumber']

        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(frame, LPN,(x, y), font, 2, (255, 255, 255),3)
       # cv2.imshow("hi",frame)
    cv2.imwrite("a%d.jpg"% frame_number, frame)
    output_movie.write(frame)
    if frame_number %10 == 0:
         time.sleep(60)

# All done!
input_movie.release()
cv2.destroyAllWindows()
