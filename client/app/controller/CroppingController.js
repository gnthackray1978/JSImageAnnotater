(function(exports){

    var CroppingController = function (view, channel, model) {
        this._view = view;
        this._channel = channel;
        
        this.model = model;
        
        this.init();
        
        if(this._view.QryCropACModeButton)
            this._view.QryCropACModeButton($.proxy(this.qryCropACModeButton, this));
            
        if(this._view.QryCropSaveButton)
            this._view.QryCropSaveButton($.proxy(this.qryCropSaveButton, this));
        
        if(this._view.QryCropDeleteButton)
            this._view.QryCropDeleteButton($.proxy(this.qryCropDeleteButton, this));
        
        
        
        if(this._view.QryCanvasMouseDown)
            this._view.QryCanvasMouseDown($.proxy(this.qryCanvasMouseDown, this));
        
        if(this._view.QryCanvasMouseUp)
            this._view.QryCanvasMouseUp($.proxy(this.qryCanvasMouseUp, this));
        
        if(this._view.QryCanvasMouseMove)
            this._view.QryCanvasMouseMove($.proxy(this.qryCanvasMouseMove, this));
    
    };

    CroppingController.prototype = {
        init:function(){
            
        },
    
        qryCanvasMouseDown:function(evt){
            if (this.model !== null) {
                
                if(this.model.addMode) return;
                
                
                this._channel.publish( "lockmousemove", { value: 'CROP' } );
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                
                this.model.SetMouseStartPosition(mx,my);
            }
        },
        
        qryCanvasMouseUp:function(evt){
            if (this.model !== null) {
                
                if(this.model.addMode) return;
                
                this._channel.publish( "lockmousemove", { value: '' } );
    	        this._channel.publish( "lockmouseup", { value: '' } );
                this._channel.publish( "lockmousedown", { value: '' } );
                
                if(this.model.ValidCropNode()){
                    this._channel.publish( "setcropsaveenabled", { value: '' } );
                }
            }
        },
    
        qryCanvasMouseMove:function(evt){
            if (this.model !== null) {
                
                if(this.model.addMode) return;
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
    	        
                this.model.SetMouseMovingPosition(mx,my);
                this._channel.publish( "drawtree", { value: this.model } );
            }
        },
    
        _setAddMode:function(){
            var that = this;
            
            this._channel.publish( "setaddbuttoncancel", { value: this.model } );
            
            this.model.GetNode(function(){
    	        that._channel.publish( "lockmouseup", { value: 'CROP' } );
	    	    that._channel.publish( "lockmousedown", { value: 'CROP' } );
    	    });
    	    
    	    this.model.addMode =false;
        },
        _setCancelMode:function(){
            
            this._channel.publish( "lockmouseup", { value: '' } );
            this._channel.publish( "lockmousedown", { value: '' } );
            this._channel.publish( "lockmousemove", { value: '' } );
            this._channel.publish( "setaddbuttonadd", { value: this.model } );
            this._channel.publish( "setcropsavedisabled", { value: this.model } );
            
            this.model.Cancel();
            this.model.addMode =true;
        },
        
        qryCropACModeButton:function(){
            if(this.model.addMode){
               this._setAddMode();
            }
            else
            {
               this._setCancelMode();
            }
        },
        
        qryCropDeleteButton:function(data){
            var that = this;
            this.model.Delete(function(){
                that._channel.publish( "setcropsavedisabled", { value: that.model } );
                that._channel.publish( "scale", { value: that.model } );
                that._channel.publish( "drawtree", { value: that.model } );
            }); 
        },
        
        qryCropSaveButton:function(data){
            var that = this;
            
            this.model.Save(
                function(success){
                    
                    if(success == undefined) success = true;
                    
                    if(success){
                        that._channel.publish( "scale", { value: that.model } );
                        that._channel.publish( "drawtree", { value: that.model } );
                    }
                    else
                        console.log('Crop.Save failed');
                    
                }
            ); 
            
            that._channel.publish( "setaddbuttonadd", { value: this.model } );
            that._channel.publish( "setcropsavedisabled", { value: this.model } );
        
        }
    };

    exports.CroppingController = CroppingController;
    
})(typeof exports === 'undefined'? this: exports);