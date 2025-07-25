function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBall() {
    return colors[random(0, colors.length - 1)];
}

function degreeToRadian(type, degree) {
    return Math[type](degree * Math.PI / 180);
}

function arc(type, number) {
    return Math['a' + type](number) * 180 / Math.PI;
}

function pushMid(index, newBall) {
    balls.splice(index, 0, newBall);
}

function turnColor() {
    balls[0].type = 'green';
    balls[1].type = 'blue';
    balls[2].type = 'blue';
    balls[3].type = 'red';
    balls[4].type = 'red';
    balls[5].type = 'red';
    balls[6].type = 'red';
    balls[7].type = 'green';
    balls[8].type = 'blue';
    balls[9].type = 'green';
    balls[10].type = 'green';

    player.ball.current.type = 'red';
    player.ball.future.type = 'red';

    // setTimeout(() => {
    //     checkSameBalls();
    // }, 1000);
}

function remove(sameBalls) {
    let tempBalls = [...balls];

    sameBalls.forEach(sameBallIndex => {
        let currentBall = tempBalls[sameBallIndex];
        currentBall.createParticles();
        balls.splice(balls.indexOf(currentBall), 1);
    });
}

function loadLocation(percent) {
    let percentIndex = Math.floor(percent * pathLength * 10) / 10;
    // if(!(percentIndex + 1)) console.log(percent, percentIndex);
    return savedLocation[percentIndex] = savedLocation[percentIndex] || path.getPointAtLength(percentIndex);
}

function getDegree(front, side) {
    let degree = Math.atan(Math.abs(front / side)) * 180 / Math.PI;

    if (side < 0 && front < 0) {
        degree = 90 + 90 - degree;
    } else if (side < 0 && front >= 0) {
        degree += 180;
    } else if (side >= 0 && front >= 0) {
        degree = 270 + 90 - degree;
    }

    return degree;
}

function getRotation(sourcePoint, collidePoint, targetPoint) {
    let collideToSourcePoint = {
        front: collidePoint.x - sourcePoint.x,
        side: collidePoint.y - sourcePoint.y
    };
    let collideToSource = Math.hypot(collideToSourcePoint.front, collideToSourcePoint.side);

    let collideToTargetPoint = {
        front: collidePoint.x - targetPoint.x,
        side: collidePoint.y - targetPoint.y
    };
    let collideToTarget = Math.hypot(collideToTargetPoint.front, collideToTargetPoint.side);

    let sourceToTargetPoint = {
        front: sourcePoint.x - targetPoint.x,
        side: sourcePoint.y - targetPoint.y
    };
    let sourceToTarget = Math.hypot(sourceToTargetPoint.front, sourceToTargetPoint.side);

    let arcCos = (collideToSource ** 2 + collideToTarget ** 2 - sourceToTarget ** 2) / (2 * collideToSource * collideToTarget);

    // console.log(collideToSource, collideToTarget, sourceToTarget);
    // console.log(collideToSource, collideToTarget);
    // console.log(arcCos);

    return arc('cos', arcCos);
}

function getRotationPosition(radius, rotation, x = 0, y = 0) {
    return {
        x: x + radius * degreeToRadian('cos', rotation),
        y: y + radius * degreeToRadian('sin', rotation)
    }
}

function convert(range) {
    return range / pathLength;
}
