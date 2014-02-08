/**
 * Game model stuff goes here
 **/
var Game = {
  canvas: {},
  data: {},

  init: function(){
    this.canvas = new createjs.Stage('canvas');
    this.canvas.enableMouseOver(10);
    this.data = new Data();
	
    Loader.init();
  },

  start: function(){
    Map.init();
    Activities.init();
    Textbox.init();
    Resources.init();
    Dudes.init();
    RiskMeter.init();
    Modal.init();
    createjs.Ticker.addEventListener('tick', this.canvas);
    createjs.Ticker.setFPS(60);
	for(var key in Constants.INITIAL_ACTIONS){
		Map.newActionUnlocked(Constants.INITIAL_ACTIONS[key]);
	}
  },
  updateDays: function(){
    Activities.dayCounter.text = this.data.days + " days left";
  },
  addMoney: function(amount){
    Activities.moneyCounter.color='#00FF00'
    if (this.data.money + amount >= 0) {
      this.data.money += amount;
      Activities.moneyCounter.text="$"+this.data.money.toFixed(2);
      return true;
    }
    return false;
  },
  tempMoney: function(amount){
    if (this.data.money + amount < 0) {
      Activities.moneyCounter.color='#FF0000';
    }
    Activities.moneyCounter.text="$"+this.data.money.toFixed(2) + "  ->  $"+((this.data.money+amount).toFixed(2));
  },
  addAction: function(action, location){
	var act = Constants.ALL_ACTIONS[action];
	if(act.resources<=this.data.resources){
		this.data.resources-=act.resources;
		//search model for action and location pair
		var added=false;
		for(var i=0;i<this.data.currentActions.length;i++){
			if(this.data.currentActions[i].action===action && this.data.currentActions[i].location===location){
				this.data.currentActions[i].count++;
				added=true;
			}
		}
		if(!added)
			this.data.currentActions.push(new Pair(action,location));
		Resources.updateCurrentActions();
		Resources.updateResource();
		Resources.modifyGhostResource(-act.resources);
	}
  },
  removeAction: function(index){
	if(this.data.currentActions.length>index){
		this.data.resources+=Constants.ALL_ACTIONS[this.data.currentActions[index].action].resources;
		if(this.data.currentActions[index].count>1)
			this.data.currentActions[index].count--;
		else
			this.data.currentActions.splice(index,1);
	}
	else return;
	Resources.updateResource();
	Resources.updateCurrentActions();
  },
  step: function(){
	this.data.stepLogic();
	Resources.updateResource();
	Resources.updateCurrentActions();
	Game.addMoney(0);
  },
  addResources: function(deltaResources) {
    this.data.resources += deltaResources;
	Resources.updateResource();
	Resources.modifyGhostResource(deltaResources);
  },
};

var Pair = function(initialAction,initialLocation){
	this.action = initialAction;
	this.location= initialLocation;
	this.count=1;
}


