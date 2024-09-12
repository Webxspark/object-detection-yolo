import cv2
import random

def predict(chosen_model, img, classes=[], conf=0.5):
    if classes:
        results = chosen_model.predict(img, classes=classes, conf=conf)
    else:
        results = chosen_model.predict(img, conf=conf)

    return results

def predict_and_detect(chosen_model, img, classes=[], conf=0.5, rectangle_thickness=4, text_thickness=3, font_scale=2):
    results = predict(chosen_model, img, classes, conf=conf)
    for result in results:
        for box in result.boxes:
            # Draw rectangle around detected objects
            cv2.rectangle(img, (int(box.xyxy[0][0]), int(box.xyxy[0][1])),
                          (int(box.xyxy[0][2]), int(box.xyxy[0][3])), (255, 0, 0), rectangle_thickness)
            
            # Put text label on detected objects
            cv2.putText(img, f"{result.names[int(box.cls[0])]}",
                        (int(box.xyxy[0][0]), int(box.xyxy[0][1]) - 10),
                        cv2.FONT_HERSHEY_TRIPLEX, font_scale, (255, 0, 0), text_thickness)
            print   (f"{result.names[int(box.cls[0])]}")
    return img, results

def detect_objects(image_path, model, output = "./outputs"):
    image = cv2.imread(image_path)
    result_img, _ = predict_and_detect(model, image, classes=[], conf=0.5, font_scale=1, text_thickness=1)
    # generate random filename
    random_filename = str(random.randint(100000, 999999))
    cv2.imwrite(f"{output}/{random_filename}.jpg", result_img)
    cv2.waitKey(0)
    return random_filename