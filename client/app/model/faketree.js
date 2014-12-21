//http://www.w3schools.com/jsref/jsref_cos.asp
//http://classroom.synonym.com/coordinates-distances-angles-2732.html

var FakeData = function () {
 
    this.generations = [];
    this.initialGenerations =[];
    this.urlId =0;
    this.baseUrl = 'https://jsimageannotater-gnthackray1978.c9.io';
//this.loader = new FakeData();
};


FakeData.prototype = {

    GetGenerations: function (urlId, callback) {
        this.urlId = urlId;
        this.generations.push([]);
        this.generations[0] = [];

        this.AddData(0,0,0,0,900,900,0,'empty');

        this.generations[1] = [];

        var that =this;

         $.ajax({
             type: "GET",
             async: false,
             url: this.baseUrl  + '/notes/'+urlId,
             contentType: "application/json",
             dataType: "JSON",
             success: function(ajaxResult) {
                console.log('loaded');
               // console.log(ajaxResult);
                
                var idx =0;
                
                while(idx < ajaxResult.length){
                    
                    that.AddData(1,ajaxResult[idx].Index, 
                                    ajaxResult[idx].X, 
                                    ajaxResult[idx].Y, 
                                    ajaxResult[idx].Width, 
                                    ajaxResult[idx].Height, 
                                    ajaxResult[idx].D, 
                                    ajaxResult[idx].Annotation);
                    
                    idx++;
                }
                
                that.initialGenerations =  JSON.parse(JSON.stringify(that.generations)); 
                
                
                callback();
             },
             error: function() {
                alert('Error loading data');
             }
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
        
        // var c2 = document.getElementById('myCanvas').getContext('2d');
        // c2.strokeStyle="red";
      

        // c2.beginPath();
        // c2.moveTo(coords.x1, coords.y1);
        // c2.lineTo(coords.x2, coords.y2);
        
        
        
        // c2.lineTo(coords.x3, coords.y3);
        // c2.lineTo(coords.x4, coords.y4);
        
        //  c2.closePath();
         
        // c2.stroke();
 
        
    },
    
    WriteTextArea: function(id, note){
        
        // get text area contents 
        // make data
    
        //   var result = {
        //         "x" : x,
        //         "y" : y,
        //         "width" : w+5,
        //         "height" : h,
        //         "d":this.getAngle(),
        //         "text" : text
        //     };
            
        if(!note)
            console.log('writetextarea note null or undefined');
          
        note.noteId = id;
     
        if(note.noteId == 0)
            note.noteId = this.NewId();
        
        this.AddData(1, note.noteId,note.x,note.y,note.width,note.height,note.d,note.text, true);
    
        return note.noteId;
    },
    
    AddData: function(genidx,noteId,x,y,width,height,degree,annotation,withInit){
 
        var node = {
            Annotation: annotation,
            Index: noteId,
            UrlId: this.urlId,
            Layer:0,
            X:Number(x),
            Y:Number(y),
            Width:Number(width),
            Height:Number(height),
            D:Number(degree),
            Visible: true
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
            if(Number(this.generations[1][idx].Index) === Number(noteId)){
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
        
        console.log('attempting to post to db');
        var stringy = JSON.stringify(note);
    
        $.ajax({
                type: "POST",
                async: true,
                url: this.baseUrl  + '/notes/annotation/',
                data: stringy,
                contentType: "application/json",
                dataType: "JSON"
            });
    }
    
};