var TreeBase, TreeUI;



// need ref to view for scope



var ImageViewer = function () {

   // $.extend(this, new TreeBase());
 

    this.currentZoomPercentage = 100;

    this.canvas = document.getElementById("myCanvas");


    //functions
    
    this.displayNodeInfo=1;//delegate
    this.updateAddButtonUI = 1;
    //this.updateSaveButtonUI = 1;
    this.updateDeleteButtonUI = 1;
    this.updateUrlList = 1;
    this.updateRunButtonUI =1;
    this.updateOptions=1;
    this.getTextAreaDetails =1;
    
    this.clearTextArea = 1;
    
    
    // modes delete add etc
    this.addNode =false;
    this.deleteNode =false;
    
    
    //ids
    this.urlId =null;
    this.selectedNoteId = 0; // not zero based
    this.imageData = null;
    
    
    //settings
    //https://jsimageannotater-gnthackray1978.c9.io
    this.baseUrl = 'https://jsimageannotater-gnthackray1978.c9.io';
    this.options = {};
};

ImageViewer.prototype = new TreeBase();

ImageViewer.prototype.ChangeAngle= function (direction){
    
},

ImageViewer.prototype.PerformClick= function (x, y) {
        
        
    this.lastClickedPosY = y;
    this.lastClickedPosX = x;

    var vidx =1;
    var hidx =0;
    // loop throught generations and find out if we have the mouse in anything of them
    this.currentNode.x = -1; 
    this.currentNode.y = -1; 
   
    while(vidx < this.nodestore.generations.length){
        
        hidx=0;
        while(hidx < this.nodestore.generations[vidx].length){
            
            if(this.nodestore.generations[vidx][hidx].Visible)
            {
                var m = this.nodestore.ContainsXY(this.nodestore.generations[vidx][hidx],x,y);
                
                if(m){
                    
                    this.currentNode.x = vidx; 
                    this.currentNode.y = hidx;  
                }
                
                // var tpx2 = this.nodestore.generations[vidx][hidx].X +this.nodestore.generations[vidx][hidx].Width;
                // var tpy2 = this.nodestore.generations[vidx][hidx].Y +this.nodestore.generations[vidx][hidx].Height;
                
                // if (this.nodestore.generations[vidx][hidx].X <= x &&  tpx2 >= x) 
                // {
                //      //console.log('matched x');
                     
                //      if (this.nodestore.generations[vidx][hidx].Y <= y && tpy2 >= y)                      
                //      {
                //         this.currentNode.x = vidx; 
                //         this.currentNode.y = hidx;  
                //      } 
                // }
            }
            
            hidx++;
        }
        
        vidx++;
    }
    
    //this.ancTree.displayNodeInfo
    // add delete stuff here
    
    
    // add/edit node
    if(this.addNode)
    {
        if( this.currentNode.x != -1 && this.currentNode.y != -1)
        {
            var currentNode = this.nodestore.generations[this.currentNode.x][this.currentNode.y];
            var height = currentNode.Height;
            var width = currentNode.Width;
            var note = currentNode.Annotation;
            this.selectedNoteId = this.nodestore.generations[this.currentNode.x][this.currentNode.y].Index;
            this.displayNodeInfo(currentNode.X, currentNode.Y,width,height,currentNode.D,note,this.options);
        }
        else
        {
            this.selectedNoteId =0;
            this.displayNodeInfo(x, y,70,25,15,'',this.options);
        }
    
    }
            
    
    
    if(this.deleteNode){
        
        if( this.currentNode.x != -1 && this.currentNode.y != -1)
        {
            this.nodestore.generations[this.currentNode.x][this.currentNode.y].Visible =false;
            if(this.selectedNoteId == this.nodestore.generations[this.currentNode.x][this.currentNode.y].Index){
                this.selectedNoteId = 0;
            }
            
            this.nodestore.WriteToDB(this.nodestore.generations[this.currentNode.x][this.currentNode.y]);
            
            // make sure no invalid selection is left in memory
            // because then future adds etc, will go wrong!
            this.currentNode.x = -1; 
            this.currentNode.y = -1; 
            
            
        }
        
        
    }
    
    if(!this.addNode)
        this.clearTextArea();
    
};

