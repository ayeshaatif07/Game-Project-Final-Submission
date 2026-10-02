/* Aayesha Atif

Creating a game project centered around SpongeBob was a nostalgic journey for me, as it allowed me to relive the joy of one of my favorite childhood cartoons. The game features various extensions, including sound effects to enhance the gaming experience, platforms which are named sticks in my platform for SpongeBob to navigate through, and enemies to add challenges and excitement.
One of the most challenging aspects of the project was implementing the platform jump code. Ensuring that SpongeBob's jumps were responsive and accurately interacted with the platforms required careful attention to detail and testing. Additionally, the flagpole(KrustyCrab) check function, which determines if SpongeBob has reached the end of the level, presented its own set of challenges. Ensuring its accuracy and efficiency while accounting for various game states was a significant task.
Throughout the development process, I learned and practiced several valuable skills.However, despite these challenges, I learned and practiced various skills throughout the project. I honed my ability to implement logic in code, particularly when it came to handling complex game mechanics. Creating constructor functions allowed me to efficiently organize and manage different aspects of the game, while also improving code readability. Additionally, I gained experience in refactoring my code to make it more presentable and maintainable, ensuring that it could be easily understood and modified in the future.
Overall, this project allowed me to combine my passion for SpongeBob with my interest in game development, while also providing valuable opportunities for skill-building and learning.

- References:
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
  https://freesound.org/

//sounds chosen from this link
//https://www.101soundboards.com/boards/20194-spongebob-squarepants-sounds

//reference of gradient in background = https://www.w3schools.com/graphics/canvas_gradients.asp

*/ 

// game character variables
var bob_x;
var bob_y;

var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

//houses in the background 

var patrick;
var patrick_x;

var sponge;
var sponge_x;

var squid;
var squid_x;

var road;
var road_x;

var bubble;
var bubble_x;

var canyon;
var patty;

var game_score;

//flagpole
var KrustyCrab;

var cameraPosX;

//lives
var gary;

//sound variables 
var jumpSound;
var levelCompleteSound;
var bitePattySound; 
var gameOverSound;
var fallingCanyonSound;
var backgroundSound;

//platforms
var sticks;

//enemies
var planktons;

function preload()
{
    soundFormats('mp3','wav');

    //load your sounds here

    jumpSound = loadSound('assets/jump_sound.mp3');
    jumpSound.setVolume(0.4);

    levelCompleteSound = loadSound('assets/a_few_inches_later.mp3');
    levelCompleteSound.setVolume(0.5);

    gameOverSound = loadSound('assets/i_have_no_talent.mp3');
    gameOverSound.setVolume(0.1);

    bitePattySound = loadSound('assets/patty_bite.mp3');
    bitePattySound.setVolume(0.5);

    fallingCanyonSound = loadSound('assets/canyon_falling.mp3');
    fallingCanyonSound.setVolume(0.5);

    backgroundSound = loadSound('assets/theme song.mp3');
    backgroundSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
	backgroundSound.loop();
	
	floorPos_y = height * 3/4;

	start_Bob_World();
    gary = 3;
}


function draw()
{
    cameraPosX = bob_x - width/2;

    ///////////DRAWING CODE//////////
    const Canvas = document.getElementById("defaultCanvas0");
    const ctx = canvas.getContext("2d");

    // Create gradient
    const grd = ctx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "MediumSpringGreen");
    grd.addColorStop(0.5,"SkyBlue")
    grd.addColorStop(1, "DeepSkyBlue");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1024, 576);

    //score 
    fill(225, 0, 0);
    noStroke();
    textSize(29);
    text("score: " + game_score , 20, 40);

push();
translate(-cameraPosX, 0);

    //patricks house
    locatePatricksHouse();

    //spongebobs house
    locateSpongebobsHouse();

    //squidwards house
    locateSquidsHouse();
    
pop();

    //top ground and road
    locateGround();
	
push();
translate(-cameraPosX, 0);

    //flagpole draw 
    renderKrustyCrab(); 

	//footpaths
	locateFootpaths();

    //bubbles
    locateBubbles();
	
	//platforms
	for(var i = 0; i < sticks.length; i++)
        {
            sticks[i].draw();
        }

    // collectable item
    for(var i = 0; i < patty.length; i++)
        {
            if(patty[i].isFound == false)
            {
                locatePatty(patty[i]);
                checkpatty(patty[i]);
            }
        }

    //canyon 
    for(var i = 0; i < canyon.length; i++)
    {
            locateCanyon(canyon[i]);
    }
	
    //the game character
    locateSquarePants();

    for(var i = 0; i < planktons.length; i++)
    {
        planktons[i].draw();

        var isContact = planktons[i].checkContact(bob_x, bob_y);
        if(isContact)
        {
            if(gary > 0)
            {
                gary -= 1
                start_Bob_World();
                break;
            } 
        }   
    }

pop();

    checkPlayerDie();

    //lives
    for (var i = 0; i < gary; i++)  
    {
        stroke(60);
        fill(72, 200, 255);
        ellipse(37 + i * 60, 97, 45, 10); 

        fill(240, 128, 128);
        ellipse(40 + i * 60, 83, 27, 32); 

        fill(72, 200, 255);
        beginShape();
        vertex(29 + i * 60, 95); 
        vertex(30 + i * 60, 77);
        vertex(25 + i * 60, 77);
        vertex(26 + i * 60, 95);
        endShape();
        beginShape();
        vertex(19 + i * 60, 94); 
        vertex(19 + i * 60, 77);
        vertex(23 + i * 60, 77);
        vertex(22 + i * 60, 95);
        endShape();

        fill(154, 205, 50);
        ellipse(20 + i * 60, 76, 10); 
        ellipse(28 + i * 60, 76, 10); 
        fill(30);
        ellipse(18 + i * 60, 76, 4, 6); 
        ellipse(26 + i * 60, 76, 4, 6); 
    }

    if(gary <  1)
    {
        fill(255);
        textSize(50);
        text("GAME OVER! ", width/2.5 , height/2);
        textSize(30);
        text("PRESS SPACE TO CONTINUE. ",350,315);
		gameOverSound.play();
		return;
	}
	
	// LEVEL COMPLETE INTERACTION
    if(KrustyCrab.isReached == true)
    {
        fill(255);
        textSize(45);
        text("LEVEL COMPLETE! ", width/3 , height/2);
        textSize(30);
        text("PRESS SPACE TO CONTINUE. ",340,315);
        return;
    }

	///////////INTERACTION CODE//////////
	// conditional statements to move the game character

    if(isRight == true && KrustyCrab.isReached == false)
        {
            bob_x += 3;
        }
    if(isLeft == true && KrustyCrab.isReached == false)
        {
            bob_x -= 3;
        }

    if(bob_y < floorPos_y + 55 )
        {
			var isContact = false;
			for(var i = 0; i < sticks.length; i++)
				{
					if(sticks[i].checkContact(bob_x, bob_y) == true)
						{
							isContact = true;
                            isPlummeting = false;
                            isFalling = false;
							break;
						}
				}
			if(isContact == false)
				{
					bob_y += 5;
					isFalling = true;
					isPlummeting = true;
				}
        }
    else 
        {
            isFalling = false;
            isPlummeting = false; 
        }
    
    //canyon statement for falling
    for(var i = 0; i < canyon.length; i++)
    {
        //locateCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

    //game end interaction
    if(KrustyCrab.isReached == false)
    {
        checkKrustyCrab();
    }
}
// end of draw()

function keyPressed()
{
    //if statements to control the animation of the character
    //keys are pressed
    if(keyCode == 68)
        {
                isRight = true;
        }
    if(keyCode == 65)
        {
            isLeft = true;
        }
    if(keyCode == 87 && isPlummeting == false)
        {
            bob_y -= 180;
            jumpSound.play();
        }

    //space restarts the game after game over or level complete
    if(keyCode == 32 && (gary < 1 || KrustyCrab.isReached))
        {
            gary = 3;
            start_Bob_World();
        }
}

function keyReleased()
{
    //keys are released
    if(keyCode == 68)
        {
            isRight = false;
        }
    if(keyCode == 65)
        {
            isLeft = false;
        }
}

