print("Starting server...")
import os
print("Loading model...")
from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
from methods.functions import *
import threading
import time

model = YOLO("./models/yolov10x.pt")
print(f"Model loaded - yolov10x.pt")

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!"

@app.route("/api/detect", methods=["POST"])
def detect():
    # get image from request
    image = request.files["image"]
    #create a temporary file to store the image
    image_path = f"./tmp/{image.filename}"
    #check if the directory exists
    if not os.path.exists("./tmp"):
        os.makedirs("./tmp")
    #save the image
    image.save(image_path)
    #check if the output directory exists
    if not os.path.exists("./outputs"):
        os.makedirs("./outputs")
    #detect objects in the image
    random_filename = detect_objects(image_path, model, output = "./outputs")
    #return the filename of the output image
    return jsonify({
        "status" : 200,
        "message" : "Image detection successful",
        "image" : random_filename
    })

@app.route("/api/files/<path:filename>")
def files(filename):
    return send_from_directory("./outputs", filename)

def cleanup():
    # a function to clear files in tmp directory after 5mins of uploading'
    # get the list of files in the tmp directory
    print("Starting cleanup function...")
    files = os.listdir("./tmp")
    # loop through the files and delete files older than 5mins
    for file in files:
        if time.time() - os.path.getctime(f"./tmp/{file}") > 300:
            print(f"Deleting {file} - older than 5mins ({(time.time() - os.path.getctime(f'./tmp/{file}'))*60}mins)")
            os.remove(f"./tmp/{file}")
    # sleep for 1min
    time.sleep(60)

# start the cleanup function in a separate thread
threading.Thread(target=cleanup).start()

if __name__ == "__main__":
    app.run(port=5000)