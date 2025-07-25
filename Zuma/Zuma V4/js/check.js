function check() {
    checkOutOfBounds();
    checkCollision();

    if (!startingPhase) checkDistance();

    // checkSameBalls();
    // checkEnd();
    checkGameOver();
}

function checkBallCollision(ball1, ball2) {
    let dx = ball1.x - ball2.x;
    let dy = ball1.y - ball2.y;
    let distance = Math.hypot(dx, dy);

    return distance < ball.r + ball.r;
}

function checkCollision() {
    balls.forEach((trainBall, index) => {
        shootBalls.forEach((shootBall, shootBallIndex) => {
            if (checkBallCollision(shootBall, trainBall)) {
                let sourcePoint = {...shootBall};

                // RIGHT
                let rightBall = loadLocation(trainBall.percent + ball.margin);
                let rightFront = shootBall.x - rightBall.x;
                let rightSide = shootBall.y - rightBall.y;
                let rightHypot = Math.hypot(rightFront, rightSide);

                // LEFT
                leftBall = loadLocation(trainBall.percent - ball.margin);
                let leftFront = shootBall.x - leftBall.x;
                let leftSide = shootBall.y - leftBall.y;
                let leftHypot = Math.hypot(leftFront, leftSide);

                let newIndex = index + (leftHypot < rightHypot);

                pushMid(newIndex, shootBall);
                shootBalls.splice(shootBallIndex, 1);

                // + ball.margin * (newIndex === index)
                let newBall = balls[newIndex];
                newBall.percent = trainBall.percent;

                let check = loadLocation(newBall.percent - ball.margin);
                let checkNotCollide = balls[newIndex + 1] ? !checkBallCollision(check, balls[newIndex + 1]) : true;
                if (checkNotCollide) { // Check if current ball before isn't collide with ball that are in behind
                    newBall.percent -= ball.margin;
                } else { // Otherwise
                    newBall.percent = balls[newIndex + 1].percent + ball.margin;
                }

                newBall.updatePosition();

                let startIndex = index - (newIndex === index);
                let newBallCollide = startIndex >= 0 ? checkBallCollision(newBall, balls[startIndex]) : false;

                let collidePoint = loadLocation(trainBall.percent);

                for (let i = startIndex; i >= 0; i--) {
                    let currentBall = balls[i];

                    if (!checkBallCollision(currentBall, balls[i + 1])) {
                        break;
                    }

                    if (newBallCollide) {
                        currentBall.push.target = (newBall.percent + ball.margin * (startIndex - i + 1)) - currentBall.percent;
                        // currentBall.percent = newBall.percent + ball.margin * (startIndex - i + 1);
                    } else {
                        // currentBall.percent += ball.margin;
                        currentBall.push.target = ball.margin;
                    }

                    currentBall.push.direction = 1;

                    if (i === index && newIndex !== index) {
                        collidePoint = loadLocation(currentBall.percent + currentBall.push.target);
                        // console.log('b', currentBall.percent + currentBall.push.target);
                    }
                }

                // console.log(newBall.percent, trainBall.percent);
                // Ganti TrainBall dengan CollidePoint
                // Prob. 1: beda rotasi aneh

                // Pakai trainBall
                // Prob. 1: Ada NAN untuk newindex === index karena trainBall harusnya dipush
                // , getRotation(sourcePoint, trainBall, newBall)
                newBall.startRotateAnimation(trainBall, sourcePoint);

                sound('shoot-collide');
            }
        })
    });

    balls.forEach((ball1, ballIndex) => {
        let ball2 = balls[ballIndex + 1];

        if (ball2) {
            if (checkBallCollision(ball1, ball2) && ball1.direction !== ball2.direction) {
                let index = reverseBallIndexes.indexOf(ballIndex);

                if (index + 1) {
                    checkSameBalls(ballIndex);
                }

                for (let i = ballIndex; i >= 0; i--) {
                    balls[i].directionMode('normal');
                }

                sound('ball-collide');
            }
        }
    });
}