function locatePatricksHouse()
{
	for(var i = 0; i < patrick_x.length; i++)
	{
        noStroke();
        fill(255,195,0)
        rect(patrick_x[i] - 10, patrick.y - 172 ,8,50);
        rect(patrick_x[i] - 35, patrick.y - 160 ,58,5);

        beginShape();
        vertex(patrick_x[i] - 32,patrick.y - 168);
        vertex(patrick_x[i] - 32,patrick.y - 148);
        vertex(patrick_x[i] - 49,patrick.y - 159);
        endShape();

        rect(patrick_x[i] + 3 ,patrick.y - 168,2,20);
        rect(patrick_x[i] + 10,patrick.y - 168,2,20);

        stroke(165,48,90);
        strokeWeight(4);
        fill(137, 56, 67);
        ellipse(patrick_x[i] ,patrick.y ,280,250);

        noStroke();
        fill(47,95,81);
        rect(patrick_x[i] - 42,patrick.y + 40,30,576);
	}
}

function locateSpongebobsHouse()
{    
	for(var i = 0; i < sponge_x.length; i++)
    {
        //pipe
        stroke(0);
        strokeWeight(2);
        fill(176,196,222);
        ellipse(sponge_x[i] + 101, sponge.y - 120,20);
        rect(sponge_x[i] + 71, sponge.y - 125,25,15);
        rect(sponge_x[i] + 95, sponge.y - 154,15,30);


        stroke(255,100,0);
        fill(255,140,0);
        ellipse(sponge_x[i] ,sponge.y,200,350);

        stroke(150,50,0);
        strokeWeight(1);
        line(sponge_x[i] - 25 , sponge.y - 173,sponge_x[i] + 72 , sponge.y - 120);
        line(sponge_x[i] - 57 , sponge.y - 147,sponge_x[i] + 91 , sponge.y - 72);
        line(sponge_x[i] - 75 , sponge.y - 119,sponge_x[i] + 98 , sponge.y - 18);
        line(sponge_x[i] - 90 , sponge.y - 83 ,sponge_x[i] + 97 , sponge.y + 27);
        line(sponge_x[i] - 99 , sponge.y - 42 ,sponge_x[i] + 23 , sponge.y + 38);
        line(sponge_x[i] - 102, sponge.y - 2  ,sponge_x[i] - 40 , sponge.y + 38);
        line(sponge_x[i] - 100, sponge.y + 36 ,sponge_x[i] + 42 , sponge.y - 160);
        line(sponge_x[i] - 55 , sponge.y + 38 ,sponge_x[i] + 65 , sponge.y - 135);
        line(sponge_x[i] - 5  , sponge.y + 37 ,sponge_x[i] + 83 , sponge.y - 93);
        line(sponge_x[i] + 43 , sponge.y + 38 ,sponge_x[i] + 98 , sponge.y - 40);
        line(sponge_x[i] - 101, sponge.y - 29 ,sponge_x[i] + 7  , sponge.y - 178);
        line(sponge_x[i] - 77 , sponge.y - 114,sponge_x[i] - 32 , sponge.y - 168);

        //door
        stroke(30);
        strokeWeight(3);
        fill(176,196,222);
        rect(sponge_x[i] - 33,sponge.y - 33,65,95,80);
        rect(sponge_x[i] - 23,sponge.y - 22,45,75,80);

        //leaves
        stroke(0,150,0);
        fill(0,180,0);
        triangle(sponge_x[i] - 38, sponge.y - 149,
                 sponge_x[i] - 28, sponge.y - 154,
                 sponge_x[i] - 70, sponge.y - 248);
        triangle(sponge_x[i] - 26, sponge.y - 149,
                 sponge_x[i] - 8 , sponge.y - 157,
                 sponge_x[i] - 60, sponge.y - 248);
        triangle(sponge_x[i] - 18, sponge.y - 157,
                 sponge_x[i]     , sponge.y - 159,
                 sponge_x[i] - 29, sponge.y - 260);
        triangle(sponge_x[i] - 5 , sponge.y - 155,
                 sponge_x[i] + 7 , sponge.y - 156,
                 sponge_x[i]     , sponge.y - 263);
        triangle(sponge_x[i] + 5 , sponge.y - 158,
                 sponge_x[i] + 16, sponge.y - 159,
                 sponge_x[i] + 17, sponge.y - 248);
        triangle(sponge_x[i] + 11, sponge.y - 157,
                 sponge_x[i] + 26, sponge.y - 154,
                 sponge_x[i] + 45, sponge.y - 253);

        //windows
        stroke(30); 
        fill(176,196,245);
        ellipse(sponge_x[i] - 45,sponge.y - 65,50);
        ellipse(sponge_x[i] + 71,sponge.y - 15,40)
        fill(180,50,10);
        ellipse(sponge_x[i] - 45,sponge.y - 65,30);
        ellipse(sponge_x[i] + 71,sponge.y - 15,20);
    }
}

function locateSquidsHouse()
{
	for(var i = 0; i < squid_x.length; i++)
    {
        stroke(30);
        strokeWeight(2.5);
        fill(80);
        rect(squid_x[i] - 10, squid.y + 95 ,150,200);
        rect(squid_x[i] ,squid.y,130,100,5);

        triangle(squid_x[i] + 35 , squid.y + 207,
                 squid_x[i] + 100, squid.y + 207,
                 squid_x[i] + 68 , squid.y + 85);

        rect(squid_x[i] - 15, squid.y + 83 ,158,30,3);
        rect(squid_x[i] - 32, squid.y + 122,23,80);
        rect(squid_x[i] + 140,squid.y + 122,23,80);

        ellipse(squid_x[i] + 25 , squid.y + 142 ,50);
        ellipse(squid_x[i] + 25 , squid.y + 142 ,20);
        ellipse(squid_x[i] + 112, squid.y + 142 ,50);
        ellipse(squid_x[i] + 112, squid.y + 142 ,20);

        fill(160,82,45);
        rect(squid_x[i] + 43, squid.y + 236,50,70,80);
    }
}

