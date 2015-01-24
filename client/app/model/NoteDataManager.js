//http://www.w3schools.com/jsref/jsref_cos.asp
//http://classroom.synonym.com/coordinates-distances-angles-2732.html

var NoteDataManager = function (data) {
 
    this.generations = [];
    this.initialGenerations =[];
    this.urlId =0;
   
    this._noteDll = data;
    //new MongoNoteData();
    
  //  this.layers =[];
    
};


NoteDataManager.prototype = {

    init: function(loaded){
        this._noteDll.init(loaded);
    },

    GetGenerations: function (urlId, callback) {
        this.urlId = urlId;
        this.generations.push([]);
        this.generations[0] = [];

        this.AddData(0,0,0,0,900,900,0,'empty',true,false, undefined,1);

        this.generations[1] = [];

        var that =this;

        this._noteDll.GetNoteData(urlId,function(ajaxResult) {
            var idx =0;
            while(idx < ajaxResult.length){
                
                that.AddData(1,ajaxResult[idx].Index, 
                                ajaxResult[idx].X, 
                                ajaxResult[idx].Y, 
                                ajaxResult[idx].Width, 
                                ajaxResult[idx].Height, 
                                ajaxResult[idx].D, 
                                ajaxResult[idx].Annotation,
                                ajaxResult[idx].Visible,
                                false,
                                ajaxResult[idx].Options,
                                ajaxResult[idx].layerId);
                
                idx++;
            }
            
            that.initialGenerations =  JSON.parse(JSON.stringify(that.generations)); 
            
            
            callback();
        });


    
    },
    
    
    NewId : function(){
          
        var idx =0;
        var topNumber =0;
        while(idx < this.generations[1].length){
            if(Number(this.generations[1][idx].Index) > Number(topNumber)){
                topNumber = this.generations[1][idx].Index;
            }
            
            idx++;
        }
        
        return topNumber + 1;
    },
    
    ContainsXY:function(node, x, y){
        //x,y,width,height, angle
        
      
        //console.log('get coords:' + x + ' ' + y + ' ' + width + ' ' + height + ' ' + angle);
         
        var xangle = node.D *(Math.PI/180);
        var yangle = (node.D+90) *(Math.PI/180)
        
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
       
        console.log('testing:' + x +','+ y);
        
        var checkSide = function(pa,pb){
        
            console.log(pa.x + ',' + pa.y + ' to ' + pb.x + ',' + pb.y);
           // var A = -(pb.y - pa.y);
           // var B = pb.x - pa.x;
          //  var C = -(A * pa.y + B * pb.x);
    
            var D = ( (pb.x-pa.x)*(y-pa.y) - (pb.y-pa.y)*(x-pa.x) );
            
            console.log('result:' + D);
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
        
        console.log('r: ' +result);
        
        if(result == 4){
            // no contains
            console.log('MATCH:' +  x + ' ' + y + ' '+ node.X + ' ' + node.Y + ' ' + node.Width + ' ' + node.Height + ' ' + node.D);
            return true;
        }
        else
        {
            console.log('NOT MATCH:' +  x + ' ' + y + ' '+ node.X + ' ' + node.Y + ' ' + node.Width + ' ' + node.Height + ' ' + node.D);
            return false;
        }
        
    },
    
    WriteTextArea: function(id, note){
        
        // get text area contents 
        // make data
    
        if(!note)
            console.log('writetextarea note null or undefined');
          
        note.Index = id;
     
        if(note.Index == 0)
            note.Index = this.NewId();
        
        this.AddData(1, note.Index,note.x,note.y,note.width,note.height,note.d,note.text,true, true, note.options,2);
    
        return note.Index;
    },
    
    WriteNote: function(genidx,index,x,y,width,height,degree,annotation,options,layerId){

        if(index == 0)
            index = this.NewId();
        
        this.AddData(1, index,x,y,width,height,degree,annotation,true, true, options,layerId);
    
        return index;
    },
    
    
    AddData: function(genidx,index,x,y,width,height,degree,annotation,visible,withInit,options,layerId){
 
        var node = {
            Annotation: annotation,
            Index: index,
            UrlId: this.urlId,
            Layer:0,
            X:Number(x),
            Y:Number(y),
            Width:Number(width),
            Height:Number(height),
            D:Number(degree),
            Visible: visible,
            Options: options,
            LayerId : layerId
        };

        if(genidx === 0){
            this.generations[0].push(node);
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
            
             
            
            //console.log('writeInitialData changing init values by :' + zoomPercentage);
          //  try
          //  {
               // console.log('writeInitialData ' + that.generations[1][2].X1 + ' ' +that.generations[1][2].X2);
               // console.log('writeInitialData ' + that.initialGenerations[1][2].X1 + ' ' +that.initialGenerations[1][2].X2);
          //  }
          //  catch(err){
                
          //  }
            
            
            
          //  console.log('writeInitialData node xs         :' + initialValueNode.X1 + ' ' + initialValueNode.X2);
            
            initialValueNode.X = pcx1 * pxInitWidth;
           
            initialValueNode.Y = pcy1 * pxInitHeight;
     
            initialValueNode.Width = pcW * pxInitWidth;
           
            initialValueNode.Height = pcH * pxInitHeight;
     
     
     
          //  console.log('writeInitialData node xs changed :' + initialValueNode.X1 + ' ' + initialValueNode.X2); 
             
            //if we have no index that means its a new entry that needs adding
            if(index == undefined){
                that.initialGenerations[1].push(initialValueNode);
                
            }
            else
            {
                console.log('AddData writeInitialData updating generations');
                that.initialGenerations[1][index]= initialValueNode;
            }
           
            that.WriteToDB(initialValueNode);
        };


        var idx =0;
        var isPresent =false;
        while(idx < this.generations[1].length){
            
            //console.log(this.generations[1][idx].PersonId + ' ' + noteId);
            if(Number(this.generations[1][idx].Index) === Number(index)){
                isPresent = true;
                console.log('AddData updating generations');
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
        
        
        
    },
    
    WriteToDB: function(note){
        this._noteDll.WriteNoteData(note);
    },
    
    GetOptions: function (urlId,callback) {
        this._noteDll.GetOptions(urlId,callback);
    },
    
    SaveOptions: function (options) {
        this._noteDll.SaveOptions(options);
    },
    GetImageData: function (callback) {
        this._noteDll.GetImageData(callback);
    },
    Type : function(){
        return this._noteDll.Type();
    },
    
    GetLayers: function (callback) {
        this._noteDll.GetLayers(callback);
    },
    SaveLayers: function (data,updateCache) {
        this._noteDll.SaveLayers(data,updateCache);
    },
    GetActiveLayer:function(callback){
        this._noteDll.GetActiveLayer(callback);
    },
    GetVisibleLayer:function(callback){
        this._noteDll.GetVisibleLayer(callback);
    },
    
    GetMetaData :function(callback){
        this._noteDll.GetMetaData(callback);
    },
    
    GetMetaDataTypes :function(callback,ids){
        this._noteDll.GetMetaData(callback,ids);
    }
};


