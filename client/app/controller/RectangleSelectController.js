(function(exports){

    var RectangleSelectController = function (view, channel, model) {
        this._view = view;
        this._channel = channel;
        this._mouseLockKey = 'RS';
        
        this.model = model;
        
        this.init();
       
        this._channel.subscribe("selectionRectangleActivated", function(data, envelope) {
            this.qrySelectionStart(data.value);
        });
        
        this._channel.subscribe("selectionMouseDown", function(data, envelope) {
            this.qryCanvasMouseDown(data.value);
        });
        
        this._channel.subscribe("selectionMouseUp", function(data, envelope) {
            this.qryCanvasMouseUp(data.value);
        });
        
        this._channel.subscribe("selectionMouseMove", function(data, envelope) {
            this.qryCanvasMouseMove(data.value);
        });
    
    };

    RectangleSelectController.prototype = {
        init:function(){
            
        },
    
        qryCanvasMouseDown:function(evt){
            if (this.model !== null) {
                this._channel.publish( "lockmousemove", { value: this._mouseLockKey } );
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                
                this.model.SetMouseStartPosition(mx,my);
            }
        },
        
        qryCanvasMouseUp:function(evt){
            if (this.model !== null) {
             
                this._channel.publish( "lockmousemove", { value: '' } );
    	        this._channel.publish( "lockmouseup", { value: '' } );
                this._channel.publish( "lockmousedown", { value: '' } );
                
                
            }
        },
    
        qryCanvasMouseMove:function(evt){
            if (this.model !== null) {
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
    	        
                this.model.SetMouseMovingPosition(mx,my);
                
                // check for node inside the selection area here
                
                this._channel.publish( "drawtree", { value: this.model } );
                
            }
        },

        qrySelectionStart:function(){
            var that = this;
            
            // enable the rectangular selector
            
            // get a node that we'll use to draw the rectangle
            this.model.GetNode(function(){
    	        that._channel.publish( "lockmouseup", { value: this._mouseLockKey } );
	    	    that._channel.publish( "lockmousedown", { value: this._mouseLockKey} );
    	    });
        }
        
       
        
        
    };

    exports.RectangleSelectController = RectangleSelectController;
    
})(typeof exports === 'undefined'? this: exports);