function locateSquarePants() // render and move the main game character Sponge Bob
{
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 17,bob_y - 45,35,15);

        //pants
        fill(139,69,19);
        rect(bob_x - 17,bob_y - 31,35,10);


        beginShape();
            vertex(bob_x + 15, bob_y - 24);
            vertex(bob_x + 17, bob_y - 16);
            vertex(bob_x + 5 , bob_y - 16);
            vertex(bob_x + 4, bob_y - 24);
        endShape();

        beginShape();
            vertex(bob_x - 4, bob_y - 24);
            vertex(bob_x - 3, bob_y - 16);
            vertex(bob_x - 13, bob_y - 16);
            vertex(bob_x - 14, bob_y - 24);
        endShape();
        
        fill(0);
        rect(bob_x - 14,bob_y - 28,29,2);

        //legs 
        stroke(0);
        strokeWeight(1);
        fill(255,255,39);

        beginShape();
            vertex(bob_x + 15, bob_y - 16);
            vertex(bob_x + 17, bob_y - 12);
            vertex(bob_x + 23, bob_y - 10);
            vertex(bob_x + 23, bob_y - 7);
            vertex(bob_x + 14, bob_y - 10);
            vertex(bob_x + 11, bob_y - 16);
        endShape();

        beginShape();
            vertex(bob_x - 4, bob_y - 16);
            vertex(bob_x - 2, bob_y - 12);
            vertex(bob_x + 4, bob_y - 10);
            vertex(bob_x + 4, bob_y - 7);
            vertex(bob_x - 5, bob_y - 10);
            vertex(bob_x - 8, bob_y - 16);
        endShape();

        //shoes
        fill(0);
        ellipse(bob_x + 25 ,bob_y - 7,6);
        ellipse(bob_x + 3 ,bob_y - 8,6);

        ellipse(bob_x + 20,bob_y - 4,6);
        ellipse(bob_x - 2,bob_y - 5,6);

        //arms
        stroke(0);
        fill(255,255,39);
        
        // left arm
        beginShape();
           vertex(bob_x - 20, bob_y - 49);
           vertex(bob_x - 32, bob_y - 49);
           vertex(bob_x - 32, bob_y - 61);
           vertex(bob_x - 36, bob_y - 61);
           vertex(bob_x - 36, bob_y - 45);
           vertex(bob_x - 21, bob_y - 45);
        endShape();

        // right arm
        beginShape();
           vertex(bob_x + 23, bob_y - 44);
           vertex(bob_x + 32, bob_y - 44);
           vertex(bob_x + 32, bob_y - 35);
           vertex(bob_x + 36, bob_y - 35);
           vertex(bob_x + 36, bob_y - 48);
           vertex(bob_x + 23, bob_y - 48);
        endShape();

        //hands
        ellipse(bob_x + 34,bob_y - 34,5);
        ellipse(bob_x - 34,bob_y - 60,5);

        //sleeves
        stroke(0);
        fill(255);
        // Triangle 1 
        triangle(bob_x + 16, bob_y - 49, 
                 bob_x + 23, bob_y - 51,
                 bob_x + 23, bob_y - 44);

        // Triangle 2
        triangle(bob_x - 12, bob_y - 48, 
                 bob_x - 23, bob_y - 50,
                 bob_x - 23, bob_y - 42);

        //tie
        stroke(255,0,0);
        strokeWeight(1);
        fill(250,0,0);
        triangle(bob_x - 3,bob_y - 42,
                 bob_x + 7,bob_y - 42,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 24);

        //body
        noStroke();
        fill(255,255,39);
        rect(bob_x - 17,bob_y - 75,35,30);

        //left vertical circles
        ellipse(bob_x - 17,bob_y - 43,7);
        ellipse(bob_x - 17,bob_y - 49,7);
        ellipse(bob_x - 17,bob_y - 55,7);
        ellipse(bob_x - 17,bob_y - 61,7);
        ellipse(bob_x - 17,bob_y - 67,7);
        ellipse(bob_x - 17,bob_y - 72,7);
        ellipse(bob_x - 17,bob_y - 76,7);
        
        //right vertical circles
        ellipse(bob_x + 17,bob_y - 43,7);
        ellipse(bob_x + 17,bob_y - 49,7);
        ellipse(bob_x + 17,bob_y - 55,7);
        ellipse(bob_x + 17,bob_y - 61,7);
        ellipse(bob_x + 17,bob_y - 67,7);
        ellipse(bob_x + 17,bob_y - 72,7);
        
        //bottom circles
        ellipse(bob_x - 12,bob_y - 43,7);
        ellipse(bob_x - 6 ,bob_y - 43,7);
        ellipse(bob_x     ,bob_y - 43,7);
        ellipse(bob_x + 6 ,bob_y - 43,7);
        ellipse(bob_x + 12,bob_y - 43,7);
        ellipse(bob_x + 18,bob_y - 43,7);
        
        // top circles
        ellipse(bob_x - 12,bob_y - 76,7);
        ellipse(bob_x - 6 ,bob_y - 76,7);
        ellipse(bob_x     ,bob_y - 76,7);
        ellipse(bob_x + 6 ,bob_y - 76,7);
        ellipse(bob_x + 12,bob_y - 76,7);
        ellipse(bob_x + 18,bob_y - 76,7);

        //mouth
        stroke(0);
        fill(80);
        arc(bob_x + 1,bob_y - 51,18,9,0 ,PI);
        noFill();
        arc(bob_x + 1,bob_y - 53,18,5,0 ,PI);

        //teeth
        fill(255);
        rect(bob_x - 4,bob_y - 51,4,4);
        rect(bob_x + 2,bob_y - 51,4,4);

        //nose
        fill(255,255,39);
        ellipse(bob_x - 1,bob_y - 60,3,4);

        //eyes
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x - 5,bob_y - 67,10,11);
        ellipse(bob_x + 7,bob_y - 67,10,11);

        strokeWeight(0.5);
        fill(173,216,230);
        ellipse(bob_x - 6,bob_y - 67,5);
        ellipse(bob_x + 6,bob_y - 67,5);

        stroke(0);
        strokeWeight(2.5);
        point(bob_x - 6,bob_y - 67);
        point(bob_x + 6,bob_y - 67);

        //eyelashes
        strokeWeight(1)
        line(bob_x - 9,bob_y - 72,bob_x - 11,bob_y - 76);
        line(bob_x - 6,bob_y - 73,bob_x - 6 ,bob_y - 77);
        line(bob_x - 3 ,bob_y - 73 ,bob_x - 1 ,bob_y - 77);
        line(bob_x + 4 ,bob_y - 72 ,bob_x + 2 ,bob_y - 77);
        line(bob_x + 7 ,bob_y - 72 ,bob_x + 7 ,bob_y - 78);
        line(bob_x + 10,bob_y - 72 ,bob_x + 12,bob_y - 77);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x - 17,bob_y - 75,4);
        ellipse(bob_x - 15,bob_y - 65,5);
        ellipse(bob_x - 16,bob_y - 46,3);
        ellipse(bob_x + 14,bob_y - 59,3);
        ellipse(bob_x + 14,bob_y - 46,4);

	}
    
    else if(isRight && isFalling)
	{
		// add your jumping-right code
        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 17,bob_y - 45,35,15);

        //pants
        fill(139,69,19);
        rect(bob_x - 17,bob_y - 31,35,10);


        beginShape();
            vertex(bob_x - 15, bob_y - 24);
            vertex(bob_x - 17, bob_y - 16);
            vertex(bob_x - 5, bob_y - 16);
            vertex(bob_x - 4, bob_y - 24);
        endShape();

        beginShape();
            vertex(bob_x + 4, bob_y - 24);
            vertex(bob_x + 3, bob_y - 16);
            vertex(bob_x + 13, bob_y - 16);
            vertex(bob_x + 14, bob_y - 24);
        endShape();
        
        fill(0);
        rect(bob_x - 14,bob_y - 28,29,2);

        //legs 
        stroke(0);
        strokeWeight(1);
        fill(255,255,39);

        beginShape();
            vertex(bob_x - 15, bob_y - 16);
            vertex(bob_x - 17, bob_y - 12);
            vertex(bob_x - 23, bob_y - 10);
            vertex(bob_x - 23, bob_y - 7);
            vertex(bob_x - 14, bob_y - 10);
            vertex(bob_x - 11, bob_y - 16);
        endShape();

        beginShape();
            vertex(bob_x + 4, bob_y - 16);
            vertex(bob_x + 2, bob_y - 12);
            vertex(bob_x - 4, bob_y - 10);
            vertex(bob_x - 4, bob_y - 7);
            vertex(bob_x + 5, bob_y - 10);
            vertex(bob_x + 8, bob_y - 16);
        endShape();

        //shoes
        fill(0);
        ellipse(bob_x - 25 ,bob_y - 7,6);
        ellipse(bob_x - 3 ,bob_y - 8,6);

        ellipse(bob_x - 20,bob_y - 4,6);
        ellipse(bob_x + 2,bob_y - 5,6);

        //arms
        stroke(0);
        fill(255,255,39);
        //arm  
        beginShape();
            vertex(bob_x + 20, bob_y - 49);
            vertex(bob_x + 32, bob_y - 49);
            vertex(bob_x + 32, bob_y - 61);
            vertex(bob_x + 36, bob_y - 61);
            vertex(bob_x + 36, bob_y - 45);
            vertex(bob_x + 21, bob_y - 45);
        endShape();

        // Shape 2
        beginShape();
            vertex(bob_x - 23, bob_y - 44);
            vertex(bob_x - 32, bob_y - 44);
            vertex(bob_x - 32, bob_y - 35);
            vertex(bob_x - 36, bob_y - 35);
            vertex(bob_x - 36, bob_y - 48);
            vertex(bob_x - 23, bob_y - 48);
        endShape();

        //hands
        ellipse(bob_x - 34,bob_y - 34,5);
        ellipse(bob_x + 34,bob_y - 60,5);

        //sleeves
        stroke(0);
        fill(255);
        //Triangle 1
        triangle(bob_x + 16, bob_y - 49, 
                 bob_x + 23, bob_y - 51,
                 bob_x + 23, bob_y - 44);

        //Triangle 2
        triangle(bob_x - 12, bob_y - 48, 
                 bob_x - 23, bob_y - 50,
                 bob_x - 23, bob_y - 42);

        //tie
        stroke(255,0,0);
        strokeWeight(1);
        fill(250,0,0);
        triangle(bob_x - 3,bob_y - 42,
                 bob_x + 7,bob_y - 42,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 24);

        //body
        noStroke();
        fill(255,255,39);
        rect(bob_x - 17,bob_y - 75,35,30);

        //left vertical circles
        ellipse(bob_x - 17,bob_y - 43,7);
        ellipse(bob_x - 17,bob_y - 49,7);
        ellipse(bob_x - 17,bob_y - 55,7);
        ellipse(bob_x - 17,bob_y - 61,7);
        ellipse(bob_x - 17,bob_y - 67,7);
        ellipse(bob_x - 17,bob_y - 72,7);
        ellipse(bob_x - 17,bob_y - 76,7);
        
        //right vertical circles
        ellipse(bob_x + 17,bob_y - 43,7);
        ellipse(bob_x + 17,bob_y - 49,7);
        ellipse(bob_x + 17,bob_y - 55,7);
        ellipse(bob_x + 17,bob_y - 61,7);
        ellipse(bob_x + 17,bob_y - 67,7);
        ellipse(bob_x + 17,bob_y - 72,7);
        
        //bottom circles
        ellipse(bob_x - 12,bob_y - 43,7);
        ellipse(bob_x - 6 ,bob_y - 43,7);
        ellipse(bob_x     ,bob_y - 43,7);
        ellipse(bob_x + 6 ,bob_y - 43,7);
        ellipse(bob_x + 12,bob_y - 43,7);
        ellipse(bob_x + 18,bob_y - 43,7);
        
        // top circles
        ellipse(bob_x - 12,bob_y - 76,7);
        ellipse(bob_x - 6 ,bob_y - 76,7);
        ellipse(bob_x     ,bob_y - 76,7);
        ellipse(bob_x + 6 ,bob_y - 76,7);
        ellipse(bob_x + 12,bob_y - 76,7);
        ellipse(bob_x + 18,bob_y - 76,7);

        //mouth
        stroke(0);
        fill(80);
        arc(bob_x + 1,bob_y - 51,18,9,0 ,PI);
        noFill();
        arc(bob_x + 1,bob_y - 53,18,5,0 ,PI);

        //teeth
        fill(255);
        rect(bob_x - 4,bob_y - 51,4,4);
        rect(bob_x + 2,bob_y - 51,4,4);

        //nose
        fill(255,255,39);
        ellipse(bob_x + 2,bob_y - 60,3,4);

        //eyes
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x - 5,bob_y - 67,10,11);
        ellipse(bob_x + 7,bob_y - 67,10,11);

        strokeWeight(0.5);
        fill(173,216,230);
        ellipse(bob_x - 4,bob_y - 67,5);
        ellipse(bob_x + 8,bob_y - 67,5);

        stroke(0);
        strokeWeight(2.5);
        point(bob_x - 4,bob_y - 67);
        point(bob_x + 8,bob_y - 67);

        //eyelashes
        strokeWeight(1)
    
        line(bob_x - 9,bob_y - 72,bob_x - 11,bob_y - 76);
        line(bob_x - 6,bob_y - 73,bob_x - 6 ,bob_y - 77);
        line(bob_x - 3 ,bob_y - 73 ,bob_x - 1 ,bob_y - 77);
        line(bob_x + 4 ,bob_y - 72 ,bob_x + 2 ,bob_y - 77);
        line(bob_x + 7 ,bob_y - 72 ,bob_x + 7 ,bob_y - 78);
        line(bob_x + 10,bob_y - 72 ,bob_x + 12,bob_y - 77);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x - 17,bob_y - 75,4);
        ellipse(bob_x - 15,bob_y - 65,5);
        ellipse(bob_x - 16,bob_y - 46,3);
        ellipse(bob_x + 14,bob_y - 59,3);
        ellipse(bob_x + 14,bob_y - 46,4);

	}
    
    else if(isLeft)
	{
		// add your walking left code

        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 12, bob_y - 45, 25, 15);

        //tie
        noStroke();
        fill(255,0,0);
        rect(bob_x - 12, bob_y - 45,3,12);

        //legs
        stroke(0);
        strokeWeight(1);
        fill(255, 255, 49);
        beginShape();
            vertex(bob_x - 14, bob_y - 18);
            vertex(bob_x - 20, bob_y - 5);
            vertex(bob_x - 16, bob_y - 4);
            vertex(bob_x - 10, bob_y - 16);
        endShape();

        rect(bob_x + 4, bob_y - 16, 5, 12);

        //pants
        fill(139, 69, 19);
        rect(bob_x - 12, bob_y - 33, 25, 10);
        beginShape();
            vertex(bob_x - 10, bob_y - 28);
            vertex(bob_x - 15, bob_y - 17);
            vertex(bob_x - 6, bob_y - 16);
            vertex(bob_x, bob_y - 28);
        endShape();

        beginShape();
            vertex(bob_x + 2, bob_y - 28);
            vertex(bob_x + 2, bob_y - 16);
            vertex(bob_x + 10, bob_y - 16);
            vertex(bob_x + 10, bob_y - 28);
        endShape();

        //nose
        stroke(200, 200, 200);
        fill(255, 255, 49);
        ellipse(bob_x - 14, bob_y - 59, 10, 3);

        //body
        noStroke();
        fill(255, 255, 39);
        rect(bob_x - 12, bob_y - 75, 25, 30);

        //left  circles
        ellipse(bob_x - 11, bob_y - 76, 8);
        ellipse(bob_x - 11, bob_y - 70, 8);
        ellipse(bob_x - 11, bob_y - 63, 8);
        ellipse(bob_x - 11, bob_y - 56, 8);
        ellipse(bob_x - 11, bob_y - 49, 8);
        ellipse(bob_x - 11, bob_y - 45, 8);
        
        //bottom circles
        ellipse(bob_x - 6, bob_y - 44, 8);
        ellipse(bob_x - 1, bob_y - 44, 8);
        ellipse(bob_x + 4, bob_y - 44, 8);
        ellipse(bob_x + 9, bob_y - 44, 8);
        ellipse(bob_x + 12, bob_y - 44, 8);
        
        //top circles
        ellipse(bob_x - 6, bob_y - 76, 8);
        ellipse(bob_x - 1, bob_y - 76, 8);
        ellipse(bob_x + 4, bob_y - 76, 8);
        ellipse(bob_x + 9, bob_y - 76, 8);
        ellipse(bob_x + 12,bob_y - 76, 8);
        
        //right circles
        ellipse(bob_x + 12, bob_y - 76, 8);
        ellipse(bob_x + 12, bob_y - 70, 8);
        ellipse(bob_x + 12, bob_y - 63, 8);
        ellipse(bob_x + 12, bob_y - 56, 8);
        ellipse(bob_x + 12, bob_y - 49, 8);
        ellipse(bob_x + 12, bob_y - 45, 8);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x - 6, bob_y - 74, 4);
        ellipse(bob_x + 2, bob_y - 65, 3);
        ellipse(bob_x - 7, bob_y - 57, 3);
        ellipse(bob_x + 13,bob_y - 47, 3);

        //sleeves
        stroke(0);
        fill(255);
        triangle(bob_x + 2, bob_y - 51,
                 bob_x - 1, bob_y - 42,
                 bob_x + 6, bob_y - 42);

        line(bob_x - 12, bob_y - 72, bob_x - 12, bob_y - 77);
        line(bob_x - 10, bob_y - 71, bob_x - 9, bob_y - 77);
        line(bob_x - 13, bob_y - 51, bob_x - 10, bob_y - 51);

        //arms
        fill(255, 255, 39);
        rect(bob_x + 0, bob_y - 42, 4, 10);
        ellipse(bob_x + 2, bob_y - 32, 5);

        //eyes
        stroke(80);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x - 11, bob_y - 68, 5, 8);
        strokeWeight(2);
        point(bob_x - 12, bob_y - 68);

        //shoes
        noStroke();
        fill(0);
        ellipse(bob_x - 17, bob_y - 2, 7);
        ellipse(bob_x - 23, bob_y - 4, 7);

        ellipse(bob_x + 7, bob_y - 2, 7);
        ellipse(bob_x + 1, bob_y - 2, 7);
    }

    else if(isRight)
    {
        // add your walking right code
        
        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 12, bob_y - 45, 25, 15);

        //tie
        noStroke();
        fill(255,0,0);
        rect(bob_x + 11, bob_y - 45,3,12);

        //legs
        stroke(0);
        strokeWeight(1);
        fill(255, 255, 49);
        beginShape();
            vertex(bob_x + 14, bob_y - 18);
            vertex(bob_x + 21, bob_y - 5);
            vertex(bob_x + 16, bob_y - 4);
            vertex(bob_x + 10, bob_y - 16);
        endShape();

        rect(bob_x - 8, bob_y - 16, 5, 12);

        //pants
        fill(139, 69, 19);
        rect(bob_x - 12, bob_y - 33, 25, 10);
        beginShape();
            vertex(bob_x + 10, bob_y - 28);
            vertex(bob_x + 15, bob_y - 17);
            vertex(bob_x + 6, bob_y - 16);
            vertex(bob_x, bob_y - 28);
        endShape();

        beginShape();
            vertex(bob_x - 2, bob_y - 28);
            vertex(bob_x - 2, bob_y - 16);
            vertex(bob_x - 10, bob_y - 16);
            vertex(bob_x - 10, bob_y - 28);
        endShape();

        //nose
        stroke(200, 200, 200);
        fill(255, 255, 49);
        ellipse(bob_x + 14, bob_y - 59, 10, 3);

        //body
        noStroke();
        fill(255, 255, 39);
        rect(bob_x - 12, bob_y - 75, 25, 30);

        //left circles
        ellipse(bob_x - 11, bob_y - 76, 8);
        ellipse(bob_x - 11, bob_y - 70, 8);
        ellipse(bob_x - 11, bob_y - 63, 8);
        ellipse(bob_x - 11, bob_y - 56, 8);
        ellipse(bob_x - 11, bob_y - 49, 8);
        ellipse(bob_x - 11, bob_y - 45, 8);
        
        //bottom circles
        ellipse(bob_x - 6, bob_y - 44, 8);
        ellipse(bob_x - 1, bob_y - 44, 8);
        ellipse(bob_x + 4, bob_y - 44, 8);
        ellipse(bob_x + 9, bob_y - 44, 8);
        ellipse(bob_x + 12,bob_y - 44, 8);
        
        //top circles
        ellipse(bob_x - 6, bob_y - 76, 8);
        ellipse(bob_x - 1, bob_y - 76, 8);
        ellipse(bob_x + 4, bob_y - 76, 8);
        ellipse(bob_x + 9, bob_y - 76, 8);
        ellipse(bob_x + 12,bob_y - 76, 8);
        
        //right circles
        ellipse(bob_x + 12, bob_y - 76, 8);
        ellipse(bob_x + 12, bob_y - 70, 8);
        ellipse(bob_x + 12, bob_y - 63, 8);
        ellipse(bob_x + 12, bob_y - 56, 8);
        ellipse(bob_x + 12, bob_y - 49, 8);
        ellipse(bob_x + 12, bob_y - 45, 8);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x + 6, bob_y - 74, 4);
        ellipse(bob_x - 2, bob_y - 65, 3);
        ellipse(bob_x + 7, bob_y - 57, 3);
        ellipse(bob_x - 13,bob_y - 47, 3);

        //sleeves
        stroke(0);
        fill(255);
        triangle(bob_x + 2, bob_y - 51,
                 bob_x - 1, bob_y - 42,
                 bob_x + 6, bob_y - 42);

        line(bob_x + 12, bob_y - 72, bob_x + 12, bob_y - 77);
        line(bob_x + 10, bob_y - 71, bob_x + 9 , bob_y - 77);
        line(bob_x + 14, bob_y - 51, bob_x + 11, bob_y - 51);

        //arms
        fill(255, 255, 39);
        rect(bob_x + 0, bob_y - 42, 4, 10);
        ellipse(bob_x + 2, bob_y - 32, 5);

        //eyes
        stroke(80);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x + 11, bob_y - 68, 5, 8);
        //eye ball
        strokeWeight(2);
        point(bob_x + 12, bob_y - 68);

        //shoes
        //1
        noStroke();
        fill(0);
        ellipse(bob_x + 17, bob_y - 2, 7);
        ellipse(bob_x + 23, bob_y - 4, 7);
        //2
        ellipse(bob_x - 7, bob_y - 2, 7);
        ellipse(bob_x - 1, bob_y - 2, 7);
    }

    else if(isFalling || isPlummeting)
	{
        // add your jumping facing forwards code
        
        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 17,bob_y - 45,35,15);

        //pants
        fill(139,69,19);
        rect(bob_x - 17,bob_y - 31,35,10);


        beginShape();
            vertex(bob_x - 14, bob_y - 24);
            vertex(bob_x - 18, bob_y - 15);
            vertex(bob_x - 7, bob_y - 14);
            vertex(bob_x - 3, bob_y - 23);
        endShape();
        
        beginShape();
            vertex(bob_x + 14, bob_y - 24);
            vertex(bob_x + 18, bob_y - 15);
            vertex(bob_x + 7 , bob_y - 14);
            vertex(bob_x + 3 , bob_y - 23);
        endShape();
        
        fill(0);
        rect(bob_x - 14,bob_y - 28,29,2);

        //legs 
        stroke(0);
        strokeWeight(1);
        fill(255,255,39);

        beginShape();
            vertex(bob_x - 17, bob_y - 16);
            vertex(bob_x - 21, bob_y - 9);
            vertex(bob_x - 13, bob_y - 3);
            vertex(bob_x - 11, bob_y - 7);
            vertex(bob_x - 16, bob_y - 10);
            vertex(bob_x - 13, bob_y - 15);
        endShape();
        beginShape();
            vertex(bob_x + 17, bob_y - 16);
            vertex(bob_x + 21, bob_y - 9);
            vertex(bob_x + 13, bob_y - 3);
            vertex(bob_x + 11, bob_y - 7);
            vertex(bob_x + 16, bob_y - 10);
            vertex(bob_x + 13, bob_y - 15);
        endShape();


        //shoes
        fill(0);
        ellipse(bob_x - 9 ,bob_y - 4,6);
        ellipse(bob_x + 9 ,bob_y - 4,6);

        ellipse(bob_x - 14,bob_y - 2,6);
        ellipse(bob_x + 14,bob_y - 2,6);

        //arms
        stroke(0);
        fill(255,255,39);

        beginShape();
            vertex(bob_x - 24, bob_y - 47);
            vertex(bob_x - 31, bob_y - 41);
            vertex(bob_x - 23, bob_y - 33);
            vertex(bob_x - 22, bob_y - 37);
            vertex(bob_x - 26, bob_y - 41);
            vertex(bob_x - 21, bob_y - 45);
        endShape();


        beginShape();
            vertex(bob_x + 24, bob_y - 47);
            vertex(bob_x + 31, bob_y - 41);
            vertex(bob_x + 23, bob_y - 33);
            vertex(bob_x + 22, bob_y - 37);
            vertex(bob_x + 26, bob_y - 41);
            vertex(bob_x + 21, bob_y - 45);
        endShape();

        //hands
        ellipse(bob_x - 21,bob_y - 34,5);
        ellipse(bob_x + 22,bob_y - 34,5);

        //sleeves
        stroke(0);
        fill(255);
        triangle(bob_x + 16, bob_y - 55,
        bob_x + 26, bob_y - 47,
        bob_x + 15, bob_y - 43);

        triangle(bob_x - 17, bob_y - 53,
                 bob_x - 25, bob_y - 47,
                 bob_x - 17, bob_y - 43);

        //tie
        stroke(255,0,0);
        strokeWeight(1);
        fill(250,0,0);
        triangle(bob_x - 3,bob_y - 42,
                 bob_x + 7,bob_y - 42,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 34);
        
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 24);

        //body
        noStroke();
        fill(255,255,39);
        rect(bob_x - 17,bob_y - 75,35,30);

        //left vertical circles
        ellipse(bob_x - 17,bob_y - 43,7);
        ellipse(bob_x - 17,bob_y - 49,7);
        ellipse(bob_x - 17,bob_y - 55,7);
        ellipse(bob_x - 17,bob_y - 61,7);
        ellipse(bob_x - 17,bob_y - 67,7);
        ellipse(bob_x - 17,bob_y - 72,7);
        ellipse(bob_x - 17,bob_y - 76,7);
        
        //right vertical circles
        ellipse(bob_x + 17,bob_y - 43,7);
        ellipse(bob_x + 17,bob_y - 49,7);
        ellipse(bob_x + 17,bob_y - 55,7);
        ellipse(bob_x + 17,bob_y - 61,7);
        ellipse(bob_x + 17,bob_y - 67,7);
        ellipse(bob_x + 17,bob_y - 72,7);
        
        //bottom circles
        ellipse(bob_x - 12,bob_y - 43,7);
        ellipse(bob_x - 6 ,bob_y - 43,7);
        ellipse(bob_x     ,bob_y - 43,7);
        ellipse(bob_x + 6 ,bob_y - 43,7);
        ellipse(bob_x + 12,bob_y - 43,7);
        ellipse(bob_x + 18,bob_y - 43,7);
        
        //top circles
        ellipse(bob_x - 12,bob_y - 76,7);
        ellipse(bob_x - 6 ,bob_y - 76,7);
        ellipse(bob_x     ,bob_y - 76,7);
        ellipse(bob_x + 6 ,bob_y - 76,7);
        ellipse(bob_x + 12,bob_y - 76,7);
        ellipse(bob_x + 18,bob_y - 76,7);

        //mouth
        stroke(0);
        fill(80);
        arc(bob_x + 1,bob_y - 51,19,9,0 ,PI);
        noFill();
        arc(bob_x + 1,bob_y - 53,19,5,0 ,PI);

        //teeth
        fill(255);
        rect(bob_x - 4,bob_y - 50,4,3.5);
        rect(bob_x + 2,bob_y - 50,4,3.5);

        //nose
        fill(255,255,39);
        ellipse(bob_x + 2,bob_y - 60,3,4);

        //eyes
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x - 5,bob_y - 67,10,11);
        ellipse(bob_x + 7,bob_y - 67,10,11);

        strokeWeight(0.5);
        fill(173,216,230);
        ellipse(bob_x - 5,bob_y - 67,5);
        ellipse(bob_x + 7,bob_y - 67,5);
        
        //eyeballs
        stroke(0);
        strokeWeight(2.5);
        point(bob_x - 5,bob_y - 67);
        point(bob_x + 7,bob_y - 67);

        //eyelashes
        strokeWeight(1)
        line(bob_x - 9,bob_y - 72,bob_x - 11,bob_y - 75);
        line(bob_x - 6,bob_y - 73,bob_x - 6 ,bob_y - 76);
        line(bob_x - 2,bob_y - 72,bob_x - 1 ,bob_y - 76);
        line(bob_x + 4 ,bob_y - 72,bob_x + 2,bob_y - 76);
        line(bob_x + 7 ,bob_y - 73,bob_x + 7,bob_y - 77);
        line(bob_x + 10,bob_y - 72,bob_x +11,bob_y - 76);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x - 17,bob_y - 75,4);
        ellipse(bob_x - 15,bob_y - 65,5);
        ellipse(bob_x - 16,bob_y - 46,3);
        ellipse(bob_x + 14,bob_y - 59,3);
        ellipse(bob_x + 14,bob_y - 46,4);

    }
    
    else
    {
        // add your standing front facing code
        //shirt
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(bob_x - 17,bob_y - 45,35,15);

        //pants
        fill(139,69,19);
        rect(bob_x - 13,bob_y - 23,10,10);
        rect(bob_x + 3 ,bob_y - 23,10,10);
        rect(bob_x - 17,bob_y - 31,35,10);
        fill(0);
        rect(bob_x - 14,bob_y - 28,29,2);

        //legs 
        stroke(0);
        strokeWeight(1);
        fill(255,255,39);
        rect(bob_x - 11,bob_y - 13,5,10);
        rect(bob_x + 5 ,bob_y - 13,5,10);

        //shoes
        fill(0);
        ellipse(bob_x - 8 ,bob_y - 3,6);
        ellipse(bob_x + 7 ,bob_y - 3,6);

        ellipse(bob_x - 14,bob_y - 2,6);
        ellipse(bob_x + 13,bob_y - 2,6);

        //arms
        stroke(0);
        fill(255,255,39);
        rect(bob_x - 23,bob_y - 45,4,14);
        rect(bob_x + 20,bob_y - 45,4,14);

        //hands
        ellipse(bob_x - 21,bob_y - 31,5);
        ellipse(bob_x + 22,bob_y - 31,5);

        //sleeves
        stroke(0);
        fill(255);
        triangle(bob_x + 16, bob_y - 55,
                 bob_x + 26, bob_y - 43,
                 bob_x + 15, bob_y - 43);
            
        triangle(bob_x - 17, bob_y - 53,
                 bob_x - 25, bob_y - 44,
                 bob_x - 17, bob_y - 43);

        //tie
        stroke(255,0,0);
        strokeWeight(1);
        fill(250,0,0);
        triangle(bob_x - 3,bob_y - 42,
                 bob_x + 7,bob_y - 42,
                 bob_x + 2,bob_y - 34);
            
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 34);
            
        triangle(bob_x - 2,bob_y - 31,
                 bob_x + 6,bob_y - 31,
                 bob_x + 2,bob_y - 24);

        //body
        noStroke();
        fill(255,255,39);
        rect(bob_x - 17,bob_y - 75,35,30);

        //left vertical circles
        ellipse(bob_x - 17,bob_y - 43,7);
        ellipse(bob_x - 17,bob_y - 49,7);
        ellipse(bob_x - 17,bob_y - 55,7);
        ellipse(bob_x - 17,bob_y - 61,7);
        ellipse(bob_x - 17,bob_y - 67,7);
        ellipse(bob_x - 17,bob_y - 72,7);
        ellipse(bob_x - 17,bob_y - 76,7);
            
        //right vertical circles
        ellipse(bob_x + 17,bob_y - 43,7);
        ellipse(bob_x + 17,bob_y - 49,7);
        ellipse(bob_x + 17,bob_y - 55,7);
        ellipse(bob_x + 17,bob_y - 61,7);
        ellipse(bob_x + 17,bob_y - 67,7);
        ellipse(bob_x + 17,bob_y - 72,7);
            
        //bottom circles
        ellipse(bob_x - 12,bob_y - 43,7);
        ellipse(bob_x - 6 ,bob_y - 43,7);
        ellipse(bob_x     ,bob_y - 43,7);
        ellipse(bob_x + 6 ,bob_y - 43,7);
        ellipse(bob_x + 12,bob_y - 43,7);
        ellipse(bob_x + 18,bob_y - 43,7);
            
        // top circles
        ellipse(bob_x - 12,bob_y - 76,7);
        ellipse(bob_x - 6 ,bob_y - 76,7);
        ellipse(bob_x     ,bob_y - 76,7);
        ellipse(bob_x + 6 ,bob_y - 76,7);
        ellipse(bob_x + 12,bob_y - 76,7);
        ellipse(bob_x + 18,bob_y - 76,7);

        //mouth
        stroke(0)
        noFill();
        arc(bob_x + 1,bob_y - 53,17,5,0 ,PI);

        //teeth
        fill(255);
        rect(bob_x - 4,bob_y - 50,4,4);
        rect(bob_x + 2,bob_y - 50,4,4);

        //nose
        fill(255,255,39);
        ellipse(bob_x + 2,bob_y - 60,3,4);

        //eyes
        stroke(0);
        strokeWeight(1);
        fill(255);
        ellipse(bob_x - 5,bob_y - 67,10,11);
        ellipse(bob_x + 7,bob_y - 67,10,11);

        strokeWeight(0.5);
        fill(173,216,230);
        ellipse(bob_x - 5,bob_y - 67,5);
        ellipse(bob_x + 7,bob_y - 67,5);

        stroke(0);
        strokeWeight(2.5);
        point(bob_x - 5,bob_y - 67);
        point(bob_x + 7,bob_y - 67);

        //eyelashes
        strokeWeight(1)
        line(bob_x - 9,bob_y - 72,bob_x - 11,bob_y - 75);
        line(bob_x - 6,bob_y - 73,bob_x - 6 ,bob_y - 76);
        line(bob_x - 2,bob_y - 72,bob_x - 1 ,bob_y - 76);
        line(bob_x + 4 ,bob_y - 72,bob_x + 2,bob_y - 76);
        line(bob_x + 7 ,bob_y - 73,bob_x + 7,bob_y - 77);
        line(bob_x + 10,bob_y - 72,bob_x +11,bob_y - 76);

        //spots
        noStroke();
        fill(190,255,85);
        ellipse(bob_x - 17,bob_y - 75,4);
        ellipse(bob_x - 15,bob_y - 65,5);
        ellipse(bob_x - 16,bob_y - 46,3);
        ellipse(bob_x + 14,bob_y - 59,3);
        ellipse(bob_x + 14,bob_y - 46,4);

    }
}

