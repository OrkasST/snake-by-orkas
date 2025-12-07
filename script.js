import { map } from "./src/map.js";

const canvas = document.getElementById('gameScreen');
const ctx = canvas.getContext('2d');
const start = document.getElementById('startGame');
const quiteGame = document.getElementById('quiteGame');
const outputTimer = document.getElementById('timer');
const mainHeader = document.querySelector('.mainHeader');
const wrapper = document.querySelector('.wrapper');

const theme = document.getElementById('theme');
const eat = document.getElementById('eat');
const gameover = document.getElementById('gameover');
const immortality_sound = document.getElementById('immortality');


let score = 0;
let highScore = 0;
const box = 20;
let game = true;
//let chngPlayerPos = true;
let musicInterval;


window.onload = () => {

	setTimeout(() => {
		mainHeader.style.width = '47rem';
	}, 199);
	setTimeout(() => {
		mainHeader.classList.add('_border');
	}, 200);
	setTimeout(() => {
		mainHeader.classList.remove('_border');
	}, 1202);
	setTimeout(() => {
		mainHeader.classList.remove('_centered');
	}, 1205);
	setTimeout(() => {
		wrapper.classList.remove('_hidden');
	}, 2206);

	setTimeout(() => {
		startGame();
	}, 20);
	endGame();

}


	
start.onclick = () => {
		game = true;
		ctx.clearRect(0,0,800,800);
		startGame();

		theme.play();
		musicInterval = setInterval(() => {
			theme.currentTime = 0;
		}, 65000);

		quiteGame.removeAttribute('disabled');
		start.classList.add('_hidden');
		quiteGame.classList.remove('_hidden');
}
function loadingScreen() {
	ctx.beginPath();
	ctx.fillStyle = '#555';
	ctx.fillRect(0,0,800,800);
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.font = '50px "Fredericka the Great"';
	ctx.fillText('Press "Start Game" to begin...', 60, 400);
	ctx.closePath();
}

// media loading


let enemyTexture = new Image();
enemyTexture.src = 'media/img/enemy_texture.png';
let wallTexture = new Image();
wallTexture.src = 'media/img/Brick_for_walls_2.png';

let Body = new Image();
Body.src = 'media/img/player_animation.png';
let buffedBody = new Image();
buffedBody.src = 'media/img/buffed_body.png';
let playerBody = Body;
let sx = 0, animInd = 0;

let Tail = new Image();
Tail.src = 'media/img/tail.png';
let buffedTail = new Image();
buffedTail.src = 'media/img/buffed_tail.png';
let playerTail = Tail;

let backgroundImg = new Image();
backgroundImg.src = 'media/img/background_2.png';

backgroundImg.onload = () => {
	loadingScreen();
	start.classList.remove('_hidden');
}

let player = [];
player[0] = {x: 2*box, y: 2*box};
let ignoreWalls = false, immortality = false;
let playerColor = '#fff';

let enemy = {x: 0, y: 0};

let directionX = 2, directionY = 2;
let enemyCreated = false;	

let wall = map;

function createWall() {
	for (let a = 0; a < 40; a++){
		for (let b = 0; b < 40; b++) {
			if (wall[a][b] == 1){
				ctx.beginPath();
				ctx.drawImage(wallTexture, b*20, a*20, 20, 20);
				ctx.closePath();
			}
		}
	}
}

function startGame() {
	if (game == true){
		ctx.clearRect(0,0,800,800);
		ctx.drawImage(backgroundImg, 0, 0);

		//if (score > 7) {
			//if (chngPlayerPos) {
				//player[0].x = 2*box;
				//player[0].y = 2*box;
				//chngPlayerPos = false;
			//}
			createWall();
		//}

		createEnemy();

		
	ctx.beginPath();
	ctx.drawImage(enemyTexture, enemy.x, enemy.y, 20, 20);
	ctx.closePath();

		if (animInd != 3) {
			animInd++;
		} else {
			if (sx < 9){
				sx += 1;
			} else {
				sx = 0;
			}
			animInd = 0;
		}


		for (let i = player.length-1; i >= 0 ; i--){
			if (i == 0) {
				ctx.drawImage(playerBody, sx*40, 0, 40, 40, player[i].x, player[i].y, 40, 40);

			} else {
				ctx.drawImage(playerTail, player[i].x, player[i].y, 40, 40);
			}
		}


		let playerX = player[0].x, playerY = player[0].y;

		enemyDefeatCheck(playerX, playerY);
		//if (score > 7) {
			wallCollisionCheck(playerX, playerY);
		//}

		if (score > 1 && score % 20 == 0 && immortality == false) {
			ignoreWalls = true;
			startCountdown();
		}

		if (directionX == 0) playerX -= 3;
		if (directionX == 1) playerX += 3;
		if (directionY == 0) playerY -= 3;
		if (directionY == 1) playerY += 3;
		if (directionX == 2 && directionY == 2) { 
			for (let j = 0; j < player.length; j++) { 
				player[j].x = player[j].x;
				player[j].y = player[j].y;
			} 
		}

		if (playerX >= 800) {
			playerX = 0;
		}
		if (playerX+20 <= 0) {
			playerX = 800;
		}
		if (playerY >= 800) {
			playerY = 0;
		}
		if (playerY+20 <= 0) {
			playerY = 800;
		}

		let newHead = {
			x: playerX,
			y: playerY
		};
		player.unshift(newHead);

		requestAnimationFrame(startGame);
		//setTimeout(startGame, 30);
	}
}

