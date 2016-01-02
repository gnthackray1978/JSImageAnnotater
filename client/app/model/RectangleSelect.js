(function(exports){
	var RectangleSelect = function (nodestore) {
	    
	    this.nodestore = nodestore;
	    this.mouse = {x: 0, y: 0};
		this.start_mouse = {x: 0, y: 0};
		this.selectionnode;
	};
	
	RectangleSelect.prototype.SetMouseMovingPosition = function(mx,my){
	
		this.mouse.x = mx;
		this.mouse.y = my;
		
		this.updateSelectArea();
	},

	RectangleSelect.prototype.SetMouseStartPosition = function(mx,my){
		this.mouse.x = mx;
		this.mouse.y = my;
		
		this.start_mouse.x = this.mouse.x;
		this.start_mouse.y = this.mouse.y;
	},
	
	RectangleSelect.prototype.updateSelectArea = function() {
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
	
		this.selectionnode.X = tpx;
		this.selectionnode.Y = tpy;
		this.selectionnode.Width = tpw;
		this.selectionnode.Height = tph;
		this.selectionnode.Visible =true;
		
		//console.log('selectionnode: ' +this.selectionnode.X + ' ' + this.selectionnode.Y + ' ' + this.selectionnode.Width + ' ' + this.selectionnode.Height);
	},
	
	RectangleSelect.prototype.GetNode = function(complete){
		var that = this;
		
	    this.nodestore.GetSelectionAreaNode(function(node){
	    	that.selectionnode = node;
	    	complete();
	    });
	},

    exports.RectangleSelect = RectangleSelect;
    
})(typeof exports === 'undefined'? this: exports);


//monkey//