//Scenery element functions start here

function locateGround()
{
	for(var i = 0; i < road_x.length; i++)
    {
        //top ground
        noStroke(); 
        fill(189,183,107);
        rect(road_x[i], road.y , 1024, 70); 
        rect(road_x[i], road.y + 110, 1024, 70); 

        //road
        fill(47,95,81);
        rect(road_x[i] ,road.y + 60,1024,576);
        rect(road_x[i] ,road.y + 460,1024,576);

        fill(189,183,107);
        rect(road_x[i],road.y + 110,1024,50);
    }
}

function locateFootpaths()
{
	for(var i = 0; i < road_x.length; i++)
    {
        //footpaths 
        fill(47,95,81);
        rect(road_x[i] + 523,road.y ,51,10);
        rect(road_x[i] + 523,road.y + 15,51,10);
        rect(road_x[i] + 523,road.y + 30,51,10);
        rect(road_x[i] + 523,road.y + 45,51,10);

        //draw some green ground
        //patricks road
        rect(road_x[i] + 145, road.y,100,80);

        //spongebobs road
        rect(road_x[i] + 846, road.y,48,60);
    }
}

function locateBubbles()
{
    for(var i = 0; i < bubble_x.length; i++)
     {
        //bubbles with patricks house
        stroke(255);
        strokeWeight(1)
        noFill();
        ellipse(bubble_x[i] + 2 ,bubble.y + 113,8);
        ellipse(bubble_x[i] + 15,bubble.y + 98,20);
        ellipse(bubble_x[i] + 10,bubble.y + 62,25);
        ellipse(bubble_x[i]     ,bubble.y + 40,10);
        ellipse(bubble_x[i] + 3 ,bubble.y + 18,19);
        ellipse(bubble_x[i] + 5 ,bubble.y - 6,8)
        ellipse(bubble_x[i] - 5 ,bubble.y,5)

        strokeWeight(8);
        point(bubble_x[i] + 13,bubble.y + 95);
        point(bubble_x[i] + 7,bubble.y + 56);
        point(bubble_x[i] + 3,bubble.y + 15);

        //bubbles with spongebobs house
        stroke(255);
        strokeWeight(1)
        noFill();
        ellipse(bubble_x[i] + 406,bubble.y + 113,8);
        ellipse(bubble_x[i] + 394,bubble.y + 98,20);
        ellipse(bubble_x[i] + 396,bubble.y + 62,25);
        ellipse(bubble_x[i] + 385,bubble.y + 40,10);
        ellipse(bubble_x[i] + 395,bubble.y + 18,19);
        ellipse(bubble_x[i] + 398,bubble.y - 6,8);
        ellipse(bubble_x[i] + 386,bubble.y    ,5);

        strokeWeight(8);
        point(bubble_x[i] + 396,bubble.y + 95);
        point(bubble_x[i] + 395,bubble.y + 56);
        point(bubble_x[i] + 395,bubble.y + 15);
        point(bubble_x[i] + 625,bubble.y - 92);

        strokeWeight(1);
        ellipse(bubble_x[i] + 620,bubble.y - 90,20);
        ellipse(bubble_x[i] + 622,bubble.y - 110,10);
        ellipse(bubble_x[i] + 615,bubble.y - 120,7);
     }
}

