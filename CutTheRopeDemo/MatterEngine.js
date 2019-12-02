// module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Body = Matter.Body,
Composite = Matter.Composite,
Composites = Matter.Composites,
Constraint = Matter.Constraint,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
World = Matter.World,
Bodies = Matter.Bodies,
Events = Matter.Events;



// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {width: 800, height: 700}
});

var addToWorld = [];
//Create spikes
function createSpikes(posX, posY, length) {
  var spikes = Composites.stack(posX, posY, length, 1, 15, 15, function(x, y) {
    return Bodies.polygon(x, y, 3, 30, {isStatic: true});
  });

  for (i = 0; i < spikes.bodies.length; i++) {
    Body.rotate(spikes.bodies[i], Math.PI/2);
  }
  return spikes;
}

//Create rope
function createRope(posX, posY, length, objectToConnectA, objectToConnectB) {
  var group = Body.nextGroup(true);

  //Makes stack of boxes
  var boxes = Composites.stack(posX, posY, length, 1, 0, 0, function(x, y) {
    return Bodies.rectangle(x, y, 20, 8, { frictionAir : 0, isSensor: true });
  });

  //Make a chain out of these boxes
  var chain = Composites.chain(boxes, 0.5, 0, -0.5, 0, { stiffness: 0, length: length, render: { type: 'line' } });

  if (objectToConnectA && objectToConnectB) {
    Composite.add(boxes, Constraint.create({
      bodyA: boxes.bodies[0],
      bodyB: objectToConnectA,
      pointB: {x: 0, y: 20},
      length: 20,
      stiffness: 0
    }));

    Composite.add(boxes, Constraint.create({
      bodyA: boxes.bodies[boxes.bodies.length - 1],
      bodyB: objectToConnectB,
      pointA: {x: 10 , y: 0},
      pointB: {x: objectToConnectA.position.x - objectToConnectB.position.x, y: -20},
      length: 20,
      stiffness: 0
    }));

    ropes.push(chain);
    return chain;
  }

  //Hanging point
  if (objectToConnectA) {
    Composite.add(boxes, Constraint.create({
      bodyA: boxes.bodies[0],
      bodyB: objectToConnectA,
      pointB: { x: 0, y: 20 },
      stiffness: 0
    }));
  } else {
    Composite.add(boxes, Constraint.create({
      bodyA: boxes.bodies[0],
      pointB: { x: posX - 10, y: posY },
      stiffness: 0
    }));
  }

  //Attach point
  Composite.add(boxes, Constraint.create({
    pointA: {x: 10 , y: 0},
    bodyA: boxes.bodies[boxes.bodies.length - 1],
    bodyB: circleC,
    length: 40,
    stiffness: 0
  }));


  return chain;
}

//Circles
//Needs to be first created object!
var circleC = Bodies.circle(300, 200, 15, { friction: 0, airFriction: 0, label: "hero" });

//rope circle Positions
var circleD = Bodies.circle(580, 400, 40,{ isStatic: true, isSensor: true });
var circleE = Bodies.circle(750, 1480, 40,{ isStatic: true, isSensor: true });
var circleF = Bodies.circle(50, 2050, 40,{ isStatic: true, isSensor: true });

//Rectangles
var recA = Bodies.rectangle(0, 0, 40, 40, { isStatic: true, label: "movingBox" });
var recB = Bodies.rectangle(680, 600, 40, 40, { isStatic: true });
var recC = Bodies.rectangle(420, 600, 40, 40, { isStatic: true });
var recD = Bodies.rectangle(550, 700, 250, 40);
var recE = Bodies.rectangle(500, 900, 600, 20, { isStatic: true });
var recF = Bodies.rectangle(480, 1350, 500, 20, { isStatic: true });
Body.rotate( recF, Math.PI/6);
var recG = Bodies.rectangle(400, 1900, 600, 20, { isStatic: true });
Body.rotate( recG, -Math.PI/8);
var recH = Bodies.rectangle(0, 0, 40, 40, { isStatic: true, label: "movingBox" });
var recI = Bodies.rectangle(0, 0, 40, 40, { isStatic: true, label: "movingBox" });
var recJ = Bodies.rectangle(0, 0, 40, 40, { isStatic: true, label: "movingBox" });
var recK = Bodies.rectangle(0, 0, 40, 40, { isStatic: true, label: "movingBox" });
var recL = Bodies.rectangle(-10, 3600, 40, 1000, { isStatic: true });
var recM = Bodies.rectangle(400, 4000, 1000, 1000, { isStatic: true });
var recN = Bodies.rectangle(400, 3700, 800, 700, { isStatic: true, label: "winArea", isSensor: true });


//Ropes
var ropes = [];
var ropeA = createRope(100, 50, 4);
var ropeB = createRope(400, 50, 8);
var ropeC = createRope(recB.position.x, recB.position.y, 4, recB, recD);
var ropeD = createRope(recC.position.x, recC.position.y, 4, recC, recD);

var followTarget = Bodies.rectangle(400, 100, 1, 1,{ isStatic: true, isSensor: true });

