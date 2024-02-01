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
    { type: 'stroke', x: 0, y: 0, distance:  this.x},
    { type: 'stroke', x: 50, y: 200, distance: this.x},
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
        distance: Math.hypot(x - oldX, y - oldY),
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

// Start running animation.
const animate = () => {
    console.log('animating...');

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    oldX = canvas.width / 2;
    oldY = canvas.height / 2;

    ctx.lineDashOffset = 200;
    ctx.setLineDash([20, 30]);


    moveArray.forEach(move => {
        console.log(move.distance);

        draw(move.x, move.y)
    });

}

animate();