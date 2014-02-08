var RiskMeter = {
  surface: new createjs.Container(),

  WIDTH: 80,
  HEIGHT: 650,
  X: 0,
  Y: 0,

  risk: new createjs.Shape(),
  init: function(){
    this.surface.x = this.X;
    this.surface.y = this.Y;
    var filly = this.HEIGHT - 8 - (this.HEIGHT*Game.data.risk/100);
    var height = this.HEIGHT* (Game.data.risk/100);
    console.log(filly, height);
    var container = new createjs.Container();
    container.x=0;
    container.y=0;
    var risk =  new createjs.Shape();

    risk.graphics.beginFill("#ff0000").drawRect(0, filly, 80, height);
    container.addChild(risk);
    var background = new createjs.Bitmap(Game.data.images['meter']);

    this.surface.addChild(container);
    this.surface.addChild(background);

    Game.canvas.addChild(this.surface);
  },
  update: function(){
    this.surface.removeAllChildren();
    var filly = this.HEIGHT - 8 - (this.HEIGHT*Game.data.risk/100);
    var height = this.HEIGHT* (Game.data.risk/100);
    console.log(filly, height);
    var container = new createjs.Container();
    container.x=0;
    container.y=0;
    var risk =  new createjs.Shape();

    risk.graphics.beginFill("#ff0000").drawRect(0, filly, 80, height);
    container.addChild(risk);
    var background = new createjs.Bitmap(Game.data.images['meter']);

    this.surface.addChild(container);
    this.surface.addChild(background);
  }
}