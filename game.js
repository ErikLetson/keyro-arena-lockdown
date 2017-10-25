//Globals
var IMAGES = [["topbg.png", 640, 480], ["square.png", 20, 17], ["spikewall.png", 64, 32],
			  ["sidewall.png", 32, 640], ["key.png", 28, 28], ["hero2.png", 20, 17], 
			  ["hero3.png", 20, 17], ["skull1.png", 20, 17], ["skull2.png", 20, 17], ["skull3.png", 20, 17],
			  ["door.png", 64, 32], ["keyThumbnail.png", 11, 11], ["keyrologo.png", 462, 200],
			  ["onSound.png", 11, 11], ["offSound.png", 11, 11]];
var WORLDSPEED = 3;
var SCREENDIMENSIONS = [640, 480];
var KEYS = 0;
var METERS = 0.0;

///////////////////////////////////////////////////////////////////////////////////////////////////
//Game object
function Game(screenWidth, screenHeight) {
	
	this.init = function(screenWidth, screenHeight) {
		
		this.canvas = this.createScreen(screenWidth, screenHeight);
		this.context = this.canvas.getContext("2d");
		this.context.font = "14px Impact";
		this.context.fillStyle = "#00ff21";
		
		this.loadImages(IMAGES);
		
		this.entities = [];
		this.mode = 'LOADING';
		
		this.bg1 = new BackGround(this, this.imageList[0], [0, 0], 4000);
		this.bg2 = new BackGround(this, this.imageList[0], [0, -SCREENDIMENSIONS[1]], 4001);
		
		var s1 = new SideWall(this, this.imageList[3], [0, 0], 100);
		var s2 = new SideWall(this, this.imageList[3], [608, 0], 101);
		var s3 = new SideWall(this, this.imageList[3], [0, -SCREENDIMENSIONS[1]], 102);
		var s4 = new SideWall(this, this.imageList[3], [608, -SCREENDIMENSIONS[1]], 103);
		
		this.entities.push(s1, s2, s3, s4);
		
		this.player = new Player(this, this.imageList[1], [(SCREENDIMENSIONS[0] / 2) - 16, 440]);
		
		this.spikeSpawnTimer = 60;
		this.keyTimer = 180;
		this.keyExists = false;
		
		this.start = true;//one-time var
		
		this.openingTimer = 60;
		this.loadingTimer = 60;
		
		this.muted = false;
		this.dieSound = new Audio('die.wav');
		this.dieSound.loop = false;
		this.openSound = new Audio('open.wav');
		this.openSound.loop = false;
		this.pickupSound = new Audio('keyPickup.wav');
		this.pickupSound.loop = false;
		this.enterSound = new Audio('enter.wav');
		this.enterSound.loop = false;
		this.music = new Audio('Crowd_Pleaser.wav');
		this.music.loop = true;
		
		this.interval = setInterval(this.updateGame, 20, this);
		
		this.keyIcon = new Entity(this, this.imageList[11], [12, (SCREENDIMENSIONS[1] - 36)]);
		this.logo = new Entity(this, this.imageList[12], [(SCREENDIMENSIONS[0] / 2) - 231, (SCREENDIMENSIONS[1] / 2) - 100]);
		this.soundIcon = new Entity(this, this.imageList[13], [617, SCREENDIMENSIONS[1] - 36]);
		
		window.addEventListener('keydown', this.setKeyDown.bind(this));//<3
        window.addEventListener('keyup', this.setKeyUp.bind(this));
		
	}
	
	this.setKeyDown = function(event) {
		
		if(this.mode == 'GAME') {
			
			if(event.keyCode == 37) { 
			
				this.player.moveLeft = true;
			
			}
			
			else if(event.keyCode == 39) {
				
				this.player.moveRight = true;
			
			}
			
			else if(event.keyCode == 38) {
				
				this.player.moveUp = true;
			
			}
			
			else if(event.keyCode == 40) {
				
				this.player.moveDown = true;
			
			}
			
			else if(event.keyCode == 77) {//m key
				
				if(this.muted == false) {
					
					this.muted = true;
					this.soundIcon.image = this.imageList[14][1];
					
					this.music.pause();
				
				}
				
				else {
					
					this.muted = false; 
					this.soundIcon.image = this.imageList[13][1];
					
					this.music.play();
					
				}
			
			}
		
		}
		
		else if(this.mode == 'MENU') {
			
			if(event.keyCode == 13) {
				
				this.entities = [];
				
				var s1 = new SideWall(this, this.imageList[3], [0, 0], 100);
				var s2 = new SideWall(this, this.imageList[3], [608, 0], 101);
				var s3 = new SideWall(this, this.imageList[3], [0, -SCREENDIMENSIONS[1]], 102);
				var s4 = new SideWall(this, this.imageList[3], [608, -SCREENDIMENSIONS[1]], 103);
		
				this.entities.push(s1, s2, s3, s4);
				
				this.player = new Player(this, this.imageList[1], [(SCREENDIMENSIONS[0] / 2) - 16, 440]);
		
				this.spikeSpawnTimer = 60;
				this.keyTimer = 180;
				this.keyExists = false;
				
				KEYS = 0;
				METERS = 0.0;
				
				this.mode = 'GAME';
				
				if(this.muted == false) {
			
					this.enterSound.play();
			
				}
				
			}
			
			else if(event.keyCode == 77) {//m key
				
				if(this.muted == false) {
					
					this.muted = true;
					this.soundIcon.image = this.imageList[14][1];
					
					this.music.pause();
				
				}
				
				else {
					
					this.muted = false; 
					this.soundIcon.image = this.imageList[13][1];
					
					this.music.play();
					
				}
			
			}
			
		}
		
	}
	
	this.setKeyUp = function(event) {
		
		if(this.mode == 'GAME') {
		
			if(event.keyCode == 37) {
				
				this.player.moveLeft = false;
				
			} 
			
			else if(event.keyCode == 39) {
				
				this.player.moveRight = false;
				
			}
			
			else if(event.keyCode == 38) {
				
				this.player.moveUp = false;
			
			}
			
			else if(event.keyCode == 40) {
				
				this.player.moveDown = false;
			
			}
		
		}
		
	}
	
	this.createScreen = function(width, height) {
		
		document.write('<canvas id="screen" width=' + width + ' height=' + height + 
					   ' style="border:1px solid #000000;"></canvas>');
		
		return document.getElementById("screen");
		
	}
	
	this.loadImages = function(images) {
		
		//imageList is in the form [['name', 'Image object', 'width', 'height'], ...]
		this.imageList = [];
		
		for(i = 0; i < images.length; i++) {
			
			img = new Image();//Image should take width and height by itself
			img.src = images[i][0];
			w = images[i][1];
			h = images[i][2];
			
			this.imageList.push([i, img, w, h]);
			
		}
		
	}
	
	this.updateGame = function(self) {
		/*
		Because this function is called by the setInterval method, it cannot
		reference the specific object attributes of the object it belongs to.
		Hence, 'this.etc.' must be reached by self here.
		*/
		
		//Update game state
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);//clear screen at first
		
		if(self.mode == 'GAME') {
			
			self.checkSpikeSpawn();
			
			self.checkKeySpawn();
			
			self.bg1.update(self.context);
			self.bg2.update(self.context);
			
			for(i = 0; i < self.entities.length; i++) {
				
				self.entities[i].update(self.context);
				
			}
			
			self.player.update(self.context);
			self.keyIcon.update(self.context);
			self.soundIcon.update(self.context);
			
			self.context.fillText(" X " + KEYS, 24, (SCREENDIMENSIONS[1] - 24));
			var m = METERS.toFixed(2);
			self.context.fillText(m + " m", 280, 12);
			
			for(i = 0; i < self.entities.length; i++) {
				
				if(self.entities[i].flagged) {
					
					self.entities.splice(i, 1);
					
				}
			
			}
			
		}
		
		else if(self.mode == 'MENU') {
			
			if(self.start == true) {
				
				self.start = false;
				
				self.music.play();
				
			}
			
			self.bg1.update(self.context);
			self.bg2.update(self.context);
			
			self.logo.update(self.context);
			
			if(self.openingTimer > 0) {
				
				self.openingTimer -= 1;
				
			}
			
			else {
				
				self.context.font = "34px Impact";
				self.context.fillStyle = "#000000";
				self.context.fillText("PRESS ENTER", 235, 380);
				
				self.context.font = "32px Impact";
				self.context.fillStyle = "#fd2229";
				self.context.fillText("PRESS ENTER", 240, 380);
				
				//put it back to normal
				self.context.font = "14px Impact";
				self.context.fillStyle = "#00ff21";
				
				self.soundIcon.update(self.context);
				
			}
			
		}
		
		else if(self.mode == 'LOADING') {
			
			if(self.loadingTimer > 0) {
				
				self.loadingTimer -= 1;
				
				self.context.font = "20px Impact";
				self.context.fillStyle = "#000000";
				self.context.fillText(" LOADING ", 240, 100);
				
				//put it back to normal
				self.context.font = "14px Impact";
				self.context.fillStyle = "#00ff21";
				
			}
			
			else { self.mode = 'MENU'; }
			
		}
		
		//document.getElementById("f").innerHTML = self.entities.toString();
		
	}
	
	this.checkSpikeSpawn = function() {
		
		if(this.spikeSpawnTimer > 0) {
			
			this.spikeSpawnTimer -= 1;
		
		}
		
		else if(this.spikeSpawnTimer == 0) {
			
			this.spikeSpawnTimer = 60;
			
			var hole = Math.floor((Math.random() * 8) + 1);
			var hole2 = false;
			
			var wide = Math.round(Math.random());
			
			if(wide == 1) {
				
				/*
				Math.round(Math.random()) gives either 1 or 0
				multiplying by 2 gives either 0 or 2
				subtracting 1 gives either 1 or -1
				*/
				var dir = Math.round(Math.random()) * 2 - 1
				
				hole2 = hole + dir
				
			}
			
			for(i = 0; i < 9; i++) {
				
				if(i == hole || (hole2 && i == hole2)) {
					
					if(wide == 0 && this.keyExists == true) {
						
						var d = new Door(this, this.imageList[10], [(i * 64) + 32, -64], 1337);
					
						this.entities.push(d);
						
					}
					
				}
				
				else {
					
					var id = Math.random() - 3;
					var check = true;
					
					while(check) {
						
						check = false;
						
						for(j = 0; j < this.entities.length; j++) {
							
							if(j.id == id) { 
							
								check = true;
								id = Math.random() - 3;
								
							}
							
						}
						
					}
					
					var w = new Wall(this, this.imageList[2], [(i * 64) + 32, -64], id);
					
					this.entities.push(w);
					
				}
				
			}
			
			this.keyExists = false;
			
		}
		
	}
	
	this.checkKeySpawn = function() {
		
		if(this.keyTimer > 0) {
			
			this.keyTimer -= 1;
			
		}
		
		else {
			
			this.keyTimer = 180;
			
			var m = Math.random() * 10;

			if(m < 7) {
				
				var k = new Key(this, this.imageList[4], [40 + Math.random() * 550, -this.spikeSpawnTimer - 31], 666);
			    this.entities.push(k);
				
				this.keyExists = true;
				
				//document.getElementById("f").innerHTML = k.y;
			}
			
		}
		
	}
	
	//initialize object
	this.init(screenWidth, screenHeight);
	
}

