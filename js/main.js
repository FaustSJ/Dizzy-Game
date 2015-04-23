var game = new Phaser.Game(800, 800, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });


function preload() {
	game.load.tilemap('dizzymap', 'assets/dizzymap.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles-1', 'assets/tiles-1.png');
	game.load.image('fire', 'assets/firesprl.png');
	game.load.image('bg', 'assets/bg.jpg');
	game.load.image('player','assets/player.png');
	game.load.image('crate','assets/crate.png');
	game.load.image('info','assets/info.png');
	game.load.image('dot','assets/dot.png');
	game.load.image('goal','assets/goal.png');
	game.load.image('lose','assets/lose.png');
	game.load.image('win','assets/win.png');
}

var map;
var tileset;
var background;
var layer;
var player;
var fire1;
var fire2;
var fire3;
var fire4;
var fire5;
var crate1;
var crate2;
var crate3;
var crate4;
var state;
var jumpTimer = 0;
var tapTimer = 0;
var info;
var updot;
var downdot;
var leftdot;
var rightdot;
var goal;
var fail;
var winning;
var tally = 0; //tracks how many crates reached the goal

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//setting up the background
	background = game.add.sprite(0, 0, 'bg');
	info = game.add.sprite(0, 0, 'info');
	goal = game.add.sprite(481, 761, 'goal');
	
	//setting up the tilemap
	map = game.add.tilemap('dizzymap');
	map.addTilesetImage('tiles-1');
	layer = map.createLayer('Tile Layer 1'); 
	map.setCollisionBetween(1,5,true, 'Tile Layer 1');
	layer.resizeWorld();
	//layer.debug = true;
	
	fail = game.add.sprite(0, 0, 'lose');
	fail.visible = false;
	winning = game.add.sprite(0, 0, 'win');
	winning.visible = false;
	
	// the dots that tell the playergravity's direction
	rightdot = game.add.sprite(354, 752, 'dot');
	updot = game.add.sprite(325, 731, 'dot');
	downdot = game.add.sprite(325, 776, 'dot');
	leftdot = game.add.sprite(295, 753, 'dot');
	rightdot.visible = false;
	updot.visible = false;
	downdot.visible = false;
	leftdot.visible = false;
	
	
	//creating the various objects
	player = game.add.sprite(336, 288, 'player');
	game.physics.enable(player, Phaser.Physics.ARCADE);
	fire1 = game.add.sprite(496, 446, 'fire');
	game.physics.enable(fire1, Phaser.Physics.ARCADE);
	fire2 = game.add.sprite(272, 416, 'fire');
	game.physics.enable(fire2, Phaser.Physics.ARCADE);
	fire3 = game.add.sprite(272, 192, 'fire');
	game.physics.enable(fire3, Phaser.Physics.ARCADE);
	fire4 = game.add.sprite(496, 192, 'fire');
	game.physics.enable(fire4, Phaser.Physics.ARCADE);
	fire5 = game.add.sprite(384, 416, 'fire');
	game.physics.enable(fire5, Phaser.Physics.ARCADE);
	crate1 = game.add.sprite(16, 16, 'crate');
	game.physics.enable(crate1, Phaser.Physics.ARCADE);
	crate2 = game.add.sprite(752, 16, 'crate');
	game.physics.enable(crate2, Phaser.Physics.ARCADE);
	crate3 = game.add.sprite(752, 672, 'crate');
	game.physics.enable(crate3, Phaser.Physics.ARCADE);
	crate4 = game.add.sprite(16, 672, 'crate');
	game.physics.enable(crate4, Phaser.Physics.ARCADE);

	//the state tracks gravity's direction
	state = 0; //1 is upright
	// -> = state++
	// <- = state--
	changeStateRight();
	
	
	
	//move player with the WASD keys
	cursors = game.input.keyboard.createCursorKeys();
	this.wasd = {
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S),
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
         }; 
	
}

