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
    this.selectedFontChanged;
    
    
    this.PublishSelectedColourComponent();
    
    this.PublishSaveClick();
    
    this.PublishFontChanged();
    
    this.PublishTransparencyChanged();
    
    this.PublishAngleChangeClicked();
    
    
    this._channel.subscribe("RefreshOptions", function(data, envelope) {
        that.SetOptions(data.options, data.currentColour);
        that._channel.publish( "drawtree", { value: this.model } );
    });
    
    this._channel.subscribe("ColourChanged", function(data, envelope) {
        that.SetChosenColour(data.value);            
    });
    
    this._channel.subscribe("ColourComponentChanged", function(data, envelope) {
        that.SetColourComponents(data.value);
    });
    
    this._channel.subscribe("DefaultOptionsLoaded", function(data, envelope) {
        that.SetDefaultOptionsUI(data.state, data.nodeCount);
        that.SetDisableSave();
    });
    
    this._channel.subscribe("RequestOptions", function(data, envelope) {
        that._channel.publish( "SelectedOptions", { value: that._getOptionDetails() } );
    });
    
    
    this._channel.subscribe("existingOptionsLoaded", function(data, envelope) {
        that.SetDisableSave();
    });
    
    this._channel.subscribe("newOptionsLoaded", function(data, envelope) {
        that.SetDisableSave();
    });
    
    this._channel.subscribe("defaultOptionsSaved", function(data, envelope) {
        that.SetDisableSave();
    });
    
    this._channel.subscribe("OptionsChanged", function(data, envelope) {
        that.SetEnableSave();
    });
    
    
    
    this.InitOptions();
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
    
    $('#fontSelect').fontSelector({
		'hide_fallbacks' : true,
		'initial' : 'Courier New,Courier New,Courier,monospace',
		'selected' : function(style) { 
		    that.selectedFontChanged(style);
		},
		'fonts' : [
			'Arial,Arial,Helvetica,sans-serif',
			'Arial Black,Arial Black,Gadget,sans-serif',
			'Comic Sans MS,Comic Sans MS,cursive',
			'Courier New,Courier New,Courier,monospace',
			'Georgia,Georgia,serif',
			'Impact,Charcoal,sans-serif',
			'Lucida Console,Monaco,monospace',
			'Lucida Sans Unicode,Lucida Grande,sans-serif',
			'Palatino Linotype,Book Antiqua,Palatino,serif',
			'Tahoma,Geneva,sans-serif',
			'Times New Roman,Times,serif',
			'Trebuchet MS,Helvetica,sans-serif',
			'Verdana,Geneva,sans-serif',
			'Gill Sans,Geneva,sans-serif'
			]
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
    //console.log('Options.SetOptions');

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

OptionsView.prototype.SetDisableSave = function (hex) {
    $('#btnSaveOptions').prop('disabled', true); 
};

OptionsView.prototype.SetEnableSave = function (hex) {
    $('#btnSaveOptions').prop('disabled', false); 
};

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

OptionsView.prototype.PublishSaveClick = function(){
    var that = this;
    $('#btnSaveOptions').click(function (e) {            
        e.preventDefault();
       // action(that._getOptionDetails());
        
        that._channel.publish( "SaveOptions", { value: that._getOptionDetails() } );
    });   
};

OptionsView.prototype.PublishFontChanged = function (action) {
    var that = this;
    this.selectedFontChanged = function(style){
        
        var selectedFont = $('#fontSelect').fontSelector('selected');
        
        that._channel.publish( "FontChanged", { value: selectedFont } );
    };
};

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

OptionsView.prototype.PublishAngleChangeClicked = function (action) {
    var that = this;
    var angle;
    
    var moveTextArea = function(offset){
        
        var angleUtils = new AngleUtils();
        
        var a = angleUtils.getAngle();
        
        if(a!= 1000){
            a = a + offset;
            var newprop =  'rotate('+ a  +'deg)';
            $('textarea.info').css('transform',newprop);
        }
        
        return a;
    };
    
    $('#btnAngleDown').click(function (e) {
        //action('down');
        
        
        angle = moveTextArea(-1);
        
        that._channel.publish( "AngleChanged", { value: -1 } );
        
        e.preventDefault();
    });
    
    $('#btnAngleUp').click(function (e) {
        //action('up');
        
        angle = moveTextArea(1);
        
        that._channel.publish( "AngleChanged", { value: 1 } );
        
        e.preventDefault();
    });
};
