
function Box (parentElement) {
	this.x = 10;
	this.y = 10;
	this.speed = 1;
	this.dx = 2;
	this.dy = 2;
	this.width = 50;
	this.height = 50;
	this.element = null;
	this.parentElement = parentElement;
	this.hasClicked = false;
	var that = this;

	this.init = function () {

		var box = document.createElement('div');
		box.style.height = this.height + 'px';
		box.style.width = this.width + 'px';
		box.style.backgroundImage = 'url(images/ant.gif)';
		box.style.backgroundSize = 'cover';
		box.classList.add('box');
		this.parentElement.appendChild(box);
		this.element = box;
		var factor = (Math.floor(getRandomNumber(1, 3)) == 1)?1:-1;
		this.dx = factor * Math.floor(getRandomNumber(3,8));
		this.dy = factor * Math.floor(getRandomNumber(3,8));
		box.addEventListener('click', this.boxClicked.bind(this) );
	}

	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	}

	this.draw = function () {
		this.element.style.left = this.x + 'px';
		this.element.style.top = this.y + 'px';
	}

	this.move = function () {

		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}

	this.boxClicked = function (e) {
		this.element.classList.add('clicked');
		this.hasClicked = true;
		
	}

	this.checkCollision = function (boxes) {
		for(var i = 0; i < boxes.length; i++) {

			// ignore checking collision with self
			if( boxes[i].x === this.x && boxes[i].y === this.y ) continue;

			var rad1 = this.width/2;
			var center1 = {
				x: (this.x + rad1),
				y: (this.y + rad1)
			};

			var rad2 = boxes[i].width/2;
			var center2 = {
				x: (boxes[i].x + rad2),
				y: (boxes[i].y + rad2)
			};
			var dx = center1.x - center2.x;
			var dy = center1.y - center2.y;
			var distance = Math.sqrt(dx * dx + dy * dy);

			if( distance < rad1 + rad2) {
				// collision detected
				this.speed = -this.speed;
				this.dx = -this.dx;
				this.dy = -this.dy;
				
			}

		}		
	}

}

// Game Class/Constructor Function

function Game (parentElement, boxCount) {
	
	var boxes = [];
	var MAX_WIDTH = 500;
	var MAX_HEIGHT = 500;
	var score = 0;
	var movingInterval = null;
	this.parentElement = parentElement;
	this.boxCount = boxCount || 50;


	this.startGame = function () {
		// create number of boxes
		for ( var i = 0; i < this.boxCount; i++ ) {
			var box = new Box(parentElement);
			box.init();
			
			// Unique X,Y for preventing collision on spawn
			this.setUniqueBoxPosition(box);
			box.draw();
			boxes.push(box);			
		}

		// Move All Boxes every 100 milli seconds
		movingInterval = setInterval(this.moveBoxes.bind(this), 100);
	}

	this.checkUniqueBoxPosition = function (x, y) {
		var unique = true;
		var marginLR = 10;
		var marginTB = 10;

		for (var i = 0; i < boxes.length; i++) {
			if(
				x >= (boxes[i].x - marginLR) && x <= (boxes[i].x + boxes[i].width + marginLR) &&
				y >= (boxes[i].y - marginTB) && y <= (boxes[i].y + boxes[i].height + marginTB)
				
			) {
				unique = false;
				break;
			}
		}
		return unique;
	}

	this.setUniqueBoxPosition = function (box) {
		var uniqueX;
		var uniqueY;
		// var counter=0;
		while ( true ) {
			// console.log('unique check counter', counter++);
			uniqueX = getRandomNumber(0, MAX_WIDTH - box.width);
			uniqueY = getRandomNumber(0, MAX_HEIGHT - box.height);
			
			var checkUniqueTL = this.checkUniqueBoxPosition(uniqueX,uniqueY); 
			var checkUniqueTR = this.checkUniqueBoxPosition(uniqueX + box.width, uniqueY); 
			var checkUniqueBL = this.checkUniqueBoxPosition(uniqueX,uniqueY + box.height); 
			var checkUniqueBR = this.checkUniqueBoxPosition(uniqueX + box.width,uniqueY + box.height); 
			
			if(checkUniqueTL && checkUniqueTR && checkUniqueBL && checkUniqueBR) {
				box.setPosition(uniqueX, uniqueY);
				break;
			}
		}
	}

	this.moveBoxes = function() {
		// If No Boxes remaining then GoTo Game Over Screen
		if(boxes.length === 0) {
			clearInterval(movingInterval);
			this.parentElement.innerHTML = '<h2>YOU WON</h2><h3>Score : ' + score + '</h3>';
			console.log("YOU WON : SCORE ==> ",score);
		}

		var clickedBoxesIndices = [];

		for( var i = 0; i < boxes.length; i++) {
			// remove boxes element that has been clicked and increase score
			if(boxes[i].hasClicked) {
				// boxes[i].element.remove();
				boxes[i].element.style.backgroundImage = 'url("images/blood.png")';
				boxes[i].element.style.backgroundSize = 'contain';

				clickedBoxesIndices.push(i);
				score = score + 10;
				continue;
			}

			boxes[i].move();
			// Check  boxes collision
			boxes[i].checkCollision(boxes);

			// Handle Boundary Collision
			// x-direction
			if ( boxes[i].x <= 0 ) {
				boxes[i].speed = Math.abs(boxes[i].speed);
				boxes[i].dx = Math.abs(boxes[i].dx);
			}
			if ( boxes[i].x >= MAX_WIDTH - boxes[i].width ) {
				boxes[i].speed = -Math.abs(boxes[i].speed);
				boxes[i].dx = -Math.abs(boxes[i].dx);
			}
            //y direction
			if ( boxes[i].y <= 0 ) {
				boxes[i].speed = Math.abs(boxes[i].speed);
				boxes[i].dy = Math.abs(boxes[i].dy);
			}
			if ( boxes[i].y >= MAX_WIDTH - boxes[i].height ) {
				boxes[i].speed = -Math.abs(boxes[i].speed);
				boxes[i].dy = -Math.abs(boxes[i].dy);
			}

            
		} // for loop end

		// Remove clicked Box instances from boxes array
		clickedBoxesIndices.forEach(function(i){
			boxes.splice(i, 1);
		});
		clickedBoxesIndices = [];
	}
}

// Global Utility Function
function getRandomNumber ( min, max ) {
	return Math.random() * (max - min) + min;
}


// Main
var parentElement = document.getElementById('app');

new Game(parentElement, 10).startGame();

