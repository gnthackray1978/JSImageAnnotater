(function(exports){
	var NodePositioningController = function (nodestore, channel,view) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._view = view;
	    this._state =0;
	    
	    var that = this;
	    
	    that._view.ActivateNodePositioning(function(){
	        that.PositioningActivated();
	    });
	    
	    this._channel.subscribe("multiselectingend", function(data, envelope) {
            that.selectionChange(data.value);
        });
        
        this._channel.subscribe("nodeselected", function(data, envelope) {
            that.selectionChange(data.value);
        });
        
        this._channel.subscribe("singleSelectionDisabled", function(data, envelope) {
            
            that._state = 0;
            that.updateState();
        });
        
        this._channel.subscribe("singleSelectionEnabled", function(data, envelope) {
            
            that._state = 1;
            that.updateState();
        });
        
        
	};
	
	NodePositioningController.prototype.PositioningActivated = function(node){
	    console.log('PositioningActivated');
	    // find all the selected nodes.
	    // if selection is enabled.
	    
	    if(this._state != 0){
	    
            if(this._state == 1 && this._state == 3) this._state =2;
            
            if(this._state == 1 && this._state == 2) this._state =3;
	    }
	    
        this.updateState();
	},
	
	NodePositioningController.prototype.updateState = function(node){
	    console.log('selection changed');
	    // find all the selected nodes.
	    // if selection is enabled.
	    switch(this._state){
	       case 0: // positioning not allowed
	           this._view.DisableNodePositioning(true);
	           break;
	       case 1: // positioning allowed but unset
	           this._view.DisableNodePositioning(false);
	           break;
	           
           case 2: // positioning switched on
	           this._view.ToggleNodePositioning(true);
	           break;
	       case 3: // positioning switched off
	           this._view.ToggleNodePositioning(false);
	           break;         
	       
	    }
	},
	
	NodePositioningController.prototype.selectionChange = function(node){
	    console.log('selection changed');
	    // find all the selected nodes.
	    // if selection is enabled.
	},
	
	NodePositioningController.prototype.MoveNodes = function(nodes,x,y){
	    console.log('NodePositioningController.movenodes: ' + (nodes ? nodes.length : nodes) + ' - ' + x + ',' + y);
	},

    exports.NodePositioningController = NodePositioningController;
    
})(typeof exports === 'undefined'? this: exports);