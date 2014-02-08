var Resources = {
  surface: new createjs.Container(),

  WIDTH: 200,
  HEIGHT: 350,
  X: 680,
  Y: 0,
  ICONWIDTH:20,
  ICONCOLS:4,
  ICONROWS:9,
  RESOURCEWIDTH:200,
  color:"#00FF00",
  textcolor:"#00FF00",
  resourceArrow: new createjs.Shape(),
  resourceArrowRed: new createjs.Shape(),
  iconContainer: new createjs.Container(),
  updateResource: function(){
	this.resourceText.text = Game.data.resources.toString();
  },
  modifyGhostResource: function(num){
	if(num==0){
		this.resourceArrow.visible=false;
		this.resourceArrowRed.visible=false;
		this.resourceText2.visible=false;
	}
	else{
		this.resourceText2.visible=true;
		var val =Game.data.resources+num;
		if(val<0){
			this.resourceArrowRed.visible=true;
			this.resourceText2.color="#ff0000";
		}
		else{
			this.resourceText2.color="#00ff00";
			this.resourceArrow.visible=true;
		}
		this.resourceText2.text = (val).toString();
	}
  },
  
  updateCurrentActions: function(){
	this.iconContainer.removeAllChildren();
	function removeIndexCallback(index){
		return function(){
			Game.removeAction(index);
		};
	}
	for(var i=0;i<0;i++){//Game.data.currentActions.length;i++){
		var container = new createjs.Container();
		container.x =10 + (Math.floor(i/this.ICONROWS)*(this.ICONWIDTH+5));
		container.y = 10+ ((i%this.ICONROWS)*(this.ICONWIDTH+5));
		var gfx = new createjs.Shape();
		var action = Constants.ALL_ACTIONS[Game.data.currentActions[i].action];
		var location = Constants.ALL_LOCATIONS[Game.data.currentActions[i].location];
		gfx.graphics.beginFill(action.color).drawRect(0,0,this.ICONWIDTH,this.ICONWIDTH);
		gfx.graphics.beginFill(location.color).drawCircle(10, 10,8);
		container.addChild(gfx);
		if(Game.data.currentActions[i].count>1){
			var text = new createjs.Text(Game.data.currentActions[i].count.toString(),"12px GameFont",this.textcolor);
			text.x=this.ICONWIDTH;
			text.y=this.ICONWIDTH-12;
			text.textAlign="right";
			container.addChild(text);
		}
		this.iconContainer.addChild(container);
		gfx.addEventListener("click",removeIndexCallback(i));
	}
  },
  
  
  init: function() {
    this.surface.x = this.X;
    this.surface.y = this.Y;
	var txt = new createjs.Text("Free Agents", "12px GameFont", "#00ff00");
	txt.x = this.RESOURCEWIDTH/2;
	txt.y = 15;
	txt.textAlign="center";
	//Load resource text and position
	this.resourceText= new createjs.Text("0","30px GameFont",this.color);
	this.resourceText.x = this.RESOURCEWIDTH/2;
	this.resourceText.y = 50;
	this.resourceText.textAlign="center";
	
	//Load ghost resource text and position
	this.resourceText2= new createjs.Text("0","30px GameFont",this.color);
	this.resourceText2.x = this.RESOURCEWIDTH/2;
	this.resourceText2.y = 190;
	this.resourceText2.textAlign="center";
	
	
	//Load resource arrow
	this.resourceArrow.graphics.beginFill(this.color).drawRect(25,0,10,60);
	this.resourceArrow.graphics.beginFill(this.color).moveTo(0,60).lineTo(60,60).lineTo(30,80);
	this.resourceArrow.x = this.RESOURCEWIDTH/2 - 30;
	this.resourceArrow.y = 90;
	this.resourceArrowRed.graphics.beginFill("#ff0000").drawRect(25,0,10,60);
	this.resourceArrowRed.graphics.beginFill("#ff0000").moveTo(0,60).lineTo(60,60).lineTo(30,80);
	this.resourceArrowRed.x = this.RESOURCEWIDTH/2 - 30;
	this.resourceArrowRed.y = 90;
	
	//Load play button
	this.playBtn=ButtonHelper.newButton(
		Game.data.images['Play'],
		'Play',
		1,
		20,
		250,
		function(event){
				Textbox.setTitle("Advance Day");
				Textbox.setBody("Performs all actions queued up.");
		},
		function (event) {
		  Textbox.setTitle('');
		  Textbox.setBody(Constants.DEFAULT_TEXTBOX_TEXT);
		},
		function(){Game.step()}
	);
	
	//load background
  var background = new createjs.Bitmap(Game.data.images['resources']);
	this.surface.addChild(background);
	this.surface.addChild(this.resourceText);
	this.surface.addChild(this.resourceText2);
	this.surface.addChild(this.resourceArrow);
	this.surface.addChild(this.resourceArrowRed);
	this.surface.addChild(this.iconContainer);
	this.surface.addChild(this.playBtn);
	this.surface.addChild(txt);
	this.updateResource();
	this.modifyGhostResource(0);
    Game.canvas.addChild(this.surface);
  },
};