//obstacles
var spikesA = createSpikes(40, 400, 9);
var spikesB = createSpikes(40, 1200, 4);
var spikesC = createSpikes(700, 1750, 2);
var spikesD = createSpikes(0, 2490, 3);
var spikesE = createSpikes(400, 2490, 8);
var spikesF = createSpikes(-10, 2700, 9);
var spikesG = createSpikes(760, 2700, 2);
var spikesH = createSpikes(0, 2900, 4);
var spikesI = createSpikes(600, 2900, 7);
var spikesJ = createSpikes(100, 3100, 14);


addToWorld.push(ropeA, ropeB, circleC, circleD,
   spikesA, spikesB, spikesC, spikesD, spikesE, spikesF, spikesG, spikesH, spikesI, spikesJ,
   recA, recB, recC, recD, ropeC, ropeD, recE, recF, recG, recH, recI, recJ, recK, recL, recM, recN,
   circleE, circleF,  followTarget);

function moveBox(object, x, offset, y) {
  var px = x + offset * Math.sin(engine.timing.timestamp * 0.002);
  Body.setVelocity(object, { x: px - object.position.x, y: 0 });
  Body.setPosition(object, { x: px, y: y });
}

//Move stuffs
Events.on(engine, 'beforeUpdate', function(event) {
  //Move horizo
  moveBox(recA, 125, 50, 950);
  moveBox(recH, 125, 75, 2300);
  moveBox(recI, 275, -100, 2500);
  moveBox(recJ, 600, 100, 2700);
  moveBox(recK, 400, -150, 2900);

  Body.setPosition(followTarget, {x: 400, y: circleC.position.y + 100});

});

// add mouse control
var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {collisionFilter: {group: 0}});

World.add(engine.world, mouseConstraint);

render.mouse = mouse;

function RemoveCompositeById(id) {
  for (i = 0; i < engine.world.composites.length; i++) {
    if (engine.world.composites[i].id == id) {
      World.remove(engine.world, engine.world.composites[i]);
    }
  }
}

function updateRopesInWorld() {
  ropesInWorld = [];
  for (i = 0; i < engine.world.composites.length; i++) {
    if (engine.world.composites[i].label == "Stack Chain") {
      ropesInWorld.push(engine.world.composites[i]);
    }
  }
  updateRopeGraphs();
}

Events.on(mouseConstraint, "mousedown", function(event) {
  console.log(mouse.position.x + ', ' + mouse.position.y);
  //Check mouse pos
  var mouseX = mouse.position.x;
  var mouseY = mouse.position.y;
  for (i = 0; i < ropesInWorld.length; i++) {
      for (j = 0; j < ropesInWorld[i].bodies.length; j++) {
        var posX = ropesInWorld[i].bodies[j].position.x;
        var posY = ropesInWorld[i].bodies[j].position.y;
        var differenceX = posX - mouseX;
        var differenceY = posY - mouseY;
        if (-30 < differenceX && differenceX < 30 && -30 < differenceY && differenceY < 30)  {
          RemoveCompositeById(ropesInWorld[i].id);
          ropesInWorld.splice([i], 1);
          break;
        };
    }
  }
  updateRopesInWorld();
});

// add all of the bodies to the world
World.add(engine.world, addToWorld);

// run the engine
Engine.run(engine);

//Camera
initialEngineBoundsMaxX = render.bounds.max.x
initialEngineBoundsMaxY = render.bounds.max.y
centerX = - 200
centerY = - 200

this.Events.on(this.engine, 'beforeTick', function() {

  Render.lookAt(render, followTarget, {
    x: 0,
    y: 350
  });

}.bind(this));

// run the renderer
Render.run(render);

//temporary fix
var first = true;

Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs;

  // change object colours to show those starting a collision
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    //Rectangles
    if (pair.bodyA.label == "hero" && pair.bodyB.label == "movingBox") {
      if (first) {
      World.add(engine.world, createRope(pair.bodyB.position.x, pair.bodyB.position.y, 6, pair.bodyB));
      first = false;
      } else {
        World.add(engine.world, createRope(pair.bodyB.position.x, pair.bodyB.position.y, 3, pair.bodyB));
      }
     pair.bodyB.label = "movingBoxDone";
      updateRopesInWorld();
    }
    //Circles
    if (pair.bodyA.label  == "hero" && pair.bodyB.label == "Circle Body") {
      World.add(engine.world, createRope(pair.bodyB.position.x, pair.bodyB.position.y, 5));
      destroyGraphic();
      updateRopesInWorld();

      World.remove(engine.world, pair.bodyB)
    }
    //Spikes
    if (pair.bodyA.label  == "hero" && pair.bodyB.label == "Polygon Body") {

      World.remove(engine.world, pair.bodyA)
      destroyPlayer();
    }
    //End of game
    if (pair.bodyA.label == "hero" && pair.bodyB.label == "winArea") {
      let text = new PIXI.Text('Good job! You finished the level!',{fontFamily : 'Arial', fontSize: 40, fill : 0xFFFFFF, align : 'center'});
      text.x = 800 / 2;
      text.anchor.set(0.5);
      text.y = circleC.position.y + 200;
      app.stage.addChild(text);
    }
  }
});
