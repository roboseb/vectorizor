// Initialize basic canvas.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerHeight - 20;
ctx.canvas.height = window.innerHeight / 2;

ctx.lineWidth = 10;
ctx.lineCap = 'round';

let oldX = canvas.width / 2;
let oldY = canvas.height / 2;

let moveArray = [
    { type: 'stroke', x: 0, y: 0, distance: Math.hypot(0 - oldX, 0 - oldY)},
    { type: 'stroke', x: 50, y: 200, distance: Math.hypot(50 - oldX, 200 - oldY)},
    // { type: 'stroke', x: 400, y: 75, distance: Math.hypot(400 - oldX, 75 - oldY)},
];

function draw(x, y) {
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);
    ctx.stroke();

    oldX = x;
    oldY = y;
}

// Add a move to moveArray.
const addMove = (type, x, y) => {
    const move = {
        type: type,
        x: x,
        y: y,
        distance: null,
    }

    moveArray.push(move);
}

// Draw a line on left click.
canvas.addEventListener('click', event => {
    draw(event.clientX, event.clientY);
    addMove('stroke', event.clientX, event.clientY);
})

// Set start point for next line on right click.
canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    oldX = event.clientX;
    oldY = event.clientY;
})

const animateBtn = document.getElementById('animate-btn');
animateBtn.addEventListener('click', () => {

});

let currentMove = 0;
let animatedFrames = 0;
let drawnLength = 0;

// Start running animation.
const animate = () => {

    // Stop animating once all lines have been drawn.
    if (animatedFrames == moveArray.length * 60) {
        console.log('done');
        return;
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    oldX = canvas.width / 2;
    oldY = canvas.height / 2;

    // ctx.lineDashOffset = 500;
    // ctx.setLineDash([500, 500]);


    for (let i = 0; i < currentMove; i++) {

        if (i > moveArray.length - 1) break;

        const lastLineLength = moveArray[i].distance;

        drawnLength += lastLineLength / 60;
        ctx.setLineDash([lastLineLength, 2000]);


        draw(moveArray[i].x, moveArray[i].y)
    }

    // Draw the next move every second.
    if (animatedFrames % 60 == 0) {
        currentMove++;
    }

    animatedFrames++;

    // Animate a frame 60 times per second.


    setTimeout(animate, 1000 / 60);


}

animate();