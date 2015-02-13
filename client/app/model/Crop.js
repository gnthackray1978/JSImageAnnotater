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
	console.log('CanvasMouseMove');
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	
	this.onPaint();
},
Crop.prototype.CanvasMouseUp = function(e){
	console.log('CanvasMouseUp');
	this.view.LockCanvasMouseMove('');
	this.view.LockCanvasMouseUp('');
    this.view.LockCanvasMouseDown('');
    
    
},
Crop.prototype.CanvasMouseDown = function(e){
	console.log('CanvasMouseDown');
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
	
	console.log('cropnode: ' +this.cropnode.X + ' ' + this.cropnode.Y + ' ' + this.cropnode.Width + ' ' + this.cropnode.Height);
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

