(function(exports){
	var NodePositioning = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	 
	};
	
	NodePositioning.prototype.MoveNodes = function(nodes,x,y){
	
	},

    exports.NodePositioning = NodePositioning;
    
})(typeof exports === 'undefined'? this: exports);