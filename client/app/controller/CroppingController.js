var CroppingController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryCropButton($.proxy(this.qryCropButton, this));
    
    this._view.QryCropResetButton($.proxy(this.qryCropResetButton, this));
};

CroppingController.prototype = {
    init:function(){
        
    },
    qryCropButton:function(data){
      this.model.Crop();  
    },
    qryCropResetButton:function(data){
        
    }
};