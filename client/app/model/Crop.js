var Crop = function (nodestore,view) {
    this.nodestore = nodestore;
    this.view = view;
    
    this.tmp_canvas;
    this.tmp_ctx;
    
    this.mouse = {x: 0, y: 0};
	this.start_mouse = {x: 0, y: 0};
	
	this.cropnode;
};
Crop.prototype.CanvasMouseMove = function(e){
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
},
Crop.prototype.CanvasMouseUp = function(e){
	this.view.LockCanvasMouseMove('');
	this.view.LockCanvasMouseUp('');
    this.view.LockCanvasMouseDown('');
},
Crop.prototype.CanvasMouseDown = function(e){
	this.view.LockCanvasMouseMove('CROP');
	
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	
	this.start_mouse.x = this.mouse.x;
	this.start_mouse.y = this.mouse.y;
	
	this.onPaint();
},

Crop.prototype.onPaint = function() {

	this.cropnode.x = this.start_mouse.x;
	this.cropnode.y = this.start_mouse.y;
	this.cropnode.width = this.mouse.x - this.start_mouse.x ;
	this.cropnode.height = this.mouse.y - this.start_mouse.y;
	this.cropnode.visible =true;
},

Crop.prototype.Crop = function(){
    
    var that = this;
    
    that.nodestore.GetCroppingNode(function(data){
       
        that.nodestore.GetOptions(0, function(options){
			
			that.cropnode = data;
			that.cropnode.Visible =false;
			that.cropnode.options = JSON.parse(JSON.stringify(options));
            that.cropnode.options.DefaultEditorBorderColour = 'red';
            that.cropnode.options.BorderWidth = 5;
            
	        that.view.LockCanvasMouseUp('CROP');
	    	that.view.LockCanvasMouseDown('CROP');
	
        });
    });
};

Crop.prototype.Reset = function(metaData){

};

