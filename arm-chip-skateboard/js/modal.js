var Modal = {
  underlay: new createjs.Container(),
  surface: new createjs.Container(),
  content: new createjs.Container(),
  title: new createjs.Text('Title', '20px GameFont', '#00FF00'),
  okayButton: new createjs.Container(),

  WIDTH: 600,
  HEIGHT: 400,
  X: 140,
  Y: 100,

  CONTENT_PADDING_HORIZONTAL: 10,
  CONTENT_PADDING_VERTICAL: 40,

  init: function() {
    this.surface.x = this.X;
    this.surface.y = this.Y;

    var background = new createjs.Shape();
    background.graphics
      .beginFill('#404040')
      .drawRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    background.alpha = 0.95;
    this.underlay.addChild(background);

    background = new createjs.Shape();
    background.graphics
      .beginStroke("#00FF00")
      .beginFill('#000000')
      .drawRect(0, 0, this.WIDTH, this.HEIGHT);
    this.surface.addChild(background);

    this.title.textAlign = 'center';
    this.title.x = this.WIDTH / 2;
    this.title.y = 30;
    this.surface.addChild(this.title);

    var OKAY_BUTTON_WIDTH = 150;
    this.okayButton = this.makeTextButton('OK', OKAY_BUTTON_WIDTH);

    this.surface.addChild(this.okayButton);

    this.content.x = this.CONTENT_PADDING_HORIZONTAL;
    this.content.y = this.CONTENT_PADDING_VERTICAL;
    this.surface.addChild(this.content);

    Modal.showIntroSequence();
  },

  makeTextButton: function(text, width) {
    var okayButton = new createjs.Container();
    var okayButtonBackground = new createjs.Shape();
    okayButtonBackground.graphics
      .beginFill('#000000')
      .beginStroke('#00FF00')
      .drawRect(0, 0, width, 30);
    var okayButtonText = new createjs.Text(text, '20px GameFont', '#00FF00');
    okayButtonText.textAlign = 'center';
    okayButtonText.x = width / 2.0;
    okayButtonText.y = 3;
    okayButton.x = this.WIDTH / 2 - width / 2;
    okayButton.y = this.HEIGHT - 80;
    okayButton.addChild(okayButtonBackground);
    okayButton.addChild(okayButtonText);
    new createjs.ButtonHelper(okayButton);
    return okayButton;
  },

  hide: function() {
    Map.surface.mouseEnabled = true;
    Resources.surface.mouseEnabled = true;
    Activities.surface.mouseEnabled = true;
    Dudes.surface.mouseEnabled = true;
    Textbox.surface.mouseEnabled = true;

    Game.canvas.removeChild(this.underlay);
    Game.canvas.removeChild(this.surface);
  },

  show: function(title, content, onOkayClicked) {
    this.setTitle(title);
    this.setContent(content);
    this.okayButton.removeAllEventListeners();
    this.okayButton.addEventListener('click', onOkayClicked);

    Map.surface.mouseEnabled = false;
    Resources.surface.mouseEnabled = false;
    Activities.surface.mouseEnabled = false;
    Dudes.surface.mouseEnabled = false;
    Textbox.surface.mouseEnabled = false;

    Game.canvas.addChild(this.underlay);
    Game.canvas.addChild(this.surface);
  },

  setTitle: function(text) {
    this.title.text = text;
  },

  setContent: function(content) {
    this.content.removeAllChildren();
    this.content.addChild(content.surface);
  },

  showIntroSequence: function() {
    this.showSplash();
  },

  showSecondIntroSequence: function() {
    Modal.show('Awareness', new Content(Content.TUTORIAL_RISK), function() {
      Modal.show('Buying Workers', new Content(Content.TUTORIAL_RESOURCES), function() {
        Modal.hide();
      });
    });
  },

  showForgotMethod: function() {
    Modal.show('Method 1: Forgetfulness', new Content(Content.FORGOT), function() {
      Modal.hide();
    });
  },

  showSpoofMethod: function() {
    Modal.show('Method 2: Spoofing', new Content(Content.SPOOF), function() {
      Modal.hide();
    });
  },

  showKeyLoggerMethod: function() {
    Modal.show('Method 3: Keylogger', new Content(Content.KEY_LOGGER), function() {
      Modal.hide();
    });
  },

  showWifiMethod: function() {
    Modal.show('Method 4: Compromised Wifi', new Content(Content.WIFI), function() {
      Modal.hide();
    });
  },

  showGameOver: function(reason) {
    var type;
    switch (reason) {
      case 'awareness': type = Content.GAME_OVER_AWARENESS; break;
      case 'time': type = Content.GAME_OVER_TIME; break;
      case 'money': type = Content.GAME_OVER_MONEY; break;
    }
    Modal.show('', new Content(type), function() {
		Modal.showStatsGraph();
      // nop
    });
  },

  showNewsStory: function() {
    Modal.show('BREAKING NEWS', new Content(Content.NEWS), function() {
      Modal.hide();
    });
  },

  showSplash: function() {
    Modal.show('Splash', new Content(Content.SPLASH), function() {
      Modal.show('Welcome!', Content.withText(Constants.INTRO_STRING), function() {
        Modal.show('Tutorial?', new Content(Content.TUTORIAL), function() {
          Modal.hide();
        });
      });
    });
  },

  showScamMethod: function() {
    Modal.show('Method 5: Scams', new Content(Content.SCAM), function() {
      Modal.hide();
    });
  },
  showNewsBlurb: function(){
	Modal.show("REPORT", new Content(Content.NEWSPAPER),function(){
    if (Game.data.days == 0 && Game.data.money < Constants.MONEY_GOAL) {
      Modal.showGameOver('time');
    } else if (Game.data.risk >= 100) {
      Modal.showGameOver('awareness');
    } else if (Game.data.money >= Constants.MONEY_GOAL) {
      Modal.showGameOver('money');
    } else if (Game.data.days == Constants.INITIAL_DAYS - 1 && Game.data.showTutorial) {
      Modal.showSecondIntroSequence();
    } else {
      Modal.hide();
    }
	});
  },
  showStatsGraph: function() {
    Modal.show('Stats', new Content(Content.GRAPH_STATS), function() {
		//nop
    });
  },
};

