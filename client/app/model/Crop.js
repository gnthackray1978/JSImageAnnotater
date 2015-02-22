var Crop = function (nodestore,view) {
    this.nodestore = nodestore;
    this.view = view;
    this.addMode =false;
    this.tmp_canvas;
    this.tmp_ctx;
    
    this.mouse = {x: 0, y: 0};
	this.start_mouse = {x: 0, y: 0};
	
	this.cropnode;
};
Crop.prototype.CanvasMouseMove = function(e){
//	console.log('CanvasMouseMove');
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	
	this.onPaint();
},
Crop.prototype.CanvasMouseUp = function(e){
//	console.log('CanvasMouseUp');
	this.view.LockCanvasMouseMove('');
	this.view.LockCanvasMouseUp('');
    this.view.LockCanvasMouseDown('');
    
    
    if(this.cropnode.X !=0 && this.cropnode.Y!= 0){
    	this.view.SetCropSaveEnabled();
    }
    
},
Crop.prototype.CanvasMouseDown = function(e){
//	console.log('CanvasMouseDown LockCanvasMouseMove set');
	this.view.LockCanvasMouseMove('CROP');
	
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	
	this.start_mouse.x = this.mouse.x;
	this.start_mouse.y = this.mouse.y;
	
	
},

Crop.prototype.onPaint = function() {

	this.cropnode.X = this.start_mouse.x;
	this.cropnode.Y = this.start_mouse.y;
	this.cropnode.Width = this.mouse.x - this.start_mouse.x ;
	this.cropnode.Height = this.mouse.y - this.start_mouse.y;
	this.cropnode.Visible =true;

	// console.log('writing crop node index: ' + this.cropnode.Index);
	// this.nodestore.WriteNote(this.cropnode.Index, this.cropnode.X,  this.cropnode.Y,
	//             				this.cropnode.Width, this.cropnode.Height, this.cropnode.D, '', this.cropnode.Options,  -4,  undefined, 
	// 									          function(){ });
										          
										          
	this.view.UpdateCanvas(this,null);
	console.log('cropnode: ' +this.cropnode.X + ' ' + this.cropnode.Y + ' ' + this.cropnode.Width + ' ' + this.cropnode.Height);
},

Crop.prototype.Add = function(){
    
    var that = this;
    
    
    that.addMode = !that.addMode;
    
    if(that.addMode)
    {
    	that.view.SetAddButtonCancel();
    	that.view.SetCropSaveDisabled();
    	
	    that.nodestore.GetCroppingNode(function(data, initnode){
	        console.log('got cropping node: ' + data.Index);
	        that.nodestore.GetOptions(0, function(options){
				console.log('got cropping node options: ' + options);
				that.cropnode = data;
		 
				that.cropnode.LayerId = -4;
				initnode.LayerId = -4;
				that.cropnode.X = 0;
				that.cropnode.Y = 0;
				that.cropnode.Width = 0;
				that.cropnode.Height = 0;
		
				that.cropnode.Options = JSON.parse(JSON.stringify(options));
	            that.cropnode.Options.DefaultEditorBorderColour = 'red';
	            that.cropnode.Options.BorderWidth = 5;
	            
		        that.view.LockCanvasMouseUp('CROP');
		    	that.view.LockCanvasMouseDown('CROP');
		
	        });
	    });
    }
    else
    {
    	if(that.cropnode){
	
			console.log('writing crop node index: ' + this.cropnode.Index);
			that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, 
										          function(data){ 
										          	console.log('Crop.prototype.Add cancel saved cropnode data: ' +data);
										          	
										          	
										          });
		}
		that.view.UpdateCanvas(this,null);
    	that.view.LockCanvasMouseUp('');
		that.view.LockCanvasMouseDown('');
		that.view.LockCanvasMouseMove('');
		that.view.SetAddButtonAdd();
		that.view.SetCropSaveDisabled();
    }
};

Crop.prototype.Delete = function(metaData){
	console.log('delete');
	
	
	
	var that = this;
	if(that.cropnode!= undefined){
		//this.cropnode.X = 0;
		//this.cropnode.Y = 0;
		//this.cropnode.Width = 0;
		//this.cropnode.Height = 0;
		//this.cropnode.Visible =false;
		//this.cropnode.LayerId = 4;
		
		  that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, 
										          function(){
											          	that.view.SetCropSaveDisabled();
														that.view.UpdateCanvas(that,null);
										          });
	}
	else
	{
		
		that.nodestore.GetCroppingNode(function(data){
			that.cropnode =data;
			
			that.nodestore.WriteNote(that.cropnode.Index, 0,  0,  0, 0, 0, '', that.cropnode.Options,  4,  undefined, 
										          function(){
											          	that.view.SetCropSaveDisabled();
														that.view.UpdateCanvas(that,null);
										          });
		});
		
	
	}
	
	
};

Crop.prototype.Save = function(metaData){
	console.log('save');
	//we need to save this to the db to make sure the entry in 
	// init values array gets updated to correct size.
	
	// also need to think about positioning!
	if(this.cropnode.LayerId == -4 
        && this.cropnode.X != 0
        && this.cropnode.Y != 0
        && this.cropnode.Visible){
       
        console.log('writing crop node index: ' + this.cropnode.Index);
        this.nodestore.WriteNote(this.cropnode.Index, this.cropnode.X,  this.cropnode.Y,
	            				this.cropnode.Width, this.cropnode.Height, this.cropnode.D, '', this.cropnode.Options,  4,  undefined, 
										          function(data){ 
										          	console.log('Crop.prototype.Save saved cropnode data: ' +data);
										          });
        
        this.view.UpdateCanvas(this,null);
    }
    
    this.view.SetAddButtonAdd();
    this.addMode = false;            
    this.view.SetCropSaveDisabled();                 
};