function update() {
	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(fire1, layer);
	game.physics.arcade.collide(fire1, fire2);
	game.physics.arcade.collide(fire1, fire3);
	game.physics.arcade.collide(fire1, fire4);
	game.physics.arcade.collide(fire1, fire5);
	game.physics.arcade.collide(fire2, layer);
	game.physics.arcade.collide(fire2, fire3);
	game.physics.arcade.collide(fire2, fire4);
	game.physics.arcade.collide(fire2, fire5);
	game.physics.arcade.collide(fire3, layer);
	game.physics.arcade.collide(fire3, fire4);
	game.physics.arcade.collide(fire3, fire5);
	game.physics.arcade.collide(fire4, layer);
	game.physics.arcade.collide(fire4, fire5);
	game.physics.arcade.collide(fire5, layer);
	game.physics.arcade.collide(crate1, layer);
	game.physics.arcade.collide(crate1, crate2);
	game.physics.arcade.collide(crate1, crate3);
	game.physics.arcade.collide(crate1, crate4);
	game.physics.arcade.collide(crate2, layer);
	game.physics.arcade.collide(crate2, crate3);
	game.physics.arcade.collide(crate2, crate4);
	game.physics.arcade.collide(crate3, layer);
	game.physics.arcade.collide(crate3, crate4);
	game.physics.arcade.collide(crate4, layer);
	
	//player movement
	if((state===1)||(state===3))
	{
		player.body.velocity.x = 0;
		fire1.body.velocity.x = 0;
		fire2.body.velocity.x = 0;
		fire3.body.velocity.x = 0;
		fire4.body.velocity.x = 0;
		fire5.body.velocity.x = 0;
		crate1.body.velocity.x = 0;
		crate2.body.velocity.x = 0;
		crate3.body.velocity.x = 0;
		crate4.body.velocity.x = 0;
	}
	if((state===2)||(state===4))
	{
		player.body.velocity.y = 0;
		fire1.body.velocity.y = 0;
		fire2.body.velocity.y = 0;
		fire3.body.velocity.y = 0;
		fire4.body.velocity.y = 0;
		fire5.body.velocity.y = 0;
		crate1.body.velocity.y = 0;
		crate2.body.velocity.y = 0;
		crate3.body.velocity.y = 0;
		crate4.body.velocity.y = 0;
	}
	

 	//moves the player left
 	if (this.wasd.left.isDown)
 	{
 		if(state===1)
 			player.body.velocity.x = -150;
 		if(state===2)
 			player.body.velocity.y = 150;
 		if(state===3)
 			player.body.velocity.x = 150;
 		if(state===4)
 			player.body.velocity.y = -150;
        }
        //moves the player right
        else if (this.wasd.right.isDown)
        {
        	if(state===1)
        		player.body.velocity.x = 150;
        	if(state===2)
        		player.body.velocity.y = -150;
        	if(state===3)
        		player.body.velocity.x = -150;
        	if(state===4)
        		player.body.velocity.y = 150;
        }
	if(cursors.left.isDown && game.time.now > tapTimer) 
	{
		//game.world.rotation += 0.25;
		//game.camera.displayObject.pivot.x = game.camera.view.x + game.camera.view.width/2;
		//game.camera.displayObject.pivot.y = game.camera.view.y + game.camera.view.height/2;
		//game.camera.displayObject.rotation = Math.PI/4;
		changeStateLeft();
		tapTimer = game.time.now + 600;
	}
	else if(cursors.right.isDown && game.time.now > tapTimer) 
	{
		//game.world.rotation -= 0.25;
		//game.camera.displayObject.pivot.x = game.camera.view.x + game.camera.view.width/2;
		//game.camera.displayObject.pivot.y = game.camera.view.y + game.camera.view.height/2;
		changeStateRight();
		tapTimer = game.time.now + 600;
	}
	
	
	//makes the sprite jump, but only if the player in touching the ground
	if (this.wasd.up.isDown && game.time.now > jumpTimer)
	{
		if((state===1)&&(player.body.blocked.down===true))
			player.body.velocity.y = -250;
		if((state===2)&&(player.body.blocked.right===true))
			player.body.velocity.x = -250;
		if((state===3)&&(player.body.blocked.up===true))
			player.body.velocity.y = 250;
		if((state===4)&&(player.body.blocked.left===true))
			player.body.velocity.x = 250;
		
		
		jumpTimer = game.time.now + 750;
	}
	
	game.physics.arcade.overlap(player, fire1, lose, null, this);
	game.physics.arcade.overlap(player, fire2, lose, null, this);
	game.physics.arcade.overlap(player, fire3, lose, null, this);
	game.physics.arcade.overlap(player, fire4, lose, null, this);
	game.physics.arcade.overlap(player, fire5, lose, null, this);
	game.physics.arcade.overlap(crate1, goal, score, null, this);
	game.physics.arcade.overlap(crate2, goal, score, null, this);
	game.physics.arcade.overlap(crate3, goal, score, null, this);
	game.physics.arcade.overlap(crate4, goal, score, null, this);
}

