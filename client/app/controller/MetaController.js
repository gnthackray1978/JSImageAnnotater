var MetaController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this.init();
    
    this._view.QryDeleteButtonState($.proxy(this.qryDeleteButtonState, this));
    
    this._view.QryAddButtonState($.proxy(this.qryAddButtonState, this));
    
    this._view.QryMetaState($.proxy(this.qryMetaState, this));
    
    this._view.QryTemplateState($.proxy(this.qryTemplateState, this));
    
    this._view.QrySaveButtonState($.proxy(this.qryAddButtonState, this));
};

MetaController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
 
    
    qryMetaState:function(data){
        
        this.model.SetCurrentMetaId(data);
          
    },
    
    qryTemplateState:function(data){
        
        this.model.SetCurrentTemplate(data);
          
    },
    
    qryAddButtonState:function(data){
        this.model.SetAddButtonState(data);
    },
    
    qryDeleteButtonState:function(data){
        this.model.SetDeleteButtonState(data);
    },
    
    qrySaveButtonState:function(){
        this.model.Save();
    }
};