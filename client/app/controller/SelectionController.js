(function(exports){

    var SelectionController = function (channel, model,nodeDataManager) {
        this._isMultiSelecting =false;
        
        this._state =0;
        this._mouseClickLocked =false;
        this._nodeManager = nodeDataManager;
        this._selectedNode;
        this.isStarted = false;
        
        this._channel = channel;
        this._mouseLockKey = 'RS';
        
        this.model = model;
        
        this.init();
        var that = this;
         
        this._channel.subscribe("selectnodebtn", function(data, envelope) {
            that.selectNodeAction();
        });
        
        this._channel.subscribe("selectionRectangleActivated", function(data, envelope) {
            that.qrySelectionStart(data.value);
        });
        
        this._channel.subscribe("selectionMouseDown", function(data, envelope) {
            that.qryCanvasMouseDown(data.value);
        });
         
        this._channel.subscribe("selectionMouseMove", function(data, envelope) {
            that.qryCanvasMouseMove(data.value);
        });
        
        this._channel.subscribe("selectionClick", function(data, envelope) {
            that.clickAction(data.value.x, data.value.y);
        });
    
        this._channel.subscribe("selectionDoubleClick", function(data, envelope) {
            that.doubleClickAction(data.value.x, data.value.y);
        });
        
        this._channel.subscribe("mouseClickLock", function(data, envelope) {
            that._mouseClickLocked =data.value;
        });
        
        this._channel.subscribe("activateStandardSelection", function(data, envelope) {
            that.selectNodeAction();
        });
        
        this._channel.subscribe("activateFocusedSelection", function(data, envelope) {
            that.deleteNodeAction();
        });
        
        this._channel.subscribe("deactivateFocusedSelection", function(data, envelope) {
            that.deleteNodeAction();           
        });
        
        this._channel.subscribe("activateNullSelection", function(data, envelope) {
            that.nullAction();
        });
        
        this._channel.subscribe("deactivateSelection", function(data, envelope) {
            that._state =0;
        });
        
        // triggered after node saved
        this._channel.subscribe("DisplayNeutralState", function(data, envelope) {
            that._state =0;
        });
        
        /*
            selection cleared
            selection changed
            
        */
    };

    SelectionController.prototype = {
        init:function(){
            
        },
        
        qryCanvasMouseDown:function(evt){
            var that =this;
            
            if (this.model !== null) {
                if(this.isStarted)
                {
                    this.lockMouse(that._mouseLockKey);
                    
                    var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
        	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                    
                    this.model.SetMouseStartPosition(mx,my);
                    
                    this.model.OpenSelection();
                }
            }
        },
        
        qryCanvasMouseMove:function(evt){
            if (this.model !== null) {
                
                if(this.isStarted)
                {
                    var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
        	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
        	        
                    this.model.SetMouseMovingPosition(mx,my);
                    this._channel.publish( "drawtree", { value: this.model } );
                }
            }
        },

        qrySelectionStart:function(){
            var that = this;
            
            that.isStarted = !that.isStarted;
            // enable the rectangular selector
            
            if(that.isStarted){
                // get a node that we'll use to draw the rectangle
                this.model.GetNode(function(){
        	  
    	    	    that.lockMouse(that._mouseLockKey);
    	    	    
    	    	    that._channel.publish( "DisplayRectangleSelection", { value: true } );
    	    	    that._channel.publish( "multiselectingstart", { value: this.model } );
    	    	    that._isMultiSelecting =true;
        	    });
            }else
            {
                that.finishSelecting();
            }
        }, 
        
        lockMouse : function(val){
            //console.log('locked mouse: ' + val);
            this._channel.publish( "lockmouseup", { value: val } );
	    	this._channel.publish( "lockmousedown", { value: val} );
	    	this._channel.publish( "lockmousemove", { value: val } );
	    	this._channel.publish( "lockmouseclick", { value: val } );
        },
        
        finishSelecting : function(){

	    	this._channel.publish( "DisplayRectangleSelection", { value: false} );
	    	
	    	this.model.CloseSelection();
	    	
	    	this._channel.publish( "multiselectingend", { value: this._nodeManager.SelectionCount()  } );
	    	
	    	this.isStarted = false;
	    	
	    	this._isMultiSelecting =false;
	    	
	    	this._channel.publish( "drawtree", { value: this.model } );
	    	
	    	this._state =1;
	    	
	    	this.updateState();
        },

        clickAction:function(x,y){
            var that = this;
            var point = {
                x:x,
                y:y
            };
            
            if(this._isMultiSelecting)
            {
                this.finishSelecting();
            }
            else
            {
                this._nodeManager.PointToNode(x,y, function(node){
                    
                    switch(that._state){
                        case 0:
                            break;
                        case 1://standard we trigger events for null and selection
                            if(node){ 
                                that._selectedNode = node;
                                that.selectNode();
                            }
                            else
                            {
                                that._channel.publish( "nullselection", { value: point } ); 
                            }
                            break;
                        case 2:// no selecting selection ie you point to a node return it so it can be deleted.
                            if(node){ 
                                that._selectedNode = node;
                                that._channel.publish( "focusednode", { value: node } ); 
                            }
                            else
                            {
                                that._channel.publish( "nullselection", { value: point } ); 
                            }
                            break;
                        case 3:// only interested in null selections
                            if(node == undefined && !that._isMultiSelecting){
                                if(that._state == 3)
                                {
                                    that._state = 0;
                                    that._channel.publish( "nullselection", { value: point } ); 
                                }
                            }
                            break;
                    }
                  
                    // if we havent clicked on anything deselect everything
                    // always do this whatever the state.
                    if(node == undefined && !that._isMultiSelecting){
                        that._nodeManager.DeSelectNodes(function(count){
                            
                            if(count >0)
                                that._channel.publish( "nodedeselected", { value: 0 } );
                                
                            that._channel.publish( "drawtree", null);
                            
                        });
                        
                    }
                    
                });
            }
        },

        doubleClickAction:function(x,y){
            var that = this;
         
            if(this._mouseClickLocked) return;
            
            
            
            this._nodeManager.PointToNode(x,y, function(node){
                
                if(that._state ==0 ) return; // selections have been turned off.
                
                if(node)
                    that._channel.publish( "doubleClickSelectionChange", { value: node } ); 
            });
           
        },

        selectNode: function(){
            var that = this;
            
            this._nodeManager.SelectNode(this._selectedNode, function(node){
                that._shout('selectNode','selectNode node selected');
                that._channel.publish( "nodeselected", { value: that._nodeManager.SelectionCount() } ); 
            }, function(node){
                that._shout('selectNode','selectNode node deselected');
                that._channel.publish( "nodedeselected", { value: that._nodeManager.SelectionCount() } ); 
            });   
            
            
            this._channel.publish( "drawtree", { value: this.model } );    
        },
        
        
        selectNodeAction: function(){ // users are clicking nodes and they are being selected/deselected
            
            if(this._state ==2  || this._state == 3) return;
            
            if(this._state == 0) 
                this._state =1;
            else
                this._state =0;
                
            this.updateState();
        },
        
        deleteNodeAction: function(){ // users are clicking nodes and they are being deleted
            
            if(this._state ==1  || this._state == 3 ) return;
            
            if(this._state == 0) 
                this._state = 2;
            else
                this._state =0;
            
            this.updateState();
        },

        nullAction: function(){ // users are clicking nodes and they are being deleted
            
            if(this._state ==1 || this._state ==2 ) return;
            
            if(this._state == 0) 
                this._state = 3;
            else
                this._state =0;
            
            this.updateState();
        },

        updateState: function(){
            var that = this;
            
            switch (this._state) {
                case 0:// SELECTIONS DEACTIVATED nothing can be selected now.
                    
                    this._channel.publish( "DisplaySingleSelection", { value: false} );// turn off ui button
                    this._channel.publish( "singleSelectionDisabled", { value: false} );  // tell the world we are no longer selecting anything
                    // if there was something selected deselect it.
                    this._nodeManager.SelectNode(this._selectedNode, function(node){}, function(node){
                        
                        that._channel.publish( "drawtree", { value: this.model } ); 
                        that._channel.publish( "nodedeselected", { value: that._nodeManager.SelectionCount() } ); //deselect whatever is currently selected
                        
                    },false);   
                    this.lockMouse('');
                    break;
                case 1:
                    this.lockMouse(this._mouseLockKey);
                    
                    this._channel.publish( "DisplaySingleSelection", { value: true} );// turn off ui button
                    this._channel.publish( "singleSelectionEnabled", { value: false} ); 
                    break;
                case 2:// non select selections
                    this.lockMouse(this._mouseLockKey);
                    // code
                    break;
                case 3: // empty space selections
                    this.lockMouse(this._mouseLockKey);
                    // code
                    break;
            }
        },

        _shout : function(method, message){
            this._channel.publish( "DebugMessage", {name : 'SLC' , description : method + '.'+ message } );
        }
    };

    exports.SelectionController = SelectionController;
    
})(typeof exports === 'undefined'? this: exports);