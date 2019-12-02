let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

let app = new PIXI.Application({
  width: 800,
  height: 700
});

//Player
let graphic = createCircle(circleC.position.x, circleC.position.y, 15);

//Todo: make object class
//rope circle Positions
let ropeArea1 = createCircle(circleD.position.x, circleD.position.y, 40, true);
let ropeArea2 = createCircle(circleE.position.x, circleE.position.y, 40, true);
let ropeArea3 = createCircle(circleF.position.x, circleF.position.y, 40, true);

//Todo: make object class
//rects
let rectA = createRectangle(recA.position.x, recA.position.y, 40, 40, true);
let rectB = createRectangle(recB.position.x, recB.position.y, 40, 40);
let rectC = createRectangle(recC.position.x, recC.position.y, 40, 40);
let rectD = createRectangle(recD.position.x, recD.position.y, 250, 40, true);
let rectE = createRectangle(recE.position.x, recE.position.y, 600, 20);
let rectF = createRectangle(recF.position.x, recF.position.y, 500, 20);
let rectG = createRectangle(recG.position.x, recG.position.y, 600, 20);
let rectL = createRectangle(recL.position.x, recL.position.y, 40, 1000);
let rectM = createRectangle(recM.position.x, recM.position.y, 1000, 1000);
//Movers
let rectH = createRectangle(0, 0, 40, 40, true);
let rectI = createRectangle(0, 0, 40, 40, true);
let rectJ = createRectangle(0, 0, 40, 40, true);
let rectK = createRectangle(0, 0, 40, 40, true);



centerPivotAndRotate(rectF, recF, 500, 20);
centerPivotAndRotate(rectG, recG, 600, 20);

function centerPivotAndRotate(objectA, objectB, width, height) {
  objectA.position.x = objectB.position.x;
  objectA.position.y = objectB.position.y;
  objectA.pivot.x = objectB.position.x + width/2;
  objectA.pivot.y = objectB.position.y + height/2;
  objectA.angle = objectB.angle * (180/Math.PI);
}

//Obstacles
function drawSpike(posX, posY, amount) {
  var spikes = new PIXI.Graphics();
  for (i = 0; i < amount; i++) {
    createSpike(posX  + (52 * i), posY + 50, 50);
  }

  return spikes;
}

//Todo: make object class
var spikesA = drawSpike(40, 400, 9)
var spikesB = drawSpike(40, 1200, 4);
var spikesC = drawSpike(700, 1750, 2);
var spikesD = drawSpike(0, 2490, 3);
var spikesE = drawSpike(400, 2490, 8);
var spikesF = drawSpike(-10, 2700, 9);
var spikesG = drawSpike(760, 2700, 2);
var spikesH = drawSpike(0, 2900, 4);
var spikesI = drawSpike(600, 2900, 7);
var spikesJ = drawSpike(100, 3100, 14);



//Ropes
let ropesInWorld = [];
for (i = 0; i < engine.world.composites.length; i++) {
  if (engine.world.composites[i].label == "Stack Chain") {
    ropesInWorld.push(engine.world.composites[i]);
  }
}

let ropeGraphs = [];
// app.stage.addChild(rope);

//Pair list
var ropeAreas = [];

var addPair = function (myValue) {
  ropeAreas.push(myValue);
};

addPair(ropeArea1);
addPair(ropeArea2);
addPair(ropeArea3);

var raIndex = 0;
function destroyGraphic(objectLabel) {
  ropeAreas[raIndex].clear();
  raIndex ++;
}

app.ticker.add(animate);

function drawRopes() {
  for (i = 0; i < ropesInWorld.length; i++) {
    ropeGraphs[i].clear();
    ropeGraphs[i].lineStyle(4, 0xffffff);
    var tmpContraint = ropesInWorld[i].constraints[ropesInWorld[i].constraints.length - 2]
    if (tmpContraint.bodyB) {
      ropeGraphs[i].moveTo(tmpContraint.bodyB.position.x + tmpContraint.pointB.x,
        tmpContraint.bodyB.position.y + tmpContraint.pointB.y);
      ropeGraphs[i].lineTo(ropesInWorld[i].bodies[0].position.x, ropesInWorld[i].bodies[0].position.y);
    }

    for (let j = 0; j < ropesInWorld[i].bodies.length - 1; j++) {
        ropeGraphs[i].moveTo(ropesInWorld[i].bodies[j].position.x, ropesInWorld[i].bodies[j].position.y)
        ropeGraphs[i].lineTo(ropesInWorld[i].bodies[(j + 1)].position.x, ropesInWorld[i].bodies[(j + 1)].position.y);
    };


    ropeGraphs[i].moveTo(ropesInWorld[i].bodies[ropesInWorld[i].bodies.length - 1].position.x, ropesInWorld[i].bodies[ropesInWorld[i].bodies.length - 1].position.y)
    var tmpContraint = ropesInWorld[i].constraints[ropesInWorld[i].constraints.length - 1]
    ropeGraphs[i].lineTo(tmpContraint.bodyB.position.x + tmpContraint.pointB.x,
    tmpContraint.bodyB.position.y + tmpContraint.pointB.y);
  }
}

