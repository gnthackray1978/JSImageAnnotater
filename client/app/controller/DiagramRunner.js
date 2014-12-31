
var JSMaster, AncUtils, QryStrUtils, AncTree, Tree;




var DiagramRunner = function (treeModel, colourPicker) {
    this.ancTree = null;
    this.ancUtils = new AncUtils();
    this.treeUI = null;
    this._moustQueue = [];
    this._mouseDown = false;
    
    this.textarea = null;
    
    this.ancTree = treeModel;
  //  this.loader = nodeStore;
    this.colourPicker = colourPicker;
    
};

DiagramRunner.prototype = {
    
    
    startFromDrive: function(){
        
        //  if (this.ancTree !== null) {
            
        //     this.ancTree.EnableRun(false);
        //     this.ancTree.GetUrls();
            
        //  };
         
         
         if(this.colourPicker!== null){
             this.colourPicker.CreateComponentList();
             
         }
         
         
         //init drive here
         var that = this;
          
         that.ancTree.nodestore.init(function(){
            //set image 
            
                that.ancTree.LoadBackgroundImage(function(id){
                    // run the graphics loop
                    that.treeUI = new TreeUI(1, function (treeUI) {
                    var canvas = document.getElementById("myCanvas");
              
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
        
                    that.ancTree.nodestore.GetGenerations(id, function(){
                        
                        console.log('got data starting app');
                        
                        setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
         
                        that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
        
        
                        that.ancTree.treeUI = treeUI;
                        that.ancTree.selectedNoteId = id;
                        that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
                        that.ancTree.UpdateGenerationState();
                        that.ancTree.ScaleToScreen();
                       
                    });
                });
            });
            
            
            
            
            
            
        
        });
        
    },
    
    init:function(){
    
         if (this.ancTree !== null) {
            
            this.ancTree.EnableRun(false);
            this.ancTree.GetUrls();
            
         };
         
         if(this.colourPicker!== null){
             this.colourPicker.CreateComponentList();
             
         }
    },
        
    run: function (id) {
        // id is data thats passed in
        // for example from a call back
        var that = this;
        //set image 
        this.treeUI = new TreeUI(1, function (treeUI) {
            var canvas = document.getElementById("myCanvas");
      
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            that.ancTree.nodestore.GetGenerations(id, function(){
                
                console.log('got data starting app');
                
                setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
 
                that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);


                that.ancTree.treeUI = treeUI;
                that.ancTree.selectedNoteId = id;
                that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
                that.ancTree.UpdateGenerationState();
                that.ancTree.ScaleToScreen();
               
            });
        });
    },
     
    boxButtonUp:function(milliseconds){
        clearInterval(milliseconds);
    
    },
    boxButtonDown:function(dir){
        
        if (this.ancTree !== null) {
            
            var that = this;
            return setInterval(function () {
                that.ancTree.MoveTree(dir); 
                
            }, 100);
        }
    },
    
    canvasMouseMove:function(_point){
     
        if (this.ancTree !== null) {
            this.ancTree.SetMouse(_point[0], _point[1]);
           
            if (this._mouseDown) {
                this._moustQueue.push(_point);
            }
        }
    },
    
    canvasMouseUp:function(){
        
      //console.log('canvas mouse up');
      if (this.ancTree !== null) {
            this._mouseDown = false;

            var _point = new Array(1000000, 1000000);
            this._moustQueue[this._moustQueue.length] = _point;

        }
    },
    
    canvasMouseDown:function(){
        
        //console.log('canvas mouse down');
        if (this.ancTree !== null) {
      
            this._mouseDown = true;
        }
    },
    
    canvasClick:function(x,y){
        
        //console.log('canvas mouse click');
         if (this.ancTree !== null) {

            this.ancTree.PerformClick(x, y);
        
            this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);
            
        }
    },
    
    CleanUp: function () {



        this.ancTree.generations = null;
      //  this.ancTree.familiesPerGeneration = null;
        this.ancTree.familySpanLines = null;
        this.ancTree.childlessMarriages = null;
    },
    
    // SetNodeSelectionUI:function(action){
        
    //     // set delegate to be used in diagram displayer
    //     this.ancTree.displayNodeInfo = action;
        
   
    // },

    angleChanged:function(direction){
        this.ancTree.ChangeAngle(direction);
    },

    addButtonClicked:function(){
        this.ancTree.EnableAdd();
    },
   
    cancelButtonClicked:function(){
        this.ancTree.CancelAdd();
    },
    
    deleteNote:function(action){
        this.ancTree.DeleteNoteMode();
    },
    
    saveNote:function(){
        
        if (this.ancTree !== null) {

            this.ancTree.SaveNoteClicked();
        }
    },

    saveOptionsClicked:function(options){
        this.ancTree.saveOptions(options);
    },

    // SetClearTextArea:function(action){
    //     this.ancTree.clearTextArea = action;
    // },
    
    //
    // SetAddButtonUpdate:function(action){
    //     this.ancTree.updateAddButtonUI = action;
    // },
    
    // SetDeleteButtonUpdate:function(action){
    //     this.ancTree.updateDeleteButtonUI = action;
    // },
    
    // SetRunButtonUpdate:function(action){
    //     this.ancTree.updateRunButtonUI = action;
    // },
    
    // SetOptionsUpdate:function(action){
    //     this.ancTree.updateOptions = action;
    // },
    
    // SetUpdateInfoWindow:function(action){
    //     this.ancTree.updateInfoWindow = action;
    // },
    
    // SetGetTextAreaDetails:function(action){
    //     this.ancTree.getTextAreaDetails = action;
    // },
    
    
    
    
    //COLOUR PICKER 
    colourPickerClicked: function(callback){
        this.colourPicker.init(callback);  
         
    },

    saveColourComponentToModel: function(companentId, hex){
        this.ancTree.setColourComponentHex(companentId, hex);
    },

    SetModelUpdateColourPickerComponents:function(action){
         this.colourPicker.updateComponentList = action;
    },

    getColourComponentHex: function(companentId){
        return this.ancTree.getColourComponentHex(companentId);
    },
    
    // URLS 
    
    URLNew:function(){
        
        if (this.ancTree !== null) {

            
            return this.ancTree.urlId=-1;
        }
    },
    
    URLSave:function(urlName, url, urlGroup,urlDefault, successMethod){
        
        if (this.ancTree !== null) {

            return this.ancTree.URLSave(urlName, url, urlGroup,urlDefault, successMethod);
        }
    },
    URLDelete:function(urlId){
        
        if (this.ancTree !== null) {

            this.ancTree.URLDelete(urlId);
        }
    },
    URLChanged:function(urlId, response){
        
        if (this.ancTree !== null) {

            return this.ancTree.URLChanged(urlId,response);
        }
    },
   
    URLFilterList:function(filter){
        
        if (this.ancTree !== null) {

            return this.ancTree.GetUrls(filter);
        }
    },
    
    SetLoadUrls:function(action){
        
        if (this.ancTree !== null) {

             this.ancTree.updateUrlList = action;
        }
    },
    
    
    GameLoop: function () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this.ancTree.SetCentrePoint(_point[0], _point[1]);
            this.ancTree.DrawTree();
        }

        setTimeout($.proxy(this.GameLoop, this));
    }

};












