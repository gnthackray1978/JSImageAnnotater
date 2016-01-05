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
	    	
	    	this._channel.publish( "multiselectingend", { value: this.model } );
	    	
	    	this.isStarted = false;
	    	
	    	this._isMultiSelecting =false;
        },

        clickAction:function(x,y){
            var that = this;
         
            if(this._mouseClickLocked) return;
            
            this._nodeManager.PointToNode(x,y, function(node){
                
                if(that._state ==0 ) return; // selections have been turned off.
                
                if(node == undefined && !that._isMultiSelecting){
                    that.nodeManager.DeSelectNodes(function(){
                        that._channel.publish( "drawtree", null);
                    });
                    
                    that._channel.publish( "nullselection", { value: this.model } ); 
                }
                
                if(node && that._state == 1){ // standard selection
                    that._selectedNode = node;
                    that.selectNode();
                }
                
                if(node && that._state == 2){ // no selecting selection ie you point to a node return it so it can be deleted.
                    that._selectedNode = node;
                    that._channel.publish( "focusednode", { value: this.model } ); 
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
             
            if(this._selectedNode){        
                if(this._selectedNode.Selected == undefined) {    
                    this._selectedNode.Selected = true;
                    this._channel.publish( "nodeselected", { value: this.model } ); 
                }
                else
                {
                    this._selectedNode.Selected = !this._selectedNode.Selected;
                    
                    if(this._selectedNode.Selected)
                        this._channel.publish( "nodeselected", { value: this.model } ); 
                    else
                        this._channel.publish( "nodedeselected", { value: this.model } ); 
                }
            }
            else
                console.log('selected note undefined');
                
                
            this._channel.publish( "drawtree", { value: this.model } );    
        },
        
        
        selectNodeAction: function(){ // users are clicking nodes and they are being selected/deselected
            
            if(this._state ==2 ) return;
            
            if(this._state == 1) 
                this._state =0;
            else
                this._state =1;
                
            this.updateState();
        },
        
        deleteNodeAction: function(){ // users are clicking nodes and they are being deleted
            
            if(this._state ==1 ) return;
            
            if(this._state == 2) 
                this._state = 0;
            else
                this._state =2;
            
            this.updateState();
        },

        updateState: function(){
            
            switch (this._state) {
                case 0:
                    this._view.DisplaySingleSelection(true);
                    break;
                case 1:
                    this._view.DisplaySingleSelection(false);
                    break;
                case 2:
                    // code
                    break;
            }
        }

    };

    exports.RectangleSelectController = RectangleSelectController;
    
})(typeof exports === 'undefined'? this: exports);