var wrapper = document.getElementById('wrapper');
var scoreCard = document.createElement('span');
var welcome = document.createElement('div');
scoreCard.className += 'scorecard';


wrapper.style.background = "url('images/background.png') no-repeat";


wrapper.appendChild(scoreCard);

var wrapperWidth = 950;
var wrapperHeight = 581;


var verticalGap;
var horizentalGap;
var gravity = 1;
var score = 0;
var highScore = 0;
var keyPress = false;
var poleHeight;
var timeCount = 0;
var start = false;

wrapper.style.width = wrapperWidth + 'px';
wrapper.style.height = wrapperHeight + 'px';

function Bird() {
    this.x = 300;
    this.y = 300;
    this.gravity = gravity;
    this.height = 30;
    this.width = 30;
    var bird = document.createElement('div');

    this.draw = function () {

        bird.style.width = this.width + 'px';
        bird.style.height = this.height + 'px';
        bird.style.background = "url('images/bird.png') no-repeat";
        bird.style.backgroundSize = '100%';
        bird.style.position = 'absolute';
        bird.style.top = this.y + 'px';
        bird.style.left = this.x + 'px';

        wrapper.appendChild(bird);
    }

    this.move = function () {

        bird.style.top = this.y + 'px';

    }

    this.birdUpDown = function (gravity) {

        this.y += gravity;
    }

    this.checkCollision = function (poleList) {

        for (var i = 0; i < poleList.length; i++) {

            var poleLeft = poleList[i].startPoint;
            var poleTop = 0;
            if (!poleList[i].upperpole) {
                poleTop = wrapperHeight - poleList[i].height;
            }
            var poleWidth = poleList[i].width;
            var poleHeight = poleList[i].height;

            var birdLeft = this.x;
            var birdTop = this.y;
            var birdWIdth = this.width;
            var birdHeight = this.height;

            if (birdLeft < poleLeft + poleWidth && birdLeft + birdWIdth > poleLeft &&
                birdTop < poleTop + poleHeight && birdTop + birdHeight > poleTop) {
                return true;
            }
        }

        if (birdTop < 0 || birdTop + birdHeight > wrapperHeight) {
            return true;
        }

        return false;
    }
}




function Pole(height, upperpole) {
    this.startPoint = parseInt(wrapperWidth - 200);

    this.x = this.startPoint;
    this.width = 50;
    this.height = height;
    this.upperpole = upperpole;

    var pole = document.createElement('div');

    this.draw = function () {

        pole.style.width = this.width + 'px';
        pole.style.height = this.height + 'px';
        pole.style.background = '#86c656';
        pole.style.position = 'absolute';
        pole.style.left = this.startPoint;
        if (this.upperpole == true) {
            pole.style.top = '0px';
            pole.style.borderBottomWidth = 100 + 'px';
            pole.style.borderBottom = '5px solid red';
        } else {

            pole.style.bottom = '0px';
            pole.style.borderTopWidth = 100 + 'px';
            pole.style.borderTop = '5px solid red';

        }

        wrapper.appendChild(pole);
    }

    this.move = function () {
        pole.style.left = this.startPoint + 'px';
        this.startPoint -= 1;
    }

    this.getElement = function () {
        return pole;
    }
}


function poleList() {
    this.poleArray = [];

    this.add = function (pole) {
        this.poleArray.push(pole);
    }

    this.remove = function () {
        for (var i = 0; i < 2; i++) {
            wrapper.removeChild(this.poleArray[0].getElement());
            this.poleArray.splice(0, 1);
        }
    }

    this.getAll = function () {
        return this.poleArray;
    }
}

function Game() {
    welcome.remove();
    var bird = new Bird();
    bird.draw()
    bird.move();

    poleArray = new poleList();

    var pole = new Pole();

    var init = setInterval(function () {

        var collision = bird.checkCollision(poleArray.getAll());
        if (collision) {

            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            gameOver();
           
            clearInterval(init);
            document.addEventListener('keydown', function () {
                window.location.reload()
            });
        } else {

            bird.move();

            if (score < 7) {
                poleHeight = Math.ceil(Math.random() * (wrapperHeight - 250));
                verticalGap = 120;
                horizentalGap = 300;
            } else if (score >= 7 && score < 15) {
                poleHeight = Math.ceil(Math.random() * (wrapperHeight - 150));
                verticalGap = 90;
                horizentalGap = 230;
            } else {
                poleHeight = Math.ceil(Math.random() * (wrapperHeight - 75));
                verticalGap = 90;
                horizentalGap = 150;
            }

            if (timeCount % horizentalGap == 0) {
                var poleTop = new Pole(poleHeight, true);
                poleTop.draw();
                poleArray.add(poleTop);

                var poleBottom = new Pole(wrapperHeight - (poleHeight + verticalGap), false);
                poleBottom.draw();
                poleArray.add(poleBottom);
            }


            for (var i = 0; i < poleArray.getAll().length; i++) {
                poleArray.getAll()[i].move();
                if (i % 2 == 1) {
                    if (poleArray.getAll()[i].startPoint + poleArray.getAll()[i].width == bird.x) {
                        score++;
                        scoreCard.textContent = 'Score:' + score;
                
                    }
                }

                if (poleArray.getAll()[i].startPoint == 0) {
                    poleArray.remove();

                }
            }


            document.addEventListener('keydown', function () {
                keyPress = true;
            });

            document.addEventListener('keyup', function () {
                keyPress = false;
            });

            if (keyPress == true) {
               
                bird.birdUpDown(-bird.gravity * 2);
            } else {
                bird.birdUpDown(bird.gravity * 1.5);
            }

            timeCount++;

        }
    }, 10);
}

function gameOver() {
    var gameOver = document.createElement('div');
    gameOver.className += 'gameover';

    var Heading = document.createElement('h1');
    Heading.textContent = 'GAME OVER';

    var scoreBoard = document.createElement('h2');
    scoreBoard.textContent = "Your Score: " + score;

    var highscoreBoard = document.createElement('h2');
    highscoreBoard.textContent = "High Score: " + localStorage.getItem('highScore');

    var pressKey = document.createElement('h2');
    pressKey.textContent = "Press any key to re-start";

    gameOver.appendChild(Heading);
    gameOver.appendChild(scoreBoard);
    gameOver.appendChild(highscoreBoard);
    gameOver.appendChild(pressKey);

    wrapper.appendChild(gameOver);
}

function welcomeScreen() {
    welcome.className += 'welcome';

    var welcomeText = document.createElement('h2');
    welcomeText.textContent = 'WELCOME';

    var gameName = document.createElement('h1');
    gameName.textContent = "Flappy Bird";

    var highscoreBoard = document.createElement('h2');
    highscoreBoard.textContent = "High Score: " + localStorage.getItem('highScore');

    var pressKey = document.createElement('h2');
    pressKey.textContent = "Press any key to Start";

    welcome.appendChild(welcomeText);
    welcome.appendChild(gameName);
    welcome.appendChild(highscoreBoard);
    welcome.appendChild(pressKey);

    wrapper.appendChild(welcome);
}

function startGame() {
    welcomeScreen();
    var eventHandler = function () {
        welcome.style.display = 'none';
        Game();
        document.removeEventListener('keydown', eventHandler)
    }
    setTimeout(function () {
        document.addEventListener('keydown', eventHandler);
    }, 1);
}

window.onload = startGame();