(function(exports){
	var NodePositioning = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._mouse = {x: 0, y: 0};
		this._start_mouse = {x: 0, y: 0};
		
	};
	
	NodePositioning.prototype.OpenSelection = function(){
	
	},
	
	NodePositioning.prototype.CloseSelection = function(){
	
	},
	
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
		tpx = tpx- this._mouse.x;
		tpy = tpy- this._mouse.y;	
		 
		console.log('NodePositioning.prototype.updateSelectArea: ' + tpx + ' ' + tpy);
	}
	


    exports.NodePositioning = NodePositioning;
    
})(typeof exports === 'undefined'? this: exports);