(function(exports){
	var NodePositioning = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._mouse = {x: 0, y: 0};
		this._start_mouse = {x: 0, y: 0};
		this._selectedNodes;
		this.SelectedNodeCount =0;
	};
	
	NodePositioning.prototype.StartMove = function(){
		
		console.log('StartMove: ' + this.SelectedNodeCount);
		
		this._nodeStore.GetSelectedNodes(function(selectedNodes){
            this._selectedNodes = selectedNodes;
        });
	},
	
	NodePositioning.prototype.FinishMove = function(){
		
		
		//this._selectedNodes;
		// save the changes here somehow.
		
		
	},
	
	NodePositioning.prototype.MoveNodes = function(nodes,x,y){
	
	},

	NodePositioning.prototype.SetMouseMovingPosition = function(mx,my){
		
		this._mouse.x = mx;
		this._mouse.y = my;
		
		this.MoveNodes();
	},

	NodePositioning.prototype.SetMouseStartPosition = function(mx,my){
		this._mouse.x = mx;
		this._mouse.y = my;
		
		this._start_mouse.x = this._mouse.x;
		this._start_mouse.y = this._mouse.y;
	},
	
	NodePositioning.prototype.MoveNodes = function() {
		var tpx = this._start_mouse.x;
		var tpy = this._start_mouse.y;
		
		tpx = tpx- this._mouse.x;
		tpy = tpy- this._mouse.y;	
		 
		 
		console.log('NodePositioning.prototype.MoveNodes: ' + tpx + ' ' + tpy);
	}
	


    exports.NodePositioning = NodePositioning;
    
})(typeof exports === 'undefined'? this: exports);