//Entity objects
function Player(game, imageData, position) {
	
	this.init = function(game, imageData, position) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
		
		this.fatal = false;
		
		this.id = 1;
		this.flagged = false;
		
		this.anim = [1, 5, 1, 6];
		this.animCounter = 10;
		this.currentAnim = 0;
		
		this.dead = false;
		this.dieCounter = 120;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		var xNew = this.x + xOffset;
		var yNew = this.y + yOffset;
		
		if(xNew > 0 && xNew + this.width < SCREENDIMENSIONS[0]) {
			
			this.x = xNew;
			
		}
		
		if(yNew > 0 && yNew + this.height < SCREENDIMENSIONS[1]) {
			
			this.y = yNew;
			
		}
		
		if(this.dead == true) {
			
			this.x = xNew;
			this.y = yNew;
			
		}
		
	}
	
	this.determineMove = function() {
		
		if(this.moveLeft && this.xSpeed > -5) { this.xSpeed -= 5; }
		if(this.moveRight && this.xSpeed < 5) { this.xSpeed = 5; }
		if(this.moveUp && this.ySpeed > -5) { this.ySpeed -= 5; }
		if(this.moveDown && this.ySpeed < 5) { this.ySpeed = 5; }
		
		if(this.moveLeft == false && this.xSpeed < 0) { this.xSpeed += 5; }
		if(this.moveRight == false && this.xSpeed > 0) { this.xSpeed -= 5; }
		if(this.moveUp == false && this.ySpeed < 0) { this.ySpeed += 5; }
		if(this.moveDown == false && this.ySpeed > 0) { this.ySpeed -= 5; }	
		
	}
	
	this.animate = function() {
		
		if(this.animCounter > 0) {
			
			this.animCounter -= 1;
			
		}
		
		else {
			
			this.animCounter = 10;
			
			if(this.currentAnim < 3) { this.currentAnim += 1; }
			else { this.currentAnim = 0; }
			
			this.image = this.game.imageList[this.anim[this.currentAnim]][1];
			
		}
		
	}
	
	this.die = function() {
		
		if(this.dieCounter > 0) {
			
			this.dieCounter -= 1;
			
		}
		
		else {
			
			this.game.mode = 'MENU';
			
		}
		
		this.anim = [7, 8, 9, 8];
		this.xSpeed = 0;
		this.ySpeed = WORLDSPEED;
		
	}
	
	this.update = function(context) {
		
		if(this.dead == false) {
		
			this.determineMove();
			METERS += (WORLDSPEED / 10.0);
			
		}
		
		else { this.die(); }
		
		this.move(this.xSpeed, this.ySpeed);
		
		this.animate();
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position);
	
}

