var MetaController = function (model,channel, nodeManager) {
    
    this._nodeManager = nodeManager;
    this._channel = channel;
    this.selectedNode;
    this.model = model;
    
    this.init();
    
    this._view.QryDeleteButtonState($.proxy(this.qryDeleteButtonState, this));
    
    this._view.QryAddButtonState($.proxy(this.qryAddButtonState, this));
    
    this._view.QryMetaState($.proxy(this.qryMetaState, this));
    
    this._view.QryTemplateState($.proxy(this.qryTemplateState, this));
    
    this._view.QrySaveButtonState($.proxy(this.qrySaveButtonState, this));
    
    
    
    //that.meta.Load([]);
    //nodecreation
    
    var that = this;
    
    this._channel.subscribe("nodecreation", function(data, envelope) {
        that.model.Load([]);
    });
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        that.selectionChanged(function(){
            that.model.Load(that.selectedNode.MetaData);      
        });
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        that.selectionChanged(function(){
            that.model.Load(that.selectedNode.MetaData);      
        });
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        that.selectionChanged(function(){
            that.model.Load(that.selectedNode.MetaData);      
        });
    });
  
    this._channel.subscribe("nullselection", function(data, envelope) {
        that.selectionChanged(function(){
            that.model.Load(that.selectedNode.MetaData);      
        }); 
    });
    
};

            
            
MetaController.prototype = {
    init:function(){
    
         if (this.model !== null) {
            this.model.GetData();
         }
    },
 
    selectionChanged : function(callback){
        var that = this;
        
        this._nodeManager.GetSelectedNodes(function(selection){
            if(selection.length > 0){
                that.selectedNode = selection[0]; 
                callback();
            }
        });
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