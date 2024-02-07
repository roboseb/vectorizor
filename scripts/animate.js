// Animate through all lines in moveArray.
const animate = (draw, canvas, ctx, oldX, oldY, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode, calculateMoveDistances) => {

    // If all moves have been drawn, reset and go to draw mode.
    if (currentMove >= moveArray.length) {
        currentMove = 0;
        lineProgress = 0;
        setMode('draw');
        return;
    };

    setMode('animate');
    calculateMoveDistances();
    ctx.strokeStyle = 'black';

    let lineLeft = moveArray[currentMove].distance - lineProgress;

    // Update line speed based on bezier curve options.
    // The following code adds a nice bezier curve to the animation. I'm not 100% sure why. I am not really a math guy.
    const distToCenter = Math.abs(lineProgress - Math.abs(moveArray[currentMove].distance / 2));
    const percentToCenter = distToCenter / moveArray[currentMove].distance * 200;
    const newLineSpeed = lineSpeed * (1.01 - (percentToCenter / 100));

    // Progress the line being drawn by either lineSpeed or the last bit of the line.
    if (lineLeft < newLineSpeed) {
        ctx.lineDashOffset -= lineLeft;
        lineProgress += newLineSpeed;
        lineLeft = 0;
        lineProgress = 0;
    } else {
        lineProgress += newLineSpeed;
        ctx.lineDashOffset = moveArray[currentMove].distance - lineProgress;
    }



    if (moveArray[currentMove].type !== 'stroke') {
        lineLeft = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    oldX = originX;
    oldY = originY;

    // Iterate through all moves and draw them.
    for (let i = 0; i <= currentMove; i++) {
        if (i > moveArray.length) break;

        if (i < currentMove) {
            ctx.setLineDash([0, 0])

        } else {
            ctx.setLineDash([moveArray[i].distance, moveArray[i].distance])
        }

        ctx.beginPath();
        draw(moveArray[i].x, moveArray[i].y, moveArray[i].type, i);
        ctx.stroke();
    }

    // If current line is fully drawn, progress to the next.
    if (lineLeft == 0) {
        currentMove++;
    }

    // Animate a new frame 60 times per second.
    setTimeout(() => {
        animate(draw, canvas, ctx, oldX, oldY, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode, calculateMoveDistances);
    }, 1000 / 60)
}

export default animate;