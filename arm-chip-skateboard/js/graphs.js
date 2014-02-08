var GraphUtil = {
	newLineGraph: function(width,height){
		this.series=[];
		
		this.width=width;
		this.height=height;
		this.container = new createjs.Shape();
		this.addPoint= function(series,y){
			var newX;
			var xArr = this.series[series].x;
			if(xArr.length==0)
				newX=0;
			else
				newX=(xArr[xArr.length-1]+1);
			xArr.push(newX);
			if(newX<this.series[series].xBounds.min)
				this.series[series].xBounds.min=newX;
			if(newX>this.series[series].xBounds.max)
				this.series[series].xBounds.max=newX;
			this.series[series].y.push(y);
			if(y<this.series[series].yBounds.min)
				this.series[series].yBounds.min=y;
			if(y>this.series[series].yBounds.max)
				this.series[series].yBounds.max=y;
			this.graph();
			return this;
		};
		this.addSeries = function(c){
			this.series.push({x:[],y:[],color:c,xBounds:{min:0,max:0},yBounds:{min:0,max:0}});
			return this;
		};
		this.graph = function(){
			var gfx = this.container.graphics;
			gfx.clear();
			gfx.setStrokeStyle(3);
			gfx.beginStroke("#00FF00").moveTo(0,this.height).lineTo(0,0).moveTo(0,this.height).lineTo(this.width,this.height);
			gfx.endStroke();
			for(var j=0;j<this.series.length;j++){
				var xArr = this.series[j].x;
				var yArr = this.series[j].y;
				gfx.setStrokeStyle(3);
				gfx.beginStroke(this.series[j].color);
				gfx.moveTo(0,this.height);
				for(var i=0;i<xArr.length;i++){
					var x = (xArr[i]-this.series[j].xBounds.min)/(this.series[j].xBounds.max-this.series[j].xBounds.min) * this.width;
					var y = (yArr[i]-this.series[j].yBounds.min)/(this.series[j].yBounds.max-this.series[j].yBounds.min) * this.height;
					gfx.lineTo(x,this.height-y);
				}
				gfx.endStroke();
			}
		};
	}
};