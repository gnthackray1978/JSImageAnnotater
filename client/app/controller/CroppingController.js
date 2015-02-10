var CroppingController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryCropButton($.proxy(this.qryCropButton, this));
    
    this._view.QryCropResetButton($.proxy(this.qryCropResetButton, this));
    
    this._view.QryCanvasMouseDown($.proxy(this.qryCanvasMouseDown, this));
    this._view.QryCanvasMouseUp($.proxy(this.qryCanvasMouseUp, this));
    this._view.QryCanvasMouseMove($.proxy(this.qryCanvasMouseMove, this));
    
};

CroppingController.prototype = {
    init:function(){
        
    },
    qryCanvasMouseDown:function(evt){
        if (this.model !== null) {
            this.model.canvasMouseDown(evt);
        }
    },
    
    qryCanvasMouseUp:function(evt){
        if (this.model !== null) {
            this.model.canvasMouseUp(evt);
        }
    },
    
    qryCanvasMouseMove:function(evt){
        if (this.model !== null) {
            this.model.canvasMouseMove(evt);
        }
    },
    
    qryCropButton:function(data){
      this.model.Crop();  
    },
    qryCropResetButton:function(data){
        
    }
};