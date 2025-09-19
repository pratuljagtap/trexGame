// Sprite-based Dino Runner using p5.play + sounds

let trex, trexRunning;
let ground, invisibleGround, groundImg;
let cloudImg, obstacleImgs = [];
let gameOverImg, restartImg, gameOver, restart;

let cloudsGroup, obstaclesGroup;

let jumpSound, gameOverSound;

let score = 0;
let PLAY = 1;
let END = 0;
let gameState = PLAY;

function preload() {
  // animations
  trexRunning = loadAnimation("assets/trex1.png", "assets/trex3.png", "assets/trex4.png");

  // images
  groundImg = loadImage("assets/ground2.png");
  cloudImg = loadImage("assets/cloud.png");
  for (let i = 1; i <= 6; i++) {
    obstacleImgs[i] = loadImage("assets/obstacle" + i + ".png");
  }
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  // sounds
  jumpSound = loadSound("assets/jump.mp3");
  gameOverSound = loadSound("assets/gameover.mp3");
}

function setup() {
  const canvas = createCanvas(600, 200);
  canvas.parent("game-holder");

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trexRunning);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImg);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 80);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(300, 120);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;
}

function draw() {
  background(255);

  textSize(16);
  fill(20);
  text("Score: " + score, 500, 30);

  if (gameState === PLAY) {
    ground.velocityX = -(6 + 3 * score / 100);
    score += Math.round(getFrameRate() / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      jumpSound.play();
    }

    trex.velocityY += 0.8;

    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      gameOverSound.play();
    }
  }
  else if (gameState === END) {
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  trex.collide(invisibleGround);
  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    let cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImg);
    cloud.y = Math.round(random(80, 120));
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 220;
    cloud.depth = trex.depth;
    trex.depth += 1;

    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    let obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);

    let rand = Math.round(random(1, 6));
    obstacle.addImage(obstacleImgs[rand]);
    obstacle.scale = 0.5;
    obstacle.lifetime = 220;

    obstaclesGroup.add(obstacle);
  }
}
