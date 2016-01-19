var AngleUtils = function() {};


AngleUtils.prototype = {
    getAngle: function () {
        var tr = $('textarea.info').css('transform');

        if(tr){
            var values = tr.split('(')[1];
                values = values.split(')')[0];
                values = values.split(',');
            
            var a = values[0]; // 0.866025
            var b = values[1]; // 0.5
            var c = values[2]; // -0.5
            var d = values[3]; // 0.866025
            
            var angle = Math.round(Math.asin(b) * (180/Math.PI));
            
            return angle;
        }
            
        return 1000;
    }
};


var OptionsView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this.PublishSelectedColourComponent();
    
    this.PublishSaveClick();
    
    this.PublishFontChanged();
    
    this.PublishTransparencyChanged();
    
    this.PublishAngleChangeClicked();
    
    
    this._channel.subscribe("OptionsChanged", function(data, envelope) {
        //options, currentColour
        that.SetOptions(data.value.options, data.value.currentColour);            
    });
    
    this._channel.subscribe("ColourChanged", function(data, envelope) {
        that.SetChosenColour(data.value);            
    });
    
    this._channel.subscribe("ColourComponentChanged", function(data, envelope) {
        that.SetColourComponents(data.value);
    });
    
    this._channel.subscribe("DefaultOptionsChanged", function(data, envelope) {
        that.SetDefaultOptionsUI(data.value.state, data.value.nodeCount);
    });
};


OptionsView.prototype.InitOptions = function (state){
    var that = this;
    var key = 'COLP';
    var pickEnabled = false;
    
    $('#btnPickColour').click(function (e) {
        pickEnabled =true;
        that._channel.publish( "lockmouseclick", { value: 'COLP' } );
        that._channel.publish( "lockmouseup", { value: 'COLP' } );
        that._channel.publish( "lockmousedown", { value: 'COLP' } );
    });  

    
    $("#myCanvas").click(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMouseClickLocks) == key) {
            if(pickEnabled)
            {
                evt.stopImmediatePropagation();
    
                var x = evt.pageX - this.offsetLeft;
                var y = evt.pageY - this.offsetTop;
                
                var c = new CanvasTools();
                
                var r = c.GetCanvasPointColour('myCanvas',x,y);
                
                // making the color the value of the input
                that.SetChosenColour(r.hex);
                  
                that._channel.publish( "colourSelection", { value: r } );    
                    
                that._channel.publish( "lockmouseclick", { value: '' } );
                that._channel.publish( "lockmouseup", { value: '' } );
                that._channel.publish( "lockmousedown", { value: '' } );
                pickEnabled =false;
            } 
        }
    });
    
    

};
 
    

//private
OptionsView.prototype._getOptionDetails= function (includeColour){
    var currentComponent =1;

    $( "#colourComponentList option:selected" ).each(function() {
        currentComponent = $( this ).val();
    });


    var options = {
        "hexval": (includeColour ? $("#txtChosenColour").val() : undefined) ,
        "DefaultFont" :  $('#fontSelect').fontSelector('selected'),
        "IsTransparent" : $("#chkTransparentBackground").is(":checked"),
        "componentId" : currentComponent
    };
    
    return options;
};



//setters
OptionsView.prototype.SetOptions = function(options, currentColour){
    console.log('Options.SetOptions');

    // the other defaults only updated when combo box gets changed         
    $("#txtChosenColour").css("background-color", currentColour);
    $("#txtChosenColour").val(currentColour);

    $("#chkTransparentBackground").val(options.IsTransparent);
    
    $('#fontSelect').fontSelector('select',options.DefaultFont);
    
    $('textarea.info').css('color',options.DefaultEditorFontColour);
    
    $('textarea.info').css('font-family',$('#fontSelect').fontSelector('selected'));
 
    if(!options.IsTransparent)
        $('textarea.info').css('background-color',options.DefaultNoteColour);
    else
        $('textarea.info').css('background-color','transparent');
  
    $('textarea.info').css('border-color',options.DefaultEditorBorderColour);
};

OptionsView.prototype.SetChosenColour = function (hex) {
    console.log('Options.SetChosenColour');
    $("#txtChosenColour").val(hex);
    $("#txtChosenColour").css("background-color", "#"+hex);
};

OptionsView.prototype.SetColourComponents = function (data){
 
    var output = [];
    
    $.each(data, function(key, value)
    {
      output.push('<option value="'+ value.id +'">'+ value.name +'</option>');
    });

    $('#colourComponentList').html(output.join(''));

  //  var myDDL = $('#colourComponentList');
   // myDDL[0].selectedIndex = 0;
}

//SetDefaultOptionsUI
OptionsView.prototype.SetDefaultOptionsUI = function (state, nodeCount) {
        
    $("#angleGroup").show(); 
    $("#optionGroup").show();
    $('#btnPickColour').show();
        
    if(state)
    {
        if(nodeCount && nodeCount > 0)
            $("#options-label").html('Options ' + nodeCount + 'n');
        else
            $("#options-label").html('New Options');
    }
    else
    {
        $("#options-label").html('Default Options');
    }
};




//LIST CHANGED AND UI UPDATED
OptionsView.prototype.PublishSelectedColourComponent = function () {
    var that = this;
    var currentComponent =1;

    $( "#colourComponentList option:selected" ).each(function() {
        currentComponent = $( this ).val();
    });
    
    $("#colourComponentList")
      .change(function () {
        // console.log('colour component changed: '+ str);
        
        currentComponent = $( "#colourComponentList option:selected" ).val();
       
        that._channel.publish( "selectedColourComponentChanged", { value: currentComponent } );
        
    })
    .change();
};

//QryDefaultOptions
OptionsView.prototype.PublishSaveClick = function(){
    var that = this;
    $('#btnSaveOptions').click(function (e) {            
        e.preventDefault();
       // action(that._getOptionDetails());
        
        that._channel.publish( "SaveOptions", { value: that._getOptionDetails() } );
    });   
};

//QrySelectedFontChanged
OptionsView.prototype.PublishFontChanged = function (action) {
    var that = this;
    this.selectedFontChanged = function(style){
        console.log('font changed');
        //action($('#fontSelect').fontSelector('selected'));
        
        var selectedFont = $('#fontSelect').fontSelector('selected');
        
        that._channel.publish( "FontChanged", { value: selectedFont } );
    };
};

//QryTransparencyChanged
OptionsView.prototype.PublishTransparencyChanged = function (action) {
    var that = this;
    $("#chkTransparentBackground")
      .change(function () {
        //action($("#chkTransparentBackground").is(":checked"));
        
        var chkTransparentBackground = $("#chkTransparentBackground").is(":checked");
        
        that._channel.publish( "TransparencyChanged", { value: chkTransparentBackground } );
    })
    .change();
};

//AngleChangeClicked
OptionsView.prototype.PublishAngleChangeClicked = function (action) {
    var that = this;
    
    var moveTextArea = function(offset){
        
        var angleUtils = new AngleUtils();
        
        var a = angleUtils.getAngle();
        
        if(a!= 1000){
            a = a + offset;
            var newprop =  'rotate('+ a  +'deg)';
            $('textarea.info').css('transform',newprop);
        }
        
    };
    
    $('#btnAngleDown').click(function (e) {
        //action('down');
        that._channel.publish( "AngleChanged", { value: 'down' } );
        
        moveTextArea(-1);
        
        e.preventDefault();
    });
    
    $('#btnAngleUp').click(function (e) {
        //action('up');
        that._channel.publish( "AngleChanged", { value: 'up' } );
        moveTextArea(1);
        e.preventDefault();
    });
};