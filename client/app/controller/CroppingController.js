(function(exports){

    var CroppingController = function (view, model) {
        this._view = view;
    
        this.model = model;
        
        this.init();
        
        if(this._view.QryCropAddButton)
            this._view.QryCropAddButton($.proxy(this.qryCropAddButton, this));
            
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
    
        qryCropAddButton:function(){
            var that = this;
            
            if(this.model.addMode){
                this._view.SetAddButtonCancel();
        	    this._view.SetCropSaveDisabled();
        	    
        	    this.model.GetNode(function(){
        	        that._view.LockCanvasMouseUp('CROP');
    	    	    that._view.LockCanvasMouseDown('CROP');
        	    });
        	    
        	    this.model.addMode =false;
            }
            else
            {
               // this.model.Add(function(){
                that._view.UpdateCanvas(this.model,null);
                that._view.LockCanvasMouseUp('');
                that._view.LockCanvasMouseDown('');
                that._view.LockCanvasMouseMove('');
                that._view.SetAddButtonAdd();
                that._view.SetCropSaveDisabled(); 
               // });
            }
        },
        
        qryCropDeleteButton:function(data){
            var that = this;
            this.model.Delete(function(){
                that._view.SetCropSaveDisabled();
                that._view.UpdateCanvas(that.model,null);
            }); 
        },
        
        qryCropSaveButton:function(data){
            var that = this;
            
            this.model.Save(
            function(){
                that._view.UpdateCanvas(that.model,null);
            },
            function(data){ 
    		    console.log('Crop.prototype.Save saved cropnode data: ' +data);
    		}); 
            
            this._view.SetAddButtonAdd();
                 
            this._view.SetCropSaveDisabled();  
        
        
        }
    };

    exports.CroppingController = CroppingController;
    
})(typeof exports === 'undefined'? this: exports);