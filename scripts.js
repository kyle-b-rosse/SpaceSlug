(function(){
	$(document).ready(function(){
		var game = {};

		game.stars = [];

		game.width = 550;
		game.height = 600;



		game.keys = [];

		game.projectile =[];

		game.enemies = [];

		game.score = 0;

		game.horde = 0;


		game.images = [];
		game.doneImages = 0;
		game.requiredImages = 0;

		game.gameOver = false;
		game.gameWon = false;

		game.count = 24;
		game.division = 48;
		game.left = false;
		game.enemySpeed = 2;

		game.explodeSound = new Audio("explosion.wav");
		game.shootSound = new Audio("shoot.wav");
		game.music = new Audio("music.flac");

		game.moving = false;

		game.fullShootTimer = 40;
		game.shootTimer = game.fullShootTimer;

		game.player = {
			x: game.width / 2 -50,
			y: game.height - 110,
			width: 100,
			height: 100,
			speed:3,
			rendered: false
		};

		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
		game.contextEnemies = document.getElementById("enemiesCanvas").getContext("2d");

		function createEnemies() {
			for(y = 0; y < 3; y ++){
				for(x = 0; x < 4; x++){
					game.enemies.push({
						x: (x * 120) + (10 * x) + 30,
						y: (y * 100) + 40 + (10 * y),
						width: 70,
						height: 70,
						image: 1,
						dead: false,
						deadTime: 20,
						
					});
				}
			}
		game.horde ++;
		console.log(game.horde);
		}


		

		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});
		

		

		$(document).keyup(function(e){

			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		function addBullet(){
			game.projectile.push({
				x: game.player.x,
				y: game.player.y,
				size: 20,
				image: 2

			});
		}



		function init(){
			for(i = 0; i < 600; i++){
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: Math.floor(Math.random() * game.height),
					size: Math.random() * 5,
				});
			}
	
		createEnemies();
			loop()
			setTimeout(function(){
				game.moving = true;
			}, 130600);
		}  

		function addStars(num){
			for(i = 0; i < num; i++){
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: game.height + 10,
					size: Math.random() * 5,
				});
			}
		}

		function addStars2(num){
			for(i = 0; i < num; i++){
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: game.height + 10,
					size: Math.random() * 20,
				});
			}
		}		

		// up - 38
		// down - 40
		// left - 37
		// right - 39
		// 
		// w - 87
		// a - 65
		// s - 83
		// d - 68
		// 
		// space - 32
		// 
		
		

		function update(){			
			addStars(1);
			if(game.count > 1000000)game.count = 0;
			game.count++;
			if(game.score > 100){
				game.fullShootTimer = 10;
			}
			if(game.score > 500){
				game.fullShootTimer = 2;
			}
			if(game.count > 6000){
				addStars(false);
				addStars2(1);
			}
			if(game.shootTimer > 0)game.shootTimer --;

			if(game.count > 13500){
				game.gameOver = true;
			}

			for(i in game.stars){
				if(game.stars[i].y <= -20){
					game.stars.splice(i, 1);
				}
				game.stars[i].y--;
			}
			if(game.keys[37] || game.keys[65]){
			  if(!game.gameOver){
				if(game.player.x > -10){
					game.player.x-=game.player.speed;
					game.player.rendered = false;
				}
			  }				
			}if(game.keys[39] || game.keys[68]){
				if(!game.gameOver){
				if(game.player.x <= game.width - game.player.width + 10){
					game.player.x+=game.player.speed;
					game.player.rendered = false;
				}
			  }
			}if(game.keys[38] || game.keys[87]){
			  if(!game.gameOver){
				if(game.player.y > -20){
					game.player.y-=game.player.speed;
					game.player.rendered = false;
			  }
			}
			}if(game.keys[40] || game.keys[83]){
			  if(!game.gameOver){
				if(game.player.y <= game.height - game.player.height -2){
					game.player.y+=game.player.speed;
					game.player.rendered = false;
				}
			  }
				
			}
			if(game.count % game.division === 0){
				game.left = !game.left;
			}
			for(i in game.enemies){
				if(!game.moving){
					if(game.left){
						game.enemies[i].x -= game.enemySpeed;
					}else{
						game.enemies[i].x += game.enemySpeed;
					}
				}
				if(game.moving){
						game.enemies[i].y++;
					}
					if(game.enemies[i].y >= game.height){				
						game.contextEnemies.clearRect(game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
						game.enemies.splice(i, 1);
					}
			}
				
		
		for(i in game.projectile){
			game.projectile[i].y-=3;
			if(game.projectile[i].y <= -game.projectile[i].size){
				game.projectile.splice(i, 1);
			}
			
		}
		if(game.keys[32] && game.shootTimer <= 0){
			addBullet();
			game.shootSound.play();
			game.shootTimer = game.fullShootTimer;
}
		for(m in game.enemies){
			for(p in game.projectile){
				if(collision(game.enemies[m], game.projectile[p])){
					game.enemies[m].dead = true;
					game.explodeSound.play();
					game.enemies[m].image = 3;
					game.score += 1;
					game.contextEnemies.clearRect(game.projectile[p].x, game.projectile[p].y, game.projectile[p].size, game.projectile[p].size);
					game.projectile.splice(p, 1);
	
				}
			}
		}
		for(i in game.enemies){
			if(game.enemies[i].dead){
				game.enemies[i].deadTime--;
			}
			if(game.enemies[i].dead && game.enemies[i].deadTime <= 0){
				game.contextEnemies.clearRect(game.enemies[i].x, game.enemies[i].y, game.enemies[i].width, game.enemies[i].height);
				game.enemies.splice(i, 1);
			}
		}
		if(game.enemies.length <= 0){
			if(!game.gameOver){
			createEnemies();
		}
			
		}
	}

		function render(){
			game.contextBackground.clearRect(0, 0, game.width, game.height);
			game.contextEnemies.clearRect(0, 0, game.width, game.height);
			game.contextBackground.fillStyle = "white";
			game.contextEnemies.font = "bold 50px  VT323";
			game.contextEnemies.fillStyle= "red";
			game.contextEnemies.fillText(game.score, game.width/2 -30, game.height-570);

			for(i in game.stars){
				var star = game.stars[i];
				game.contextBackground.fillRect(star.x, star.y, star.size, star.size);
			}
			if(!game.player.rendered){
				game.contextPlayer.clearRect(game.player.x, game.player.y , game.player.width +10, game.player.height + 2);
				game.contextPlayer.drawImage(game.images[0], game.player.x, game.player.y, game.player.width, game.player.height);
				game.player.rendered = true;
			}
			for(i in game.enemies){
				var enemy = game.enemies[i];
				game.contextEnemies.clearRect(enemy.x, enemy.y, enemy.width, enemy.height);
				game.contextEnemies.drawImage(game.images[enemy.image], enemy.x, enemy.y, enemy.width, enemy.height);
			}
			for(i in game.projectile){
				var proj = game.projectile[i]
				game.contextEnemies.clearRect(proj.x -3, proj.y +20, proj.size +5, proj.size +5);
				game.contextEnemies.drawImage(game.images[proj.image], proj.x, proj.y, proj.size, proj.size);	
			}
			if(game.gameOver){
				game.contextPlayer.font = "bold 50px VT323";
				game.contextPlayer.fillStyle= "white";
				game.contextPlayer.fillText("Game Over", game.width / 2 - 130, game.height / 2 - 25);
			}	
			if(game.gameWon){
				game.contextPlayer.font = "bold 50px VT323";
				game.contextPlayer.fillStyle= "white";
				game.contextPlayer.fillText("You Win!", game.width / 2 - 130, game.height / 2 - 25);
			}
		}

		function loop(){
			requestAnimFrame(function() {
				loop();
			});
			update();
			render();
			
		}

		function initImages(paths){
			game.requiredImages = paths.length; 
			for(i in paths){
				var img = new Image;
				img.src = paths[i];
				game.images[i] = img;
				game.images[i].onload = function(){
					game.doneImages++;
				}
			}
		}

		function collision(first, second){
			//create enemy object
				return !(first.x  > second.x + second.size || 
					first.x + first.width < second.x || 
					first.y > second.y + second.size||
					first.y + first.height < second.y);

		}

		function checkImages(){
			if(game.doneImages >= game.requiredImages){
				init();
			} else {
				setTimeout(function(){
					checkImages();
				}, 1);
				
			}
		}
		game.contextBackground.font = "bold 50px VT323";
		game.contextBackground.fillStyle= "white";
		game.contextBackground.fillText("loading", game.width / 2 - 100, game.height / 2 - 250);
		initImages(["coolSlug2.png" , "ship.png", 'moonRock.png', "faceYeah.png" ]);
		checkImages();
		

	});
})();

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();