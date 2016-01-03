(function(exports){

    var RectangleSelectController = function (view, channel, model) {
        this._view = view;
        this.isStarted = false;
        
        this._channel = channel;
        this._mouseLockKey = 'RS';
        
        this.model = model;
        
        this.init();
        var that = this;
        
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
             
                this._channel.publish( "lockmousemove", { value: '' } );
    	        this._channel.publish( "lockmouseup", { value: '' } );
                this._channel.publish( "lockmousedown", { value: '' } );
                
                this.model.CloseSelection();
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
        	    });
            }else
            {
                that._channel.publish( "lockmouseup", { value: '' } );
    	    	that._channel.publish( "lockmousedown", { value: ''} );
    	    	that._view.DisplayRectangleSelection(false);
            }
        }

    };

    exports.RectangleSelectController = RectangleSelectController;
    
})(typeof exports === 'undefined'? this: exports);