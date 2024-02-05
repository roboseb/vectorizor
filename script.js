// Initialize basic canvas.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.lineWidth = 4;
ctx.lineCap = 'butt';

let oldX = canvas.width / 2;
let oldY = canvas.height / 2;

let moveArray = [
    { type: 'stroke', x: 30, y: 30, distance: null},
    { type: 'stroke', x: 30, y: 200, distance: null},
    { type: 'stroke', x: 400, y: 75, distance: null},
];

// let moveArray = [];

const draw = (x, y) => {
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);

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
    lineProgress = 0;
    currentMove = 0;
    oldX = canvas.width / 2;
    oldY = canvas.height / 2;
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
    currentMove = 0;

    // Calculate the length of each line in the moveArray.
    moveArray.forEach((move, index) => {
        if (index == 0) {
            move.distance = Math.hypot(move.x - oldX, move.y - oldY)
        } else {
            move.distance = Math.hypot(move.x - moveArray[index - 1].x, move.y - moveArray[index - 1].y)
        }
    });

    ctx.lineDashOffset = moveArray[0].distance * -1;
    ctx.setLineDash([moveArray[0].distance, moveArray[0].distance]);
    animate();

    console.log(moveArray);
});

let currentMove = 0;
let lineProgress = 0;
const lineSpeed = 15;

let mode = 'draw';

// Start running animation.
const animate = () => {

    // Stop animating if all moves have been shown.
    if (currentMove > moveArray.length - 1) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    oldX = canvas.width / 2;
    oldY = canvas.height / 2;

    // Add lineSpeed to the current line being drawn. If the amount
    // left is less than lineSpeed, just add that.



    let lineLeft = moveArray[currentMove].distance - lineProgress;
    //console.log(lineLeft);

    if (lineLeft < lineSpeed) {
        ctx.lineDashOffset -= lineLeft;
        lineProgress += lineSpeed;

        lineLeft = 0;
    } else {
        //console.log('animating...')
        ctx.lineDashOffset -= lineSpeed;
        lineProgress += lineSpeed;

    }

    let totalLine = 0;

    ctx.beginPath();
    ctx.moveTo(oldX, oldY)

    // Draw every move saved in the moveArray.
    for (let i = 0; i <= currentMove; i++) {

        if (i > moveArray.length - 1) break;

        totalLine += moveArray[i].distance;

        ctx.lineTo(moveArray[i].x, moveArray[i].y)
    }

    ctx.stroke();

    // ctx.setLineDash([totalLine, totalLine]);

    // Start animating the next move once a line is drawn.
    if (lineLeft == 0) {
        console.log('line done: ' + currentMove)
        if (currentMove < moveArray.length - 1) {
            lineProgress = 0;
            ctx.setLineDash([totalLine + moveArray[currentMove + 1].distance, totalLine + moveArray[currentMove + 1].distance])
            console.log(totalLine);
            ctx.lineDashOffset -= moveArray[currentMove + 1].distance;
        }
        currentMove++;
    }

    // Animate a frame 60 times per second.
    setTimeout(animate, 1000 / 60);
}

const drawGuide = (x, y) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    oldX = canvas.width / 2;
    oldY = canvas.width / 2;

    moveArray.forEach(move => {
        draw(move.x, move.y);
    })

    // ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);
    ctx.stroke();

    
}

// Animate effects for draw mode.
document.addEventListener('mousemove', (event) => {
    drawGuide(event.clientX, event.clientY)
});