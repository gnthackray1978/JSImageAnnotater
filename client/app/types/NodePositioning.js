(function(exports){
	var NodePositioning = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._mouse = {x: 0, y: 0};
		this._start_mouse = {x: 0, y: 0};
		this._last_mouse = {x: 0, y: 0};
		this._selectedNodes;
		this.SelectedNodeCount =0;
	};
	
	NodePositioning.prototype.StartMove = function(){
		var that = this;
		console.log('StartMove: ' + this.SelectedNodeCount);
		
		this._nodeStore.GetSelectedNodes(function(selectedNodes){
            that._selectedNodes = selectedNodes;
        });
	},
	
	NodePositioning.prototype.FinishMove = function(){
		
		
		//this._selectedNodes;
		// save the changes here somehow.
		
		
	},
	 

	NodePositioning.prototype.SetMouseMovingPosition = function(mx,my){
		
		this._mouse.x = mx;
		this._mouse.y = my;
		
	    
		this.MoveNodes();
	},

	NodePositioning.prototype.SetMouseStartPosition = function(mx,my){
		this._mouse.x = mx;
		this._mouse.y = my;
		
		this._last_mouse.x = mx;
	    this._last_mouse.y = my;
	    
		this._start_mouse.x = this._mouse.x;
		this._start_mouse.y = this._mouse.y;
	},
	
	NodePositioning.prototype.MoveNodes = function() {

	    var tpx = this._last_mouse.x - this._mouse.x;
	    var tpy = this._last_mouse.y - this._mouse.y;

		var idx =0;

		while(idx < this._selectedNodes.length){
			this._selectedNodes[idx].IsMove =true;
			this._selectedNodes[idx].X -= tpx;
			
			this._selectedNodes[idx].Y -= tpy;
			this._nodeStore.UpdateNode(this._selectedNodes[idx]);
			idx++;
		}
		
		this._last_mouse.x = this._mouse.x;
	    this._last_mouse.y = this._mouse.y;

	}
	


    exports.NodePositioning = NodePositioning;
    
})(typeof exports === 'undefined'? this: exports);