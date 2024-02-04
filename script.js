// Initialize basic canvas.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerHeight - 20;
ctx.canvas.height = window.innerHeight / 2;

ctx.lineWidth = 4;
ctx.lineCap = 'butt';

let oldX = canvas.width / 2;
let oldY = canvas.height / 2;

let moveArray = [
    { type: 'stroke', x: 0, y: 0, distance: Math.hypot(0 - oldX, 0 - oldY) },
    // { type: 'stroke', x: 50, y: 200, distance: Math.hypot(50 - oldX, 200 - oldY)},
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
const lineSpeed = 12;

ctx.lineDashOffset = moveArray[0].distance * -1;

// Start running animation.
const animate = () => {

    let lastLineLength = moveArray[currentMove].distance;

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    oldX = canvas.width / 2;
    oldY = canvas.height / 2;

    if (lastLineLength - Math.abs(ctx.lineDashOffset + moveArray[0].distance) < lineSpeed) {
        console.log('not enough left')
        console.log(lastLineLength - Math.abs(ctx.lineDashOffset + moveArray[0].distance));
        ctx.lineDashOffset -= lastLineLength - Math.abs(ctx.lineDashOffset + moveArray[0].distance);
    } else {
        ctx.lineDashOffset -= lineSpeed;
    }

    // Draw every move saved in the moveArray.
    for (let i = 0; i <= currentMove; i++) {

        if (i > moveArray.length - 1) break;
        ctx.setLineDash([lastLineLength, lastLineLength]);

        draw(moveArray[i].x, moveArray[i].y)
    }

    // Stop animating once all lines have been drawn.
    if (Math.abs(ctx.lineDashOffset + moveArray[0].distance).toFixed(1) == lastLineLength.toFixed(1)) {
        console.log('done')
        console.log(ctx.lineDashOffset)
        return;
    }

    // Draw every line currently reached in the moveArray.
    for (let i = 0; i <= currentMove; i++) {

        if (i > moveArray.length - 1) break;
        ctx.setLineDash([lastLineLength, lastLineLength]);

        draw(moveArray[i].x, moveArray[i].y)
    }

    // Animate a frame 60 times per second.
    setTimeout(animate, 1000 / 60);
}

animate();

// const lastLineLength = moveArray[currentMove].distance;
// ctx.setLineDash([lastLineLength, lastLineLength]);
// ctx.lineDashOffset -= lastLineLength;
// draw(moveArray[0].x, moveArray[0].y)



// ctx.beginPath();
// ctx.moveTo(canvas.width / 2, canvas.height / 2);
// ctx.lineTo((canvas.width / 2)  + 200, (canvas.height / 2)  + 0);
// ctx.lineTo((canvas.width / 2)  + 200, (canvas.height / 2)  - 200);
// ctx.lineTo((canvas.width / 2)  + 0, (canvas.height / 2)  - 200);
// ctx.lineTo((canvas.width / 2)  + 0, (canvas.height / 2)  - 0);
// ctx.stroke();