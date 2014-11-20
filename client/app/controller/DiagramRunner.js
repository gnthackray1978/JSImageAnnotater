
var JSMaster, AncUtils, QryStrUtils, AncTree, Tree;




var DiagramRunner = function (gedPreLoader, treeModel) {
    this.ancTree = null;
    this.ancUtils = new AncUtils();
    this.treeUI = null;
    this._moustQueue = [];
    this._mouseDown = false;
    
    this.textarea = null;
    
    this.ancTree = treeModel;
    this.loader = gedPreLoader;
};

DiagramRunner.prototype = {
    
    displayUrls:function(x,y){
    
         if (this.ancTree !== null) {
        
            this.ancTree.GetUrls();
            
         };
    },
        
    run: function (id) {
     

            // id is data thats passed in
            // for example from a call back
            var that = this;
            
            
            //set image 

            this.treeUI = new TreeUI(1, function (treeUI) {
                
                // application is started in the gameloop
                setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
    
                var _point = new Array(1000000, 1000000);
                
                that._moustQueue[that._moustQueue.length] = _point;
    
                var canvas = document.getElementById("myCanvas");
          
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
    
                that.getData(id,0,0);
             
            });

    },
    
    
    getData:function (id,x,y) {
                
       // this.ancTree = new ImageViewer();
        this.ancTree.treeUI = this.treeUI;
        //this.loader.SetForAncLoader();

        this.ancTree.selectedPersonId = id;
        this.ancTree.selectedPersonX = x;
        this.ancTree.selectedPersonY = y;
            
        this.loader.GetGenerations(this.ancTree.selectedPersonId, $.proxy(this.processData, this));

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
        
        //    this.ancTree.UpdateGenerationState();

            if (this.ancTree.refreshData) {                    
                this.getData(this, this.ancTree.selectedPersonId, this.ancTree.selectedPersonX, this.ancTree.selectedPersonY);                    
            }
    

            this._moustQueue[this._moustQueue.length] = new Array(1000000, 1000000);
            
            //return any selected nodes to the ui
            //should we call a draw stuff method here?
            
        }
    },
    
    processData: function (data) {


       
        var _zoomLevel = 100;//this.qryStrUtils.getParameterByName('zoom', '');



        this.ancTree.SetInitialValues(Number(_zoomLevel), 0.0, 0.0, screen.width, screen.height);

        //    var _personId = '913501a6-1216-4764-be8c-ae11fd3a0a8b';
        //    var _zoomLevel = 100;
        //    var _xpos = 750.0;
        //    var _ypos = 100.0;

        this.ancTree.initialGenerations = JSON.parse(JSON.stringify(data.Generations));


        this.ancTree.generations = data.Generations;

        
        
        this.ancTree.UpdateGenerationState();

        //
      //  this.ancTree.RelocateToSelectedPerson();
        
        this.ancTree.ScaleToScreen();
         
        this.ancTree.refreshData = false;
    },

    CleanUp: function () {



        this.ancTree.generations = null;
      //  this.ancTree.familiesPerGeneration = null;
        this.ancTree.familySpanLines = null;
        this.ancTree.childlessMarriages = null;
    },
    
    SetNodeSelectionUI:function(action){
        
        // set delegate to be used in diagram displayer
        this.ancTree.displayNodeInfo = action;
        
   
    },

    addButtonClicked:function(){
        this.ancTree.EnableAdd();
    },
    cancelButtonClicked:function(){
        this.ancTree.CancelAdd();
    },
    
    deleteNote:function(action){
        
    },
    
    saveNote:function(){
        
        if (this.ancTree !== null) {

            this.ancTree.SaveNoteClicked();
        }
    },



    SetClearTextArea:function(action){
        this.ancTree.clearTextArea = action;
    },
    
    SetAddButtonUpdate:function(action){
        this.ancTree.updateAddButtonUI = action;
    },

    SetSaveButtonUpdate:function(action){
        this.ancTree.updateSaveButtonUI = action;
    },
    
    SetDeleteButtonUpdate:function(action){
        this.ancTree.updateDeleteButtonUI = action;
    },
    SetGetTextAreaDetails:function(action){
        this.ancTree.getTextAreaDetails = action;
    },
    
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












