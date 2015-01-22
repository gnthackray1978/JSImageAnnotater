var Layer = function (nodestore,view, image) {
    this.nodestore = nodestore;
    this.layerData = 1;  
    this.view = view;
    //obviously this needs reworking
    //but lets get functionality correct first
    this.image = image;
};

Layer.prototype.GetData = function(){
     var that = this;
    
     this.nodestore.GetLayers(function(data){
        that.layerData = data;    
        that.view.SetLayers(data);
     });
     
};

Layer.prototype.SetName = function(layerId, name){
    var idx =0;
    while(idx < this.layerData.length){
        if(this.layerData[idx].id == layerId){
            this.layerData[idx].name = name;
            break;
        }
        idx++;
    }
    this.nodestore.SaveLayers(this.layerData,true);
    
    this.view.SetLayers(this.layerData);
};

Layer.prototype.SetOrder = function(layerId, order){
    var idx =0;
    while(idx < this.layerData.length){
        if(this.layerData[idx].id == layerId){
            this.layerData[idx].order = order;
            break;
        }
        idx++;
    }
    
    this.nodestore.SaveLayers(this.layerData,true);
    
    this.view.SetLayers(this.layerData);
    this.image.DrawTree();
};

Layer.prototype.SetCurrent = function(layerId, current){
    // we cant make the first one(the image) current
    if(layerId === 1) return;
    
    var idx =0;
    while(idx < this.layerData.length){
        if(this.layerData[idx].id == layerId){
            this.layerData[idx].current = current;
        }
        else
        {
            this.layerData[idx].current = false;
        }
        idx++;
    }
    this.nodestore.SaveLayers(this.layerData,true);
    
    this.view.SetLayers(this.layerData);
    this.image.DrawTree();
    
};

Layer.prototype.SetVisible = function(layerId, visible){
    var idx =0;
    
    while(idx < this.layerData.length){
        if(this.layerData[idx].id == layerId){
            this.layerData[idx].visible = visible;
            break;
        }
        idx++;
    }
    
    this.nodestore.SaveLayers(this.layerData,true);
  
    this.view.SetLayers(this.layerData);
    this.image.DrawTree();
};


Layer.prototype.SetDeleted = function(layerId){
    
   if(layerId > 3)    
   {
       for (var i = 0; i < this.layerData.length; i++)
        if (this.layerData[i].id === layerId) { 
            this.layerData.splice(i, 1);
            break;
        }
   }
   this.view.SetLayers(this.layerData);
   this.image.DrawTree();
};

Layer.prototype.SetNewLayer = function(){
    
    var idx =0;
    var newId =1;
    
    while(idx < this.layerData.length){
        
        if(this.layerData[idx].id > newId) 
            newId = this.layerData[idx].id;
        
        idx++;
    }
    
    newId= newId+1;
    
    this.layerData.push( {id:newId , order:newId , name : 'newlayer', visible: true, current: false});
    
    this.view.SetLayers(this.layerData);
};

Layer.prototype.Save = function(){
    
    this.nodestore.SaveLayers(this.layerData);
    this.view.SetLayers(this.layerData);
};