function locatePatty(t_patty)
{
    stroke(60);
    strokeWeight(1);
    fill(230,165,32);
    ellipse(t_patty.x ,t_patty.y_pos  ,t_patty.size - 5 ,t_patty.size - 10);
    fill(107,142,35);
    ellipse(t_patty.x ,t_patty.y_pos - 1, t_patty.size , t_patty.size - 30);
    fill(139,69,19);
    ellipse(t_patty.x ,t_patty.y_pos + 2, t_patty.size , t_patty.size - 30);  
} 

function checkpatty(t_patty)
{
    if(dist(bob_x, bob_y, t_patty.x, t_patty.y_pos) < 50)
    {
        t_patty.isFound = true; 
        game_score += 1;
		bitePattySound.play();
    }
}

function locateCanyon(t_canyon)
{
    fill(0)
    noStroke();
    rect(t_canyon.x , t_canyon.y + 79, t_canyon.width - 10, t_canyon.height);
}

function checkCanyon(t_canyon)
{
    if(bob_x > t_canyon.x + 10 && bob_x < t_canyon.x + t_canyon.width - 12 && bob_y >= floorPos_y + 55)
    { 
        bob_y += 50;
        isLeft = false;
        isRight = false;
		fallingCanyonSound.play();
    }
}

function renderKrustyCrab()
{
    push();
    strokeWeight(5);
    stroke(100);
    line( KrustyCrab.xpos, floorPos_y + 50, KrustyCrab.xpos, floorPos_y - 200);

    fill(0,40,200);
    strokeWeight(2);
    stroke(80);
    
    if(KrustyCrab.isReached)
    {
        noStroke();
        fill(233,150,122);
        triangle(KrustyCrab.xpos, floorPos_y - 146, KrustyCrab.xpos - 45, floorPos_y - 196, KrustyCrab.xpos + 45, floorPos_y - 196);
        triangle(KrustyCrab.xpos, floorPos_y - 167, KrustyCrab.xpos - 20, floorPos_y - 142, KrustyCrab.xpos + 20, floorPos_y - 142);
        ellipse(KrustyCrab.xpos - 33, floorPos_y - 197, 20);
        ellipse(KrustyCrab.xpos - 18, floorPos_y - 197, 25, 35);
        ellipse(KrustyCrab.xpos, floorPos_y - 197, 25, 42);
        ellipse(KrustyCrab.xpos + 18, floorPos_y - 197, 25, 35);
        ellipse(KrustyCrab.xpos + 33, floorPos_y - 197, 20);
       
        fill(0);
        textSize(12)
        fill(139,0,0)
        text("THE ", KrustyCrab.xpos - 12, floorPos_y - 195);
        text("KRUSTY ", KrustyCrab.xpos - 22, floorPos_y - 183);
        text("KRAB ", KrustyCrab.xpos - 13, floorPos_y - 170);
    }
    else
    {
        noStroke();
        fill(233,150,122);
        triangle(KrustyCrab.xpos, floorPos_y + 38, KrustyCrab.xpos - 45, floorPos_y - 13, KrustyCrab.xpos + 45, floorPos_y - 13);
        triangle(KrustyCrab.xpos, floorPos_y + 17, KrustyCrab.xpos - 20, floorPos_y - 42, KrustyCrab.xpos + 20, floorPos_y - 42);
        ellipse(KrustyCrab.xpos - 33, floorPos_y - 13, 20);
        ellipse(KrustyCrab.xpos - 18, floorPos_y - 13, 25, 35);
        ellipse(KrustyCrab.xpos, floorPos_y - 13, 25, 42);
        ellipse(KrustyCrab.xpos + 18, floorPos_y - 13, 25, 35);
        ellipse(KrustyCrab.xpos + 33, floorPos_y - 13, 20);
    }
	
    pop();
}

