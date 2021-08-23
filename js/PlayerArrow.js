class PlayerArrow {
  constructor(x, y, width, height, archerAngle) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
      isStatic: true
    };
    this.width = width;
    this.height = height;
    this.body = Bodies.rectangle(x, y, this.width, this.height, options);
    this.image = loadImage("./assets/arrow.png");
    this.trajectory = [];
    this.isRemoved = false;
    this.archerAngle = archerAngle;
    this.velocity = p5.Vector.fromAngle(archerAngle);
    World.add(world, this.body);
  }

 remove(){
  this.isRemoved = true;
  Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

  this.speed = 0.05;
  this.r = 150;
  setTimeout(() => {
    Matter.World.remove(world, this.body);
    playerArrows.splice(index, 1);
  }, 1000);
 }
  reduceLife(archerLife){
    if(archerLife === 2){
      this.life1 = "red";
    }
    if(archerLife === 1){
      this.life2 = "red";
    }
    if(archerLife === 0){
      this.life = "red";
    }
    if(
      baseCollision.collided ||
      archerCollision.collided ||
      playerCollision.collided
    ){
      playerLife -= 1;
      player.reduceLife(playerLife);
      if(playerLife >= 0){
        playerArcher.collapse = true;
        Matter.Body.setStatic(playerArcher.body, false);
        Matter.Body.setStatic(player.body, false);
        Matter.Body.setPosition(player, body, {
          x: width - 100,
          y:player.body.position.y
        });
      }
    }
  }
  shoot(archerAngle) {
    this.velocity = p5.Vector.fromAngle(archerAngle + PI / 2);
    this.velocity.mult(25);

    Matter.Body.setVelocity(this.body, {
      x: this.velocity.x,
      y: this.velocity.y
    });

    Matter.Body.setStatic(this.body, false);
  }

  display() {
    var tmpAngle;
    if (this.body.velocity.y === 0) {
      tmpAngle = this.archerAngle + PI / 2;
    } else {
      tmpAngle = Math.atan(this.body.velocity.y / this.body.velocity.x);
    }

    Matter.Body.setAngle(this.body, tmpAngle);

    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.image, 0, 0, this.width, this.height);
    pop();

    if (this.body.velocity.x > 0 && this.body.position.x > 400) {
      var position = [this.body.position.x, this.body.position.y];
      this.trajectory.push(position);
    }

    for (var i = 0; i < this.trajectory.length; i++) {
      fill("white");
      ellipse(this.trajectory[i][0], this.trajectory[i][1], 5, 5);
    }
  }
}
