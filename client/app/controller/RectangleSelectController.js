(function(exports){

    var RectangleSelectController = function (view, channel, model) {
        this._view = view;
        this._channel = channel;
        
        this.model = model;
        
        this.init();
        
        if(this._view.QryRectangularSelector)
            this._view.QryRectangularSelector($.proxy(this.qrySelectionStart, this));

        if(this._view.QryCanvasMouseDown)
            this._view.QryCanvasMouseDown($.proxy(this.qryCanvasMouseDown, this));
        
        if(this._view.QryCanvasMouseUp)
            this._view.QryCanvasMouseUp($.proxy(this.qryCanvasMouseUp, this));
        
        if(this._view.QryCanvasMouseMove)
            this._view.QryCanvasMouseMove($.proxy(this.qryCanvasMouseMove, this));
    
    };

    RectangleSelectController.prototype = {
        init:function(){
            
        },
    
        qryCanvasMouseDown:function(evt){
            if (this.model !== null) {
                this._channel.publish( "lockmousemove", { value: 'RS' } );
                
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
    	        that._channel.publish( "lockmouseup", { value: 'RS' } );
	    	    that._channel.publish( "lockmousedown", { value: 'RS' } );
    	    });
        }
        
       
        
        
    };

    exports.RectangleSelectController = RectangleSelectController;
    
})(typeof exports === 'undefined'? this: exports);