function Door(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.fatal = true;
		
		this.id = "WALL";
		this.flagged = false;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.checkPlayerCollide = function() {
		
		var myLeft = this.x;
		var myRight = this.x + this.width;
		var myTop = this.y;
		var myBottom = this.y + this.height;
		
		var otherLeft = this.game.player.x + 3;
		var otherRight = this.game.player.x + this.game.player.width - 3;
		var otherTop = this.game.player.y + 3;
		var otherBottom = this.game.player.y + this.game.player.height - 3;
		
		var ret = true;
		
		if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || 
		   (myLeft > otherRight)) {
	 
			ret = false

		}
		
		return ret
		
	}
	
	this.checkKill = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.flagged = true;
		
		}
	}
	
	this.beHit = function() {
		
		if(KEYS > 0) {
			
			this.flagged = true;
			KEYS -= 1;
			
			if(this.game.muted == false) {
			
				this.game.openSound.play();
			
			}
			
		}
		
		else if(this.game.player.dead == false) {
			
			this.game.player.dead = true;
			
			if(this.game.muted == false) {
			
				this.game.dieSound.play();
			
			}
			
		}
		
	}
	
	this.update = function(context) {
		
		this.move(0, WORLDSPEED);
		this.checkKill();
		var col = this.checkPlayerCollide();
		
		if(col == true) { 
		
			this.beHit(); 
		
		}
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);
}

