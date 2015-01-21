var DiagramController = function (view, model) {
 
    this._moustQueue = [];
    this._mouseDown = false;
    this._view = view;
    
 //   this.textarea = null;
    
    this.ancTree = model;
 
  
    this._view.AngleChangeClicked($.proxy(this.angleChanged, this));
    this._view.QryDefaultOptions($.proxy(this.qryDefaultOptions, this));
    this._view.CanvasClick($.proxy(this.canvasClick, this));
    this._view.CanvasMouseDown($.proxy(this.canvasMouseDown, this));
    this._view.CanvasMouseUp($.proxy(this.canvasMouseUp, this));
    this._view.CanvasMouseMove($.proxy(this.canvasMouseMove, this));
    this._view.ButtonPressDown($.proxy(this.boxButtonDown, this));
    this._view.ButtonPressUp($.proxy(this.boxButtonUp, this));
    
    
    
    
    //get hex whenever listbox changes selection
    this._view.QrySelectedColourComponent($.proxy(this.qrySelectedColourComponent, this));
    this._view.QryPickedColour($.proxy(this.qryPickedColour, this));
    this._view.QryDefaultOptionsState($.proxy(this.qryDefaultOptionsState, this));
    this._view.QryPickState($.proxy(this.qryPickState, this));
    this._view.QrySelectedFontChanged($.proxy(this.qrySelectedFontChanged, this));
    this._view.QryTransparencyChanged($.proxy(this.qryTransparencyChanged, this));
    
    
    //colour picker 
    //saves colour back to model
    //this._view.ColourPickerClicked($.proxy(this.colourPickerClicked, this));          

    //note operations
    this._view.Add($.proxy(this.addButtonClicked, this));
    
    this._view.Cancel($.proxy(this.cancelButtonClicked, this));
    
    this._view.SaveNote($.proxy(this.saveNote, this));
   
    this._view.Delete($.proxy(this.deleteNote, this));
   
    if(model.nodestore.Type() == 'AJAX'){
        //URL operations
        this._view.URLFilterList($.proxy(this.URLFilterList, this));
        
        this._view.URLNew($.proxy(this.URLNew, this));
        
        this._view.URLSave($.proxy(this.URLSave, this), $.proxy(this.URLFilterList, this) );
        
        this._view.URLDelete($.proxy(this.URLDelete, this));
        
        this._view.URLChanged($.proxy(this.URLChanged, this));
     
    }
    
    this._view.InitPanelVisibility();

 
    if(model.nodestore.Type() != 'AJAX'){
        this.startFromDrive();
        
    }
    else
    {
        this.init();
        
        this._view.RunButtonClicked($.proxy(this.startFromAjax, this));
    }



};

DiagramController.prototype = {
    
    
    startFromDrive: function(){

        //init drive here
        var that = this;
        that.ancTree.CreateComponentList();
    
        that.ancTree.LoadBackgroundImage(function(id){
                    var canvas = document.getElementById("myCanvas");
              
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
        
                    that.ancTree.nodestore.GetGenerations(id, function(){
                        
                        console.log('got data starting app');
                        
                        setTimeout($.proxy(that.GameLoop,that), 1000 / 50);
         
                        that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);
        
                        that.ancTree.selectedNoteId = id;
                        that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
                        that.ancTree.UpdateGenerationState();
                        that.ancTree.ScaleToScreen();
                       
                    });
            });

    },
    
    init:function(){
    
         if (this.ancTree !== null) {
            this.ancTree.CreateComponentList();
            this.ancTree.EnableRun(false);
            this.ancTree.GetUrls();
            
         };
    },
        
    startFromAjax: function (id) {
    
        var that = this;
        //set image 
      
        var canvas = document.getElementById("myCanvas");
  
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        that.ancTree.nodestore.GetGenerations(id, function(){
            
            console.log('got data starting app');
            
            setTimeout($.proxy(that.GameLoop,that), 1000 / 50);

            that._moustQueue[that._moustQueue.length] = new Array(1000000, 1000000);


            that.ancTree.selectedNoteId = id;
            that.ancTree.SetInitialValues(100, 0.0, 0.0, screen.width, screen.height);
            that.ancTree.UpdateGenerationState();
            that.ancTree.ScaleToScreen();
           
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
    
    saveNote:function(saveData){
        
        if (this.ancTree !== null) {

            this.ancTree.SaveNoteClicked(saveData);
        }
    },

    qryDefaultOptions:function(options){
        this.ancTree.saveDefaultOptions(options);
    },
    
    qryDefaultOptionsState:function(data){
        this.ancTree.SetDefaultOptionMode(data);  
    },
    
    qryPickState: function(state){
       this.ancTree.setPickState(state);
    },
    
    qryPickedColour: function(rgb,hex){
       this.ancTree.updateOptionColour(rgb,hex);
    },

    qrySelectedColourComponent: function(componentId){
        this.ancTree.updateSelectedComponentId(componentId);
    },
    
    qrySelectedFontChanged: function(font){
        this.ancTree.updateOptionFont(font);
    },
    qryTransparencyChanged: function(transparency){
        this.ancTree.updateOptionTransparency(transparency);
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
    
 
    GameLoop: function () {

        while (this._moustQueue.length > 0) {
            var _point = this._moustQueue.shift();


            this.ancTree.SetCentrePoint(_point[0], _point[1]);
            this.ancTree.DrawTree();
        }

        setTimeout($.proxy(this.GameLoop, this));
    }

};












