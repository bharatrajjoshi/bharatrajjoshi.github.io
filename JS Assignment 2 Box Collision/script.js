const ballMinSize = 10;
const ballMaxSize = 36;
var directionArray = [-1, 1];
var balls = [];
const speed = 12;

const CONTAINER_WIDTH = 1000;
const CONTAINER_HEIGHT = 600;

const BALL_CONSTRAINT_X = CONTAINER_WIDTH - (ballMaxSize);
const BALL_CONSTRAINT_Y = CONTAINER_HEIGHT - (ballMaxSize);

function getRandomInt(min, max) {
	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}

function generateRandom(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}
  
function Ball(x, y, ballRadius, color, ballDirectionX, ballDirectionY, parent) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.element;
    this.ballRadius = ballRadius;
    this.ballDirectionX = ballDirectionX;
    this.ballDirectionY = ballDirectionY;



    this.createBall = function() {

        this.element = document.createElement('div');
        this.element.classList.add('ball');
        parent.appendChild(this.element);
    }

    this.styleBall = function() {
        this.element.style.top = this.y + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.width = ballRadius * 2 + 'px';
        this.element.style.height = ballRadius * 2 + 'px';
        this.element.style.borderRadius = 50 + '%';
        this.element.style.backgroundColor = this.color;
    }


    this.update = function() {
        this.x = this.x + speed * this.ballDirectionX / 11 ;
        this.y = this.y + speed * this.ballDirectionY / 11 ;
    }

    this.reverseUpdate = function() {
        this.ballDirectionX = -this.ballDirectionX;
        this.ballDirectionY = -this.ballDirectionY;

        this.x = this.x + speed * this.ballDirectionX / 11;
        this.y = this.y + speed * this.ballDirectionY / 11;

    }

}

function Game(ballNum) {
    var gameInterval;

    this.init = function() {
        var containerDiv = document.getElementById('container');


        for (var i = 0; i < ballNum; i++) {
            var noCollision = false;
            do {
                var directionX = directionArray[Math.floor((Math.random() * 2))];
                var directionY = directionArray[Math.floor((Math.random() * 2))];
                var randomX = getRandomInt(0, BALL_CONSTRAINT_X - 50);
                var randomY = getRandomInt(0, BALL_CONSTRAINT_Y - 50);
                var randomColor = getRandomColor();
                var radius = getRandomInt(ballMinSize, ballMaxSize);
                var ball = new Ball(randomX, randomY, radius, randomColor, directionX, directionY, containerDiv);

                noCollision = checkCollision(ball);
            } while (noCollision)
            ball.createBall();
            ball.styleBall();
            balls.push(ball);
        }

        gameInterval = setInterval(this.move, 08);
    }

    function checkCollision(obj) {
        //this function checks collision of balls
        for (let i = 0; i < balls.length; i++) {
            if (balls[i] == obj) {
                continue;
            }
            var xc1 = obj.x;
            var yc1 = obj.y;
            var xc2 = balls[i].x;
            var yc2 = balls[i].y;
            var radius1 = obj.ballRadius;
            var radius2 = balls[i].ballRadius;
            var dx = xc1 - xc2;
            var dy = yc1 - yc2;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= (radius1 + radius2)) {
                return true;
            }

        }
        return false;
    }


    this.move = function() {
        balls.forEach(function(ball) {

            //this loop checks collision of balls
            if (checkCollision(ball)) {
                this.ballDirectionX = -this.ballDirectionX;
                ball.ballDirectionX = -ball.ballDirectionX;
                this.ballDirectionY = -this.ballDirectionY;
                ball.ballDirectionY = -ball.ballDirectionY;
            }
            //these conditions check boundary collision
            if (ball.x + ball.ballRadius * 2 >= parseInt(CONTAINER_WIDTH) || ball.x < 0 ||
                ball.y + ball.ballRadius * 2 >= parseInt(CONTAINER_HEIGHT) || ball.y < 0) {
                ball.reverseUpdate();
                ball.styleBall();
            } else {
                ball.update();
                ball.styleBall();
            }
        });
    }
}

new Game(25).init();