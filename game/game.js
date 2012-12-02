//load the AMD modules we need
require(['frozen/GameCore', 'frozen/ResourceManager', 'frozen/Sprite', 'frozen/Animation', 'dojo/keys', 'frozen/box2d/Box', 'frozen/box2d/RectangleEntity', 'frozen/box2d/PolygonEntity', 'frozen/box2d/CircleEntity'],
 function(GameCore, ResourceManager, Sprite, Animation, keys, Box, Rectangle, Polygon, Circle){

  //dimensions same as canvas.
  var gameH = 480;
  var gameW = 770;
  
  var speed = 8;

  var output = document.getElementById('output');

  var rm = new ResourceManager();
  var backImg = rm.loadImage('images/bg.png');
  var gunfireSound = rm.loadSound('Sounds/gunfire.mp3');
  var childHitSound = rm.loadSound('Sounds/childhit.mp3');
  var punisherHitSound = rm.loadSound('Sounds/punisherhit.mp3');
  var childHitSound = rm.loadSound('Sounds/childhit.mp3');
  var spriteImg = rm.loadImage('images/walking.png');
  //var walkingDownImg = rm.loadImage();
  //var walkingUpImg = rm.loadImage();
  //var walkingLeftImg = rm.loadImage();
  //var walkingRightImg = rm.loadImage();
  //var ShootLeftImg = rm.loadImage();
  //var ShootRightImg = rm.loadImage();
  var babyImg = rm.loadImage('images/babymonster.png');
  var bulletImg = rm.loadImage('images/bullet.png');
  var kidImg = rm.loadImage('images/kid-walking-right.png');
  
  var box;
  var world = {};

  //pixels per meter for box2d
  var SCALE = 30.0;

  //objects in box2d need an id
  var geomId = 1;

  //shapes in the box2 world, locations are their centers
  var nyan, moon, pyramid, ground, ceiling, leftWall, rightWall, yarn, yarn2, yarn3, kid;

  var sprite = new Animation().createFromTile(4,100,spriteImg,60,60);

  var baby = new Animation().createFromTile(4,100,babyImg,36,48);
  var baby2 = new Animation().createFromTile(4,100,babyImg,36,48);
  var baby3 = new Animation().createFromTile(4,100,babyImg,36,48);
  var kid = new Animation().createFromTile(4,100,kidImg,60,60);

  var bulletSpeed = 20;
  var bullet;
  
  var started = false;
  
  // create our box2d instance
  box = new Box({intervalRate:60, adaptive:false, width:gameW, height:gameH, scale:SCALE, gravityY:0.0});

  //create each of the shapes in the world
  ground = new Rectangle({
    id: geomId,
    x: 385 / SCALE,
    y: 480 / SCALE,
    halfWidth: 1000 / SCALE,
    halfHeight: 1 / SCALE,
    staticBody: true
  });
  box.addBody(ground); //add the shape to the box
  world[geomId] = ground; //keep a reference to the shape for fast lookup

  celing = new Rectangle({
    id: geomId,
    x: 385 / SCALE,
    y: -1 / SCALE,
    halfWidth: 1000 / SCALE,
    halfHeight: 1 / SCALE,
    staticBody: true
  });
  box.addBody(celing);
  world[geomId] = celing;

  leftWall = new Rectangle({
    id: geomId,
    x: -1 / SCALE,
    y: 240 / SCALE,
    halfWidth: 1 / SCALE,
    halfHeight: 1000 / SCALE,
    staticBody: true
  });
  box.addBody(leftWall);
  world[geomId] = leftWall;

  rightWall = new Rectangle({
    id: geomId,
    x: 771 / SCALE,
    y: 240 / SCALE,
    halfWidth: 1 / SCALE,
    halfHeight: 1000 / SCALE,
    staticBody: true
  });
  box.addBody(rightWall);
  world[geomId] = rightWall;

  geomId++;
  nyan = new Circle({ //Rectangle({
    id: geomId,
    x: 96 / SCALE,
    y: 96 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    draw: function(ctx, scale){ // we want to render the nyan cat with an image
      var cf = sprite.getCurrentFrame();
      ctx.drawImage(sprite.image, 
					cf.imgSlotX * sprite.width, 
					cf.imgSlotY * sprite.height, 
					sprite.width, 
					sprite.height, 
					(this.x-this.radius) * scale,
					(this.y-this.radius) * scale, 
					sprite.width, 
					sprite.height);
    }
  });
  box.addBody(nyan);
  world[geomId] = nyan;

  geomId++;
  yarn = new Circle({
    id: geomId,
    x: 600 / SCALE,
    y: 390 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx, scale){  //we also want to render the yarn with an image
      var cf = baby.getCurrentFrame();
      ctx.drawImage(baby.image, 
					cf.imgSlotX * baby.width, 
					cf.imgSlotY * baby.height, 
					baby.width, 
					baby.height, 
					(this.x-this.radius) * scale,
					(this.y-this.radius) * scale, 
					baby.width, 
					baby.height);
    }
  });
  box.addBody(yarn);
  world[geomId] = yarn;

    geomId++;
  yarn2 = new Circle({
    id: geomId,
    x: 600 / SCALE,
    y: 190 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx, scale){  //we also want to render the yarn with an image
      var cf = baby2.getCurrentFrame();
      ctx.drawImage(baby2.image, 
          cf.imgSlotX * baby2.width, 
          cf.imgSlotY * baby2.height, 
          baby2.width, 
          baby2.height, 
          (this.x-this.radius) * scale,
          (this.y-this.radius) * scale, 
          baby2.width, 
          baby2.height);
    }
  });
  box.addBody(yarn2);
  world[geomId] = yarn2;

    geomId++;
  yarn3 = new Circle({
    id: geomId,
    x: 200 / SCALE,
    y: 190 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx, scale){  //we also want to render the yarn with an image
      var cf = baby3.getCurrentFrame();
      ctx.drawImage(baby2.image, 
          cf.imgSlotX * baby3.width, 
          cf.imgSlotY * baby3.height, 
          baby3.width, 
          baby3.height, 
          (this.x-this.radius) * scale,
          (this.y-this.radius) * scale, 
          baby3.width, 
          baby3.height);
    }
  });
  box.addBody(yarn3);
  world[geomId] = yarn3;

  geomId++;
  yarn4 = new Circle({
    id: geomId,
    x: 500 / SCALE,
    y: 400 / SCALE,
    radius: 30 / SCALE,
    staticBody: false,
    density: 0.5,  // al little lighter
    restitution: 0.8, // a little bouncier
    draw: function(ctx, scale){  //we also want to render the yarn with an image
      var cf = kid.getCurrentFrame();
      ctx.drawImage(kid.image, 
          cf.imgSlotX * kid.width, 
          cf.imgSlotY * kid.height, 
          kid.width, 
          kid.height, 
          (this.x-this.radius) * scale,
          (this.y-this.radius) * scale, 
          kid.width, 
          kid.height);
    }
  });
  box.addBody(yarn4);
  world[geomId] = yarn4;
  
  geomId++;
  bullet = new Circle({
    id: geomId,
    x: 116 / SCALE,
    y: 360 / SCALE,
    radius: 3 / SCALE,
    staticBody: false,
    draw: function(ctx, scale){ // we want to render the nyan cat with an image
      ctx.drawImage(
        bulletImg,
        (this.x-this.halfWidth) * scale,
        (this.y-this.halfHeight) * scale
      );
    }
  });
  box.addBody(bullet);
  world[geomId] = bullet;
  
  //setup a GameCore instance
  var game = new GameCore({
    canvasId: 'canvas',
    resourceManager: rm,
    initInput: function(im){
      //tells the input manager to listen for key events
      im.addKeyAction(keys.LEFT_ARROW);
      im.addKeyAction(keys.RIGHT_ARROW);
      im.addKeyAction(keys.UP_ARROW);
	  im.addKeyAction(keys.DOWN_ARROW);

      //the extra param says to only detect inital press
      im.addKeyAction(keys.SPACE, true);
    },
    handleInput: function(im){
      if(im.keyActions[keys.LEFT_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 180, speed);
      }

      if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 0, speed);
      }

      if(im.keyActions[keys.UP_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 270, speed);
      }

      if(im.keyActions[keys.DOWN_ARROW].isPressed()){
        box.applyImpulse(nyan.id, 90, speed);
      }

      //.play sounds with the space bar !
      if(im.keyActions[keys.SPACE].getAmount()){
		bullet.x = nyan.x;
		bullet.y = nyan.y;
		box.applyImpulse(bullet.id, 0, bulletSpeed);
        rm.playSound(gunfireSound);
      }

	  if(!started)
	  {
		box.applyImpulse(yarn.id, Math.random() * 360, Math.random() * 20);
		box.applyImpulse(yarn2.id, Math.random() * 360, Math.random() * 20);
    box.applyImpulse(yarn3.id, Math.random() * 360, Math.random() * 20);
    box.applyImpulse(yarn4.id, Math.random() * 360, Math.random() * 20);
    started = true;
    
	  }
	  
      //when creating geometry, you may want to use the to determine where you are on the canvas
      //if(im.mouseAction.position){
        //output.innerHTML = 'x: ' + im.mouseAction.position.x + ' y: ' + im.mouseAction.position.y;
      //}
    },
    update: function(millis){
      
      //have box2d do an interation
      box.update();

      //update the dyanmic shapes with box2d calculations
      var bodiesState = box.getState();
      for (var id in bodiesState) {
        var entity = world[id];
        if (entity && !entity.staticBody){
          entity.update(bodiesState[id]);
        }
      }

	  if(distance(nyan,yarn) < nyan.radius + yarn.radius)
	  {
		rm.playSound(punisherHitSound);
	  }
    if(distance(nyan,yarn2) < nyan.radius + yarn2.radius)
    {
    rm.playSound(punisherHitSound);
    }
    if(distance(nyan,yarn3) < nyan.radius + yarn3.radius)
    {
    rm.playSound(punisherHitSound);
    }
    if(distance(nyan,yarn4) < nyan.radius + yarn4.radius)
    {
    rm.playSound(punisherHitSound);
    }

    if(distance(yarn,yarn2) < yarn.radius + yarn2.radius)
    {
    rm.playSound(childHitSound);
    }
    if(distance(yarn,yarn3) < yarn.radius + yarn3.radius)
    {
    rm.playSound(childHitSound);
    }
    if(distance(yarn,yarn4) < nyan.radius + yarn4.radius)
    {
    rm.playSound(childHitSound);
    }


    if(distance(yarn2,yarn3) < yarn2.radius + yarn3.radius)
    {
    rm.playSound(childHitSound);
    }
    if(distance(yarn2,yarn4) < yarn2.radius + yarn4.radius)
    {
    rm.playSound(childHitSound);
    }

    if(distance(yarn3,yarn4) < yarn3.radius + yarn4.radius)
    {
    rm.playSound(childHitSound);
    }
	  
	  sprite.update(millis);
	  baby.update(millis);
    baby2.update(millis);
    baby3.update(millis);
    kid.update(millis);
    },
    draw: function(context){
      context.drawImage(backImg, 0, 0, this.width, this.height);
      //ground.draw(context, SCALE);
      //moon.draw(context, SCALE);
      //pyramid.draw(context, SCALE);
      nyan.draw(context, SCALE);
      yarn.draw(context, SCALE);
      yarn2.draw(context, SCALE);
      yarn3.draw(context, SCALE);
      yarn4.draw(context, SCALE);
    }
  });

  function distance(obj1, obj2)
  {
	var x2 = (obj1.x - obj2.x) * (obj1.x - obj2.x);
	var y2 = (obj1.y - obj2.y) * (obj1.y - obj2.y);
	
	return (Math.sqrt(x2 + y2));
  }
  
  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();
});