function drawRectangle(object, matterObj) {
  object.clear();
  object.beginFill(0x00ff00);
  object.drawRect(matterObj.position.x, matterObj.position.y, 40, 40);
  object.endFill();
}

function animate() {

  //Move camera
  app.stage.pivot.y = followTarget.position.y;
  app.stage.position.y = 700/2;

  //Moveable object in here
  graphic.clear();
  if (alive) {
    graphic.beginFill(0x00ff00);
    graphic.drawCircle(circleC.position.x, circleC.position.y, 15);
    graphic.endFill();
  }

  drawRopes();

  //Moveable rectangles
  drawRectangle(rectA, recA);
  drawRectangle(rectH, recH);
  drawRectangle(rectI, recI);
  drawRectangle(rectJ, recJ);
  drawRectangle(rectK, recK);

  rectD.clear();
  rectD.beginFill(0x00ff00);
  centerPivotAndRotate(rectD, recD, 250, 40)
  rectD.drawRect(recD.position.x, recD.position.y, 250, 40);
  rectD.endFill();
};

let alive = true;
function destroyPlayer() {
  let text = new PIXI.Text('Press "F5" to try again', {fontFamily : 'Arial', fontSize: 40, fill : 0xFFFFFF, align : 'center'});
  text.x = 800 / 2;
  text.anchor.set(0.5);
  text.y = circleC.position.y - 200;
  app.stage.addChild(text);
  alive = false;
  graphic.clear();
}

function updateRopeGraphs() {
  for (i = 0; i < ropeGraphs.length; i++) {
    ropeGraphs[i].clear();
    app.stage.removeChild(ropeGraphs[i]);
  }
  //Ropes to draw
  for (i = 0; i < ropesInWorld.length; i++) {
    ropeGraphs[i] = new PIXI.Graphics();
  }

  for (i = 0; i < ropeGraphs.length; i++) {
    app.stage.addChild(ropeGraphs[i]);
  }
}

updateRopeGraphs();


//drawShapes
function createRectangle(posX, posY, width, height, dynamic) {
  var graphic = new PIXI.Graphics();

  // if (dynamic) {
  graphic.pivot.x = (width / 2);
  graphic.pivot.y = (height / 2);
  // console.log(graphic.pivot);
  // }

  graphic.lineStyle(2, 0x00ff00);
  graphic.drawRect(posX, posY, width, height);
  graphic.endFill();

  app.stage.addChild(graphic);

  return graphic;
}

//create Circle
function createCircle(posX, posY, width, ropeTarget) {
  var graphic = new PIXI.Graphics();

  if (ropeTarget) {
    graphic.lineStyle(2, 0x00ff00);
    graphic.drawCircle(posX, posY, width);
    graphic.endFill();
  } else {
    graphic.beginFill(0x00ff00);
    graphic.drawCircle(posX, posY, width);
    graphic.endFill();
  }

  app.stage.addChild(graphic);

  return graphic;
}


//create Spike
function createSpike(xPos, yPos, width)
{
  var spike = new PIXI.Graphics();

  spike.x = xPos;
  spike.y = yPos;

  var spikeWidth = width,
  spikeHeight = spikeWidth,
  spikeHalfway = spikeWidth/2;

  // draw spike
  spike.beginFill(0xFF0000, 1);
  spike.lineStyle(0, 0xFF0000, 1);
  spike.moveTo(spikeWidth, 0);
  spike.lineTo(spikeHalfway, -spikeHeight);
  spike.lineTo(0, 0);
  spike.lineTo(spikeHalfway, 0);
  spike.endFill();

  app.stage.addChild(spike);
}
