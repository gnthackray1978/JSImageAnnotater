var Meta = function (nodestore,view, image) {
    this.nodestore = nodestore;
    this.metaData = 1;  
    this.metaDataTypes = 1;
    this.view = view;
    //obviously this needs reworking
    //but lets get functionality correct first
    this.image = image;
    
};



Meta.prototype.Save = function(){
    
   // this.nodestore.SaveLayers(this.layerData);
   // this.view.SetLayers(this.layerData);
};

Meta.prototype.GetMetaDataTypes = function(){
    
    
};

Meta.prototype.GetDataTypes = function(){
    
    
};

Meta.prototype.GetData = function(){
    
    var that = this;
    
    this.nodestore.GetMetaData(function(data){
        that.metaData = data;
        that.view.SetMetaData(data);
    });
    
    

};

Meta.prototype.SetDataType = function(ids){
    var that = this;
    
    this.nodestore.GetMetaDataTypes(function(data){
        that.metaDataTypes = data;
        that.view.SetMetaDataTypes(data);
    });
};

