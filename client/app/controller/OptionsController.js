var OptionsController = function (optionsDll,nodeManager, channel) {
    
    this._nodeManager = nodeManager;
    this.optionsDll = optionsDll;
    this._channel = channel;

    this.defaultOptions;
    this.tempOptions;
    this.selectedColourComponentId =1;// not zero based
    this.currentNode;
    this._state =0;
    
    var that = this;
    
   
    
    var calcState = function(val){
        if(val == 0){
            that._state =0;
        }else if(val ==1 ){
            that._state =1;
        }else
        {
            that._state =3;
        }
    };
    
    
    this._channel.subscribe("selectednodechanged", function(data, envelope) {
                    
    });
    
    this._channel.subscribe("nodeedit", function(data, envelope) {
      
        that._state =1;
        that.UpdateState();
    });    
    
    this._channel.subscribe("nodecreation", function(data, envelope) {
   
        that._state =2;
        that.UpdateState();
    });
    
    this._channel.subscribe("nodeinit", function(data, envelope) {
       
        that._state =0;
        that.UpdateState();
    });
    
 
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        calcState(data.value);
        that.UpdateState();
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        calcState(data.value);
        that.UpdateState();
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        calcState(data.value);
        that.UpdateState();
    });
  
    this._channel.subscribe("nullselection", function(data, envelope) {
        
        if(that._state != 2){ // if we arent in the process of adding a node 
            that._state =0;
            that.UpdateState();    
        }

    });
    
    this._channel.subscribe("doubleClickSelectionChange", function(data, envelope) {});
    
    this._channel.subscribe("colourSelection", function(data, envelope) {
        var options = {
            "hexval": '#'+data.value.hex,
            "DefaultFont" :  undefined,
            "IsTransparent" : undefined,
            "componentId" : undefined
        };
        
        that.OptionsChanged("hexval");
        that._updateOptions(options,true);
    });
    
    this._channel.subscribe("selectedColourComponentChanged", function(data, envelope) {
        that.updateSelectedComponentId(data.value);
    });
    
    this._channel.subscribe("SaveOptions", function(data, envelope) {
        that.SaveOptions(data.value);
    });
    
    //FontChanged
    this._channel.subscribe("FontChanged", function(data, envelope) {
        that.updateOptionFont(data.value);
    });
    
    //TransparencyChanged
    this._channel.subscribe("TransparencyChanged", function(data, envelope) {
        that.updateOptionTransparency(data.value);
    });
    
    //Angle Changed
    this._channel.subscribe("AngleChanged", function(data, envelope) {
        that.ChangeAngle(data.value);
    });
    
    this._channel.subscribe("RequestDefaultOptions", function(data, envelope) {
        that._state =0;
        that.UpdateState();
    });
    
    this.UpdateState();
    this.CreateComponentList();
};

OptionsController.prototype.SetOptions= function (options, currentColour){
    this._channel.publish( "RefreshOptions", { 
        options: options , 
        currentColour: currentColour 
    } );
},

OptionsController.prototype.OptionsChanged= function (componentName){
    this._channel.publish( "OptionsChanged", { value: componentName });
},

OptionsController.prototype.SetColourComponents= function (data){
    this._channel.publish( "ColourComponentChanged", { 
        value: data
    } );
},
OptionsController.prototype.SetDefaultOptionsUI= function (state, nodeCount){
    this._channel.publish( "DefaultOptionsLoaded", { 
        state: state,
        nodeCount: nodeCount
    } );
},


OptionsController.prototype.UpdateState= function (){
    var that = this;
    
    switch(this._state){
        case 0:
            this.LoadDefaultOptions(function(){
                that._channel.publish( "defaultOptionsLoaded", { value: that.defaultOptions } );
                that._updateOptionsToView(that.defaultOptions);
            });
            that.SetDefaultOptionsUI(false,0);
            
            console.log('OPTIONS default state 0');
            break;
        case 1:
            that._nodeManager.GetSelectedNodes(function(selection){
                if(selection.length > 0){
                    that.currentNode = selection[0]; 
                   
                    if(!that.currentNode.Options) 
                        that.currentNode.Options =  JSON.parse(JSON.stringify(this.defaultOptions));
                    
                    that._channel.publish( "existingOptionsLoaded", { value: that.currentNode.Options } );
                    that.SetDefaultOptionsUI(true,selection.length);
                    that._updateOptionsToView(that.currentNode.Options);
                }
            });
            console.log('OPTIONS edit state 1');
            break;
        case 2:
            console.log('OPTIONS new state 2');
            this.addNode = true;
            
            if(this.tempOptions == undefined)
                this.tempOptions = JSON.parse(JSON.stringify(this.defaultOptions));
            
            this._channel.publish( "newOptionsLoaded", { value: this.tempOptions } );
            that.SetDefaultOptionsUI(true,0);
            this._updateOptionsToView(this.tempOptions);
            break;
        case 3:
            that._nodeManager.GetSelectedNodes(function(selection){
                if(selection.length > 0){
                    that.currentNode = selection[0]; 
                    
                    that.SelectedNodes = selection; 
                    
                    var idx = 0;
                    
                    while(idx < that.SelectedNodes.length){
                        if(!that.SelectedNodes[idx].Options)
                            that.SelectedNodes[idx].Options =  JSON.parse(JSON.stringify(this.defaultOptions));
                        idx++;
                    }
                    
                    that._channel.publish( "existingOptionsLoaded", { value: that.currentNode.Options } );
                    that.SetDefaultOptionsUI(true,selection.length);
                    that._updateOptionsToView(that.currentNode.Options);
                }
            });
            console.log('OPTIONS multi edit state 3');
            break;
        
    }
},

