var CanvasTools = function () {
   this.ctx = document.getElementById('myCanvas').getContext('2d');
   this.canvas = document.getElementById("myCanvas");
};



CanvasTools.prototype = {

    DrawImage: function (node,  imgUrl, func) {

    //    console.log('attempting to draw :' + imgUrl);

        var x = node.X;
        var y = node.Y;

        var width = node.Width;
        var height = node.Height;
        
        var img = new Image;
        
        img.src = imgUrl;
        var that = this;
        img.onload = function () {

          
            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

            that.ctx.drawImage(img, x, y,width,height);
             
          
            func();
        }

    },
    DrawCroppedImage: function (node,  imgUrl,cropnode,initnode,func) {

        // if(cropnode && initnode){
        //     console.log('attempting to draw :' + cropnode.X + ',' + cropnode.Y+ ',' +cropnode.Width+ ',' +cropnode.Height);
        //     console.log('attempting to draw :' + initnode.X + ',' + initnode.Y+ ',' +initnode.Width+ ',' +initnode.Height);
        // }
        
        var x = node.X;
        var y = node.Y;

        var width = node.Width;
        var height = node.Height;
        
        var img = new Image;
        
        img.src = imgUrl;
        var that = this;
        img.onload = function () {

          
            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
         //   console.log('DrawCroppedImage: ' +  cropnode.Width + ' ' +cropnode.Height);
            if((cropnode.Width ==0 && cropnode.Height ==0) || cropnode.LayerId == -4)
                that.ctx.drawImage(img, x, y,width,height);
            else
                that.ctx.drawImage(img, initnode.X, initnode.Y,initnode.Width,initnode.Height, 
                cropnode.X, cropnode.Y, cropnode.Width,cropnode.Height
               );
             
          
            func();
        }

    },
    ClearCanvas: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    DrawLabel:function(x,y,width,height,d,text,options){

      
        
        var rotationAmt = d *(Math.PI/180);
        
        
        this.ctx.save();
        
        this.ctx.translate(x, y);
        
        this.ctx.rotate(rotationAmt);

        this.ctx.translate(0-x, 0-y);


        this.ctx.beginPath(); 
        this.ctx.rect(x, y, Math.abs(width), Math.abs(height));

        this.ctx.fillStyle = options.DefaultNoteColour; 
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = options.DefaultNoteColour;
        this.ctx.stroke();



        var idx = 5;

        while (idx < 150) {
            
            this.ctx.font = idx+"pt "+options.DefaultFont;

            var mo = this.ctx.measureText(text);

            if (mo.width > width || mo.height > height) {
                idx--;
                break;
            }

            idx++;
        }

         
        this.ctx.fillStyle = options.DefaultNoteFontColour;
        this.ctx.font = idx +"pt "+options.DefaultFont;


        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(text, x+ (width/2), y+ (height / 2));


        this.ctx.closePath();
        this.ctx.restore();
  
        return idx;
    },
    
    DrawCropBox :function(x,y,width,height,options){

     
        this.ctx.save();
        
             
        this.ctx.beginPath();
        this.ctx.lineWidth="4";
        this.ctx.strokeStyle= options.DefaultEditorBorderColour;
        this.ctx.rect(x, y, Math.abs(width), Math.abs(height));
        this.ctx.stroke();


        this.ctx.closePath();
        this.ctx.restore();
  
       
    }
};
