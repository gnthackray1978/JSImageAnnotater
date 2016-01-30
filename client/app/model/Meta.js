var Meta = function (metaDataDll,channel) {
    this._channel = channel;
    this.metaDataDll = metaDataDll;
    this.metaData = 1;  
    this.selectedMetaData = [];  
    this.lastClickedMetaData = {
        template: 0,
        meta:0
    };
    this.metaDataTypes = 1;

};

Meta.prototype.Load = function(metaData){
    
    if(metaData && metaData.length){
        this.selectedMetaData = metaData;
    }
};

Meta.prototype.Unload = function(){
    //this._channel.publish( "SetEnabledState", { value: false } );
};

Meta.prototype.Save = function(callback){
    // doesnt do anything yet
    // need to save back to drive here!
    this._shout('Save','meta saved');
    callback(this.selectedMetaData);
};

Meta.prototype.GetData = function(callback){
    var that = this;
    
    this.metaDataDll.GetMetaData(function(metaData){
        that.metaData = metaData;
        if(that.metaData.length >0){
            that.SetCurrentMetaId(that.metaData[0].id, function(metaDataTypes){
                callback(metaData,metaDataTypes);
            });
        } 
    });
};

Meta.prototype.SetCurrentMetaId = function(id,callback){
    var that = this;
    var ids;
    var idx =0;

    while(idx < this.metaData.length){
        if(this.metaData[idx].id == id){
            this.lastClickedMetaData.meta =this.metaData[idx];
            
            // make lastclickedmetadata object literal containing currently selected datatype and metadata
            ids = this.metaData[idx].dts.split(',').map(Number); 
            break;
        }
        idx++;
    }
    
    this.metaDataDll.GetMetaDataTypes(ids, function(data){
        that.metaDataTypes = data;
        
        if(data.length > 0){
            that.SetCurrentTemplate(data[0].id);
        }
  
        callback(that.metaDataTypes);
    });
};

Meta.prototype.SetCurrentTemplate = function(id){
    var idx =0;
    while(idx < this.metaDataTypes.length){
        if(this.metaDataTypes[idx].id == id){
            this.lastClickedMetaData.template =this.metaDataTypes[idx];
            
            break;
        }
        idx++;
    }
    
};

Meta.prototype.SetAddButtonState = function(state, callback){

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
  
       callback(this.selectedMetaData);
   }
};

Meta.prototype.SetDeleteButtonState = function(state,callback){
    
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

            callback(this.selectedMetaData);
       }
   }
};

Meta.prototype._shout = function(method, message){
    this._channel.publish( "DebugMessage", {name : 'MET' , description : method + '.'+ message } );
};