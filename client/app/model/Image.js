var  CanvasTools;

var ImageViewer = function (nodestore,view, canvasTools, meta, options) {
    //could inject this
    this._drawingQueue = [];
    this._canvasTools = canvasTools;
    
    this.currentZoomPercentage = 100;
 
    this.screenHeight = 0.0;
    this.screenWidth = 0.0;

    this.meta = meta;
    
    this.options = options;
    
    this.nodestore = nodestore;
    this.view = view;


    this.centrePoint = 400.0;
    this.centreVerticalPoint = 0.0;
    this.zoomLevel = 0.0;
    this.centrePointXOffset = 0.0;
    this.centrePointYOffset = 0.0;

    this.zoomPercentage = 0.0;


    this.mouse_x = 0; //int
    this.mouse_y = 0; //int

    this.drawingX1 = 0.0;
    this.drawingX2 = 0.0;
    this.drawingY1 = 0.0;
    this.drawingY2 = 0.0;

    this.drawingCentre = 0.0;
    this.drawingWidth = 0.0;
    this.drawingHeight = 0.0;

    this.mouseXPercLocat = 0.0;
    this.mouseYPercLocat = 0.0;

    this.zoomAmount = 8; //int

    this.lastClickedPosX = 0;
    this.lastClickedPosY = 0;

    // modes delete add etc
    this.addNode =false;
    this.deleteNode =false;
    
    this.selectedNote;
    
    this.imageData = null;
    
};

ImageViewer.prototype.PerformClick= function (x, y) {
        
    console.log("canvas clicked");
     
    var that = this;
    
    // dont select anything
    if(this.options.GetState().pickMode) return;
    
    this.lastClickedPosY = y;
    this.lastClickedPosX = x;
 
    this.nodestore.PointToNode(x,y, function(node){
        that.selectedNote = node;
        
        that.options.SetState(that.addNode, that.selectedNote);
    
        // add/edit node
        if(that.addNode)
        {
            if(that.selectedNote != undefined)
            {
                 
                if(that.selectedNote.options == undefined){
                    that.selectedNote.options = that.options.GetState().defaultOptions;
                }
               
                that.view.DisplayNodeSelection(that.selectedNote.X, that.selectedNote.Y,that.selectedNote.Width,
                    that.selectedNote.Height,that.selectedNote.D,that.selectedNote.Annotation,that.selectedNote.options);
                    
                that.meta.Load(that.selectedNote.MetaData);
                that.options.SetDefaultOptionState(false);
            }
            else
            {
                that.view.DisplayNodeSelection(x, y,70,25,0,'',that.options.GetState().tempOptions);
                that.meta.Load([]);
                that.options.SetDefaultOptionState(true);
            }
            
            that.options.SetState(that.addNode,that.selectedNote,true);
        }

        if(that.deleteNode && that.selectedNote != undefined){
            that.selectedNote.Visible =false;
            that.nodestore.WriteToDB(that.selectedNote);
            that.options.SetState(that.addNode);
        }
        
        if(!that.addNode)
            that.view.ClearActiveTextArea();

    });
};

