var Map = {
  surface: new createjs.Container(),

  WIDTH: 600,
  HEIGHT: 350,
  X: 80,
  Y: 0,
  WIN_WIDTH:120,
  WIN_HEIGHT:100,
  color:"#00ff00",
  boundedArea:{},
  hoverWindow: new createjs.Container(),
  currLocation:"",
  numLocs:1,
  numActions:0,
  newLocationUnlocked: function(location){
	if(this.boundedArea[location]){
		this.numLocs++;
		if(this.numLocs>Constants.ALL_LOCATIONS.length)
			this.numLocs=Constants.ALL_LOCATIONS.length;
		
		this.boundedArea[location].lock.visible=false;
		this.boundedArea[location].area.visible=true;
		this.boundedArea[location].bound.visible=true;
	}
  },
  resizeWin:function(){
	this.WIN_WIDTH= Math.ceil((this.numActions+1)/2) * 37;
	this.WIN_HEIGHT = ((this.numActions+1)>1)?74:38;
	this.box.graphics.clear().beginFill("#000000").beginStroke("#00ff00").drawRect(0,0,this.WIN_WIDTH,this.WIN_HEIGHT);
  },
  newActionUnlocked: function(action){
	var act = Constants.ALL_ACTIONS[action];
	this.resizeWin();
	function genHover(action){
		return function(event){
			Textbox.setTitle(action);

			loc = Constants.ALL_LOCATIONS[Map.currLocation];
			act = Constants.ALL_ACTIONS[action];

			profit = (loc.reward - Game.data.locationUsage[Map.currLocation] / loc.rewardDeath) * act.scoreMult;
			risk = act.risk + Game.data.actionUsage[action] * act.riskIncrease * loc.riskModifier;
			if(risk > 100)
				risk = 100;

			Textbox.setBody("Profability: $" + profit.toFixed(2) + '\n\nRisk: ' + risk.toFixed(2));
			Resources.modifyGhostResource(-Constants.ALL_ACTIONS[action].resources);
		};
	}
	var handleUnhover = function(event){
		Textbox.setTitle("");
		Textbox.setBody(Constants.DEFAULT_TEXTBOX_TEXT);
		Resources.modifyGhostResource(0);
	};
	function genClick(act){
		return function(){
			Game.addAction(act,Map.currLocation);
			
		};
	}
	var btn = ButtonHelper.newButtonSpecial(
		Game.data.images[action+"_sm"],
        action,
        1,
        3+(Math.floor(this.numActions/2))*35,
        3+(this.numActions%2)*35,
        genHover(action),
        handleUnhover,
        genClick(action));
	this.hoverWindow.addChild(btn);
	this.numActions++;
  },
  init: function() {
    this.surface.x = this.X;
    this.surface.y = this.Y;
    var background = new createjs.Bitmap(Game.data.images['map']);
	  this.surface.addChild(background);
	
	var hoveron=function(event){
		Map.hoverWindow.visible=true;
		Map.hoverWindow.x = event.currentTarget.locx-Map.WIN_WIDTH/2;
		Map.hoverWindow.y = event.currentTarget.locy-Map.WIN_HEIGHT/2;
	}
	var hoverout =function(event){}
	var click = function (event){}
	var genHoverFunc = function(loc){
		return function(event){
			hoveron(event);
			Map.currLocation=loc;
		}
	}
	for(var key in Constants.ALL_LOCATIONS){
		var loc = Constants.ALL_LOCATIONS[key];
		var container = new createjs.Container();
		
		container.x=loc.mapx;
		container.y=loc.mapy;
		var bound = new createjs.Bitmap(Game.data.images['Unlock']);
		bound.x=bound.y=-25;
		var innerShape = new createjs.Shape();
		function setTextboxFunc(title,body){
			return function(){
				Textbox.setTitle(title);
				Textbox.setBody(body);
			};
		}
		this.boundedArea[key]={};
		if(Constants.INITIAL_LOCATIONS.indexOf(key)==-1){
			var lock =  ButtonHelper.newButton(
				Game.data.images["Lock"],
				'Scammer',
				1,
				-25,
				-25,
				setTextboxFunc(key, "Unlock "+Constants.ALL_LOCATIONS[key].unlock+" to use this location."),
				setTextboxFunc("",Constants.DEFAULT_TEXTBOX_TEXT),
				function(){}
			);
			bound.visible=false;
			this.boundedArea[key].lock = lock;
			container.addChild(lock);
			innerShape.visible=false;
		}
		

		innerShape.alpha=.01;
		innerShape.graphics.beginFill(this.color).drawCircle(0,0,loc.mapr);
		//boundShape.graphics.beginStroke(this.color).setStrokeStyle(4).drawCircle(0,0,loc.mapr);
		ButtonHelper.newButtonObj(innerShape,key,genHoverFunc(key),hoverout,click);
		innerShape.locx = loc.mapx;
		innerShape.locy = loc.mapy;
		this.boundedArea[key].bound = bound;
		this.boundedArea[key].area=innerShape;
		container.addChild(bound);
		container.addChild(innerShape);
		this.surface.addChild(container);
	}
    
	this.box = new createjs.Shape();
	this.resizeWin();
	ButtonHelper.newButtonObj(this.hoverWindow,"",function(){},function(evt){
		var pt=Map.hoverWindow.globalToLocal(evt.stageX,evt.stageY);
		if(pt.x>0 && pt.y>0 && pt.x<Map.WIN_WIDTH && pt.y < Map.WIN_HEIGHT);
		else
			Map.hoverWindow.visible=false;
	},click);
	this.hoverWindow.visible=false;
	
	//add action buttons
	
	
	this.hoverWindow.addChild(this.box);
	this.surface.addChild(this.hoverWindow);
    var icon = new createjs.Bitmap(Game.data.images['Library']);
    icon.x = 200;
    icon.y = 200;
    this.surface.addChild(icon);
    Game.canvas.addChild(this.surface);
  }
};
