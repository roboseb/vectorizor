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
        "type": "move",
        "x": 148,
        "y": 279,
        "distance": 272.95512451683334
    },
    {
        "type": "stroke",
        "x": 575,
        "y": 276,
        "distance": 427.0105385116391
    },
    {
        "type": "move",
        "x": 157,
        "y": 410,
        "distance": 438.953300477397
    },
    {
        "type": "stroke",
        "x": 585,
        "y": 394,
        "distance": 428.2989610073786
    },
    {
        "type": "move",
        "x": 137,
        "y": 539,
        "distance": 470.88108902354526
    },
    {
        "type": "stroke",
        "x": 597,
        "y": 536,
        "distance": 460.00978250467676
    }
]
;

//moveArray = [];

const draw = (x, y, type) => {
    ctx.moveTo(oldX, oldY);
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
const lineSpeed = 15;
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

    moveArray.forEach(move => {
        draw(move.x, move.y, move.type);
    })

    // ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(x, y);
    ctx.stroke();
}

// Draw a line on left click.
canvas.addEventListener('click', event => {
    if (mode !== 'draw') return;
    draw(event.clientX, event.clientY);
    addMove('stroke', event.clientX, event.clientY);
});

// Animate effects for draw mode.
document.addEventListener('mousemove', (event) => {
    if (mode !== 'draw') return;
    drawGuide(event.clientX, event.clientY)
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    addMove('move', event.clientX, event.clientY);
})

// Reset stored values and animate from the moveArray.
const animateBtn = document.getElementById('animate-btn');
animateBtn.addEventListener('click', () => {
    if (mode == 'animate') return;

    console.log(moveArray);

    setMode('animate');
    currentMove = 0;
    lineProgress = 0;

    calculateMoveDistances();

    ctx.lineDashOffset = moveArray[0].distance * -1;
    ctx.setLineDash([moveArray[0].distance, moveArray[0].distance]);
    animate(canvas, ctx, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode);
});

const test = () => {
    if (mode == 'animate') return;

    setMode('animate');
    currentMove = 0;
    lineProgress = 0;

    calculateMoveDistances();

    ctx.lineDashOffset = moveArray[0].distance * -1;
    ctx.setLineDash([moveArray[0].distance, moveArray[0].distance]);
    animate(canvas, ctx, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode);
}

test();