ImageViewer.prototype.DrawTree= function () {
   // console.log('drawtree');
    var containsLevel = function(layers, id){
        var idx =0;
        
        while(idx< layers.length){
            //handle layers that have a negative
            //used for drawing effects etc
            if(layers[idx]==Math.abs(id))
                return true;
            idx++;
        }
        
        return false;
    };

    this.ComputeLocations();
    
    if (this.nodestore.generations.length == 0) {
        return;
    }

    try {
        var that = this;
        var layers ; // this needs doing better!!
        var drawNotes = function() {
           
           var vidx = 1;

           while (vidx < that.nodestore.generations.length) {
                var hidx=0;
                while (hidx < that.nodestore.generations[vidx].length) {
                    
                    var nlid = that.nodestore.generations[vidx][hidx].LayerId ? that.nodestore.generations[vidx][hidx].LayerId : 2;
                    
                    if(that.nodestore.generations[vidx][hidx].Visible 
                        && containsLevel(layers,nlid)
                        && that.nodestore.generations[vidx][hidx].LayerId != 4)
                    {
                        var tpOptions = that.options.GetState().defaultOptions;
                        
                        if(that.nodestore.generations[vidx][hidx].Options != undefined){
                            tpOptions = that.nodestore.generations[vidx][hidx].Options;
                        }
                        
                        if(Math.abs(that.nodestore.generations[vidx][hidx].LayerId) == 4){
                            console.log('crop node present: ' 
                            + that.nodestore.generations[vidx][hidx].LayerId 
                            + ' ' + that.nodestore.generations[vidx][hidx].Visible 
                            + ' ' + that.nodestore.generations[vidx][hidx].X
                            + ' ' + that.nodestore.generations[vidx][hidx].Y
                            + ' ' + that.nodestore.generations[vidx][hidx].Width
                            + ' ' + that.nodestore.generations[vidx][hidx].Height);
                        }
                        
                        if(that.nodestore.generations[vidx][hidx].LayerId == -4 
                            && that.nodestore.generations[vidx][hidx].X != 0
                            && that.nodestore.generations[vidx][hidx].Y != 0){
                            console.log('drawing crop node');
                            that._canvasTools.DrawCropBox(
                                that.nodestore.generations[vidx][hidx].X,
                                that.nodestore.generations[vidx][hidx].Y,
                                that.nodestore.generations[vidx][hidx].Width,
                                that.nodestore.generations[vidx][hidx].Height,
                                tpOptions);
                        }
                        else
                        {
                            tpOptions.FontSize = that._canvasTools.DrawLabel(
                                that.nodestore.generations[vidx][hidx].X,
                                that.nodestore.generations[vidx][hidx].Y,
                                that.nodestore.generations[vidx][hidx].Width,
                                that.nodestore.generations[vidx][hidx].Height,
                                that.nodestore.generations[vidx][hidx].D,
                                that.nodestore.generations[vidx][hidx].Annotation, 
                                tpOptions);
                        }
                    }
                    hidx++;
                }
                vidx++;
            }

        };
        
        
        // get list of visible layers here
        that.nodestore.GetVisibleLayer(function(players){
            layers = players;
            if(containsLevel(layers,1))
            {
                that.nodestore.GetCroppingNode(function(croppingnode, initNode){
                    if(croppingnode)
                        that._canvasTools.DrawCroppedImage(that.nodestore.generations[0][0], 
                        that.imageData.url ,
                        croppingnode,
                        initNode, 
                        drawNotes ); 
                    else
                        that._canvasTools.DrawImage(that.nodestore.generations[0][0], that.imageData.url , drawNotes ); 
                });
            }
            else
            {
                that._canvasTools.ClearCanvas();
                drawNotes();
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

  //  var halfCanvasWidth = (this.canvas.width / 2);

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
        
        if(this.nodestore.initialGenerations[1][idx].LayerId ==4 || this.nodestore.initialGenerations[1][idx].LayerId == -4){
            console.log('initial gens layer 4s: ' + this.nodestore.initialGenerations[1][idx].LayerId);
        }
        
        if(this.nodestore.initialGenerations[1][idx].LayerId!=-4){
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
        }
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

ImageViewer.prototype.SaveNoteClicked=function(saveData){
    
    console.log('save note');
    var that = this;

    var saveCallback = function(savednode){
        that.selectedNote = savednode;
        that.addNode = false;
        that.options.SetState(that.addNode);
        that.view.DisplayUpdateNoteAdd(that.addNode);
        that.view.ClearActiveTextArea();
        //refresh the drawing
        that.DrawTree();
        that.UpdateInfo();
        that.meta.Unload();
    };

    this.nodestore.GetActiveLayer(function(layerId){
        that.meta.QryNodeMetaData(function(data){
                that.options.QrySaveData(function(options){
                    saveData.options = options;

                    that.nodestore.WriteNote(that.selectedNote,saveData.x,
                    saveData.y, saveData.width,saveData.height,saveData.d,
                    saveData.text,saveData.options,layerId, data, saveCallback);
                });
        }); 
    });
    
};

ImageViewer.prototype.CancelAdd= function () {
    this.options.SetDefaultOptionState(false);
    this.addNode = false;
    this.options.SetState(this.addNode);
    this.meta.Unload();
    this.view.DisplayUpdateNoteAdd(this.addNode);
    this.view.ClearActiveTextArea();
};

ImageViewer.prototype.EnableAdd= function () {
    this.addNode = true;
    this.options.SetState(this.addNode,undefined,true);
    this.view.DisplayUpdateNoteAdd(this.addNode);
    
};

ImageViewer.prototype.DeleteNoteMode=function(){
    console.log('delete note'); 
    if(this.deleteNode)
        this.deleteNode =false;
    else
        this.deleteNode =true;
        //DisplayUpdateDelete
    //this.updateDeleteButtonUI(this.deleteNode);
    this.view.DisplayUpdateDelete(this.deleteNode);
};

ImageViewer.prototype.EnableRun = function(status){
  
    //this.updateRunButtonUI(status);
    
    this.view.DisplayUpdateRunButton(status);
};

ImageViewer.prototype.setImageObject = function(urlId, jsonData, callback){
        
        var that = this;
        
        that.imageData = jsonData;
        
        if(that.imageData == null || that.imageData.url ==null ||  that.imageData.url == '')
            return;
        
        
        //image url should be property of some sort
        if(location.origin.indexOf('https') >= 0){
            that.imageData.url = that.baseUrl  + '/notes/file/'+ that.imageData.urlId;
            
        }
        
        that.options.SetOptionsLoad(urlId);
        
        console.log('setImageObject url: ' + that.imageData.url);
        
        // if we couldnt populate image width and height when we got the url 
        // try and work them out 
        
        
        if(that.imageData.width==0 && that.imageData.height ==0)
        {
            $("<img/>").attr("src", that.imageData.url).load(function(){
                 var s = {w:this.width, h:this.height};
                    
                 that.imageData.width = s.w;
                 that.imageData.height = s.h;
                  
                 console.log('setImageObject imageData wdth: ' + that.imageData.width);
                 that.EnableRun(true);
                 
                 that.UpdateInfo();
                 
                 if(callback)
                    callback(urlId);
            }); 
        }
        else
        {
            that.EnableRun(true);
            that.UpdateInfo();
                 
            if(callback)
                callback(urlId);
        }
      
};
    
ImageViewer.prototype.UpdateInfo = function(){
    
     var imdat = {
         
         title : this.imageData.title,
         zoomlevel: this.zoomPercentage +'%',
         dims : 'w: ' + this.imageData.width + ' h:' + this.imageData.height,
         noteCount: this.nodestore.generations.length,
         size : 'unk'
     };
     
     //this.updateInfoWindow(imdat);
     this.view.UpdateInfoWindow(imdat);
};

//map

ImageViewer.prototype.LoadBackgroundImage=function(imageLoaded){
    
    var that = this;
    this.nodestore.GetImageData(function(data){
        that.urlId = data.urlId;
        that.setImageObject(data.urlId,data, imageLoaded);
    });
};

ImageViewer.prototype.SetInitialValues = function (zoomPerc, box_wid, box_hig,  screen_width, screen_height  ) {

        //this.centrePoint = 0.0;
        this.SetCentreX(0.0);
        //this.centreVerticalPoint = 0.0;
        this.SetCentreY(0.0);

        this.screenHeight = screen_height;
        this.screenWidth = screen_width;

        this.zoomPercentage = zoomPerc;

        this.options.SetState(this.addNode,this.currentNode);
};
    
ImageViewer.prototype.MoveTree = function (direction) {
        // console.log('move tree' + direction);

        if (direction == 'SOUTH') this.SetCentreY(this.centreVerticalPoint - 1);
        if (direction == 'NORTH') this.SetCentreY(this.centreVerticalPoint + 1);
        if (direction == 'EAST') this.SetCentreX(this.centrePoint + 1);
        if (direction == 'WEST') this.SetCentreX(this.centrePoint - 1);


        if (direction == 'UP' || direction == 'DOWN') {

            var x = this.screenWidth / 2;
            var y = this.screenHeight / 2;

            if (this.lastClickedPosY != 0 && this.lastClickedPosX != 0) {
      
                this.SetMouse(this.lastClickedPosX, this.lastClickedPosY);
            } else {
                this.SetMouse(x, y);
            }
            


            this.SetZoomStart();

            this.SetCentrePointOffset(1000000, 1000000);


            if (direction == 'UP') {
                this.ZoomIn();
            }
            else {
                this.ZoomOut();
            }


        }
        else {
            this.DrawTree();
        }

    },
    
ImageViewer.prototype.SetZoom = function (percentage) {


        if (percentage !== 0.0) {
            var _workingtp = 0.0;
      
            //zoom drawing components 
            this.zoomPercentage += percentage;
            this.zoomLevel += percentage;
          
            this.ComputeLocations();

            // have some sort of override here for when we dont want to be zooming from mouse poisitons
            // or when we init the diagram
            this.GetPercDistances();
         
            //this.centreVerticalPoint += (this.drawingHeight / 100) * (this.percY1 - this.mouseYPercLocat);

            this.SetCentreY(this.centreVerticalPoint + ((this.drawingHeight / 100) * (this.percY1 - this.mouseYPercLocat)));
            
            //mouseXPercLocat is the position of the mouse x in the drawing as a percentage 
            //when the zoom was started
            
            // by subtracting the 2 positions we can work out how much to move the diagream 
            // to keep it in the same place
            
            var debugCentrePoint = this.centrePoint ;
            
            console.log('SetZoom init values: ip: ' + this.mouseXPercLocat + ' px1: ' + this.percX1 + ' dw: ' + this.drawingWidth + ' centre point: '+ this.centrePoint);
            
            //this.centrePoint += (this.drawingWidth / 100) * (this.percX1 - this.mouseXPercLocat);

            this.SetCentreX(this.centrePoint + ((this.drawingWidth / 100) * (this.percX1 - this.mouseXPercLocat)));
            
            console.log('SetZoom centrepoint moved: ' + (this.percX1 - this.mouseXPercLocat) + '% from ' +debugCentrePoint + ' to ' +  this.centrePoint);

            this.ComputeLocations();
            
            console.log('SetZoom drawing width: ' + this.drawingWidth);
        }  

       // console.log('zoom percentage ' + this.zoomPercentage);

        this.DrawTree();

};
    
ImageViewer.prototype.SetZoomStart = function () {
        this.GetPercDistances();
        this.mouseXPercLocat = this.percX1;
        this.mouseYPercLocat = this.percY1;
};

ImageViewer.prototype.ScaleToScreen = function(){
      
      
      // call this so that drawingwidth is set
     this.ComputeLocations();
      
      var screenWidth =   screen.width;
     var currentDrawingWidth = this.drawingWidth;
     
     console.log('ScaleToScreen: initial widths drawing ' + currentDrawingWidth + ' screen ' + screenWidth);
     
     
     
      var sizeDifference = (screenWidth - currentDrawingWidth);
      
      var avgSize = (currentDrawingWidth + screenWidth) / 2;
     
      console.log('ScaleToScreen: sizediff ' + sizeDifference +' avgsize '+ avgSize);
     
      var percentageDiff = 0;
      
      if((sizeDifference / currentDrawingWidth) !=0)
        percentageDiff = (sizeDifference / currentDrawingWidth) * 100;
      
      
      console.log('ScaleToScreen: set zoom ' + percentageDiff + '%');
      
      
      this.mouseXPercLocat = 0;
      this.mouseYPercLocat = 0;
   
      // make sure we dont get the mouses position 
      // when we clicked the draw button.
      this.mouse_x = 0;
      this.mouse_y = 0;
      
      
      this.SetZoom(percentageDiff);
      
      
      
};
    
ImageViewer.prototype.GetPercDistances = function () {

        // percX1 = the position of mouse x,  expressed as a percentage of the drawing.
        
        
        var _distanceFromX1 = 0.0;
        var _distanceFromY1 = 0.0;
        var _onePercentDistance = 0.0;

        this.percX1 = 0.0;
        this.percY1 = 0.0;


        this.drawingWidth = this.drawingX2 - this.drawingX1;
        this.drawingHeight = this.drawingY2 - this.drawingY1;

        if (this.drawingWidth !== 0 && this.drawingHeight !== 0) {
            if (this.drawingX1 > 0) {
                _distanceFromX1 = this.mouse_x - this.drawingX1; //;
            }
            else {
                _distanceFromX1 = Math.abs(this.drawingX1) + this.mouse_x;
            }

            _onePercentDistance = this.drawingWidth / 100;
            
            console.log('GetPercDistances: dfx1 ' + _distanceFromX1 + ' 1px ' + _onePercentDistance);
            
            if(_distanceFromX1 !=0)
                this.percX1 = _distanceFromX1 / _onePercentDistance;
            
                


            if (this.drawingY1 > 0) {
                _distanceFromY1 = this.mouse_y - this.drawingY1; // ;                
            }
            else {
                _distanceFromY1 = Math.abs(this.drawingY1) + this.mouse_y;
            }

            _onePercentDistance = this.drawingHeight / 100;
            this.percY1 = _distanceFromY1 / _onePercentDistance;

        }

    },
   
ImageViewer.prototype.SetMouse = function (x, y) {
 
        this.mouse_x = x;
        this.mouse_y = y;

};
    
    
ImageViewer.prototype.SetCentreX = function (x) {  
    this.centrePoint = x;
    this.nodestore.centreX = this.centrePoint;
};

ImageViewer.prototype.SetCentreY = function (y) {  
    this.centreVerticalPoint =y;
    this.nodestore.centreY = this.centreVerticalPoint;
};


ImageViewer.prototype.SetCentrePointOffset = function (param_x, param_y) {

        if(this.addNode) return;

        if (param_x == 1000000 && param_y == 1000000) {
            this.centrePointXOffset = 0;
            this.centrePointYOffset = 0;
        }
        else {

            if (this.centrePointXOffset === 0) {
                console.log('centrePointXOffset reset: ' +param_x );
                this.centrePointXOffset = this.centrePoint - param_x;
            }
            else {
          //      console.log('SetCentrePointOffset: cp ' + this.centrePoint + ' param_x ' + param_x + ' cpxoffset '  +this.centrePointXOffset );
                this.SetCentreX(param_x + this.centrePointXOffset);
            }


            if (this.centrePointYOffset === 0) {
                this.centrePointYOffset = this.centreVerticalPoint - param_y;
            }
            else {

                this.SetCentreY(param_y + this.centrePointYOffset);
            }

        }

        // console.log('SetCentrePointOffset: '+ this.centrePointXOffset + ' ' + this.centrePoint);
}; //end set centre point


ImageViewer.prototype.SetDrawingQueueValue = function(point){
   this._drawingQueue.push(point);   
};

ImageViewer.prototype.SetDrawingQueueReset = function(){
   this._drawingQueue[this._drawingQueue.length] = new Array(1000000, 1000000); 
};

ImageViewer.prototype.SetDrawQueueEntries = function(){
    
    while (this._drawingQueue.length > 0) {
        var _point = this._drawingQueue.shift();
        this.SetCentrePointOffset(_point[0], _point[1]);
        this.DrawTree();
    }
};
    
ImageViewer.prototype.ZoomIn = function () {
        this.zoomAmount++;
        this.SetZoom(this.zoomAmount);
    };
    
    
ImageViewer.prototype.ZoomOut = function () {
        if (this.zoomAmount > 7)
            this.zoomAmount--;

        this.SetZoom(this.zoomAmount - (this.zoomAmount * 2));
        //  SetZoom(zoomAmount - (zoomAmount * 2));
    };
   

    
   