var Loader = {
  queue: new createjs.LoadQueue(true),
  init: function(){
    var q = this.queue;
    q.on("fileload", this.handleFileLoad, this);
    q.on("complete", this.handleComplete, this);
    $.each(Constants.ALL_DUDES, function(key,val){
      console.log("Loading Dude");
      q.loadFile({id: key, src: "images/"+val.image});
    });
    $.each(Constants.ALL_ACTIONS, function(key,val){
      q.loadFile({id: key, src: "images/"+val.image});
    });
    $.each(Constants.LOCK_IMAGES, function(key,val){
      q.loadFile({id: key, src: "images/"+val});
    });
    $.each(Constants.LESSON_IMAGES, function(key,val){
      q.loadFile({id: key, src: "images/"+val});
    });
    $.each(Constants.MISC_IMAGES, function(key,val){
      q.loadFile({id: key, src: "images/"+val});
    });
    q.load();

  },
  handleFileLoad: function(event){
    var item = event.item;
    Game.data.images[item.id] = event.result;
  },
  handleComplete: function(){
    Game.start();
  },
}
