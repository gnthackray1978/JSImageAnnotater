(function(exports){
	var NodePositioningController = function (nodestore, channel) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	 
	};
	
	NodePositioningController.prototype.MoveNodes = function(nodes,x,y){
	    console.log('NodePositioningController.movenodes: ' + (nodes ? nodes.length : nodes) + ' - ' + x + ',' + y);
	},

    exports.NodePositioningController = NodePositioningController;
    
})(typeof exports === 'undefined'? this: exports);