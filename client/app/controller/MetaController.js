var MetaController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
   // this._view.QryMetaDataState($.proxy(this.qryMetaDataState, this));
    
    this._view.QryDataTypeState($.proxy(this.qryDataTypeState, this));
    
  
};

MetaController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
    
    qryMetaDataState:function(data){
        console.log('qryLayerButtonState: '+data);
      
             //   this.model.SetCurrent(data.id, data.value);
          
    },
    
    qryDataTypeState:function(data){
        console.log('qryLayerButtonState: '+data);
      
        this.model.SetDataType(data);
          
    }
    
};