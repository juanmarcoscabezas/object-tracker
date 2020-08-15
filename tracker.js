class Apple {
    x = this.getRandom(100, 501);
    y = this.getRandom(100, 351);
    radius = 40;
    puntaje = 0;

    checkCollision(rectX, rectY, rectW, rectH) {
        rectX = 600 - rectX - rectW;
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

window.onload = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    var tracker = new tracking.ColorTracker();

    tracking.track('#video', tracker, { camera: true });

    tracker.on('track', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        event.data.forEach(function (rect) {
            if (rect.color === 'red') {
                rect.color = tracker.customColor;
            }

            apple.checkCollision(rect.x, rect.y, rect.width, rect.height);
            context.strokeStyle = rect.color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
    });
};