var Meta = function (nodestore,view) {
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
  
};

Meta.prototype.Load = function(metaData){
    
    if(metaData && metaData.length){
        this.selectedMetaData = metaData;
        this.view.SetSelectedMetaData(metaData);
    }
    
    
    this.view.SetEnabledState(true);
};
Meta.prototype.Unload = function(){
    
    this.view.SetEnabledState(false);
};

Meta.prototype.QryNodeMetaData = function(callback){
    
     callback(this.selectedMetaData);
};

Meta.prototype.Save = function(){
    
    if(this.noteModelSaveCallback){
        this.noteModelSaveCallback(this.selectedMetaData);
    }
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

Meta.prototype.SetAddButtonState = function(state){

   var contains = function(sourceArray, target){
       var idx =0;
       
       if(!sourceArray) return false;
       
       while(idx < sourceArray.length){
           if(sourceArray[idx].meta.id == target.meta.id)
             return true;
           idx++;
       }
       
       return false;
   };

   if(state){
      
       if(!contains(this.selectedMetaData,this.lastClickedMetaData)){
           this.selectedMetaData.push(JSON.parse(JSON.stringify(this.lastClickedMetaData)));
       }
       this.view.SetSelectedMetaData(this.selectedMetaData);
   }
};

Meta.prototype.SetDeleteButtonState = function(state){
    
    var contains = function(sourceArray, target){
       var idx =0;
       
       if(!sourceArray) return -1;
       
       while(idx < sourceArray.length){
           if(sourceArray[idx].meta.id == target.id)
             return idx;
           idx++;
       }
       
       return -1;
    };
   
   if(state){
       var midx = contains(this.selectedMetaData,state);
       
       if(midx != -1){
            this.selectedMetaData.splice(midx, 1); 
            this.view.SetSelectedMetaData(this.selectedMetaData);
       }
   }
};