ImageViewer.prototype.DrawTree= function () {


    this.ComputeLocations();
    
    if (this.nodestore.generations.length == 0) {
        return;
    }

    try {

   
       var that = this;

       this.treeUI.DrawImage(this.nodestore.generations[0][0], this.imageData.url , function () {

           var vidx = 1;

           while (vidx < that.nodestore.generations.length) {
                var hidx=0;
                while (hidx < that.nodestore.generations[vidx].length) {
                    
                    if(that.nodestore.generations[vidx][hidx].Visible)
                    {
                        
                       
                            
                        that.treeUI.DrawLabel(
                            that.nodestore.generations[vidx][hidx].X,
                            that.nodestore.generations[vidx][hidx].Y,
                            that.nodestore.generations[vidx][hidx].Width,
                            that.nodestore.generations[vidx][hidx].Height,
                            that.nodestore.generations[vidx][hidx].D,
                            that.nodestore.generations[vidx][hidx].Annotation, that.options);
                            
                    }
                    hidx++;
                }
                vidx++;
            }

        });
        
        // we need to check if the selected node has changed if so then update ui
        // also handle when the nodes are clicked on.
        // if something is clicked we have to remove the node
        // trigger the display of the text area which is html
        // does of any of that need to be done in here?
        

    }
    catch (err) {
        console.log('Error Drawing Persons');
        console.log(err);
    }





};

ImageViewer.prototype.ComputeLocations=function () {

    var width = this.nodestore.generations[0][0].Width;

    var height = this.nodestore.generations[0][0].Height;

    if(width == 0 || height ==0){
        console.log('ComputeLocations generation[0][0] invalid dimensions: ' + this.nodestore.generations[0][0]);
    }

    // assuming that the centre point has been changed by the zoom function if needed

    if (this.currentZoomPercentage != this.zoomPercentage) {
        var percentageDiff = this.zoomPercentage - this.currentZoomPercentage;
        width += (width / 100) * percentageDiff;
        height += (height / 100) * percentageDiff;
        this.currentZoomPercentage = this.zoomPercentage;
    }

    if(isNaN(this.centrePoint) || isNaN(width)){
        console.log('ComputeLocations NAN variables: cp ' + this.centrePoint + ' wdth: ' + width + ' zp: ' + this.zoomPercentage);
        console.log(this.nodestore.generations[0][0]);
    }
    //this.canvas.width = window.innerWidth;
    //this.canvas.height = window.innerHeight;

    var halfCanvasWidth = (this.canvas.width / 2);

    // adjust centrepoint before we start?
    // no because centre point is the same for all boxs

    // we have to change the 'halfcanvaswidth' get the value as a percentage of the initial image


    this.nodestore.generations[0][0].Width = width;
    this.nodestore.generations[0][0].X = this.centrePoint;
    
    this.nodestore.generations[0][0].Height = height;
    this.nodestore.generations[0][0].Y = this.centreVerticalPoint;
  
  
    // drawing boundaries will always be based on first image because thats the background
    this.drawingX1 = this.nodestore.generations[0][0].X;
    this.drawingX2 = this.nodestore.generations[0][0].X + this.nodestore.generations[0][0].Width;

    this.drawingY1 = this.nodestore.generations[0][0].Y;
    this.drawingY2 = this.nodestore.generations[0][0].Y+ this.nodestore.generations[0][0].Height;

    this.drawingHeight = this.nodestore.generations[0][0].Height;

    this.drawingWidth = this.nodestore.generations[0][0].Width;


     
    var initWidth = this.nodestore.initialGenerations[0][0].Width;
    var initHeight = this.nodestore.initialGenerations[0][0].Height;

    //console.log('init width: ' + initWidth);

    var checkedPIncrease = ((this.drawingWidth - initWidth) / initWidth) * 100;
    
 //   console.log('checkedPIncrease: ' + checkedPIncrease);
    
    var idx = 0;

    while (idx < this.nodestore.initialGenerations[1].length) {
        var px1 = (this.nodestore.initialGenerations[1][idx].X / initWidth) * 100;
        var py1 = (this.nodestore.initialGenerations[1][idx].Y / initHeight) * 100;
        
        this.nodestore.generations[1][idx].X = this.drawingX1 + (this.drawingWidth / 100) * px1;
        this.nodestore.generations[1][idx].Y = this.drawingY1 + (this.drawingHeight / 100) * py1;
        
     //   console.log('(this.nodestore.initialGenerations[1][idx].X1 / initWidth): ' + this.nodestore.initialGenerations[1][idx].X1 + '-----' + px1);
       
      //  console.log('(this.nodestore.initialGenerations[1][idx].X2 / initWidth): ' + this.nodestore.initialGenerations[1][idx].X2 + '-----' + px2);

    
        var pw =this.nodestore.initialGenerations[1][idx].Width +  ((this.nodestore.initialGenerations[1][idx].Width/100) * checkedPIncrease);
        var py =this.nodestore.initialGenerations[1][idx].Height+ ((this.nodestore.initialGenerations[1][idx].Height/100) * checkedPIncrease);
   
        this.nodestore.generations[1][idx].Width = pw;
        this.nodestore.generations[1][idx].Height = py;

        idx++;
    }


};       //end compute locations

