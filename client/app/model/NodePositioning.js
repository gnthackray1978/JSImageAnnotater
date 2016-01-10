(function(exports){
	var NodePositioning = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._mouse = {x: 0, y: 0};
		this._start_mouse = {x: 0, y: 0};
		
	};
	
	NodePositioning.prototype.MoveNodes = function(nodes,x,y){
	
	},

	NodePositioning.prototype.SetMouseMovingPosition = function(mx,my){
		
		this._mouse.x = mx;
		this._mouse.y = my;
		
		this.updateSelectArea();
	},

	NodePositioning.prototype.SetMouseStartPosition = function(mx,my){
		this._mouse.x = mx;
		this._mouse.y = my;
		
		this._start_mouse.x = this._mouse.x;
		this._start_mouse.y = this._mouse.y;
	},
	
	NodePositioning.prototype.updateSelectArea = function() {
		var tpx = this._start_mouse.x;
		var tpy = this._start_mouse.y;
		var tpw = this._mouse.x - this._start_mouse.x ;
		var tph = this._mouse.y - this._start_mouse.y;
		
		if(tpw < 0){
			tpx = this._start_mouse.x - Math.abs(tpw);
			tpw = Math.abs(tpw);
			
		}
	 
		if(tph < 0){
			tpy = this._start_mouse.y - Math.abs(tph);
			tph = Math.abs(tph);
			
		}
		
		console.log('NodePositioning.prototype.updateSelectArea: ' + tpx + ' ' + tpy);
	}
	


    exports.NodePositioning = NodePositioning;
    
})(typeof exports === 'undefined'? this: exports);