class Apple {
    x = this.getRandom(100, 501);
    y = this.getRandom(100, 351);
    radius = 40;
    puntaje = 0;

    checkCollision(rectX, rectY, rectW, rectH) {

        let collisionX = this.x + this.radius  >= rectX && this.x + this.radius/2 <= rectX + rectW;
        let collisionY = this.y >= rectY && this.y  <= rectY + rectH;
        if (collisionX && collisionY) {
            this.x = this.getRandom(100, 501);
            this.y = this.getRandom(100, 351);
            this.puntaje++;
        }
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }
}

var apple = new Apple();

function setup() {
    createCanvas(600, 450);
}

function draw() {
    clear();
    fill(0, 0, 0);
    textSize(32);
    text('Puntaje ' + apple.puntaje, 10, 30);
    
    fill(255, 0, 0);
    ellipse(apple.x, apple.y, apple.radius, apple.radius);
}


// ---------------------------------------------------------------------------------------------- //
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let isVideo = false;
let model = null;
let videoInterval = 10;

const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    console.log("Loaded Model!");
});


function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            console.log("Now tracking");
            isVideo = true
            runDetection()
        } else {
            console.log("Please enable video");
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        console.log("Starting video");
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        console.log("Video stopped");
    }
}

function runDetection() {
    if (model) {
        model.detect(video).then(predictions => {
            // console.log("Predictions: ", predictions);
            // get the middle x value of the bounding box and map to paddle location
            model.renderPredictions(predictions, canvas, context, video);
            if (predictions[0]) {
                let x = predictions[0].bbox[0];
                let y = predictions[0].bbox[1];
                let w = predictions[0].bbox[2];
                let h = predictions[0].bbox[3];
                // let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
                // gamex = document.body.clientWidth * (midval / video.width)
                apple.checkCollision(x, y, w, h);
            }
            if (isVideo) {
                setTimeout(() => {
                    runDetection(video)
                }, videoInterval);
            }
        });
    } else {
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    }
}


windowHeight = window.innerHeight;
windowWidth = window.innerWidth;

toggleVideo();