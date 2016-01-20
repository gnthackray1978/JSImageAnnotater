(function(exports){
	var NodePositioningController = function (nodestore, channel,view,model) {
	    
	    this._nodeStore = nodestore;
	    this._channel = channel;
	    this._view = view;
	    this._state =0;
	    this._mouseLockKey = 'NP';
        this.model = model;
	    this._selectedNodeCount=0;
	    
	    this._isMultiSelecting =false;
        this._mouseClickLocked =false;
        
        this.isStarted = false;
        
        
        
      
	    var that = this;
	    
	    // that._view.ActivateNodePositioning(function(){
	    //     that.PositioningActivated();
	    // });
	    
	    this._channel.publish( "ActivateNodePositioning", { value: function(){
	        that.PositioningActivated();
	    } } );
	    
	    
	    this._channel.subscribe("positionMouseDown", function(data, envelope) {
            //console.log('s_selectionMouseDown');
            that.qryCanvasMouseDown(data.value);
        });
        
        this._channel.subscribe("positionMouseMove", function(data, envelope) {
            //console.log('s_selectionMouseMove');
            that.qryCanvasMouseMove(data.value);
        });
	    
	    this._channel.subscribe("positionClick", function(data, envelope) {
            that.clickAction(data.value.x, data.value.y);
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
        
        that.updateState();
	};

	NodePositioningController.prototype.lockMouse = function(val){
        console.log('locked mouse: ' + val);
        this._channel.publish( "lockmouseup", { value: val } );
    	this._channel.publish( "lockmousedown", { value: val} );
    	this._channel.publish( "lockmousemove", { value: val } );
    	this._channel.publish( "lockmouseclick", { value: val } );
    },

    NodePositioningController.prototype.qryCanvasMouseDown = function(evt){
        var that =this;
        
        if(that._state != 2) return;
        
        
        if (this.model !== null) {
            
            this.lockMouse(that._mouseLockKey);
            
            var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
            
            this.model.SetMouseStartPosition(mx,my);
            
            // signal model we've started to move.
            this.model.StartMove();
            
        }
    },
        
    NodePositioningController.prototype.qryCanvasMouseMove = function(evt){
        
        if(this._state != 2) return;
        
        if(this.model !== null) {
            
            var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
	        
            this.model.SetMouseMovingPosition(mx,my);
            this._channel.publish( "drawtree", { value: this.model } );
        }
    },
	
	NodePositioningController.prototype.PositioningActivated = function(node){
	    console.log('PositioningActivated');
	    // find all the selected nodes.
	    // if selection is enabled.

	    switch(this._state){
	        case 1:
	        case 3:
	            this._state = 2;
	            this.isStarted = true;
	            this._channel.publish( "lockmouseup", { value: this._mouseLockKey } );
    	    	this._channel.publish( "lockmousedown", { value: this._mouseLockKey} );
	            break;
	        case 2:
	            this._state = 3;
	            this.finishSelecting();
	            break;
	    }
	    
        this.updateState();
	},

    NodePositioningController.prototype.clickAction = function(x,y){
        
		if(this.isStarted) {
			//this.finishSelecting();      
			this._state =3;
			this.updateState();
		}
        
    },

	NodePositioningController.prototype.finishSelecting = function(){
		console.log('finishSelecting');
        this.lockMouse('');
    	this.model.FinishMove();
    	this.isStarted = false;
    },
	
	NodePositioningController.prototype.updateState = function(node){
	    console.log('selection changed');
	    // find all the selected nodes.
	    // if selection is enabled.
	    switch(this._state){
	       case 0: // positioning not allowed
	           //this._view.DisableNodePositioning(true);
	           this._channel.publish( "DisableNodePositioning", { value: true } );
	           break;
	       case 1: // positioning allowed but unset
	           //this._view.DisableNodePositioning(false);
	           this._channel.publish( "DisableNodePositioning", { value: false } );
	           break;
	           
           case 2: // positioning switched on
	           //this._view.ToggleNodePositioning(true);
	           this._channel.publish( "ToggleNodePositioning", { value: true } );
	           this._channel.publish( "lockmouseup", { value: this._mouseLockKey } );
    	       this._channel.publish( "lockmousedown", { value: this._mouseLockKey} );
	           break;
	       case 3: // positioning switched off
	           //this._view.ToggleNodePositioning(false);
	           this._channel.publish( "ToggleNodePositioning", { value: false } );
	           this.finishSelecting();
	           break;         
	       
	    }
	},
	
	NodePositioningController.prototype.selectionChange = function(countselected, callback){
	    //console.log('Selection changed: ' + countselected);
	    
	    this.model.SelectedNodeCount = countselected;
	    
	    // find all the selected nodes.
	    // if selection is enabled.
	    
	    // ok so we need to know 2 things before we start moving things.
	    // do we have at least 1 node selected
	    // is state == 2
	    
	    if(this._state ==2 ){ 
	        
	        // this._nodeStore.GetSelectedNodes(function(selectedNodes){
	        //     this._selectedNodes = selectedNodes;
	        // });
	    }
	},
	
	NodePositioningController.prototype.MoveNodes = function(nodes,x,y){
	    console.log('NodePositioningController.movenodes: ' + (nodes ? nodes.length : nodes) + ' - ' + x + ',' + y);
	},

    exports.NodePositioningController = NodePositioningController;
    
})(typeof exports === 'undefined'? this: exports);