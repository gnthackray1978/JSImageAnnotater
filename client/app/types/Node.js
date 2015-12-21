
var Node = function (nodeCollection) {
    
    this.nodeCollection = [];
    
    if(nodeCollection)
        this.nodeCollection = nodeCollection;
    
    
    //this.data = typeof (data) !== 'undefined' ? data : {};
};

    // AddData: function(genidx,index,x,y,width,height,degree,annotation,
    //                         visible,withInit,options,layerId,metaData,cropArea,isOpen, callback){
                                
                                
Node.prototype.MakeNode = function(index,x,y,width,height,degree,annotation,
                            visible,options,layerId,metaData,cropArea,isOpen,urlId, callback){
    
    
    if(index == undefined)
        index = this.NewId();
            
            
    var node = {
            Annotation: annotation,
            Index: index,
            UrlId: urlId,//this.urlId
            X:Number(x),
            Y:Number(y),
            Width:Number(width),
            Height:Number(height),
            D:Number(degree),
            Visible: visible,
            Options: options,
            LayerId : layerId,
            MetaData : metaData,
            CropArea : cropArea,
            IsOpen: isOpen
        };
        
    callback(node);    
};



Node.prototype.MakeNodeFromNote = function(id, note, metaData, layerId, urlId, callback){
    // this.AddData(1, note.Index,note.x,note.y,note.width,note.height,
    // note.d,note.text,true, true, note.options,2);
    
    if(id == 0)
        id = this.NewId();
    
    this.MakeNode(id,note.x,note.y,note.width,note.height, note.d,note.text,
                    true,note.options, layerId,metaData,false, false, urlId, callback )
    
};

Node.prototype.CorrectErrors = function(node, callback){
    var cropFound =false;
    
    if(node.CropArea == undefined) 
    {
        if(Math.abs(node.LayerId) == 4 ) 
            cropFound =true;//old method for defining crop areas left in to handle old data
    }
    else
    {
        cropFound = node.CropArea;
    }
    
    this.MakeNode(node.Index,node.X,node.Y,node.Width,node.Height, node.D,node.Annotation,
                    node.Visible,node.Options, node.LayerId,node.MetaData, cropFound, false, undefined, callback );
    
};

Node.prototype.NewId = function(){
    /*THIS IS ONLY TEMPORARY WE NEED BETTER METHOD FOR GENERATING IDS WITHOUT
    THE DEPENDANCY*/      
    
    var idx =0;
    var topNumber =0;
    while(idx < this.nodeCollection[1].length){
        if(Number(this.nodeCollection[1][idx].Index) > Number(topNumber)){
            topNumber = this.nodeCollection[1][idx].Index;
        }
        idx++;
    }
    
    return Number(topNumber) + 1;
};

Node.prototype.CloneNode = function(node, callback){
    
    
    node = JSON.parse(JSON.stringify(node));
    node.Index = this.NewId();

    return node;
};

Node.prototype.CloneNodes = function(nodes,  callback){
    
    var idx =0;
    var newNodes = [];

    while(idx < nodes.length){
        var newNode = JSON.parse(JSON.stringify(nodes[idx]));
        newNode.Index = this.NewId();
        
        newNodes.push(newNode);
        idx++;
    }
    

    callback(newNodes);
};

Node.prototype.CreateEmptyNode = function(isFirst, isCropArea, callback){
    // this.AddData(1, note.Index,note.x,note.y,note.width,note.height,
    // note.d,note.text,true, true, note.options,2);
    var id =0;
    
    if(id == 0 && !isFirst)
        id = this.NewId();
    
    var w =0,h=0;
    /*
    WHAT IS THIS?
    */
    if(isFirst){
        w=900;
        h=900;
    }
    
    var layerId =2;
    
    this.MakeNode(id,0,0,w,h,0,"",true,undefined, layerId,undefined,isCropArea, false, undefined, callback )
    
};