function checkKrustyCrab()
{
    var d = abs(bob_x - KrustyCrab.xpos);
    if(d <  15)
    {
        KrustyCrab.isReached = true;
		levelCompleteSound.play();
    }
}

function start_Bob_World()
{
    bob_x = width/2;
	bob_y = floorPos_y + 55;
    
    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;
    
//    patrick = [
//		{x: -830 , y: 380},
//		{x:  200 , y: 380},
//		{x: 1200 , y: 380},
//		{x: 2200 , y: 380},
//		{x: 3200 , y: 380},
//	];
	
	patrick = {y: 380};
    patrick_x = [-830, 200 , 1200 , 2200, 3200];

//    squid = [
//		{x: -545 , y: 125},
//		{x:  480 , y: 125},
//		{x: 1480 , y: 125},
//		{x: 2480 , y: 125},
//		{x: 3480 , y: 125},
//	];
	
	squid = {y: 125};
    squid_x = [-545, 480 ,  1480, 2480 , 3480];
    
//    sponge =  [
//		{x: -150 , y: 380},
//		{x:  870 , y: 380},
//		{x: 1870 , y: 380},
//		{x: 2870 , y: 380},
//		{x: 3870 , y: 380},
//	];
	
	sponge = {y: 380};
    sponge_x = [-150, 870 , 1870, 2870, 3870];
    
//    road =  [
//		{x: -1024 , y: 420},
//		{x:  0    , y: 420},
//		{x:  1000 , y: 420},
//		{x:  2000 , y: 420},
//	];
	
	road = {y: 420};
    road_x = [-1024, 0, 1000, 2000];
		
//    bubble =  [
//		{x: -670  , y: 300},
//		{x:  350  , y: 300},
//		{x:  1350 , y: 300},
//		{x:  2350 , y: 300},
//		{x:  3350 , y: 300},
//	];
	
	bubble = {y: 300};
    bubble_x = [-670, 350 , 1350, 2350, 3350];

    patty = [{
        x: 730, 
        y_pos: 440,
        size: 35,
        isFound: false
    },
    {
        x: 870,  
        y_pos: 360,
        size: 35,
        isFound: false
    },
    {
        x: 1250,  
        y_pos: 380,
        size: 35,
        isFound: false
    },
    {
        x: 1550,  
        y_pos: 340,
        size: 35,
        isFound: false
    },
    {
        x: 1690,  
        y_pos: 380,
        size: 35,
        isFound: false
    },
    {
        x: 2050,  
        y_pos: 340,
        size: 35,
        isFound: false
    },
    {
        x: 2560,  
        y_pos: 320,
        size: 35,
        isFound: false
    },
    {
        x: 2980,  
        y_pos: 410,
        size: 35,
        isFound: false
    },
    {
        x: 3200,  
        y_pos: 410,
        size: 35,
        isFound: false
    },
    {
        x: 3550,  
        y_pos: 410,
        size: 35,
        isFound: false
    },
];

    canyon = [{
        x: 680,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 1000,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 1400,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 1800,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 2300,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 2800,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 3300,
        y: 400,
        width:100,
        height: 98
    },
    {
        x: 3750,
        y: 400,
        width:100,
        height: 98
    },

];
	
	sticks = []; 
	sticks.push(createSticks(840, floorPos_y - 50, 100))
	sticks.push(createSticks(1200, floorPos_y - 25, 100))
    sticks.push(createSticks(1500, floorPos_y - 70, 100))
    sticks.push(createSticks(1650, floorPos_y - 30, 100))
    sticks.push(createSticks(1900, floorPos_y - 30, 100))
    sticks.push(createSticks(2000, floorPos_y - 75, 100))
    sticks.push(createSticks(2100, floorPos_y - 30, 100))
    sticks.push(createSticks(2400, floorPos_y - 20, 100))
    sticks.push(createSticks(2600, floorPos_y - 30, 100))
    sticks.push(createSticks(2950, floorPos_y - 5, 100))
    sticks.push(createSticks(3150, floorPos_y - 5, 100))
    sticks.push(createSticks(3500, floorPos_y - 5, 100))

    game_score = 0;
    
    KrustyCrab = {isReached: false, xpos: 4200};

    cameraPosX = 0;
	
    planktons = [];
    planktons.push(new Plankton(850, floorPos_y - 10, 50))
    planktons.push(new Plankton(1200, floorPos_y - 10,50))
    planktons.push(new Plankton(1600, floorPos_y - 10,50))
	planktons.push(new Plankton(2100, floorPos_y -  105,50))
	planktons.push(new Plankton(2600, floorPos_y - 105, 50))
	planktons.push(new Plankton(3100, floorPos_y - 10, 50))
    planktons.push(new Plankton(3500, floorPos_y - 10, 50))
}