//run when generation is loaded
//run when visibility changed
ImageViewer.prototype.UpdateGenerationState= function () {
    
      console.log('attempting image data');
    
      if(!this.imageData) return;
      
      if(!this.nodestore.generations || this.nodestore.generations.length == 0 || this.nodestore.generations[0].length == 0) return;
      
      
      
      this.nodestore.generations[0][0].X = 0;
      this.nodestore.generations[0][0].Width = this.imageData.width;
      
      this.nodestore.generations[0][0].Y = 0;
      this.nodestore.generations[0][0].Height = this.imageData.height;
      
      this.nodestore.generations[0][0].Index = this.imageData.urlId;
      
      this.nodestore.initialGenerations[0][0].Width= this.imageData.width;
      this.nodestore.initialGenerations[0][0].Height = this.imageData.height;
    
      console.log('setting image data succeeded gx1: '+ this.nodestore.generations[0][0].X + 'gx2: '+ this.nodestore.generations[0][0].Width + ' im_wdth: ' + this.imageData.width);
};

//notes 

ImageViewer.prototype.addNote=function(){
    console.log('add note');
 // do we ever need to do anything in here?
 // seems not
};



ImageViewer.prototype.SaveNoteClicked=function(){
    
    console.log('save note');

    var data = this.getTextAreaDetails();
    
   // data.x1 += this.centrePoint;
   // data.x2 += this.centrePoint;
   // data.y1 += this.centreVerticalPoint;
   // data.y2 += this.centreVerticalPoint;
    
    
    
    
    //var initWidth = this.nodestore.initialGenerations[0][0].Width;
 
   // var checkedPIncrease = ((this.nodestore.generations[0][0].Width - initWidth) / initWidth) * 100;
    
 //   checkedPIncrease = 0-checkedPIncrease;
    
    
    // change by percentage
    // console.log('percentage: '+checkedPIncrease);
    
    // data.width =data.width +  ((data.width/100) * checkedPIncrease);
    // data.height =data.height +  ((data.height/100) * checkedPIncrease);
    // data.x =data.x +  ((data.x/100) * checkedPIncrease);
    // data.y =data.y +  ((data.y/100) * checkedPIncrease);
    
   // console.log('change: '+w + '-'+ data.width );
    
    this.selectedNoteId = this.nodestore.WriteTextArea(this.selectedNoteId,data);
 
    this.addNode = false;
    
    this.updateAddButtonUI(this.addNode);
    
    this.clearTextArea();
    
    //refresh the drawing
    this.DrawTree();
};

ImageViewer.prototype.CancelAdd= function () {
    this.addNode = false;
    
    this.updateAddButtonUI(this.addNode);
    this.clearTextArea();
};


ImageViewer.prototype.EnableAdd= function () {
    this.addNode = true;
    
    this.updateAddButtonUI(this.addNode);
};

ImageViewer.prototype.DeleteNoteMode=function(){
    console.log('delete note'); 
    if(this.deleteNode)
        this.deleteNode =false;
    else
        this.deleteNode =true;
        
    this.updateDeleteButtonUI(this.deleteNode);
};

ImageViewer.prototype.EnableRun = function(status){
  
    this.updateRunButtonUI(status);
};



//url stuff

ImageViewer.prototype.URLSave=function( urlName, url, urlGroup,urlDefault, successMethod){
    
    console.log('save url ' +this.urlId + ' ' + urlName + ' ' +  url + ' ' + urlGroup);
    var that = this;
    
    var result = {
        "urlId" : this.urlId,
        "url" : url,
        "urlName" : urlName,
        "urlGroup" : urlGroup,
        "urlDefault" :urlDefault
    };

    var stringy = JSON.stringify(result);

    $.ajax({
            type: "POST",
            async: false,
            url: this.baseUrl  + '/notes/urls/',
            data: stringy,
            contentType: "application/json",
            dataType: "JSON",
            success: function(jsonData) {
                successMethod(jsonData.urlId);
            }
        });
 
    
};

ImageViewer.prototype.URLDelete=function(urlId){
    console.log('delete url ' +urlId);
};