function Wall(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.fatal = true;
		
		this.id = "WALL";
		this.flagged = false;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.checkPlayerCollide = function() {
		
		var myLeft = this.x;
		var myRight = this.x + this.width;
		var myTop = this.y;
		var myBottom = this.y + this.height;
		
		var otherLeft = this.game.player.x + 3;
		var otherRight = this.game.player.x + this.game.player.width - 3;
		var otherTop = this.game.player.y + 3;
		var otherBottom = this.game.player.y + this.game.player.height - 3;
		
		var ret = true;
		
		if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || 
		   (myLeft > otherRight)) {
	 
			ret = false

		}
		
		return ret
		
	}
	
	this.checkKill = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.flagged = true;
		
		}
	}
	
	this.update = function(context) {
		
		this.move(0, WORLDSPEED);
		this.checkKill();
		var col = this.checkPlayerCollide();
		
		if(col == true && this.game.player.dead == false) { 
		
			this.game.player.dead = true;
			
			if(this.game.muted == false) {
			
				this.game.dieSound.play();
			
			}
			
		}
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);
}

function SideWall(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.fatal = true;
		
		this.id = id;
		this.flagged = false;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.checkReposition = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.y = -SCREENDIMENSIONS[1] + WORLDSPEED;
			
		}
		
	}
	
	this.checkPlayerCollide = function() {
		
		var myLeft = this.x;
		var myRight = this.x + this.width;
		var myTop = this.y;
		var myBottom = this.y + this.height;
		
		var otherLeft = this.game.player.x + 3;
		var otherRight = this.game.player.x + this.game.player.width - 3;
		var otherTop = this.game.player.y + 3;
		var otherBottom = this.game.player.y + this.game.player.height - 3;
		
		var ret = true;
		
		if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || 
		   (myLeft > otherRight)) {
	 
			ret = false

		}
		
		return ret
		
	}
	
	this.update = function(context) {
		
		this.move(0, WORLDSPEED);
		this.checkReposition();
		var col = this.checkPlayerCollide();
		
		if(col == true && this.game.player.dead == false) { 
		
			this.game.player.dead = true;
			
			if(this.game.muted == false) {
			
				this.game.dieSound.play();
			
			}
			
		}
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);

}

