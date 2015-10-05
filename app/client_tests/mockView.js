(function(exports){
    
    var mockView = function(){
        this.mouseMove ='';
        this.mouseUp='';
        this.mouseDown = '';
        this.model;
        this.addButtonCancel =0;
        this.addButtonAdd =0;
        this.cropSaveEnabled =0;
        this.cropSaveDisabled =0;
    };


    mockView.prototype.LockCanvasMouseMove = function(c){
        this.mouseMove = c;
    };
    
    mockView.prototype.LockCanvasMouseUp= function(c){
        this.mouseUp= c;
    };
    
    mockView.prototype.LockCanvasMouseDown = function(c){
        this.mouseDown = c;
    };
    
    mockView.prototype.UpdateCanvas = function(model, param2){
        this.model = model;
    };

    mockView.prototype.SetAddButtonCancel= function(){
        this.addButtonCancel++;
    };
    
    mockView.prototype.SetCropSaveEnabled= function(){
        this.cropSaveEnabled++;
    };
    
    mockView.prototype.SetAddButtonAdd= function(){
        this.addButtonAdd++;
    };
    
    mockView.prototype.SetCropSaveDisabled= function(){
        this.cropSaveDisabled ++;
    };
    
    exports.MockView = mockView;
})(typeof exports === 'undefined'? this: exports);