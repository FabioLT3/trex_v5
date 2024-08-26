
var trex ,trexrun, piso, pisohb, nubes, lose, GO,obs, obsGroup,cloudGroup;
var o1, o2, o3, o4, o5, o6;
var puntos = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var restart,res,fail;
var up, coll, checkpoint;
var letra;
var salto = false;


function preload(){
  trexrun = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  piso = loadAnimation("ground2.png");
  nubes=loadImage("nube.png");
  lose = loadAnimation("trex_collided.png");
  GO = loadImage("gameOver.png");
  reset = loadImage("reset.jpeg");

  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");

  //sonidos
  up = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  coll = loadSound("die.mp3");

  letra = loadFont("PressStart2P.ttf");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //crear sprite de Trex
 trex = createSprite(50,height - 52,20,50);
 trex.addAnimation("runing", trexrun);
 trex.addAnimation("collide", lose);
 trex.scale = 0.5;
 trex.x = 50;
 trex.setCollider("circle", 0, 0, 40);

 //piso y obstaculos
 ground = createSprite(width/2,height -40,600,20);
 ground.addAnimation("ground", piso);
 ground.x = ground.width/2;
 
 pisohb = createSprite(width/2,height -30,width,1);
 pisohb.visible = false;

 //letreros
 fail = createSprite(width/2,height/2 - 50);
 fail.addImage(GO);
 fail.visible = false;

 res = createSprite(width/2,height/2);
 res.addImage(reset);
 res.scale = 0.7;
 res.visible = false;

 //grupos
 obsGroup = new Group();
 cloudGroup = new Group();

 //experimentos de debug xd
 //trex.debug = true

}

function draw(){
  background("white");
  //puntaje
  textSize(7);
  fill("black");
  textFont(letra);
  text("puntuación: "+puntos,width/1.5,height/10);
 
  //estado de juego
  
  if (gameState === PLAY) { // cuando el juego este en play
    ground.velocityX = -(6 + 3*puntos/1000);
    jump();
    puntos = puntos + Math.round(getFrameRate()/30);
    chp();
    
    if (trex.isTouching(obsGroup)) {
      gameState = END;
      coll.play();
    }
    spawnCloud();
    spawnObstacles();
    if (ground.x < 0) {
      ground.x = ground.width/2;
    }
    
  } else if (gameState === END) { //cuando el juego este en end
    ground.velocityX = 0;
    obsGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);

    obsGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);

    trex.changeAnimation("collide", lose);

    fail.visible = true;
    res.visible = true;

    //boton de reset
    if (mousePressedOver(res)) {
      gameState = PLAY;
      puntos = 0;

      trex.changeAnimation("runing", trexrun);

      obsGroup.destroyEach();
      cloudGroup.destroyEach();

      fail.visible = false;
      res.visible = false;
    }
  }

  // salto
  trex.velocityY += 0.8;
  trex.collide(pisohb);

drawSprites();
}

//--------------------------funciones---------------------------------------------------------------------
//generar nubes
function spawnCloud() {
  if (frameCount % 100 === 0) {  
    cloud = createSprite(width - 5,height/2,40,10);
    cloud.y = Math.round(random(height/3 ,height/2));
    cloud.scale = random(0.5, 2);
    cloud.addImage(nubes);
    cloud.velocityX = -(3 + 3*puntos/1000);

    cloud.lifetime = 400;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if (frameCount  % 60 === 0) {
    obs = createSprite(width - 5,height - 50,10,40);
    obs.velocityX = -(6 + 3*puntos/1000);
    obs.scale = 0.5;
    obs.lifetime = 400;
    obs.depth = trex.depth;
    trex.depth = trex.depth + 1;
  
    var skinObs = Math.round(random(1,6));
    switch(skinObs) {
      case 1: obs.addImage(o1);
        break;
      case 2: obs.addImage(o2);
        break;
      case 3: obs.addImage(o3);
        break;
      case 4: obs.addImage(o4);
        break;
      case 5: obs.addImage(o5);
        break;
      case 6: obs.addImage(o6);
        default:break;
    }
    obsGroup.add(obs);
  }
}

function chp() {
  if (puntos > 0 && puntos%1000 === 0) {
    checkpoint.play();
  }
}

function jump() {
  
  if (trex.y >= height - 52) {
    trex.y = height - 52;
    trex.velocityY = 0;
    salto = false;
  }
  if (keyDown("space") && !salto) {
    salto = true;
    trex.velocityY = -12;
    up.play();
  }
}
