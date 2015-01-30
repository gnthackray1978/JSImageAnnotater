var  CanvasTools;



// need ref to view for scope




var ImageViewer = function (nodestore,view, urlstore, canvasTools, metaModel) {
    //could inject this
    
    this._canvasTools = canvasTools;
    
    this.currentZoomPercentage = 100;
 
    this.screenHeight = 0.0;
    this.screenWidth = 0.0;

    this.metaModel = metaModel;
    this.urlWriter = urlstore;
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
    
    this.currentNode= {
        x:-1,
        y:-1
    };



    // modes delete add etc
    this.addNode =false;
    this.deleteNode =false;
    this.optionMode =false;
    this.pickMode =false;
    
    //ids
    this.urlId =null;
    this.selectedNoteId = 0; // not zero based
    this.selectedColourComponentId =1;// not zero based
 
    this.imageData = null;
     
    this.options = {};
    this.defaultOptions = {};
    this.tempOptions = {};
    
    
    
    
    
};

//ImageViewer.prototype = new TreeBase();

ImageViewer.prototype.ChangeAngle= function (direction){
    
},

ImageViewer.prototype.PerformClick= function (x, y) {
        
    // dont select anything
    if(this.pickMode) return;
    
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
        //historic data might not have any options so tempoptions could be used for existing notes
        this.tempOptions = JSON.parse(JSON.stringify(this.defaultOptions)); 
        
        if( this.currentNode.x != -1 && this.currentNode.y != -1)
        {
            var currentNode = this.nodestore.generations[this.currentNode.x][this.currentNode.y];
            var height = currentNode.Height;
            var width = currentNode.Width;
            var note = currentNode.Annotation;
            this.selectedNoteId = this.nodestore.generations[this.currentNode.x][this.currentNode.y].Index;
            //DisplayNodeSelection
       
       
            var tpOptions = this.defaultOptions;
                        
                        
            if(currentNode.options != undefined){
                tpOptions = currentNode.options;
            }
                        
            this.view.DisplayNodeSelection(currentNode.X, currentNode.Y,width,height,currentNode.D,note,tpOptions);
            this.metaModel.Load(this.nodestore.generations[this.currentNode.x][this.currentNode.y].MetaData);
            
            if(currentNode.options)
                this._updateOptionsToView(currentNode.options);
            else
                this._updateOptionsToView(this.defaultOptions);
        }
        else
        {
            
            
            this.selectedNoteId =0;
            this._updateOptionsToView(this.tempOptions);
            this.view.DisplayNodeSelection(x, y,70,25,0,'',this.tempOptions);
            this.metaModel.Load([]);
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
        this.view.ClearActiveTextArea();
    
    
};

ImageViewer.prototype.DrawTree= function () {

    var containsLevel = function(layers, id){
        var idx =0;
        
        while(idx< layers.length){
            if(layers[idx]==id)
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
                    
                    
                    
                    if(that.nodestore.generations[vidx][hidx].Visible && containsLevel(layers,nlid))
                    {
                        var tpOptions = that.defaultOptions;
                        
                        if(that.nodestore.generations[vidx][hidx].Options != undefined){
                            tpOptions = that.nodestore.generations[vidx][hidx].Options;
                        }
                        
                        tpOptions.FontSize = that._canvasTools.DrawLabel(
                            that.nodestore.generations[vidx][hidx].X,
                            that.nodestore.generations[vidx][hidx].Y,
                            that.nodestore.generations[vidx][hidx].Width,
                            that.nodestore.generations[vidx][hidx].Height,
                            that.nodestore.generations[vidx][hidx].D,
                            that.nodestore.generations[vidx][hidx].Annotation, 
                            tpOptions);
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
                that._canvasTools.DrawImage(that.nodestore.generations[0][0], that.imageData.url , drawNotes ); 
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

 


ImageViewer.prototype.SaveNoteClicked=function(saveData){
    
    console.log('save note');


   // console.log('change: '+w + '-'+ data.width );
    
    if( this.currentNode.x != -1 && this.currentNode.y != -1 && this.currentNode.options !== undefined)
    {
        //saveData.options = this._translateViewOptions(saveData.options,saveData.options);
        saveData.options = this.currentNode.options;
    }
    else
    {
        saveData.options = this.tempOptions;
    }
    
     
    var that = this;
    
    this.nodestore.GetActiveLayer(function(layerId){
 
        that.metaModel.QryNodeMetaData(function(data){
            
            that.selectedNoteId = that.nodestore.WriteNote(that.selectedNoteId,saveData.x,saveData.y,
                                    saveData.width,saveData.height,saveData.d,saveData.text,saveData.options,layerId, data);
       
            that.addNode = false;
    
            that.view.DisplayUpdateNoteAdd(that.addNode);
            
            that.view.ClearActiveTextArea();
    
            //refresh the drawing
            that.DrawTree();
            
            that.UpdateInfo();
            
            that.metaModel.Unload();
        });
    });
    
};

ImageViewer.prototype.CancelAdd= function () {
    this.addNode = false;
    this.metaModel.Unload();
    this.view.DisplayUpdateNoteAdd(this.addNode);
    this.view.ClearActiveTextArea();
};


ImageViewer.prototype.EnableAdd= function () {
    this.addNode = true;
    this.view.DisplayUpdateNoteAdd(this.addNode);
    
    this._updateOptionsToView(this.defaultOptions);
    
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



//url stuff

ImageViewer.prototype.URLSave=function( urlName, url, urlGroup,urlDefault, successMethod){
    this.urlWriter(urlName, url, urlGroup,urlDefault, successMethod);
};

ImageViewer.prototype.URLDelete=function(urlId){
    this.urlWriter.Delete(urlId);
};

ImageViewer.prototype.URLChanged=function(urlId, response){
    var that = this;
    
    this.urlId = urlId;

    this.urlWriter.UrlChanged(urlId, function(ajaxResult) {
             
        that.setImageObject(urlId,ajaxResult);
        
        console.log('image loaded');
        response(ajaxResult);
    });
    
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
        
        that.getOptions(urlId);
        
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

ImageViewer.prototype.GetUrls=function(filter){
    //https://jsimageannotater-gnthackray1978.c9.io
    
    var that = this;
    
    console.log('GetUrls');

    this.urlWriter.GetUrls(filter, function(urlList){
       // that.updateUrlList(urlList);
        that.view.FillUrls(urlList);
        
    });

 
};
     
     
     
//options

ImageViewer.prototype.CreateComponentList = function(){
        
    var component = [];
    
    component.push({id: 1, name: 'Background'});
    component.push({id: 2, name: 'Editor Font'});
    component.push({id: 3, name: 'Editor Border'});
    component.push({id: 4, name: 'Note Font'});
     
    this.view.SetColourComponents(component);
};

ImageViewer.prototype.SetDefaultOptionMode = function(state){
    //after option button clicked then its text changed to cancel thats
    //how this method is called for cancel and options add
    this.optionMode =state;
    
    this.view.SetDefaultOptionsUI(state);
};


ImageViewer.prototype.getOptions =function(urlId){
    console.log('GetUrls');
    
    var that = this;
    
    that.nodestore.GetOptions(urlId, function(jsonData){
         if(jsonData.length > 0){
                // we are in the future going to have many layers
                // currently we have 1 layer so just default to that
                // which is always going to be layer 0
                that.defaultOptions = jsonData[0];
                //that.updateOptions(that.options, that.getColourComponentHex(1));// bit hacky pass through the first colour component hex
                //that.view.SetOptions(that.defaultOptions,1);//, that.getColourComponentHex(1));// bit hacky pass through the first colour component hex
                
            }
    });
 
};
     
ImageViewer.prototype.saveDefaultOptions =function(options){
   
    console.log('save option ' +options);

  //  this._translateViewOptions(options, this.defaultOptions);

    this.nodestore.SaveOptions(this.defaultOptions);
};

ImageViewer.prototype._translateViewOptions =function(voptions,moptions){
    //  var options = {
    //     "hexval": $("#txtChosenColour").val(),
    //     "font" :  $('#fontSelect').fontSelector('selected'),
    //     "isTransparent" : $("#chkTransparentBackground").val(),
    //     "componentId" : currentComponent
    // };
     
     if(voptions.IsTransparent !== undefined)
        moptions.IsTransparent = voptions.IsTransparent;
     
     if(voptions.DefaultFont)
        moptions.DefaultFont = voptions.DefaultFont;
    
     if(moptions!=null && voptions.hexval){
        switch(Number(this.selectedColourComponentId)){
            case 1:
                moptions.DefaultNoteColour = voptions.hexval;
                break;
            case 2:
                moptions.DefaultEditorFontColour = voptions.hexval;
                break;
            case 3:
                moptions.DefaultEditorBorderColour = voptions.hexval;
                break;
            case 4:
                moptions.DefaultNoteFontColour = voptions.hexval;
                break;
        }
    }
    
    return moptions;
};

//called from colour picker when colour changed
ImageViewer.prototype.updateOptionColour =function(rgb,hex){

    this.setPickState(false);

    var options = {
        "hexval": '#'+hex,
        "DefaultFont" :  undefined,
        "IsTransparent" : undefined,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

ImageViewer.prototype.updateOptionFont =function(font){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  font,
        "IsTransparent" : undefined,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

ImageViewer.prototype.updateOptionTransparency =function(transparency){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : transparency,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

ImageViewer.prototype.updateSelectedComponentId =function(componentId){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : undefined,
        "componentId" : componentId
    };
   
   
    this._updateOptions(options,true);

};

ImageViewer.prototype._updateOptionsToView =function(options){
    
    var hex;
    switch(Number(this.selectedColourComponentId)){
        case 1:
            hex = options.DefaultNoteColour;
            break;
        case 2:
            hex = options.DefaultEditorFontColour;
            break;
        case 3:
            hex = options.DefaultEditorBorderColour;
            break;
        case 4:
            hex = options.DefaultNoteFontColour;
            break;
    }
    
    
    this.view.SetOptions(options,hex);
};

ImageViewer.prototype._updateOptions =function(options, withUpdate){
    
    var that = this;

    if(options.componentId !== undefined){
        that.selectedColourComponentId = options.componentId;
        console.log('compid: ' + that.selectedColourComponentId);
    }
    
    var finalAction = function(options){
        if(withUpdate)
            that._updateOptionsToView(options);
    };
    
    if(this.optionMode){
        this._translateViewOptions(options,this.defaultOptions);
        finalAction(this.defaultOptions);
    }
    
    if(this.addNode){
        if( this.currentNode.x != -1 && this.currentNode.y != -1)
        {
            if(this.currentNode.options != undefined){
              //  options.DefaultFont =this.currentNode.options.DefaultFont;
              //  options.IsTransparent =this.currentNode.options.IsTransparent;
                this._translateViewOptions(options, this.currentNode.options);
                finalAction(this.currentNode.options);
            }
            else
            {
                //historic data might not have any options set for the note
                this._translateViewOptions(options,this.tempOptions);
                finalAction(this.tempOptions);
            }
        }
        else
        {
            this._translateViewOptions(options,this.tempOptions);
            finalAction(this.tempOptions);
        }
    }
};

ImageViewer.prototype.setPickState = function(state){
     
    this.pickMode =state;
    
},

//map

ImageViewer.prototype.LoadBackgroundImage=function(imageLoaded){
    
    var that = this;
    this.nodestore.GetImageData(function(data){
        that.urlId = data.urlId;
        that.setImageObject(data.urlId,data, imageLoaded);
    });
};

ImageViewer.prototype.SetInitialValues = function (zoomPerc, box_wid, box_hig,  screen_width, screen_height  ) {

        this.centrePoint = 0.0;
        this.centreVerticalPoint = 0.0;


        this.screenHeight = screen_height;
        this.screenWidth = screen_width;

        this.zoomPercentage = zoomPerc;

        this.currentNode = {
            x:-1,
            y:-1
        };
};
    
ImageViewer.prototype.MoveTree = function (direction) {
        // console.log('move tree' + direction);

        if (direction == 'SOUTH') this.centreVerticalPoint -= 1;
        if (direction == 'NORTH') this.centreVerticalPoint += 1;
        if (direction == 'EAST') this.centrePoint += 1;
        if (direction == 'WEST') this.centrePoint -= 1;


        if (direction == 'UP' || direction == 'DOWN') {

            var x = this.screenWidth / 2;
            var y = this.screenHeight / 2;

            if (this.lastClickedPosY != 0 && this.lastClickedPosX != 0) {
      
                this.SetMouse(this.lastClickedPosX, this.lastClickedPosY);
            } else {
                this.SetMouse(x, y);
            }
            


            this.SetZoomStart();

            this.SetCentrePoint(1000000, 1000000);


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
         
            this.centreVerticalPoint += (this.drawingHeight / 100) * (this.percY1 - this.mouseYPercLocat);

            
            
            //mouseXPercLocat is the position of the mouse x in the drawing as a percentage 
            //when the zoom was started
            
            // by subtracting the 2 positions we can work out how much to move the diagream 
            // to keep it in the same place
            
            var debugCentrePoint = this.centrePoint ;
            
            console.log('SetZoom init values: ip: ' + this.mouseXPercLocat + ' px1: ' + this.percX1 + ' dw: ' + this.drawingWidth + ' centre point: '+ this.centrePoint);
            
            this.centrePoint += (this.drawingWidth / 100) * (this.percX1 - this.mouseXPercLocat);

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
    
ImageViewer.prototype.SetCentrePoint = function (param_x, param_y) {

        if(this.addNode) return;

        if (param_x == 1000000 && param_y == 1000000) {
            this.centrePointXOffset = 0;
            this.centrePointYOffset = 0;
        }
        else {

            if (this.centrePointXOffset === 0) {

                this.centrePointXOffset = this.centrePoint - param_x;
            }
            else {
          //      console.log('SetCentrePoint: cp ' + this.centrePoint + ' param_x ' + param_x + ' cpxoffset '  +this.centrePointXOffset );
                this.centrePoint = param_x + this.centrePointXOffset;
            }


            if (this.centrePointYOffset === 0) {
                this.centrePointYOffset = this.centreVerticalPoint - param_y;
            }
            else {

                this.centreVerticalPoint = param_y + this.centrePointYOffset;
            }

        }

        // console.log('setcentrepoint: '+ this.centrePointXOffset + ' ' + this.centrePoint);
}; //end set centre point
    
    
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
   

    
   