function checkOutOfBounds() {
    shootBalls.forEach((shootBall, index) => {
        if (shootBall.x + ball.r * 2 < 0 || shootBall.y + ball.r * 2 < 0 || shootBall.x > window.innerWidth || shootBall.y > window.innerHeight) {
            shootBalls.splice(index, 1);
        }
    })
}

function checkEnd() {
    if (balls[0].percent >= 1) {
        alert(balls.length);
    }
}

function checkSameBalls(ballIndex) {
    let currentBall = balls[ballIndex];
    let tempIndex = ballIndex;

    let sameBalls = [ballIndex];

    let dirs = [-1, 1];

    dirs.forEach(dir => {
        while (true) {
            tempIndex += dir;

            if ((dir === -1 && tempIndex >= 0) || (dir === 1 && tempIndex < balls.length)) {
                let nextBall = balls[tempIndex];

                if (nextBall.type === currentBall.type && checkBallCollision(nextBall, balls[tempIndex + dir * -1])) {
                    sameBalls.push(tempIndex);
                } else {
                    // console.log(sameBalls);
                    break;
                }
            } else {
                break;
            }
        }

        tempIndex = ballIndex;
    });

    if (sameBalls.length >= 3) {
        // if(currentBall.isDirection('reverse')){
        for (let i = ballIndex; i < balls.length; i++) {
            balls[i].push.direction = -1;
            balls[i].push.target -= ball.margin * scoreMultiplier * 1.5;
        }
        // }
        // console.log(currentBall.direction);

        scoreMultiplier++;
        scores.push(new Score(sameBalls[0], sameBalls[sameBalls.length - 1], sameBalls.length));

        sound('break');

        remove(sameBalls);
    }


    // let sameBalls = [];
    //
    // for (let i = 0; i < balls.length - 1; i++) {
    //     console.log(i);
    //     let currentSameBalls = [];
    //
    //     let index = i;
    //
    //     while (index < balls.length - 1) {
    //         let ball1 = balls[index];
    //         let ball2 = balls[index + 1];
    //
    //         if (ball1.type === ball2.type) {
    //             if (!currentSameBalls.length) currentSameBalls.push(index);
    //
    //             currentSameBalls.push(index + 1);
    //         } else {
    //             // console.log(sameBalls, currentSameBalls);
    //
    //             if (currentSameBalls.length >= 3) {
    //                 sameBalls = [...sameBalls, ...currentSameBalls];
    //             }
    //             currentSameBalls = [];
    //             i = index;
    //             break;
    //         }
    //
    //         index++;
    //     }
    // }
    //
    // remove(sameBalls);
}

function checkDistance() {
    reverseBallIndexes = [];

    for (let i = balls.length - 1; i > 0; i--) {
        let ball1 = balls[i];
        let ball2 = balls[i - 1];

        if (!checkBallCollision(ball1, ball2)) {
            let mode = ball1.type === ball2.type ? 'reverse' : 'stop';

            if (mode === 'reverse') {
                reverseBallIndexes.push(i - 1);
            }

            for (let j = i - 1; j >= 0; j--) {
                balls[j].directionMode(mode);
            }
        }
    }

    // console.log(reverseBallIndexes);

    checkScoreMultiplier();
}

function checkGameOver() {
    if (balls.length) {
        let headBall = balls[0];

        if (headBall.percent >= 1) {
            if (!gameOver) {
                sound('light-trail');
            }

            gameOver = true;
            ball.speed = ball.gameOverSpeed;
            balls.splice(0, 1);

            if (!balls.length) {
                toneSound.lightTrail.tone.disconnect();
                toneSound.lightTrail.pitchShift.pitch = 1.3;

                render = false;
                gameOverContainer.classList.add('active');
            }
        }
    }
}

function checkScoreMultiplier() {
    if (!reverseBallIndexes.length) {
        scoreMultiplier = 0;
    }
}

function checkSpace() {
    let ballSpeed = convert(ball.r);
    let checkPercent = 0;
    let startBall = loadLocation(0);
    let checkBall = startBall;

    while (checkBallCollision(startBall, checkBall)) {
        checkPercent += ballSpeed;
        checkBall = loadLocation(checkPercent);
    }

    ball.margin = checkPercent - ballSpeed * 1.1;
    ball.startMargin = ball.margin * .8;
}