OptionsController.prototype.ChangeAngle= function (direction){
    
    if(this.currentNode){
        this.currentNode.D += direction;
        this._channel.publish( "drawtree", { value: this.model } );
    }
},
 
OptionsController.prototype.CreateComponentList = function(){
        
    var component = [];
    
    component.push({id: 1, name: 'Background'});
    component.push({id: 2, name: 'Editor Font'});
    component.push({id: 3, name: 'Editor Border'});
    component.push({id: 4, name: 'Note Font'});
    component.push({id: 5, name: 'Selection Box'});
    component.push({id: 6, name: 'Crop Box'});
    component.push({id: 7, name: 'Selected Node'});
    
    this.SetColourComponents(component);
};

OptionsController.prototype.LoadDefaultOptions =function(callback){
    
    var that = this;
    
    that.optionsDll.GetOptions(function(jsonData){
        if(jsonData.length > 0){
            that.defaultOptions = jsonData[0];
            that.defaultOptions.Selection ={};
            that.defaultOptions.Selection.BorderWidth = 3;
            that.defaultOptions.Selection.Colour = 'red';
            
            that.defaultOptions.Selector ={};
            that.defaultOptions.Selector.BorderWidth = 3;
            that.defaultOptions.Selector.Colour = 'grey';
            
            
            
            callback();
        }
        
    });
 
};
     
OptionsController.prototype.SaveOptions =function(options){
   
    console.log('save option ' +options);
    var that = this;
    
    this.optionsDll.SaveOptions(this.defaultOptions, function(){
         
        that._channel.publish( "defaultOptionsSaved", { value: this.model } );
    });
     
     
};


OptionsController.prototype.updateOptionFont =function(font){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  font,
        "IsTransparent" : undefined,
        "componentId" : undefined
    };
   
    this.OptionsChanged("DefaultFont");
    this._updateOptions(options,true);

};

OptionsController.prototype.updateOptionTransparency =function(transparency){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : transparency,
        "componentId" : undefined
    };
    
    this.OptionsChanged("transparency");
    this._updateOptions(options,true);

};

OptionsController.prototype.updateSelectedComponentId =function(componentId){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : undefined,
        "componentId" : componentId
    };
   
    this.OptionsChanged("componentId");
    this._updateOptions(options,true);

};



OptionsController.prototype._updateOptionsToView =function(options){
    
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
        case 5:
            hex = options.SelectionBox;
            break;
        case 6:
            hex = options.CropBox;
            break;
        case 7:
            hex = options.SelectedNode;
            break;
    }
    
    this.SetOptions(options,hex);
};

OptionsController.prototype._updateOptions =function(options, withUpdate){
    /*
    save options from ui(option) to output object (defaultOptions etc)
    depending on state
    
    refresh ui afterwards
    */
  
    var that = this;

    if(options.componentId !== undefined){
        that.selectedColourComponentId = options.componentId;
        console.log('compid: ' + that.selectedColourComponentId);
    }
    
    var finalAction = function(dataOptions){
        if(withUpdate)
            that._updateOptionsToView(dataOptions);
    };
    
    if(this._state ==0){
        this._translateViewOptions(options,this.defaultOptions);
        finalAction(this.defaultOptions);
    }
    
    if(this._state == 1) // edit
    {
        this._translateViewOptions(options, this.currentNode.Options);
        
        finalAction(this.currentNode.Options);
    }
    
    if(this._state == 2) // new
    {
        this._translateViewOptions(options,this.tempOptions);
        this._channel.publish( "newOptionsLoaded", { value: this.tempOptions } );
        finalAction(this.tempOptions);
    }
    
    if(this._state == 3) // multi edit
    {
        var idx = 0
        
        while(idx < this.SelectedNodes.length){
            
            this._translateViewOptions(options, this.SelectedNodes[idx].Options);
            idx++;
        }
        
      
        this._channel.publish( "multiOptionsLoaded", { value: this.currentNode.Options } );
        
        finalAction(this.currentNode.Options);
    }
};

OptionsController.prototype._translateViewOptions =function(voptions,moptions){

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
          
            case 5:
                moptions.SelectionBox = voptions.hexval;
                break;
            case 6:
                moptions.CropBox = voptions.hexval;
                break;
            case 7:
                moptions.SelectedNode = voptions.hexval;
                break;
        }
    }
    
    return moptions;
};