var colors = ["red","blue","green","yellow"];
var pattern= [];
var clickedBtn=[];
var level=0;
var start=false;

function nextSequence(){
    clickedBtn=[];
    level +=1;
    $("#level-title").text("Level " + level); 
    var randomNumber = Math.floor(Math.random() * 4);
    var colorSelected= colors[randomNumber];
    pattern.push(colorSelected);
    console.log(randomNumber);
    $("#"+colorSelected).fadeIn("fast").fadeOut("fast").fadeIn("fast");
    playSound(colorSelected);
}

function playSound(color){
    var sound = new Audio("sounds/"+color+".mp3");
    sound.play();
}

$(".btn").click(function(){
    var idcolor= $(this).attr("id");
    clickedBtn.push(idcolor);
    playSound(idcolor);
    animatedPress(idcolor);
    checkAnswer(clickedBtn.length-1);
    console.log(clickedBtn);
});

function animatedPress(btnp){
    $("#"+btnp).addClass("pressed");
    setTimeout(function(){
        $("#"+btnp).removeClass("pressed");
    },100)
}

$(document).keydown(function() {
    if(!start){
        $("#level-title").text("Level " + level); 
        nextSequence();
        start=true;
    }     
});

function checkAnswer(lvl){
    if(clickedBtn[lvl]==pattern[lvl]){
        console.log("success");
        if(clickedBtn.length == pattern.length){
            setTimeout(function(){
                nextSequence();
            },1000)
        }    
    }else{
        console.log("wrong");
        playSound("wrong")
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200)
        $("#level-title").text("Game over, Press Any Key to Restart");
        restarGame();
    }
}

function restarGame(){
    start=false;
    level=0;
    pattern=[];
}