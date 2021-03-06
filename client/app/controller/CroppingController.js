(function(exports){

    var CroppingController = function (channel, model) {
        this._channel = channel;
        
        this.model = model;
        var that = this;
        
        
        
           
        this._channel.subscribe("CropACModeButton", function(data, envelope) {
            that.qryCropACModeButton(data.value);
        });
         
        this._channel.subscribe("CropSaveButton", function(data, envelope) {
            that.qryCropSaveButton(data.value);
        });
        
        this._channel.subscribe("CropDeleteButton", function(data, envelope) {
            that.qryCropDeleteButton(data.value);
        });
        
        this._channel.subscribe("cropMouseDown", function(data, envelope) {
            that.qryCanvasMouseDown(data.value);
        });
        
        this._channel.subscribe("cropMouseUp", function(data, envelope) {
            that.qryCanvasMouseUp(data.value);
        });
        
        this._channel.subscribe("cropMouseMove", function(data, envelope) {
            that.qryCanvasMouseMove(data.value);
        });
        
        this._channel.subscribe("defaultOptionsLoaded", function(data, envelope) {
            that.loadOptions(data.value);
        });
        
        this.init();
    };

    CroppingController.prototype = {
        
        init:function(){
            this._channel.publish( "RequestDefaultOptions", { value: undefined } );
        },
        
        loadOptions:function(op){
            if (this.model !== null) {
                this.model.options = op;
            }
        },
        qryCanvasMouseDown:function(evt){
            if (this.model !== null) {
                
                if(this.model.addMode) return;
                
                this.lockMouse('CROP');
                
               // this._channel.publish( "lockmousemove", { value: 'CROP' } );
                
                var mx = typeof evt.offsetX !== 'undefined' ? evt.offsetX : evt.layerX;
    	        var my = typeof evt.offsetY !== 'undefined' ? evt.offsetY : evt.layerY;
                
                this.model.SetMouseStartPosition(mx,my);
            }
        },
        
        qryCanvasMouseUp:function(evt){
            if (this.model !== null) {
                
                if(this.model.addMode) return;
                
            //     this._channel.publish( "lockmousemove", { value: '' } );
    	       // this._channel.publish( "lockmouseup", { value: '' } );
            //     this._channel.publish( "lockmousedown", { value: '' } );
                
                this.lockMouse('');
                
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
    	   //     that._channel.publish( "lockmouseup", { value: 'CROP' } );
	    	  //  that._channel.publish( "lockmousedown", { value: 'CROP' } );
	    	    
	    	    that.lockMouse('CROP');
    	    });
    	    
    	    this.model.addMode =false;
        },
        _setCancelMode:function(){
            
            // this._channel.publish( "lockmouseup", { value: '' } );
            // this._channel.publish( "lockmousedown", { value: '' } );
            // this._channel.publish( "lockmousemove", { value: '' } );
            
            this.lockMouse('');
            
            this._channel.publish( "setaddbuttonadd", { value: this.model } );
            this._channel.publish( "setcropsavedisabled", { value: this.model } );
            
            this.model.Cancel();
            this.model.addMode =true;
        },
        
        lockMouse : function(val){
            //console.log('locked mouse: ' + val);
            this._channel.publish( "lockmouseup", { value: val } );
	    	this._channel.publish( "lockmousedown", { value: val} );
	    	this._channel.publish( "lockmousemove", { value: val } );
	    	this._channel.publish( "lockmouseclick", { value: val } );
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