function checkPlayerDie()
{
    if( bob_y > canvas.height )
    {
        if(gary > 0 || gary <= 3)
        {
            gary -= 1;
            start_Bob_World();
        }
    }
}

function Plankton(x, y, range) // (enemy)Plankton constructor
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1;

    this.update = function()
    {
         this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
             this.inc = -1;
        }

        else if(this.currentX < this.x)
        {
             this.inc = 1;
        }
    }

    this.draw = function()
    {
        this.update();

        fill(39, 99, 57);
        strokeWeight(1.5);
        stroke(30);

        beginShape();
        vertex(this.currentX + 2, this.y + 40);
        vertex(this.currentX + 4, this.y + 26);
        vertex(this.currentX + 6, this.y + 40);
        endShape();

        beginShape();
        vertex(this.currentX + 9, this.y + 40);
        vertex(this.currentX + 11, this.y + 26);
        vertex(this.currentX + 13, this.y + 40);
        endShape();

        rect(this.currentX + 11 , this.y + 65, 4,8, 3);
        rect(this.currentX + 3, this.y + 65, 4,8, 3);

        rect(this.currentX , this.y + 38, 18, 29, 13);

        fill(210, 210, 4);
        ellipse(this.currentX + 9 , this.y + 49 , 9, 12);
        fill(0);
        rect(this.currentX + 4 , this.y + 41, 10,4);
        fill(255,0,0);

        ellipse(this.currentX + 9 , this.y + 49 ,4,5);

        stroke(28);
        noFill();
        arc(this.currentX + 9,this.y + 58,12,9,0 ,PI);
        noFill();
        arc(this.currentX + 9,this.y + 57,12,5,0 ,PI);

        line(this.currentX + 2, this.y + 26 , this.currentX + 5, this.y + 26);
        line(this.currentX + 1, this.y + 30 , this.currentX + 6, this.y + 30);
        line(this.currentX + 1, this.y + 34 , this.currentX + 6, this.y + 35);
        line(this.currentX + 1, this.y + 38 , this.currentX + 6, this.y + 38);

        line(this.currentX + 10, this.y + 26 , this.currentX + 13, this.y + 26);
        line(this.currentX + 9, this.y + 30 , this.currentX + 13, this.y + 30);
        line(this.currentX + 9, this.y + 34 , this.currentX + 14, this.y + 35);
        line(this.currentX + 9, this.y + 38 , this.currentX + 14, this.y + 38);
    }

    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y + 50)
       console.log(d)
        if(d < 35)
        {
            return true;
        }
        return false;
    }
}

