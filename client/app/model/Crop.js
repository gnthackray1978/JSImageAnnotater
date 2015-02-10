var Crop = function (nodestore,view) {
    this.nodestore = nodestore;
    this.view = view;
    
    this.tmp_canvas;
    this.tmp_ctx;
    
    this.mouse = {x: 0, y: 0};
	this.start_mouse = {x: 0, y: 0};
	
	
};
Crop.prototype.CanvasMouseMove = function(e){
	this.mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	this.mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
},
Crop.prototype.CanvasMouseUp = function(e){
	this.view.LockCanvasMouseMove('');
	
	this.tmp_ctx.drawImage(this.tmp_canvas, 0, 0);
	// Clearing tmp canvas
	this.tmp_ctx.clearRect(0, 0, this.tmp_canvas.width, this.tmp_canvas.height);
		
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
		
	// Tmp canvas is always cleared up before drawing.
	this.tmp_ctx.clearRect(0, 0, this.tmp_canvas.width, this.tmp_canvas.height);
	
	this.tmp_ctx.beginPath();
	this.tmp_ctx.moveTo(this.start_mouse.x, this.start_mouse.y);
	this.tmp_ctx.lineTo(this.mouse.x, this.mouse.y);
	this.tmp_ctx.stroke();
	this.tmp_ctx.closePath();
		
},

Crop.prototype.Crop = function(){
    
    var that = this;
    
    that.view.LockCanvasMouseUp('CROP');
    that.view.LockCanvasMouseDown('CROP');
    
	// Creating a tmp canvas
	that.tmp_canvas = document.getElementById("myCanvas");
	that.tmp_ctx = document.getElementById('myCanvas').getContext('2d');
	that.tmp_canvas.id = 'tmp_canvas';
	that.tmp_canvas.width = that.tmp_canvas.width;
	that.tmp_canvas.height = that.tmp_canvas.height;
 
 	that.tmp_ctx.lineWidth = 5;
	that.tmp_ctx.lineJoin = 'round';
	that.tmp_ctx.lineCap = 'round';
	that.tmp_ctx.strokeStyle = 'blue';
	that.tmp_ctx.fillStyle = 'blue';

	
};

Crop.prototype.Reset = function(metaData){

};

