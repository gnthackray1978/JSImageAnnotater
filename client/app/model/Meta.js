var Meta = function (nodestore,view, image) {
    this.nodestore = nodestore;
    this.metaData = 1;  
    this.selectedMetaData = [];  
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

Meta.prototype.SetDataType = function(id){
    var that = this;
    var ids;
    var idx =0;
    
    while(this.metaData.length){
        if(this.metaData[idx].id == id){
            ids = this.metaData[idx].dts.split(','); 
            break;
        }
        idx++;
    }
    
    this.nodestore.GetMetaDataTypes(ids, function(data){
        that.metaDataTypes = data;
        that.view.SetMetaDataTypes(data);
    });
};

Meta.prototype.SetSelectedMetaData = function(id){
    this.selectedMetaData.push(id);
    this.view.SetSelectedMetaData(this.selectedMetaData);
};

// so we already have the metadata and datatype set when they got selected
// so this method doesnt need to receive them as args
Meta.prototype.SetAddButtonState = function(state){

   if(state){
       if(this.selectedMetaData.indexOf(this.metaData)< 0){
           this.selectedMetaData.push(this.metaData);
       }
       
       this.view.SetSelectedMetaData(this.selectedMetaData);
   }
};

Meta.prototype.SetDeleteButtonState = function(state){

   if(state){
       if(this.selectedMetaData.indexOf(this.metaData)< 0){
           this.selectedMetaData.push(this.metaData);
       }
       
       this.view.SetSelectedMetaData(this.selectedMetaData);
   }
};