//Add controls
document.addEventListener('keydown', (event) => {
	if (event.keyCode == 39 || event.keyCode == 37 || 
		event.keyCode == 68 || event.keyCode == 65 ||
		event.keyCode == 38 || event.keyCode == 40 || 
		event.keyCode == 87 || event.keyCode == 83 ||
		event.keyCode == 32) {
		event.preventDefault();
	}
	//console.log(event.keyCode);
	if (event.keyCode == 38){
		directionY = 0;//up
	}
	else if (event.keyCode == 39) {
		directionX = 1;//right
	}
	else if (event.keyCode == 40){
		directionY = 1;// down
	}
	else if (event.keyCode == 37){
		directionX = 0;// left
	}


	else if (event.keyCode == 87){
		directionY = 0;// up
	}
	else if (event.keyCode == 68){
		directionX = 1;// right
	}
	else if (event.keyCode == 83){
		directionY = 1;// down
	}
	else if (event.keyCode == 65){
		directionX = 0;// left
	}
});

document.addEventListener('keyup', (event) => {
	if (event.keyCode == 39 || event.keyCode == 37 || event.keyCode == 68 || event.keyCode == 65 ) {
		directionX = 2;
	}
	if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 87 || event.keyCode == 83 ) {
		directionY = 2;
	}
});



//tecnic events
function endGame() {
	game = false;
	enemyCreated = false;
	score = 0;
	document.getElementById('count').innerHTML = score;
	ctx.clearRect(0,0,800,800);
	loadingScreen();
	player[0].x = 20;
	player[0].y = 20;
}

function createEnemy() {
	if (enemyCreated == false) {
		enemy.x = Math.floor(40*Math.random())*box;
		enemy.y = Math.floor(40*Math.random())*box;
		enemyCreated = true;
	}
}

function enemyDefeatCheck(playerX, playerY) {
	if (playerX <= enemy.x+10 && playerX+40 >= enemy.x+10 && playerY <= enemy.y+10 && playerY+40 >= enemy.y+10) {
		eat.play();
		enemyCreated = false;
		createEnemy();
		score++;
		document.getElementById('count').innerHTML = score;
		if (highScore < score) {
			highScore = score;
			document.getElementById('highScore').innerHTML = highScore;
		}
	} else {
		player.pop();
		if (player.length > score){
			for (let i = player.length; i > score; i--){
				player.pop();
			}
		}
	}
}

function wallCollisionCheck(playerX, playerY) {
	if (!ignoreWalls) {
		for (let a = playerX; a <= playerX+40; a++){
			for (let b = playerY; b <= playerY+40; b++){
				let X = Math.floor(a/20), Y = Math.floor(b/20);

				if (X >= 0 && Y >= 0 && X < 40 && Y < 40){
					if (wall[Y][X] == 1) {
						gameover.play();
						score = 0;
						//chngPlayerPos = true;
						enemyCreated = false;
						document.getElementById('count').innerHTML = score;
						immortality = false;break;
					}
				}
			}
		}
	}

	for (let a2 = enemy.x; a2 <= enemy.x+10; a2++){
		for (let b2 = enemy.y; b2 <= enemy.y+10; b2++){
			let X2 = Math.floor(a2/20), Y2 = Math.floor(b2/20);
			if (X2 >= 0 && Y2 >= 0 && X2 < 40 && Y2 < 40){
				if (wall[Y2][X2] == 1) {
					enemyCreated = false;			
					createEnemy();break;
				} 
			}
		}
	}
}
let seconds = 0, countdown;

function startCountdown() {
	seconds = 5;
	document.getElementById('buff').classList.remove('_hidden');
	outputTimer.innerHTML = seconds;
	playerBody = buffedBody;
	playerTail = buffedTail;
	immortality = true;
	immortality_sound.play();
	let scoreCheck = score;
	countdown = setInterval(() => {
		outputTimer.innerHTML = --seconds;
		if (seconds <= 0) {
			clearInterval(countdown);
			document.getElementById('buff').classList.add('_hidden');
			playerBody = Body;
			playerTail = Tail;
			ignoreWalls = false;
			immortality_sound.pause();
			immortality_sound.currentTime = 0;
			if (scoreCheck < score){
				immortality = false;
			}
		}
	}, 1000);
}


quiteGame.onclick = () => {
	theme.pause();
	endGame();
	start.classList.remove('_hidden');
	quiteGame.classList.add('_hidden');
}

window.addEventListener('resize', e => {
  document.body.style.zoom = 1/devicePixelRatio;
  document.body.style['-moz-transform'] = `scale(${1/devicePixelRatio})` ;
});