ImageViewer.prototype.URLChanged=function(urlId, response){
    var that = this;
    
    this.urlId = urlId;
    
    
    var setImageObject = function(imageData,jsonData ){
        
        that.imageData = jsonData;
        
        if(that.imageData == null || that.imageData.url ==null ||  that.imageData.url == '')
            return;
        
        
        //image url should be property of some sort
        if(location.origin.indexOf('https') >= 0){
            that.imageData.url = that.baseUrl  + '/notes/file/'+ that.imageData.urlId;
            
        }
        
        that.getOptions(urlId);
        
        
        
        console.log('setImageObject url: ' + that.imageData.url);
        
        $("<img/>").attr("src", that.imageData.url).load(function(){
             var s = {w:this.width, h:this.height};
                
             that.imageData.width = s.w;
             that.imageData.height = s.h;
              
             console.log('setImageObject imageData wdth: ' + that.imageData.width);
             that.EnableRun(true);
        }); 
      
    };
    
   
    
    
    // get url data here 
     $.ajax({

         type: "GET",
         async: false,
         url: this.baseUrl  + '/notes/urls/urlid/'+ this.urlId,
         contentType: "application/json",
         dataType: "JSON",
         success: function(ajaxResult) {
             
            setImageObject(that.imageData, ajaxResult);
            
            
            //that.generations[0][0]
            console.log('image loaded');
            response(ajaxResult);
         },
         error: function() {
            alert('Error loading data');
         }
     });
    
};
        
ImageViewer.prototype.GetUrls=function(filter){
    //https://jsimageannotater-gnthackray1978.c9.io
    
    console.log('GetUrls');
    
    
     
    var url = this.baseUrl  + '/notes/urls/';
    
    if(filter)
        url += filter;
    
    var that = this;
    
     $.ajax({

         type: "GET",
         async: false,
         url: url,
         contentType: "application/json",
         dataType: "JSON",
         success: function(jsonData) {
            that.updateUrlList(jsonData);
         },
         error: function(e) {
            alert('Error loading data' + e);
         }
     });
        
    
    
};
     
     
     
     
//options
ImageViewer.prototype.getOptions =function(urlId){
    console.log('GetUrls');

    var url = this.baseUrl  + '/notes/option/'+urlId;

    var that = this;
    
    $.ajax({

         type: "GET",
         async: false,
         url: url,
         contentType: "application/json",
         dataType: "JSON",
         success: function(jsonData) {
            
            
            if(jsonData.length > 0){
                // we are in the future going to have many layers
                // currently we have 1 layer so just default to that
                // which is always going to be layer 0
                that.options = jsonData[0];
                that.updateOptions(that.options, that.getColourComponentHex(1));// bit hacky pass through the first colour component hex
            }
         },
         error: function(e) {
            alert('Error loading data' + e);
         }
     });
     
};
        
        
        
ImageViewer.prototype.saveOptions =function(options){
    //this.options = options;
    
    console.log('save option ' +options);
    
    var that = this;
 
 
    this.options.DefaultFont = options.font;
    this.options.IsTransparent = options.isTransparent;


//   LayerId: { type: Number},
//     UrlId: { type: Number},
//     DefaultFont: { type: String} ,
//     DefaultNoteColour: { type: String} ,
//     DefaultEditorFontColour: { type: String} ,
//     DefaultEditorBorderColour: { type: String} ,
//     DefaultNoteFontColour: { type: String} ,
//     IsTransparent: { type: Boolean},
//     Visible: { type: Boolean}

    var stringy = JSON.stringify(this.options);

    $.ajax({
            type: "POST",
            async: false,
            url: this.baseUrl  + '/notes/option/',
            data: stringy,
            contentType: "application/json",
            dataType: "JSON",
            success: function(jsonData) {
                console.log(jsonData);
             //   successMethod(jsonData.urlId);
            }
        });
}

ImageViewer.prototype.setColourComponentHex =function(componentId, hex){
    
    if(this.options!=null){
        switch(Number(componentId)){
            case 1:
                this.options.DefaultNoteColour = hex;
                break;
            case 2:
                this.options.DefaultEditorFontColour = hex;
                break;
            case 3:
                this.options.DefaultEditorBorderColour = hex;
                break;
            case 4:
                this.options.DefaultNoteFontColour = hex;
                break;
        }
    }
    
};


ImageViewer.prototype.getColourComponentHex =function(componentId){
    
    if(this.options!=null){
        switch(Number(componentId)){
            case 1:
                return this.options.DefaultNoteColour;
            case 2:
                return this.options.DefaultEditorFontColour;
            case 3:
                return this.options.DefaultEditorBorderColour;
            case 4:
                return this.options.DefaultNoteFontColour;
            default:
                return "#000000";
        }
    }
    else
    {
        return "#000000";
    }
    
};

