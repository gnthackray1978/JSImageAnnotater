var Options = function (optionsDll,view, channel) {
    this.optionsDll = optionsDll;
    this._channel = channel;
    
    this.view = view;
    
    this.optionMode =false;
    this.addNode =false;
    //this.pickMode =false;
    
    //this.options = {};
    this.defaultOptions;
    this.tempOptions;
    this.selectedColourComponentId =1;// not zero based
    this.currentNode;
    this._state =0;
    
    var that = this;
    
    this._channel.subscribe("selectednodechanged", function(data, envelope) {
                    
    });
    
    this._channel.subscribe("nodeedit", function(data, envelope) {
        that.SetDefaultOptionState(false);                
        that.SetState(true,data.value,true);
        that._state =1;
        that.UpdateState();
    });    
    
    this._channel.subscribe("nodecreation", function(data, envelope) {
        that.SetDefaultOptionState(true);            
        that.SetState(true,data.value,true);
        that._state =2;
        that.UpdateState();
    });
    
    this._channel.subscribe("nodeinit", function(data, envelope) {
        that.SetDefaultOptionState(false);
        that.SetState(false);
        that._state =0;
        that.UpdateState();
    });
    
    this._channel.subscribe("multiselectingstart", function(data, envelope) {});
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        if(data.value == 0){
            that._state =0;
        }else if(data.value ==1 ){
            that._state =1;
        }else
        {
            that._state =3;
        }
        that.UpdateState();
    });
    this._channel.subscribe("nodeselected", function(data, envelope) {
        if(data.value == 0){
            that._state =0;
        }else if(data.value ==1 ){
            that._state =1;
        }else
        {
            that._state =3;
        }
        that.UpdateState();
    });
    this._channel.subscribe("nodedeselected", function(data, envelope) {
         if(data.value == 0){
            that._state =0;
        }else if(data.value ==1 ){
            that._state =1;
        }else
        {
            that._state =3;
        }
        that.UpdateState();
    });
    this._channel.subscribe("focusednode", function(data, envelope) {});
    this._channel.subscribe("nullselection", function(data, envelope) {
        that._state =0;
        that.UpdateState();
    });
    this._channel.subscribe("doubleClickSelectionChange", function(data, envelope) {});
    
    this.UpdateState();
};

Options.prototype.UpdateState= function (){
    
    switch(this._state){
        case 0:
            this.LoadDefaultOptions();
            console.log('OPTIONS default state 0');
            break;
        case 1:
            console.log('OPTIONS edit state 1');
            break;
        case 2:
            console.log('OPTIONS new state 2');
            if(this.tempOptions == undefined)
                this.tempOptions = JSON.parse(JSON.stringify(this.defaultOptions));
            break;
        case 3:
            console.log('OPTIONS multi edit state 3');
            break;
        
    }
},

Options.prototype.ChangeAngle= function (direction){
    
},
 
Options.prototype.CreateComponentList = function(){
        
    var component = [];
    
    component.push({id: 1, name: 'Background'});
    component.push({id: 2, name: 'Editor Font'});
    component.push({id: 3, name: 'Editor Border'});
    component.push({id: 4, name: 'Note Font'});
     
    this.view.SetColourComponents(component);
};

Options.prototype.SetDefaultOptionState = function(state){
    //after option button clicked then its text changed to cancel thats
    //how this method is called for cancel and options add
    this.optionMode =state;
    
    this.view.SetDefaultOptionsUI(state);
};

Options.prototype.SetState = function(addNode,currentNode, refreshView){
    this.currentNode = currentNode;
    this.addNode = addNode;
    
    // if(this.addNode)
    // {
    //     if(this.tempOptions == undefined)
    //         this.tempOptions = JSON.parse(JSON.stringify(this.defaultOptions)); 
        
    // }
     
    if(refreshView){
        if(currentNode != undefined)
            this._updateOptionsToView(this.currentNode.options);
        else
            this._updateOptionsToView(this.tempOptions);
        
    }
    
};

Options.prototype.GetState = function(addNode,callback){
    
    
    return {
    //    pickMode: this.pickMode,
        defaultOptions: this.defaultOptions,
        tempOptions: this.tempOptions
    };
};



Options.prototype.LoadDefaultOptions =function(){
    
    var that = this;
    
    that.optionsDll.GetOptions(function(jsonData){
        if(jsonData.length > 0){
            that.defaultOptions = jsonData[0];
        }
    });
 
};
     
Options.prototype.saveDefaultOptions =function(options){
   
    console.log('save option ' +options);
 
    this.optionsDll.SaveOptions(this.defaultOptions);
};

Options.prototype.QrySaveData =  function(callback){
    
    if( this.currentNode!=undefined && this.currentNode.options!=undefined)
    {
        //saveData.options = this._translateViewOptions(saveData.options,saveData.options);
        callback(this.currentNode.options);
    }
    else
    {
        callback(this.tempOptions);
    }
};
 

Options.prototype._translateViewOptions =function(voptions,moptions){
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
Options.prototype.updateOptionColour =function(rgb,hex){

    //this.setPickState(false);
    
    this._channel.publish( "mouseClickLock", { value: false } );


    var options = {
        "hexval": '#'+hex,
        "DefaultFont" :  undefined,
        "IsTransparent" : undefined,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

Options.prototype.updateOptionFont =function(font){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  font,
        "IsTransparent" : undefined,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

Options.prototype.updateOptionTransparency =function(transparency){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : transparency,
        "componentId" : undefined
    };
   
    this._updateOptions(options,true);

};

Options.prototype.updateSelectedComponentId =function(componentId){

    var options = {
        "hexval": undefined,
        "DefaultFont" :  undefined,
        "IsTransparent" : undefined,
        "componentId" : componentId
    };
   
   
    this._updateOptions(options,true);

};

Options.prototype._updateOptionsToView =function(options){
    
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

Options.prototype._updateOptions =function(options, withUpdate){
    
  
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
        if(this.currentNode !== undefined)
        {
            if(this.currentNode.options != undefined){
            
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

// Options.prototype.setPickState = function(state){
     
//     this.pickMode =state;
    
// };