function BackGround(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.id = id;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.checkReposition = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.y = -SCREENDIMENSIONS[1] + WORLDSPEED;
			
		}
		
	}
	
	this.update = function(context) {
		
		this.move(0, WORLDSPEED);
		this.checkReposition();
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);

}

function Key(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.id = id;
		this.flagged = false;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.checkKill = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.flagged = true;
			
		}
		
	}
	
	this.checkPlayerCollide = function() {
		
		var myLeft = this.x;
		var myRight = this.x + this.width;
		var myTop = this.y;
		var myBottom = this.y + this.height;
		
		var otherLeft = this.game.player.x;
		var otherRight = this.game.player.x + this.game.player.width;
		var otherTop = this.game.player.y;
		var otherBottom = this.game.player.y + this.game.player.height;
		
		var ret = true;
		
		if((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || 
		   (myLeft > otherRight)) {
	 
			ret = false

		}
		
		return ret
		
	}
	
	this.update = function(context) {
		
		this.move(0, WORLDSPEED);
		this.checkKill();
		var col = this.checkPlayerCollide();
		
		if(col == true) { 
		
			KEYS += 1;
			this.flagged = true;
			
			if(this.game.muted == false) {
				
				this.game.pickupSound.play();
				
			}
			
		}
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);

}

function Entity(game, imageData, position, id) {
	
	this.init = function(game, imageData, position, id) {
		
		this.game = game;
		
		this.imageName = imageData[0];
		this.image = imageData[1];
		this.x = position[0];
		this.y = position[1];
		this.width = imageData[2];
		this.height = imageData[3];
		
		this.id = id;
		this.flagged = false;
		
		this.xSpeed = 0;
		this.ySpeed = 0;
		
	}
	
	this.move = function(xOffset, yOffset) {
		
		this.x += xOffset;
		this.y += yOffset;
		
	}
	
	this.setSpeed = function(x, y) {
		
		this.xSpeed = x;
		this.ySpeed = y;
		
	}
	
	this.checkKill = function() {
		
		if(this.y > SCREENDIMENSIONS[1]) {
			
			this.flagged = true;
			
		}
		
	}
	
	this.update = function(context) {
		
		this.move(this.xSpeed, this.ySpeed);
		this.checkKill();
		
		context.drawImage(this.image, this.x, this.y);
		
	}
	
	this.init(game, imageData, position, id);
	
}

//Procedural section
g = new Game(SCREENDIMENSIONS[0], SCREENDIMENSIONS[1]);