//sticks are platforms
function createSticks(x, y, length)  //platform constructor 
{
	var p = 
	{
		x: x,
		y: y,
		length: length,
		draw: function()
		{
            stroke(40);
            strokeWeight(0.5);
			fill(128,50,0);
           
            beginShape()
            vertex(this.x, this.y);
            vertex(this.x + 60, this.y);
            vertex(this.x + 70, this.y - 4);
            vertex(this.x + 85, this.y + 2);
            vertex(this.x + 100, this.y + 1);
            vertex(this.x + 100, this.y + 8);
            vertex(this.x , this.y + 8);
            vertex(this.x, this.y);
            endShape();

            beginShape();
            vertex(this.x + 60, this.y + 8);
            vertex(this.x + 76, this.y + 19);
            vertex(this.x + 90, this.y + 23);
            vertex(this.x + 90, this.y + 18);
            vertex(this.x + 78, this.y + 16);
            vertex(this.x + 68, this.y + 7);
            endShape();
             
            line(this.x, this.y + 1 , this.x + 98, this.y + 3);
            line(this.x, this.y + 3 , this.x + 98, this.y + 6);
		},
		checkContact: function(gc_x, gc_y)
		{
			if(gc_x > this.x && gc_x < this.x + this.length)
				{
					var d = this.y - gc_y;
					if(d >=0 && d < 5)
					{
						return true;
					}
				}	
			return false;
		}
	
	}
	return p;
}