var Data = function(){
  this.money= Constants.INITIAL_MONEY;
  this.resources= Constants.INITIAL_RESOURCES;
  this.days= Constants.INITIAL_DAYS;
  this.locations= Constants.INITIAL_LOCATIONS;
  this.actions= Constants.INITIAL_ACTIONS;
  this.graphs= {
		
		stats: new GraphUtil.newLineGraph(500,300).addSeries("#00ff00").addSeries("#ff0000").addSeries("#0000ff"),
  };
  this.showTutorial = true;
  this.risk= 0;
  this.images= {};
  this.currentResources= 0;
  this.currentActions= [];
  this.actionUsage= {
    'Forgot': 0,
    'SpoofWebsite': 0,
    'Keylogger': 0,
    'Wifi': 0,
    'Scam': 0,
  };
  this.locationUsage= {
    'Highschool': 0,
    'Library': 0,
    'Netcafe': 0,
    'Apartment': 0,
    'Computer Store': 0,
  };
  this.profitLastTurn = 0,
  this.peopleCaughtLastTurn = 0,
  this.currentStory = '',
  this.stepLogic=function() {
    this.days-=1;
    this.profitLastTurn = 0;
    this.peopleCaughtLastTurn = 0;
	
    Game.updateDays();
    Game.data.risk+=2;
    RiskMeter.update();
	var profit=0;
		for(var i=0;i<this.currentActions.length;i++){
			//
			var action = Constants.ALL_ACTIONS[this.currentActions[i].action];
			var location = Constants.ALL_LOCATIONS[this.currentActions[i].location];
			var count = this.currentActions[i].count;
			for(var j =0;j<count;j++) {
				this.resources+=action.resources;
        profit = (location.reward - Game.data.locationUsage[Map.currLocation] / location.rewardDeath) * action.scoreMult;
        risk = action.risk + Game.data.actionUsage[action.parent] * action.riskIncrease * location.riskModifier;
        r = Math.random() * 100;
        console.log('R = ' + r + 'RISK: ' + risk);
        if(r < risk) {
          //shit hit the fan and this guy got screwed!
          console.log('Go to jail and do not collect 200 dollars!');
          this.peopleCaughtLastTurn++

          Game.data.risk += 4.0/(count);
          RiskMeter.update();
        }
        else {
          //got away clean!!!
          this.money+=profit;
          this.profitLastTurn += profit;
        }

				action.risk+=.02;
				location.risk+=.02;
        this.actionUsage[action.parent]++;
        this.locationUsage[location.parent]++;

        //I am not sure if we need this.
				if((action.risk*action.riskModifier+location.risk*location.riskModifier)*Math.random()>1){
					//UHOH
					console.log("Gameover?");
					//break;
				}
			}
		}

    console.log("profitLastTurn: " + this.profitLastTurn);
    console.log("peopleCaughtLastTurn: " + this.peopleCaughtLastTurn);
	
		this.graphs.stats.addPoint(0,this.money).addPoint(1,this.profitLastTurn).addPoint(2,this.resources);
		
    if (this.days==0 && this.money<Constants.MONEY_GOAL) {
      console.log("Gameover?");
    }
    
		
		
		Modal.showNewsBlurb();
		this.currentActions.length=0;
	};

  this.useResources = function(deltaResources) {
    if(this.resources - deltaResources >= 0) {
      this.resources -= deltaResources;
	  Resources.updateResource();
      return true;
    }
    else {
      return false;
    }
  };

}

var ArticleInfo = {
	'Forgot':[
		"Users are becoming more wary about leaving their accounts logged in!",
		"Recent trends show that 50% of users leave their accounts logged in!",
		"The most common password used is password!",
		"Users are urged to never hit 'remember password'",
	],
	'SpoofWebsite':[
		"Users are starting to pay attention to the URL's in web browsers.",
		"Users don't trust tabs left open for them anymore.",
		"60% of users won't notice a slightly misspelled URL",
	],
	'Keylogger':[
		"Users are learning not to input sensitive information when they are on unsecured public machines.",
		"Most users would not be able to detect a keylogger.",
		"Some users are utilizing the task or process manager to spot scary looking processes",
		"34% of users have fallen victim to a keylogger at least once before"
	],
	'Wifi':[
		"Users are no longer transmitting sensitive information when using a public/unencrypted wifi connection",
		"IEEE releases new wifi protocol which enforces encrypted traffic.",
		"15% of users still transmit sensitive information over open wifi without any encryption at all."
	],
	'Scam':[
		"Users are getting wise to scammers that are impersonating employees.",
    "Computer store employees start cracking down on their display models.",
		"Administrators will not have to ask you for your password (the server only has your password hash).",
		"If you go into a store, do not log in to any personal accounts using those machines.",
		"A sales rep should not need for you to log into your own account, they should their own method of interacting with your account data."
	],
	
};



var ButtonHelper = {
  newButton : function(img, name, obj, x, y, overFunc, outFunc, clickFunc) {
    var newButton = new createjs.Bitmap(img);
    newButton.name = name;
    newButton.eventID = obj;
    newButton.x = x;
    newButton.y = y;
    newButton.addEventListener("mouseover", overFunc);
    newButton.addEventListener("mouseout", outFunc);
    newButton.addEventListener("click", clickFunc);
    new createjs.ButtonHelper(newButton);
    return newButton;
  },
  newButtonObj : function(obj, name, overFunc, outFunc, clickFunc) {
    var newButton = obj;
    newButton.name = name;
    newButton.addEventListener("mouseover", overFunc);
    newButton.addEventListener("mouseout", outFunc);
    newButton.addEventListener("click", clickFunc);
    new createjs.ButtonHelper(newButton);
    return newButton;
  },
  newButtonSpecial : function(img, name, obj, x, y, overFunc, outFunc, clickFunc) {
    var newButton = new createjs.Bitmap(img);
    newButton.name = name;
    newButton.eventID = obj;
    newButton.x = x;
    newButton.y = y;
    newButton.addEventListener("mouseover", overFunc,false);
    newButton.addEventListener("mouseout", outFunc,false);
    newButton.addEventListener("click", clickFunc);
    new createjs.ButtonHelper(newButton);
    return newButton;
  },
}
