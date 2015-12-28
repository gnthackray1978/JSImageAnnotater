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
                this._view.LockCanvasMouseMove('CROP');
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                
                this.model.SetMouseStartPosition(mx,my);
            }
        },
        
        qryCanvasMouseUp:function(evt){
            if (this.model !== null) {
                this._view.LockCanvasMouseMove('');
    	        this._view.LockCanvasMouseUp('');
                this._view.LockCanvasMouseDown('');
                
                if(this.model.ValidCropNode()){
                    this._view.SetCropSaveEnabled();
                }
            }
        },
    
        qryCanvasMouseMove:function(evt){
            if (this.model !== null) {
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
    	        
                this.model.SetMouseMovingPosition(mx,my);
                
                this._view.UpdateCanvas(this.model,null);
            }
        },
    
        _setAddMode:function(){
            var that = this;
            
            this._view.SetAddButtonCancel();
    	    //this._view.SetCropSaveDisabled();
    	    
    	    this.model.GetNode(function(){
    	        that._view.LockCanvasMouseUp('CROP');
	    	    that._view.LockCanvasMouseDown('CROP');
    	    });
    	    
    	    this.model.addMode =false;
        },
        _setCancelMode:function(){
            
            this._view.UpdateCanvas(this.model,null);
            
            this._view.LockCanvasMouseUp('');
            this._view.LockCanvasMouseDown('');
            this._view.LockCanvasMouseMove('');
            this._view.SetAddButtonAdd();
            this._view.SetCropSaveDisabled(); 
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
                that._view.SetCropSaveDisabled();
                //that._view.UpdateCanvas(that.model,null);
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
                 
                    
                    this._channel.publish( "scale", { value: that.model } );
                    this._channel.publish( "drawtree", { value: that.model } );
                    //that._view.UpdateCanvas(that.model,null);
                    //that._view.ScaleToScreen(that.model,null);
                    
                }
                else
                    console.log('Crop.Save failed');
                
            }); 
            
            this._view.SetAddButtonAdd();
                 
            this._view.SetCropSaveDisabled();  
        
        
        }
    };

    exports.CroppingController = CroppingController;
    
})(typeof exports === 'undefined'? this: exports);