var Content = function(render) {
  this.surface = new createjs.Container();
  this.surface.x = Content.X;
  this.surface.y = Content.Y;
  render(this.surface);
};

Content.WIDTH = Modal.WIDTH - 4 * Modal.CONTENT_PADDING_HORIZONTAL;
Content.HEIGHT = Modal.HEIGHT - 4 * Modal.CONTENT_PADDING_VERTICAL;
Content.X = Modal.CONTENT_PADDING_HORIZONTAL;
Content.Y = Modal.CONTENT_PADDING_VERTICAL;

Content.RESULTS = function(surface) {
  var background = new createjs.Shape();
  background.graphics
    .beginFill('#00FF00')
    .drawRect(0, 0, Content.WIDTH, Content.HEIGHT);
  surface.addChild(background);
  // Render stuff for the results screen here...
};

Content.FORGOT = function(surface) {
  var signOutImage = new createjs.Bitmap(Game.data.images['ForgotSignOut']);
  signOutImage.x = Content.WIDTH / 2.0 - Game.data.images['ForgotSignOut'].width / 2.0 - 60;
  signOutImage.y = 60;
  surface.addChild(signOutImage);

  var staySignedIn = new createjs.Bitmap(Game.data.images['ForgotStaySignedIn']);
  staySignedIn.x = Content.WIDTH / 2.0 - Game.data.images['ForgotStaySignedIn'].width / 2.0 + 60;
  staySignedIn.y = 64;
  surface.addChild(staySignedIn);

  var dontSaveImage = new createjs.Bitmap(Game.data.images['ForgotDontSave']);
  dontSaveImage.x = Content.WIDTH / 2.0 - Game.data.images['ForgotDontSave'].width / 2.0;
  dontSaveImage.y = 180;
  surface.addChild(dontSaveImage);

  var text = new createjs.Text('Your targets often forget to sign out of their accounts when they are finished...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  surface.addChild(text);

  text = new createjs.Text('And even worse, they save their passwords on a public computer!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 120;
  surface.addChild(text);
};

Content.SPOOF = function(surface) {
  var spoofImage = new createjs.Bitmap(Game.data.images['SpoofBadUrl']);
  spoofImage.x = Content.WIDTH / 2.0 - Game.data.images['SpoofBadUrl'].width / 2.0;
  spoofImage.y = 60;
  surface.addChild(spoofImage);

  var text = new createjs.Text('Let\'s try to get even more user data, by leaving a browser window open with a spoofed URL...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  surface.addChild(text);

  text = new createjs.Text('These users don\'t know any better and when they \'log in\' on this spoofed page their passwords get sent directly to us!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 120;
  surface.addChild(text);
};

Content.KEY_LOGGER = function(surface) {
  var keyLogImage = new createjs.Bitmap(Game.data.images['KeyLoggingKeyboard']);
  keyLogImage.x = Content.WIDTH / 2.0 - Game.data.images['KeyLoggingKeyboard'].width / 2.0;
  keyLogImage.y = 60;
  surface.addChild(keyLogImage);

  var text = new createjs.Text('By installing keyloggers on computers we can target even the more careful users...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  surface.addChild(text);

  text = new createjs.Text('Every keystroke is recorded, so anything they log in to will also be available to us!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 170;
  surface.addChild(text);
};

Content.WIFI = function(surface) {
  var wifiImage = new createjs.Bitmap(Game.data.images['BadWifi']);
  wifiImage.x = Content.WIDTH / 2.0 - Game.data.images['BadWifi'].width / 2.0 + 80;
  wifiImage.y = 65;
  surface.addChild(wifiImage);

  var ssidImage = new createjs.Bitmap(Game.data.images['BadSsid']);
  ssidImage.x = Content.WIDTH / 2.0 - Game.data.images['BadSsid'].width / 2.0 - 80;
  ssidImage.y = 70;
  surface.addChild(ssidImage);

  var text = new createjs.Text('People tend to be willing to connect to free and open public wifi, let\'s exploit this...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  surface.addChild(text);

  text = new createjs.Text('By planting an \'innocent\' open wireless network in public we can record connected web traffic!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 150;
  surface.addChild(text);
};

Content.SCAM = function(surface) {
  var scamImage = new createjs.Bitmap(Game.data.images['EmployeeScam']);
  scamImage.x = Content.WIDTH / 2.0 - Game.data.images['BadWifi'].width / 2.0;
  scamImage.y = 75;
  surface.addChild(scamImage);

  var text = new createjs.Text('Many customers don\'t think twice before entering their passwords on store computers when a \'trained professional\' instructs them to...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = -20;
  surface.addChild(text);

  text = new createjs.Text('Let\'s dress some attackers up in company colors and send them out on the front line to harvest customer information!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 150;
  surface.addChild(text);
};

Content.TUTORIAL = function(surface) {
  Modal.surface.removeChild(Modal.okayButton);
  var text = new createjs.Text('Looks like this is your first time using the Hackmaster 3000, would you like a tutorial?', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH - 100;
  text.lineHeight = 30;
  text.textAlign = 'left';
  text.x = 100;
  text.y = 50;
  surface.addChild(text);
  var yesButton = Modal.makeTextButton('Yes', 75);
  yesButton.y = 200;
  yesButton.x -= 50;
  surface.addChild(yesButton);
  var noButton = Modal.makeTextButton('No', 75);
  noButton.y = 200;
  noButton.x += 50;
  surface.addChild(noButton);

  noButton.addEventListener('click', function() {
    Modal.surface.addChild(Modal.okayButton);
    Game.data.showTutorial = false;
    Modal.hide();
  });

  yesButton.addEventListener('click', function() {
    Modal.surface.addChild(Modal.okayButton);
    Modal.show('The Town', new Content(Content.TUTORIAL_MAP), function() {
      Modal.show('Attacks', new Content(Content.TUTORIAL_ACTIVITIES), function() {
        Modal.showForgotMethod();
      });
    });
  });

  var clippy = new createjs.Bitmap(Game.data.images['Clippy']);
  clippy.y = 30;
  surface.addChild(clippy);
};

Content.TUTORIAL_MAP = function(surface) {
  var text = new createjs.Text('In the upper left is a map of the town. The Library is our first target. You can mouse over buildings to see how we can attack them.', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 0;
  surface.addChild(text);

  var map = new createjs.Bitmap(Game.data.images['MapSmall']);
  map.x = Content.WIDTH / 2 - Game.data.images['MapSmall'].width / 2;
  map.y = 100;
  surface.addChild(map);
}

Content.TUTORIAL_ACTIVITIES = function(surface) {
  var text = new createjs.Text('There are different types of attacks we can deploy, you can mouse over them to learn more.', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 0;
  surface.addChild(text);

  var activity = new createjs.Bitmap(Game.data.images['Forgot']);
  activity.y = 65;
  activity.x = 0 + 80;
  surface.addChild(activity);
  var activity = new createjs.Bitmap(Game.data.images['SpoofWebsite']);
  activity.y = 65;
  activity.x = 80 + 80;
  surface.addChild(activity);
  var activity = new createjs.Bitmap(Game.data.images['Keylogger']);
  activity.y = 65;
  activity.x = 160 + 80;
  surface.addChild(activity);
  var activity = new createjs.Bitmap(Game.data.images['Wifi']);
  activity.y = 65;
  activity.x = 240 + 80;
  surface.addChild(activity);
  var activity = new createjs.Bitmap(Game.data.images['Scam']);
  activity.y = 65;
  activity.x = 320 + 80;
  surface.addChild(activity);

  text = new createjs.Text('New attacks can be unlocked by purchasing them, but to start you rely on... ', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 160;
  surface.addChild(text);
};

Content.TUTORIAL_RESOURCES = function(surface) {
  var text = new createjs.Text('Now you can buy more workers. Workers let you perform more attacks per turn and will also unlock new attack locations. Mouse over the highschooler and buy one!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 0;
  surface.addChild(text);

  var resource = new createjs.Bitmap(Game.data.images['Highschooler']);
  resource.x = 0 + 120;
  resource.y = 135;
  surface.addChild(resource);
  var resource = new createjs.Bitmap(Game.data.images['NetCafeOwner']);
  resource.x = 80 + 120;
  resource.y = 135;
  surface.addChild(resource);
  var resource = new createjs.Bitmap(Game.data.images['ApartmentOwner']);
  resource.x = 160 + 120;
  resource.y = 135;
  surface.addChild(resource);
  var resource = new createjs.Bitmap(Game.data.images['Scammer']);
  resource.x = 240 + 120;
  resource.y = 135;
  surface.addChild(resource);
};

Content.TUTORIAL_RISK = function(surface) {
  var text = new createjs.Text('The more money you steal the more aware your targets will become of your actions. Keep an eye on the risk meter, as it grows your attacks become less effective!', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 0;
  surface.addChild(text);
};

Content.GAME_OVER_AWARENESS = function(surface) {
  var go = new createjs.Bitmap(Game.data.images['GameOver']);
  go.x = (Content.WIDTH - Game.data.images['GameOver'].width) / 2.0;
  go.y = -50;
  surface.addChild(go);
  var text = new createjs.Text('Your targets have caught on to your attacks and are now no longer logging in on untrusted computers!', '16px GameFont', '#00FF00')
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 50;
  surface.addChild(text);
};

Content.GAME_OVER_TIME = function(surface) {
  var go = new createjs.Bitmap(Game.data.images['GameOver']);
  go.x = (Content.WIDTH - Game.data.images['GameOver'].width) / 2.0;
  go.y = -50;
  surface.addChild(go);
  var text = new createjs.Text('You haven\'t paid your rent in time and have been thrown out of your apartment!', '16px GameFont', '#00FF00')
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 50;
  surface.addChild(text);
};

Content.GAME_OVER_MONEY = function(surface) {
  var go = new createjs.Bitmap(Game.data.images['Success']);
  go.x = (Content.WIDTH - Game.data.images['Success'].width) / 2.0;
  go.y = -50;
  surface.addChild(go);
  var text = new createjs.Text('You managed to pay your rent on time before your targets were able to catch on to you! Now what to do for next month\'s rent...', '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 50;
  surface.addChild(text);
};

Content.SPLASH = function(surface) {
  var sp = new createjs.Bitmap(Game.data.images['Splash']);
  sp.x = -20;
  sp.y = -80;
  surface.addChild(sp);
  Modal.surface.removeChild(Modal.okayButton);
  Modal.surface.addChild(Modal.okayButton);
};

Content.withText = function(displayText) {
  return new Content(
    function(surface) {
      var text = new createjs.Text(displayText, '16px GameFont', '#00FF00');
      text.lineWidth = Content.WIDTH;
      text.lineHeight = 30;
      text.textAlign = 'center';
      text.x = Content.WIDTH / 2.0;
      text.y = 1 * Content.HEIGHT / 3.0  - text.getMeasuredHeight() / 2.0;
      surface.addChild(text);
    }
  );
};

Content.NEWS = function(surface) {
  console.log('Constants.NEWS_STORIES: ' + Constants.NEWS_STORIES);
  console.log('Game.data.currentStory: ' + Game.data.currentStory);
  var text = new createjs.Text(Constants.NEWS_STORIES[Game.data.currentStory]['text'], '16px GameFont', '#00FF00');
  text.lineWidth = Content.WIDTH;
  text.lineHeight = 30;
  text.textAlign = 'center';
  text.x = Content.WIDTH / 2.0;
  text.y = 0;
  surface.addChild(text);
};

Content.GRAPH_STATS = function(surface) {
	var money = new createjs.Text("Money", "10px GameFont","#00ff00");
	var profit = new createjs.Text("Profit", "10px GameFont","#ff0000");
	var resources = new createjs.Text("Resources", "10px GameFont","#0000ff");
	money.x=500;
	money.y= 40;
	profit.x=500;
	profit.y=60;
	resources.x=500;
	resources.y=80;
	surface.addChild(Game.data.graphs.stats.container);
	surface.addChild(money);
	surface.addChild(profit);
	surface.addChild(resources);
};

Content.NEWSPAPER = function(surface){
	var forgot=false;
	var keylog=false;
	var spoof = false;
	var wifi = false;
	var scam = false;
	var strleft="";
	for(var i=0;i<Game.data.currentActions.length;i++){
		if(Game.data.currentActions[i].action==="Forgot" && !forgot){
			var ind = Math.floor(Math.random()*ArticleInfo["Forgot"].length);
			strleft+= ArticleInfo["Forgot"][ind]+"\n\n";
			forgot=true;
			}
		else if(Game.data.currentActions[i].action==="Keylogger" && !keylog){
		
			var ind = Math.floor(Math.random()*ArticleInfo["Keylogger"].length);
			strleft+= ArticleInfo["Keylogger"][ind]+"\n\n";
			keylog=true;
			}
		else if(Game.data.currentActions[i].action==="SpoofWebsite" && !spoof){
			var ind = Math.floor(Math.random()*ArticleInfo["SpoofWebsite"].length);
			strleft+= ArticleInfo["SpoofWebsite"][ind]+"\n\n";
			spoof=true;
			}
		else if(Game.data.currentActions[i].action==="Wifi" && !wifi){
			var ind = Math.floor(Math.random()*ArticleInfo["Wifi"].length);
			strleft+= ArticleInfo["Wifi"][ind]+"\n\n";
			wifi=true;
			}
		else if(Game.data.currentActions[i].action==="Scam" && !scam ){
		
			var ind = Math.floor(Math.random()*ArticleInfo["Scam"].length);
			strleft+= ArticleInfo["Scam"][ind]+"\n\n";
			scam=true;
			}
	}
	
	var rstr="";
	rstr+= "Forgotten passwords retrieved: "+Game.data.actionUsage["Forgot"]+"\n";
	rstr+= "Passwords stolen on Spoofed Websites: "+Game.data.actionUsage["SpoofWebsite"]+"\n";
	rstr+= "Passwords stolen by Keyloggers: "+Game.data.actionUsage["Keylogger"]+"\n";
	rstr+= "Passwords stolen by Wifi Snoop: "+Game.data.actionUsage["Wifi"]+"\n";
	rstr+= "Passwords stolen by Scams: "+Game.data.actionUsage["Scam"]+"\n";
	rstr+= "Profit: $"+Game.data.profitLastTurn.toFixed(2)+"\n";
	rstr+= "Assets Apprehended: "+Game.data.peopleCaughtLastTurn+"\n";
	 
  var txtLeft = new createjs.Text(rstr,"12px GameFont","#00FF00");
  txtLeft.lineWidth = 2*Content.WIDTH/3;
  txtLeft.lineHeight = 30;
  surface.addChild(txtLeft);

	var txtRight = new createjs.Text(strleft,"16px GameFont","#00FF00");
	txtRight.x = 2*Content.WIDTH/3;
	txtRight.lineWidth=1*Content.WIDTH/3;
  txtRight.lineHeight = 30;
	surface.addChild(txtRight);
};
