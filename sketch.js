// agregamos los estados del juego
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//creamos las variables de Trex y el suelo
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//creamos las varibles para las nubes y obstáculos
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//cramos variables para el score
var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var message;


function preload(){
  //precargamos las animaciones e imagenes del juego
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  message = "this is a message";
  
  
  //creamos los Sprites del trex y añadimos animación
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  //creamos los Sprites del suelo y añadimos animación
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creamos Sprites de game over y reset y añadimos animación
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  //dimos escala a game over y restart
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //creamos un suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  //establece la forma y tamaño del colisionador
  trex.setCollider("circle",0,0,40);
  //activa el radio de colisión
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //muestra la puntuación
  text("Score: "+ score, 500,50);
  

  //estado de Play
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //mueve el suelo
    ground.velocityX = -(4+3*score/100);
    
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score% 100 ===0){
    checkPointSound.play();
    }
    
    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //salta cuando la tecla de espacio es presionada
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
      jumpSound.play(); 
    }
    
    //damos gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //dibuja las nubes
    spawnClouds();
  
    //dibuja los obstáculos en el suelo
    spawnObstacles();
    //si Trex choca con cualquier obstáculo el juego termina
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     //detiene el suelo
      ground.velocityX = 0;
     //detiene salto del Trex
      trex.velocityY = 0;
     
      //cambia la animación  del Trex
      trex.changeAnimation("collided", trex_collided);
     
      //ciclo de vida de los obstáculos para que nunca sean destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    console.log("reinicia el juego");
    reset();
  }
  
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach ();
  trex.changeAnimation("running", trex_running);
  score=0;
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(6+ score/100);
   
    //generamos obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assignamos tiempo de vida a la nube
    cloud.lifetime = 134;
    
    //damos profundidad a nubes y trex
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