function changeStateRight()
{
	
	state++;
	if(state===5)
		state = 1;
	
	if(state===1)
	{
		rightdot.visible = false;
		updot.visible = false;
		downdot.visible = true;
		leftdot.visible = false;
		
		player.body.gravity.x = 0;
		fire1.body.gravity.x = 0;
		fire2.body.gravity.x = 0;
		fire3.body.gravity.x = 0;
		fire4.body.gravity.x = 0;
		fire5.body.gravity.x = 0;
		crate1.body.gravity.x = 0;
		crate2.body.gravity.x = 0;
		crate3.body.gravity.x = 0;
		crate4.body.gravity.x = 0;
		
		player.body.gravity.y = 250;
		fire1.body.gravity.y = 250;
		fire2.body.gravity.y = 250;
		fire3.body.gravity.y = 250;
		fire4.body.gravity.y = 250;
		fire5.body.gravity.y = 250;
		crate1.body.gravity.y = 250;
		crate2.body.gravity.y = 250;
		crate3.body.gravity.y = 250;
		crate4.body.gravity.y = 250;
	}
	if(state===2)
	{		
		rightdot.visible = true;
		updot.visible = false;
		downdot.visible = false;
		leftdot.visible = false;
		
		player.body.gravity.x = 250;
		fire1.body.gravity.x = 250;
		fire2.body.gravity.x = 250;
		fire3.body.gravity.x = 250;
		fire4.body.gravity.x = 250;
		fire5.body.gravity.x = 250;
		crate1.body.gravity.x = 250;
		crate2.body.gravity.x = 250;
		crate3.body.gravity.x = 250;
		crate4.body.gravity.x = 250;
		
		player.body.gravity.y = 0;
		fire1.body.gravity.y = 0;
		fire2.body.gravity.y = 0;
		fire3.body.gravity.y = 0;
		fire4.body.gravity.y = 0;
		fire5.body.gravity.y = 0;
		crate1.body.gravity.y = 0;
		crate2.body.gravity.y = 0;
		crate3.body.gravity.y = 0;
		crate4.body.gravity.y = 0;
	}
	if(state===3)
	{	
		rightdot.visible = false;
		updot.visible = true;
		downdot.visible = false;
		leftdot.visible = false;
		
		player.body.gravity.x = 0;
		fire1.body.gravity.x = 0;
		fire2.body.gravity.x = 0;
		fire3.body.gravity.x = 0;
		fire4.body.gravity.x = 0;
		fire5.body.gravity.x = 0;
		crate1.body.gravity.x = 0;
		crate2.body.gravity.x = 0;
		crate3.body.gravity.x = 0;
		crate4.body.gravity.x = 0;
		
		player.body.gravity.y = -250;
		fire1.body.gravity.y = -250;
		fire2.body.gravity.y = -250;
		fire3.body.gravity.y = -250;
		fire4.body.gravity.y = -250;
		fire5.body.gravity.y = -250;
		crate1.body.gravity.y = -250;
		crate2.body.gravity.y = -250;
		crate3.body.gravity.y = -250;
		crate4.body.gravity.y = -250;
	}
	if(state===4)
	{	
		rightdot.visible = false;
		updot.visible = false;
		downdot.visible = false;
		leftdot.visible = true;
		
		player.body.gravity.x = -250;
		fire1.body.gravity.x = -250;
		fire2.body.gravity.x = -250;
		fire3.body.gravity.x = -250;
		fire4.body.gravity.x = -250;
		fire5.body.gravity.x = -250;
		crate1.body.gravity.x = -250;
		crate2.body.gravity.x = -250;
		crate3.body.gravity.x = -250;
		crate4.body.gravity.x = -250;
		
		player.body.gravity.y = 0;
		fire1.body.gravity.y = 0;
		fire2.body.gravity.y = 0;
		fire3.body.gravity.y = 0;
		fire4.body.gravity.y = 0;
		fire5.body.gravity.y = 0;
		crate1.body.gravity.y = 0;
		crate2.body.gravity.y = 0;
		crate3.body.gravity.y = 0;
		crate4.body.gravity.y = 0;
	}
}
//////////////////////////////////////////////
function changeStateLeft()
{
	state--;
	if(state===0)
		state = 4;
	
	if(state===1)
	{
		rightdot.visible = false;
		updot.visible = false;
		downdot.visible = true;
		leftdot.visible = false;
		
		player.body.gravity.x = 0;
		fire1.body.gravity.x = 0;
		fire2.body.gravity.x = 0;
		fire3.body.gravity.x = 0;
		fire4.body.gravity.x = 0;
		fire5.body.gravity.x = 0;
		crate1.body.gravity.x = 0;
		crate2.body.gravity.x = 0;
		crate3.body.gravity.x = 0;
		crate4.body.gravity.x = 0;
		
		player.body.gravity.y = 250;
		fire1.body.gravity.y = 250;
		fire2.body.gravity.y = 250;
		fire3.body.gravity.y = 250;
		fire4.body.gravity.y = 250;
		fire5.body.gravity.y = 250;
		crate1.body.gravity.y = 250;
		crate2.body.gravity.y = 250;
		crate3.body.gravity.y = 250;
		crate4.body.gravity.y = 250;
	}
	if(state===2)
	{		
		rightdot.visible = true;
		updot.visible = false;
		downdot.visible = false;
		leftdot.visible = false;
		
		player.body.gravity.x = 250;
		fire1.body.gravity.x = 250;
		fire2.body.gravity.x = 250;
		fire3.body.gravity.x = 250;
		fire4.body.gravity.x = 250;
		fire5.body.gravity.x = 250;
		crate1.body.gravity.x = 250;
		crate2.body.gravity.x = 250;
		crate3.body.gravity.x = 250;
		crate4.body.gravity.x = 250;
		
		player.body.gravity.y = 0;
		fire1.body.gravity.y = 0;
		fire2.body.gravity.y = 0;
		fire3.body.gravity.y = 0;
		fire4.body.gravity.y = 0;
		fire5.body.gravity.y = 0;
		crate1.body.gravity.y = 0;
		crate2.body.gravity.y = 0;
		crate3.body.gravity.y = 0;
		crate4.body.gravity.y = 0;
	}
	if(state===3)
	{	
		rightdot.visible = false;
		updot.visible = true;
		downdot.visible = false;
		leftdot.visible = false;
		
		player.body.gravity.x = 0;
		fire1.body.gravity.x = 0;
		fire2.body.gravity.x = 0;
		fire3.body.gravity.x = 0;
		fire4.body.gravity.x = 0;
		fire5.body.gravity.x = 0;
		crate1.body.gravity.x = 0;
		crate2.body.gravity.x = 0;
		crate3.body.gravity.x = 0;
		crate4.body.gravity.x = 0;
		
		player.body.gravity.y = -250;
		fire1.body.gravity.y = -250;
		fire2.body.gravity.y = -250;
		fire3.body.gravity.y = -250;
		fire4.body.gravity.y = -250;
		fire5.body.gravity.y = -250;
		crate1.body.gravity.y = -250;
		crate2.body.gravity.y = -250;
		crate3.body.gravity.y = -250;
		crate4.body.gravity.y = -250;
	}
	if(state===4)
	{	
		rightdot.visible = false;
		updot.visible = false;
		downdot.visible = false;
		leftdot.visible = true;
		
		player.body.gravity.x = -250;
		fire1.body.gravity.x = -250;
		fire2.body.gravity.x = -250;
		fire3.body.gravity.x = -250;
		fire4.body.gravity.x = -250;
		fire5.body.gravity.x = -250;
		crate1.body.gravity.x = -250;
		crate2.body.gravity.x = -250;
		crate3.body.gravity.x = -250;
		crate4.body.gravity.x = -250;
		
		player.body.gravity.y = 0;
		fire1.body.gravity.y = 0;
		fire2.body.gravity.y = 0;
		fire3.body.gravity.y = 0;
		fire4.body.gravity.y = 0;
		fire5.body.gravity.y = 0;
		crate1.body.gravity.y = 0;
		crate2.body.gravity.y = 0;
		crate3.body.gravity.y = 0;
		crate4.body.gravity.y = 0;
	}
}

function lose()
{
	fail.visible = true;
	
	if(cursors.left.isDown)
		lose();
	if(cursors.right.isDown)
		lose();
	if(this.wasd.right.isDown)
		lose();
	if(this.wasd.left.isDown)
		lose();
	if(this.wasd.up.isDown)
		lose();
}

function score()
{
	if(crate1.y > goal.y -20)
		crate1.kill();
	if(crate2.y > goal.y -20)
		crate2.kill();
	if(crate3.y > goal.y -20)
		crate3.kill();
	if(crate4.y > goal.y -20)
		crate4.kill();
	
	tally++;
	if(tally===4)
		win();
}

function win()
{
	winning.visible = true;
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    //game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
/*
what if the wall isnt a layer,
but an object? I can put an invisible
group of sprites at each wall and when
the player collides with the invisible
sprites,it'lll be like they're 
interacting with the wall!
*/
