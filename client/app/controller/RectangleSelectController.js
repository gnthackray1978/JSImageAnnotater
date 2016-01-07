(function(exports){

    var RectangleSelectController = function (view, channel, model,nodeDataManager) {
        this._isMultiSelecting =false;
        this._view = view;
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
        
        this._view.SelectNodeButton($.proxy(this.selectNodeAction, this));
        
        this._channel.subscribe("selectionRectangleActivated", function(data, envelope) {
            //console.log('s_selectionRectangleActivated');
            that.qrySelectionStart(data.value);
        });
        
        this._channel.subscribe("selectionMouseDown", function(data, envelope) {
            //console.log('s_selectionMouseDown');
            that.qryCanvasMouseDown(data.value);
        });
        
        this._channel.subscribe("selectionMouseUp", function(data, envelope) {
            //console.log('s_selectionMouseUp');
            that.qryCanvasMouseUp(data.value);
        });
        
        this._channel.subscribe("selectionMouseMove", function(data, envelope) {
            //console.log('s_selectionMouseMove');
            that.qryCanvasMouseMove(data.value);
        });
        
        this._channel.subscribe("singleClick", function(data, envelope) {
            that.clickAction(data.value.x, data.value.y);
        });
    
        this._channel.subscribe("doubleClick", function(data, envelope) {
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
        
        this._channel.subscribe("activateNullSelection", function(data, envelope) {
            that.nullAction();
        });
        
        this._channel.subscribe("deactivateSelection", function(data, envelope) {
            that._state =0;
        });
        
        /*
            selection cleared
            selection changed
            
        */
    };

    RectangleSelectController.prototype = {
        init:function(){
            
        },
        
        qryCanvasMouseDown:function(evt){
            var that =this;
            
            if (this.model !== null) {
                this._channel.publish( "lockmousemove", { value: that._mouseLockKey } );
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                
                this.model.SetMouseStartPosition(mx,my);
                
                this.model.OpenSelection();
            }
        },
        
        qryCanvasMouseUp:function(evt){
            if (this.model !== null) {
                this.finishSelecting();
            }
        },
    
        qryCanvasMouseMove:function(evt){
            if (this.model !== null) {
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
    	        
                this.model.SetMouseMovingPosition(mx,my);
                this._channel.publish( "drawtree", { value: this.model } );
            }
        },

        qrySelectionStart:function(){
            var that = this;
            
            that.isStarted = !that.isStarted;
            // enable the rectangular selector
            
            if(that.isStarted){
                // get a node that we'll use to draw the rectangle
                this.model.GetNode(function(){
        	        that._channel.publish( "lockmouseup", { value: that._mouseLockKey } );
    	    	    that._channel.publish( "lockmousedown", { value: that._mouseLockKey} );
    	    	    that._view.DisplayRectangleSelection(true);
    	    	    that._channel.publish( "multiselectingstart", { value: this.model } );
    	    	    that._isMultiSelecting =true;
        	    });
            }else
            {
                that.finishSelecting();
            }
        }, 
        
        finishSelecting : function(){
            
            
            this._channel.publish( "lockmouseup", { value: '' } );
	    	this._channel.publish( "lockmousedown", { value: ''} );
	    	this._channel.publish( "lockmousemove", { value: '' } );
	    	
	    	this._view.DisplayRectangleSelection(false);
	    	
	    	this.model.CloseSelection();
	    	
	    	this._channel.publish( "multiselectingend", { value: this._nodeManager.SelectionCount()  } );
	    	
	    	this.isStarted = false;
	    	
	    	this._isMultiSelecting =false;
        },

        clickAction:function(x,y){
            var that = this;
         
            if(this._mouseClickLocked) return;
            
            this._nodeManager.PointToNode(x,y, function(node){
                
                switch(that._state){
                    case 0:
                        return;
                    case 1://standard we trigger events for null and selection
                        if(node){ 
                            that._selectedNode = node;
                            that.selectNode();
                        }
                        else
                        {
                            that._channel.publish( "nullselection", { value: undefined } ); 
                        }
                        break;
                    case 2:// no selecting selection ie you point to a node return it so it can be deleted.
                        if(node){ 
                            that._selectedNode = node;
                            that._channel.publish( "focusednode", { value: node } ); 
                        }
                        else
                        {
                            that._channel.publish( "nullselection", { value: undefined } ); 
                        }
                        break;
                    case 3:// only interested in null selections
                        if(node == undefined && !that._isMultiSelecting){
                            if(that._state == 3)
                            {
                                that._state = 0;
                                that._channel.publish( "nullselection", { value: undefined } ); 
                            }
                        }
                        break;
                }
               
                if(node == undefined && !that._isMultiSelecting){
                    that._nodeManager.DeSelectNodes(function(){
                        that._channel.publish( "drawtree", null);
                    });
                    
                }
                
            });
       
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
                console.log('selectNode nodeselected');
                that._channel.publish( "nodeselected", { value: that._nodeManager.SelectionCount() } ); 
            }, function(node){
                console.log('selectNode nodedeselected');
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
                case 0:
                    this._view.DisplaySingleSelection(false);// turn off ui button
                    this._channel.publish( "singleSelectionDisabled", { value: false} );  // tell the world we are no longer selecting anything
                    
                    this._nodeManager.SelectNode(this._selectedNode, function(node){}, function(node){
                        console.log('RectangleSelectController.updateState: nodedeselected '+ that._nodeManager.SelectionCount() );
                        that._channel.publish( "drawtree", { value: this.model } ); 
                        that._channel.publish( "nodedeselected", { value: that._nodeManager.SelectionCount() } ); //deselect whatever is currently selected
                        
                    },false);   
                    
                    break;
                case 1:
                    this._view.DisplaySingleSelection(true);
                    this._channel.publish( "singleSelectionEnabled", { value: false} ); 
                    break;
                case 2:// non select selections
                    // code
                    break;
                case 3: // empty space selections
                    // code
                    break;
            }
        }

    };

    exports.RectangleSelectController = RectangleSelectController;
    
})(typeof exports === 'undefined'? this: exports);