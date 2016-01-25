//http://www.w3schools.com/jsref/jsref_cos.asp
//http://classroom.synonym.com/coordinates-distances-angles-2732.html

var NodeManager = function (data) {
 
    this.generations = [];
    this.initialGenerations =[];
    this.urlId =0;
   
    this._noteDll = data;
    this._selectionCount =0;
    
};


NodeManager.prototype = {

    GetActiveLayer: function (callback) {
        
        this._noteDll.GetActiveLayer(function(layerId){
            callback(layerId);
        });
    },
 
    init: function(loaded){
        this._noteDll.init(loaded);
    },
    
    SelectionCount: function(){
        return this._selectionCount;
    },

    SelectNode : function(node, selected, deselected, state){
        
        //hack incase something fucks up with total.
        if(this._selectionCount<0) this._selectionCount =0;
    
    
        if(node){        
            if(node.Selected == undefined) {    
                
                if(state==undefined)
                    node.Selected = true;
                else
                    node.Selected = state;
                
                this._selectionCount++;
                
                selected(node);
            }
            else
            {
                if(state!=undefined)
                    node.Selected = state;
                else
                    node.Selected = !node.Selected;
                
                if(node.Selected){
                    this._selectionCount++;
                    selected(node);
                }
                else
                {
                    this._selectionCount--;
                    deselected(node);
                    
                }
            }
        }
        else
            console.log('selected note undefined');
    },
    
    SelectNodes: function(node, callback){
        
        var intersectRect = function (r1, r2) {
            
            r1.left = r1.X;
            r1.right = r1.X + r1.Width;
            r1.top = r1.Y;
            r1.bottom = r1.Y + r1.Height;
            
            r2.left = r2.X;
            r2.right = r2.X + r2.Width;
            r2.top = r2.Y;
            r2.bottom = r2.Y + r2.Height;
            
            
            return !(r2.left > r1.right || 
                   r2.right < r1.left || 
                   r2.top > r1.bottom ||
                   r2.bottom < r1.top);
        };
        
        var vidx =1;
        var hidx =0;
      
        this._selectionCount =0;
        
        while(vidx < this.generations.length){
            hidx=0;
            while(hidx < this.generations[vidx].length){
                
                if(intersectRect(this.generations[vidx][hidx], node)){
                    if(this.generations[vidx][hidx].Annotation != '')
                        this.generations[vidx][hidx].Selected = true;
                    
                    this._selectionCount++;
                }
                else{
                    this.generations[vidx][hidx].Selected = false;
                    this._selectionCount--;
                }
                hidx++;
            }
            vidx++;
        }
        
        callback();
    },



    DeSelectNodes: function(callback){
        console.log('DeSelectNodes');
        this._selectionCount =0;
        var vidx =1;
        var hidx =0;
      
       
        while(vidx < this.generations.length){
            hidx=0;
            while(hidx < this.generations[vidx].length){
                
               
                    this.generations[vidx][hidx].Selected = false;
                
                
                hidx++;
            }
            vidx++;
        }
        
        callback();
    },

    GetSelectedNodes : function(callback){
        console.log('GetSelectedNodes');
        var selectedNodes = [];
        var vidx =1;
        var hidx =0;
      
        while(vidx < this.generations.length){
            hidx=0;
            while(hidx < this.generations[vidx].length){
                if(this.generations[vidx][hidx].Selected){
                    selectedNodes.push(this.generations[vidx][hidx]);
                }
                hidx++;
            }
            vidx++;
        }
        
        callback(selectedNodes);
    },

    GetGenerations: function (urlId, callback) {
        
        var that = this;
        var defaultOptions;
        
        that.urlId = urlId;
        that.generations.push([]);
        that.generations[0] = [];

        var nodeFactory = new Node(that.generations, that._channel);

        var fillPersistedData = function(defaultOptions){
            that.generations[1] = [];
            that._noteDll.GetNoteData(urlId,function(ajaxResult) {
                var idx =0;
                var cropFound =false;
                while(idx < ajaxResult.length){
                    
                    if(!ajaxResult[idx].Options) ajaxResult[idx].Options = defaultOptions;
                    
                    nodeFactory.CorrectErrors(ajaxResult[idx],function(node){
                        if(node.CropArea) 
                            cropFound =true;
                        that.AddNode(1,false,node,function(){});  
                    })
                    
                    idx++;
                }
            
                if(!cropFound){
                        nodeFactory.CreateEmptyNode(false,true, function(node){
                            that.AddNode(1,false,node,function(){
                                that.initialGenerations =  JSON.parse(JSON.stringify(that.generations)); 
                                callback();
                        });
                    })
                }
                else
                {
                    that.initialGenerations =  JSON.parse(JSON.stringify(that.generations)); 
                    callback();
                }

            });
        };
        
        that._noteDll.GetOptions(function(jsonData){
            if(jsonData.length > 0){
                defaultOptions = jsonData[0];
            }
            
            nodeFactory.CreateEmptyNode(true,false, function(node){
                that.AddNode(0,false,node,function(){
                    fillPersistedData(defaultOptions);
                });
            });
        });
    
    
        
        
    },
    
    RefreshMatches: function(){
        console.log('populated matches');
        var idx =0;
        var matchCount =3;
        var baseCount =0;
        
        
        while(idx < this.generations[1].length){
            var words = '';
            var chunkList = [];
            
            if((typeof this.generations[1][idx].Annotation) == "string")
                words = this.generations[1][idx].Annotation.split(' ');
            
            if(words.length <= matchCount){
                chunkList.push(this.generations[1][idx].Annotation);
            }
            else
            {
                // 
                baseCount =0;
                while(baseCount < words.length ){
                    var tp = '';
                    var iidx=0;
                    
                    while(iidx < matchCount && (baseCount+iidx) < words.length){
                        
                        //if(words[baseCount+iidx] != undefined)
                            tp += words[baseCount+iidx] + ' ';
                        
                        
                        iidx++;
                    }
                    chunkList.push(tp);
                    baseCount+= matchCount;
                }
            }
            // split 
            
            if((typeof this.generations[1][idx].Annotation) == "string"){
                var cidx=0;
            //    console.log('Unchopped annotation: '+this.generations[1][idx].Annotation);
            //    console.log('Chunks: ');
                while(cidx < chunkList.length){
                    //console.log(chunkList[cidx]);
                    cidx++;
                }
            }
            idx++;
        }
    },

    PointToNode:function(x, y, callback){
        var vidx =1;
        var hidx =0;
        var node;
       
        while(vidx < this.generations.length){
            hidx=0;
            while(hidx < this.generations[vidx].length){
                if(this.generations[vidx][hidx].Visible  && !(this.generations[vidx][hidx].SelectionArea ? this.generations[vidx][hidx].SelectionArea : false))
                {
                    var m = this.ContainsXY(this.generations[vidx][hidx],x,y);
                    if(m){
                        node = this.generations[vidx][hidx];
                        
                        if(!node.CropArea){
                            callback(node);
                            return;
                        }
                    }
                }
                hidx++;
            }
            vidx++;
        }
        
        callback();
    },
    
    ContainsXY:function(node, x, y){
        //x,y,width,height, angle
        
      
        //console.log('get coords:' + x + ' ' + y + ' ' + width + ' ' + height + ' ' + angle);
         
        var xangle = node.D *(Math.PI/180);
        var yangle = (node.D+90) *(Math.PI/180);
        
        var p1 = { x:node.X,  y:node.Y  };
        var p2 = { x:0,  y:0  };
        var p3 = { x:0,  y:0  };
        var p4 = { x:0,  y:0  };

        var cos = Math.cos(xangle) * node.Width;
      
        var sin = Math.sin(xangle) * node.Width;
        
        p2.x = p1.x + cos;
        p2.y = p1.y + sin;

        cos = Math.cos(yangle) * node.Height;
      
        sin = Math.sin(yangle) * node.Height;
        
        p3.x = p2.x + cos;
        p3.y = p2.y + sin;
        
        p4.x = p1.x + cos;
        p4.y = p1.y + sin;
       
        //console.log('testing:' + x +','+ y);
        
        var checkSide = function(pa,pb){
        
         //   console.log(pa.x + ',' + pa.y + ' to ' + pb.x + ',' + pb.y);
           // var A = -(pb.y - pa.y);
           // var B = pb.x - pa.x;
          //  var C = -(A * pa.y + B * pb.x);
    
            var D = ( (pb.x-pa.x)*(y-pa.y) - (pb.y-pa.y)*(x-pa.x) );
            
            //console.log('result:' + D);
            if(D >0){
                //left side 
                return 1;
            }
            else
            {
                //right side
                return 0;
            }
        
        };
        
        
        var result = checkSide(p1,p2);
        result += checkSide(p2,p3);
        result += checkSide(p3,p4);
        result += checkSide(p4,p1);
        
      //  console.log('r: ' +result);
        
        if(result == 4){
            // no contains
            //console.log('MATCH:' +  x + ' ' + y + ' '+ node.X + ' ' + node.Y + ' ' + node.Width + ' ' + node.Height + ' ' + node.D);
            return true;
        }
        else
        {
            //console.log('NOT MATCH:' +  x + ' ' + y + ' '+ node.X + ' ' + node.Y + ' ' + node.Width + ' ' + node.Height + ' ' + node.D);
            return false;
        }
        
    },

    WriteTextArea: function(id, UInote){
        
        var that = this;
        
        if(!UInote)
            console.log('writetextarea note null or undefined');
        
        var nodeFactory = new Node(this.generations, that._channel);
        
        nodeFactory.MakeNodeFromNote(id, UInote, undefined,2,undefined, function(node){
                                
            that.AddNode(1, true, node, function(node){
                return node.Index;
            });   
            
        });
        
    },
    
    WriteNote: function(id,x,y,width,height,degree,annotation,options,
                                layerId, metaData,cropArea,isOpen, callback)
    {
        var that = this;
        
        var nodeFactory = new Node(this.generations, that._channel);
        
        nodeFactory.MakeNode(id,x,y,width,height,degree,annotation,
                            true,options,layerId,metaData,cropArea,isOpen,undefined, function(node){
            that.AddNode(1, true, node, callback);   
        });
    },
    
    
    AddNodes: function(withInit, nodes, callback){
        var that =this;
        var idx =0;
        var responseCount=0;
        
        console.log('AddNodes: ' + nodes.length);
        
        while(idx < nodes.length){
            
            that.AddNode(1,withInit,nodes[idx],function(){
                
                responseCount++;
                console.log('AddNodes: added ' + nodes.length);
                if(responseCount == nodes.length){
                    console.log('AddNodes: finished');
                    callback();
                }
            });
            
            idx++;
        }
        
    },
    
    AddNode: function(genidx,withInit, node, callback){
 
        if(genidx === 0){
            this.generations[0].push(node);
            callback();
            return;
        }

        var that = this;
        
        var writeInitialData = function(level,node, index ){
            
            
            var initialValueNode =  JSON.parse(JSON.stringify(node));
        
        
            // first determine if this is existing entry
            if(level != 1)
            {
                console.log('writeInitialData incorrect level:' + level );
                return;
            }
            if(!that.initialGenerations){
                console.log('writeInitialData initialGenerations unitialized!');
                return;
            }
            
            // do percentage increase/decrease here
            
            var currentDrawingWidth =that.generations[0][0].Width;
            var currentDrawingHeight = that.generations[0][0].Height;
    
            var xOffset =0;
            var yOffset =0;
            
            if(that.generations[0][0].X < 0)
            {
                xOffset = Math.abs(that.generations[0][0].X);
                
            }
            
            if(that.generations[0][0].Y < 0)
            {
                yOffset = Math.abs(that.generations[0][0].Y);
                
            }
            
            if(that.generations[0][0].X > 0)
            {
                xOffset = 0-that.generations[0][0].X;
                
            }
            
            if(that.generations[0][0].Y > 0)
            {
                yOffset = 0-that.generations[0][0].Y;
                
            }

            var pcx1 = ((node.X + xOffset) / currentDrawingWidth) * 100;
         
            var pcy1 = ((node.Y + yOffset) / currentDrawingHeight) * 100;
        
        
            var pcW = ((node.Width ) / currentDrawingWidth) * 100;
         
            var pcH = ((node.Height) / currentDrawingHeight) * 100;
        
            var pxInitWidth = (that.initialGenerations[0][0].Width) /100;
            
            var pxInitHeight = (that.initialGenerations[0][0].Height)/100;
            
            initialValueNode.X = pcx1 * pxInitWidth;
           
            initialValueNode.Y = pcy1 * pxInitHeight;
     
            initialValueNode.Width = pcW * pxInitWidth;
           
            initialValueNode.Height = pcH * pxInitHeight;
     
            //if we have no index that means its a new entry that needs adding
            if(index == undefined){
                that.initialGenerations[1].push(initialValueNode);
            }
            else
            {
                console.log('AddNode writeInitialData updating generations');
                that.initialGenerations[1][index]= initialValueNode;
            }
           
            that.WriteToDB(initialValueNode,callback);
        };


        var idx =0;
        var isPresent =false;
        while(idx < this.generations[1].length){
            
            //console.log(this.generations[1][idx].PersonId + ' ' + noteId);
            if(Number(this.generations[1][idx].Index) === Number(node.Index)){
                isPresent = true;
                console.log('AddNode updating generations');
                this.generations[1][idx] =node;
                if(withInit)
                    writeInitialData(1,node,idx);
                return;
            }
            
            idx++;
        }
        
        if(!isPresent){
            this.generations[1].push(node);
            if(withInit)
                writeInitialData(1,node);
        }
        
        
        if(!withInit && callback){
            callback();
        }
         
    },
    
   
    UpdateNode: function( node, callback){
 
        var that = this;
        
        var writeInitialData = function(level,node, index ){
            
            
            var initialValueNode =  JSON.parse(JSON.stringify(node));
        
        
            // first determine if this is existing entry
            if(level != 1)
            {
                console.log('writeInitialData incorrect level:' + level );
                return;
            }
            if(!that.initialGenerations){
                console.log('writeInitialData initialGenerations unitialized!');
                return;
            }
            
            // do percentage increase/decrease here
            
            var currentDrawingWidth =that.generations[0][0].Width;
            var currentDrawingHeight = that.generations[0][0].Height;
    
            var xOffset =0;
            var yOffset =0;
            
            if(that.generations[0][0].X < 0)
            {
                xOffset = Math.abs(that.generations[0][0].X);
                
            }
            
            if(that.generations[0][0].Y < 0)
            {
                yOffset = Math.abs(that.generations[0][0].Y);
                
            }
            
            if(that.generations[0][0].X > 0)
            {
                xOffset = 0-that.generations[0][0].X;
                
            }
            
            if(that.generations[0][0].Y > 0)
            {
                yOffset = 0-that.generations[0][0].Y;
                
            }

            var pcx1 = ((node.X + xOffset) / currentDrawingWidth) * 100;
         
            var pcy1 = ((node.Y + yOffset) / currentDrawingHeight) * 100;
        
        
            var pcW = ((node.Width ) / currentDrawingWidth) * 100;
         
            var pcH = ((node.Height) / currentDrawingHeight) * 100;
        
            var pxInitWidth = (that.initialGenerations[0][0].Width) /100;
            
            var pxInitHeight = (that.initialGenerations[0][0].Height)/100;
            
            initialValueNode.X = pcx1 * pxInitWidth;
           
            initialValueNode.Y = pcy1 * pxInitHeight;
     
            initialValueNode.Width = pcW * pxInitWidth;
           
            initialValueNode.Height = pcH * pxInitHeight;
     
            //if we have no index that means its a new entry that needs adding
            if(index == undefined){
                that.initialGenerations[1].push(initialValueNode);
            }
            else
            {
                //console.log('AddNode writeInitialData updating generations');
                that.initialGenerations[1][index]= initialValueNode;
            }
           
            if(callback)
                callback(true);
        };
        
        var idx =0;
        while(idx < this.generations[1].length){
            if(Number(this.generations[1][idx].Index) === Number(node.Index)){
                //console.log('AddNode updating generations');
                this.generations[1][idx] =node;
                writeInitialData(1,node,idx);
                return;
            }
            
            idx++;
        }
        
        if(callback)
            callback(false);
    },
    
    WriteToDB: function(note,callback){
        this._noteDll.WriteNoteData(note,callback);
    },
    
    WriteNotesToDB: function(notes,callback){
        this._noteDll.WriteNotesData(notes,callback);
    },
    
    GetImageData: function (callback) {
        this._noteDll.GetImageData(callback);
    },
    Type : function(){
        return this._noteDll.Type();
    },
    
    DeleteSelection: function(callback){
        var idx =0;
        var deletedNodes = [];
        
        while(idx < this.generations[1].length){
            
            if(this.generations[1][idx].Selected){
                this.generations[1][idx].Visible =false;
                this.generations[1][idx].Selected =false;
                deletedNodes.push(this.generations[1][idx]);
            }
            
            idx++;
        }
        
        this.WriteNotesToDB(deletedNodes,callback);
    },
    
    
    GetCroppingNode : function(callback){
        
        var that = this;
        
        
        
        if(that.generations.length ==0 ) 
        {
            console.log('generations not loaded');
            return;
        }
        
        var idx =0;
        while(idx < that.generations[1].length){
            
            if(that.generations[1][idx].CropArea){
                callback(that.generations[1][idx], that.initialGenerations[1][idx]);
                return;
            }
            
            idx++;
        }
 
        console.log('cropping node not found');
        return;
    },
    
    GetSelectionAreaNode : function(callback){
        
       // this._noteDll.CleanGenerations();
        
        
        var that = this;
        
        var findNode = function(callback){   
            
            var idx =0;
            
            while(idx < that.generations[1].length){
                
                if(that.generations[1][idx].SelectionArea){
                    callback(that.generations[1][idx], that.initialGenerations[1][idx]);
                    return true;
                }
                
                idx++;
            }
            
            return false;
        };
        
        if(!findNode(callback))
        {
            var nodeFactory = new Node(that.generations, that._channel);
            
            nodeFactory.CreateEmptyNode(false,false, function(node){
                node.SelectionArea =true;
            
                //that._noteDll.GetImageData(callback);
            
                that.AddNode(1,false,node,function(){
                    findNode(callback);
                });
            })
        }
        
       

    }
    
};


