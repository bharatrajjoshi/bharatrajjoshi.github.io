var imageWidth;
var imageNumber;
var currentImage = 0;
var imageList;
var btnClicked = false;
var prevImage;
var automate;


var sliderDiv = document.getElementById('image-slider');

function Slider() {
    imageList = sliderDiv.children;
    imageNumber = imageList.length;
    imageWidth = imageList[0].children[0].clientWidth;
    sliderDiv.style.width = parseInt(imageWidth * imageNumber) + 'px';

    prev.onclick = function() {
        onClickPrev();
        //btnClicked = true;
        setTimeout(function() {
            setInterval(automate, 3000);
        }, 1500);
    };
    next.onclick = function() {
        onClickNext();
        //btnClicked = true;
        setTimeout(function() {
            setInterval(automate, 3000);;
        }, 1500);
    };

    var automate = setInterval(function() {
        if (btnClicked == false) {
            if (currentImage == 0) {
                prevImage = currentImage;
                slideTo(currentImage + 1);

            } else if (currentImage == imageNumber - 1) {
                prevImage = currentImage;
                slideTo(currentImage - 1);
            } else {
                if (currentImage > prevImage) {
                    prevImage = currentImage;
                    slideTo(currentImage + 1)
                } else {
                    prevImage = currentImage;
                    slideTo(currentImage - 1);
                }
            }
        } else {
            return;
        }
    }, 3000);
}


function slideTo(imageToGo) {
    highlightCurrentImage();
    var numOfImageToGo = Math.abs(imageToGo - currentImage);
    currentPosition = -1 * currentImage * imageWidth;
    direction = currentImage > imageToGo ? 1 : -1;
    var opts = {
        duration: 1000,
        delta: function delta(p) {
            return p;
        },
        step: function step(delta) {
            sliderDiv.style.left = parseInt(currentPosition + direction * delta * imageWidth * numOfImageToGo) + 'px';
        },
        callback: function callback() {
            currentImage = imageToGo;
        }
    };
    animate(opts);
}

function animate(opts) {
    var start = new Date();
    var id = setInterval(function() {
        var timePassed = new Date() - start;
        var progress = timePassed / opts.duration;
        if (progress > 1) {
            progress = 1;
        }
        var delta = opts.delta(progress);
        opts.step(delta);
        if (progress == 1) {
            clearInterval(id);
            opts.callback();
        }
    }, opts.delay || 17);
}

function onClickPrev() {
    if (currentImage == 0) {
        btnClicked = false;
        return;
    } else {
        slideTo(currentImage - 1);
        btnClicked = false;
    }
}

function onClickNext() {
    if (currentImage == imageNumber - 1) {
        btnClicked = false;
        return;
    } else {
        btnClicked = true;
        slideTo(currentImage + 1);
    }

}
//comment

function highlightCurrentImage() {
    var dotList = [];
    var dot1 = document.getElementById('dot1');
    dotList.push(dot1);
    var dot2 = document.getElementById('dot2');
    dotList.push(dot2);
    var dot3 = document.getElementById('dot3');
    dotList.push(dot3);
    var dot4 = document.getElementById('dot4');
    dotList.push(dot4);
    var dot5 = document.getElementById('dot5');
    dotList.push(dot5);

    for (let i = 0; i < dotList.length; i++) {
        if (currentImage == i) {
            dotList[i].style.opacity = 1;
        } else {
            dotList[i].style.opacity = 0.5;
        }
    }
}

window.onload = new Slider();