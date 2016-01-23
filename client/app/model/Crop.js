(function(exports){
	var Crop = function (nodestore, optionsDll) {
	    this.optionsDll = optionsDll;
	    this.nodestore = nodestore;
	    this.addMode =true;
	    this.mouse = {x: 0, y: 0};
		this.start_mouse = {x: 0, y: 0};
		this.cropnode;
		this.options;
	};
	
	Crop.prototype.SetMouseMovingPosition = function(mx,my){
	
		this.mouse.x = mx;
		this.mouse.y = my;
		
		this.updateCropArea();
	},
	
	Crop.prototype.ValidCropNode = function(){
	    if(this.cropnode.X !=0 && this.cropnode.Y!= 0)
	    	return true;
	    else
	    	return false;
	},
	
	Crop.prototype.SetMouseStartPosition = function(mx,my){
		this.mouse.x = mx;
		this.mouse.y = my;
		
		this.start_mouse.x = this.mouse.x;
		this.start_mouse.y = this.mouse.y;
	},
	
	Crop.prototype.updateCropArea = function() {
		var tpx = this.start_mouse.x;
		var tpy = this.start_mouse.y;
		var tpw = this.mouse.x - this.start_mouse.x ;
		var tph = this.mouse.y - this.start_mouse.y;
		
		if(tpw < 0){
			tpx = this.start_mouse.x - Math.abs(tpw);
			tpw = Math.abs(tpw);
			
		}
	 
		if(tph < 0){
			tpy = this.start_mouse.y - Math.abs(tph);
			tph = Math.abs(tph);
			
		}
	
		this.cropnode.X = tpx;
		this.cropnode.Y = tpy;
		this.cropnode.Width = tpw;
		this.cropnode.Height = tph;
		this.cropnode.Visible =true;
		
		//console.log('cropnode: ' +this.cropnode.X + ' ' + this.cropnode.Y + ' ' + this.cropnode.Width + ' ' + this.cropnode.Height);
	},
	
	Crop.prototype.GetNode = function(complete){
	 	var that = this;
	 
	    that.nodestore.GetCroppingNode(function(data, initnode){
			that.cropnode = data;
			that.cropnode.LayerId = -4;// put crop node into edit mode.
			initnode.LayerId = -4;	   // this is to ensure that we dont inadvertantly change stuff 
			that.cropnode.X = 0;	   //while screen is being redrawn
			that.cropnode.Y = 0;
			that.cropnode.Width = 0;
			that.cropnode.Height = 0;
	
			that.cropnode.Options = JSON.parse(JSON.stringify(that.options));
            that.cropnode.CropArea =true;
            that.cropnode.IsOpen =true;
			complete();
	     
	    });
	},
	
	Crop.prototype.Add = function(complete){
	    
	    var that = this;
	    
		if(that.cropnode){
	
			//console.log('writing crop node index: ' + this.cropnode.Index);
			that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, true,false,
										          function(data){ 
										          	//console.log('Crop.prototype.Add cancel saved cropnode data: ' +data);
										          	
										          	
										          });
		}
		complete();
	};
	
	Crop.prototype.Delete = function(saveFunc){
		//console.log('delete');
		
		var that = this;
		if(that.cropnode!= undefined){
			that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, true,false,saveFunc);
		}
		else
		{
			that.nodestore.GetCroppingNode(function(data){
				that.cropnode =data;
				that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, true,false,saveFunc);
			});
		}
	};
	Crop.prototype.Cancel = function(){
		if(this.cropnode.IsOpen) this.cropnode.IsOpen =false;
	},
	Crop.prototype.Save = function(saveComplete){
		//console.log('save');
		//we need to save this to the db to make sure the entry in 
		// init values array gets updated to correct size.
		
		// also need to think about positioning!
		if(this.cropnode.IsOpen
	        && this.cropnode.X != 0
	        && this.cropnode.Y != 0
	        && this.cropnode.Width > 1
	        && this.cropnode.Height > 1
	        && this.cropnode.Visible){
	       
	        //console.log('writing crop node index: ' + this.cropnode.Index);
	        this.nodestore.WriteNote(this.cropnode.Index, 
									 this.cropnode.X,  
									 this.cropnode.Y,
									 this.cropnode.Width, 
									 this.cropnode.Height, 
									 this.cropnode.D, '', 
									 this.cropnode.Options,  
									 4,  
									 undefined, 
									 
									 true, 
									 false,
							         saveComplete);
	        
	        
	    }
	    else
	    {
	    	saveComplete(false);
	    }
	    
	    this.addMode = false;                           
	};

    exports.Crop = Crop;
    
})(typeof exports === 'undefined'? this: exports);


//monkey//