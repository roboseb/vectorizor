import animate from "./scripts/animate";

// Initialize basic canvas.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.lineWidth = 4;
ctx.lineCap = 'butt';

let oldX = canvas.width / 2;
let oldY = canvas.height / 2;
let originX = canvas.width / 2;
let originY = canvas.height / 2;

let moveArray =
    [
        {
            "type": "stroke",
            "x": 60,
            "y": 279,
            "distance": null
        },
        {
            "type": "move",
            "x": 575,
            "y": 276,
            "distance": null
        },
        {
            "type": "stroke",
            "x": 157,
            "y": 410,
            "distance": null
        },
    ]
    ;

//moveArray = [];

const draw = (x, y, type, i) => {

    ctx.moveTo(oldX, oldY);
    if (i == 0) ctx.moveTo(originX, originY)
    if (type == 'stroke') ctx.lineTo(x, y);

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

// Use math to find the length of each line.
const calculateMoveDistances = () => {

    // Calculate the length of each line in the moveArray.
    moveArray.forEach((move, index) => {
        if (index == 0) {
            move.distance = Math.hypot(move.x - originX, move.y - originY)
        } else {
            move.distance = Math.hypot(move.x - moveArray[index - 1].x, move.y - moveArray[index - 1].y)
        }
    });
}

let currentMove = 0;
let lineProgress = 0;
let lineSpeed = 105;
let mode = 'draw';

// Switch to the given mode, and animate the display accordingly.
const setMode = (newMode) => {
    const modeDisplay = document.getElementById('mode');
    modeDisplay.innerText = newMode;
    mode = newMode;
}

// Show a visual guide of where the next line will be.
const drawGuide = (x, y) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    oldX = originX;
    oldY = originY;
    ctx.strokeStyle = 'black';
    ctx.setLineDash([0, 0]);

    moveArray.forEach(move => {
        draw(move.x, move.y, move.type);
    });
    ctx.stroke();

    // Draw a line from the last point to the cursor.
    ctx.beginPath();
    ctx.strokeStyle = 'lightgrey';
    ctx.setLineDash([20, 20]);
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);
    ctx.stroke();
}

// Draw a line on left click.
canvas.addEventListener('click', event => {
    if (mode !== 'draw') return;
    draw(event.clientX, event.clientY);
    addMove('stroke', event.clientX, event.clientY);
    drawGuide(event.clientX, event.clientY)
});

// Animate effects for draw mode.
document.addEventListener('mousemove', (event) => {
    if (mode !== 'draw') return;
    drawGuide(event.clientX, event.clientY)
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    if (mode !== 'draw') return;
    addMove('move', event.clientX, event.clientY);
})

// Reset stored values and animate from the moveArray.
const animateBtn = document.getElementById('animate-btn');
animateBtn.addEventListener('click', () => {
    // ctx.lineDashOffset = moveArray[0].distance * -1;
    // ctx.setLineDash([moveArray[0].distance, moveArray[0].distance]);
    if (mode !== 'draw') return;
    animate(draw, canvas, ctx, oldX, oldY, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode, calculateMoveDistances);
});

// Clear the moveArray and everything on screen.
const clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', () => {
    if (mode !== 'draw') return;
    console.log('clearing...');
    moveArray = [];
});

const speedInput = document.getElementById('speed-input');
speedInput.addEventListener('input', () => {
    if (mode !== 'draw') return;
    lineSpeed = speedInput.value;
});

animate(draw, canvas, ctx, oldX, oldY, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode, calculateMoveDistances);
