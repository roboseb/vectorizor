// Start running animation.
const animate = (canvas, ctx, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Add lineSpeed to the current line being drawn. If the amount
    // left is less than lineSpeed, just add that.
    let lineLeft = moveArray[currentMove].distance - lineProgress;

    if (lineLeft < lineSpeed) {
        ctx.lineDashOffset -= lineLeft;
        lineProgress += lineSpeed;
        lineLeft = 0;

        console.log('next lin')
    } else {
        ctx.lineDashOffset -= lineSpeed;
        lineProgress += lineSpeed;
    }


    console.log(lineLeft)

    let totalLine = 0;

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    

    // Draw every move saved in the moveArray.
    for (let i = 0; i <= currentMove; i++) {
        if (i > moveArray.length - 1) break;

        

        ctx.lineTo(moveArray[i].x, moveArray[i].y);

        
        

        totalLine += moveArray[i].distance;
    }

    ctx.stroke();

    // Start animating the next move once a line is drawn.
    if (lineLeft == 0) {
        if (currentMove < moveArray.length - 1) {
            lineProgress = 0;
            ctx.setLineDash([totalLine + moveArray[currentMove + 1].distance, totalLine + moveArray[currentMove + 1].distance]);
            ctx.lineDashOffset -= moveArray[currentMove + 1].distance;
        }
        currentMove++;
    }

    // Animate a frame 60 times per second, unless the animation is complete.
    if (!(currentMove > moveArray.length - 1)) {
        setTimeout(() => {
            animate(canvas, ctx, originX, originY, moveArray, currentMove, lineProgress, lineSpeed, setMode)
        }, 1000 / 60);
    } else {
        setMode('draw');
    }
}

export default animate;