var Meta = function (nodestore,view, image) {
    this.nodestore = nodestore;
    this.metaData = 1;  
    this.selectedMetaData = [];  
    this.lastClickedMetaData = {
        template: 0,
        meta:0
    };
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
        if(that.metaData.length >0){
            that.SetCurrentMetaId(that.metaData[0].id);
        }
        that.view.SetMetaData(data);
    });
};

Meta.prototype.SetCurrentMetaId = function(id){
    var that = this;
    var ids;
    var idx =0;
    /*
    
    */
    
    
    while(this.metaData.length){
        if(this.metaData[idx].id == id){
            this.lastClickedMetaData.meta =this.metaData[idx];
            
            // make lastclickedmetadata object literal containing currently selected datatype and metadata
            ids = this.metaData[idx].dts.split(',').map(Number); 
            break;
        }
        idx++;
    }
    
    this.nodestore.GetMetaDataTypes(ids, function(data){
        that.metaDataTypes = data;
        
        if(data.length > 0){
            that.SetCurrentTemplate(data[0].id);
        }
        that.view.SetTemplates(data);
    });
};

Meta.prototype.SetCurrentTemplate = function(id){
    var idx =0;
    while(this.metaDataTypes.length){
        if(this.metaDataTypes[idx].id == id){
            this.lastClickedMetaData.template =this.metaDataTypes[idx];
            
            break;
        }
        idx++;
    }
    
};



// Meta.prototype.SetSelectedMetaData = function(id){
//     this.selectedMetaData.push(id);
//     this.view.SetSelectedMetaData(this.selectedMetaData);
// };

// so we already have the metadata and datatype set when they got selected
// so this method doesnt need to receive them as args
Meta.prototype.SetAddButtonState = function(state){

   var contains = function(sourceArray, target){
       var idx =0;
       
       if(!sourceArray) return false;
       
       while(idx < sourceArray.length){
           if(sourceArray[idx].meta.id == target.id)
             return true;
           idx++;
       }
       
       return false;
   };

   if(state){
      
       if(!contains(this.selectedMetaData,this.lastClickedMetaData)){
           this.selectedMetaData.push(JSON.parse(JSON.stringify(this.lastClickedMetaData)));
       }
       //JSON.parse(JSON.stringify(this.defaultOptions))
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