var MetaController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryAddButtonState($.proxy(this.qryAddButtonState, this));
    
    this._view.QryDataTypeState($.proxy(this.qryDataTypeState, this));
    
  
};

MetaController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
 
    
    qryDataTypeState:function(data){
        
        this.model.SetDataType(data);
          
    },
    
    qryAddButtonState:function(data){
        this.model.SetAddButtonState(data);
    },
    qryDeleteButtonState:function(data){
        this.model.SetAddButtonState(data);
    }
    
    
};