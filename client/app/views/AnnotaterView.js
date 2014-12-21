

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




  

/** @constructor */
function AnnotaterView(diagramRunner) {       
    this.diagramRunner =diagramRunner;
    this.textarea = null;
 
   

    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.showImageUI = true;
    this.dataLoader = true;
    this.millisecondsInterval =1000;
} 



    
    
AnnotaterView.prototype.ApplicationRun = function (action) {

        action();
    };

 
   //wtf is for ? looks unusued
AnnotaterView.prototype.RunDiagClicked = function (idx, action) {
    $('#btnRunImage').click(function (e) {

            action(idx);

            e.preventDefault();
        });
};

AnnotaterView.prototype.GetAngle = function () {

},

AnnotaterView.prototype.AngleChangeClicked = function (action) {
        var that = this;
        
        
        
        //that.textarea.style.transform = 'rotate('+ angle +'deg)';
        
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
            action('down');
           
            moveTextArea(-1);
            
            e.preventDefault();
        });
        
        $('#btnAngleUp').click(function (e) {
            action('up');
            moveTextArea(1);
            e.preventDefault();
        });
    };
    
AnnotaterView.prototype.InitPanelVisibility = function () {


        var that = this;
        
        var panels = new Panels();
        
        $('body').on("click", "#chooseFileLnk", $.proxy(function () { panels.masterShowTab('1'); return false; }, panels));

        $('body').on("click", "#selectPersonLnk", $.proxy(function () { panels.masterShowTab('2'); return false; }, panels));
        
        $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
      
        $('#show_controls').click(function (e) {

            if (that.showMapControls) {
              //  $("#map_control").removeClass("hidePanel").addClass("displayPanel");
                
                $("#map_control").dialog();
                
          //   $(".ui-widget-header").css("border", "none" );
                //   $(".ui-widget-header").css("background", "none");
             
                 $(".ui-widget-header").css("height", "7px");
                
                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");
                
                 $('*[aria-describedby="map_control"]').css("width", "120px");
                 $('*[aria-describedby="map_control"]').css("height", "100px");
                
                that.showMapControls = false;
            } else {
             //   $("#map_control").removeClass("displayPanel").addClass("hidePanel");
                $("#map_control").dialog("close");
                that.showMapControls = true;
            }
        });

        $('#show_dataLoader').click(function (e) {



            if (that.dataLoader) {

                $("#imageLoader").dialog();

                that.dataLoader = false;

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="imageLoader"]').css("width", "270px");
                $('*[aria-describedby="imageLoader"]').css("height", "310px");
                
                $("#fileList").css("width", "260px");
                $("#fileList").css("height", "130px");
                
                $("#imageLoader").css("padding", "0px");

            } else {


                $("#imageLoader").dialog("close");
                that.dataLoader = true;
            }
        });

        $('#show_debugbox').click(function (e) {

         

             if (that.showDebug) {
            
                 $("#map_message").dialog();
                 
                 that.showDebug = false;
                 
                 $(".ui-widget-header").css("height", "7px");

                 $(".ui-dialog-title").css("position", "absolute");
                 $(".ui-dialog-title").css("top", "0px");
                 $(".ui-dialog-title").css("left", "0px");

                 $('*[aria-describedby="map_message"]').css("width", "120px");
                 $('*[aria-describedby="map_message"]').css("height", "140px");

            } else {
               

                 $("#map_message").dialog("close");
                 that.showDebug = true;
            }
        });

        $('#show_imageUI').click(function (e) {

            if (that.showImageUI) {
                $("#map_imageUI").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_imageUI"]').css("width", "265px");
           
                $("#map_imageUI").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showImageUI = false;
            } else {
              
                that.showImageUI = true;
            }
        });
        
        $('#btnOptions').click(function (e) {
            $("#optionGroup").toggle();
            $("#btnAddNote").toggle();
            $("#btnDeleteNote").toggle();
            $('#btnSaveOptions').toggle();
            $('#btnPickColour').toggle();
            if($("#btnOptions").val() == 'Cancel'){
                $("#btnOptions").val('Options');
            }
            else
            {
                $("#btnOptions").val('Cancel');
            }
            
            var myDDL = $('#colourComponentList');
            myDDL[0].selectedIndex = 0;
        });

		$('#fontSelect').fontSelector({
			'hide_fallbacks' : true,
			'initial' : 'Courier New,Courier New,Courier,monospace',
		//	'selected' : function(style) { alert("S1: " + style); },
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

        // hide options box to start with
	    $("#optionGroup").toggle();
     
        $("#angleGroup").toggle();
      
        $('#btnPickColour').click(function (e) {
            
        });  
    };

AnnotaterView.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
};
    
    
AnnotaterView.prototype.SaveNote = function (action) {

        var that = this;
        $('#btnSaveNote').click(function (e) {
            action();
            e.preventDefault();
        });               
    };
    
AnnotaterView.prototype.Cancel = function (action) {
        var that = this;
        $('#btnCancel').click(function (e) {
            action();

            e.preventDefault();
        });
    };
    
AnnotaterView.prototype.Add = function (action) {
        var that = this;
        $('#btnAddNote').click(function (e) {
            action();

            e.preventDefault();
        });
    };

AnnotaterView.prototype.Delete = function (action) {
    var that = this;
    $('#btnDeleteNote').click(function (e) {            
        action();
        e.preventDefault();
    });        
};



// ok so when this click happens we need to determine 
// if we're inside an existing node
// if so get the dims for that node.

AnnotaterView.prototype.CanvasClick = function (action) {
    var that = this;

    $("#myCanvas").click(function (evt) {
        var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
        
        action(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
    });
};

AnnotaterView.prototype.CanvasMouseUp = function (action) {
       
        $("#myCanvas").mouseup(function (evt) {
                evt.preventDefault();
               action();
        });
        
    };

AnnotaterView.prototype.CanvasMouseDown = function (action) {
        
        $("#myCanvas").mousedown(function (evt) {
                evt.preventDefault();
                action();
        });
        
    };
    
AnnotaterView.prototype.CanvasMouseMove = function (action) {
       
        $("#myCanvas").mousemove(function (evt) {
              
                var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();

                var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
            
                action(_point);
         });
    };
    
AnnotaterView.prototype.ButtonPressDown = function (action) {

        var that = this;
        
        $(".button_box").mousedown(function (evt) {
            var _dir = '';
        
            if (evt.target.id == "up") _dir = 'UP';
            if (evt.target.id == "dn") _dir = 'DOWN';
            if (evt.target.id == "we") _dir = 'WEST';
            if (evt.target.id == "no") _dir = 'NORTH';
            if (evt.target.id == "es") _dir = 'EAST';
            if (evt.target.id == "so") _dir = 'SOUTH';
            if (evt.target.id == "de") _dir = 'DEBUG';
        
            that.millisecondsInterval = action(_dir);

        });
        
};

AnnotaterView.prototype.ButtonPressUp = function (action) {

        var that = this;
        
        $(".button_box").mouseup(function () {
            action(that.millisecondsInterval);
        });
        
};

AnnotaterView.prototype.Dispose = function (action) {

        $("#myCanvas").unbind();
        $(".button_box").unbind();
        
        action();
};

AnnotaterView.prototype.DisplayNodeSelection = function (x,y,width,height,angle,note,options) {

        var that = this;
        var mouseDownOnTextarea = function (e) {
                var x = that.textarea.offsetLeft - e.clientX,
                    y = that.textarea.offsetTop - e.clientY;
                function drag(e) {
                    that.textarea.style.left = e.clientX + x + 'px';
                    that.textarea.style.top = e.clientY + y + 'px';
                }
                function stopDrag() {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
        };
        
       
        if (!that.textarea) {
            that.textarea = document.createElement('textarea');
            that.textarea.className = 'info';
            that.textarea.addEventListener('mousedown', mouseDownOnTextarea);
            document.body.appendChild(that.textarea);
        }
        
      //  var canvas = document.getElementById("myCanvas");
         
      //  var new_x = x - canvas.offsetLeft,
      //      new_y = y - canvas.offsetTop;
            
        height = height -5;
        
        that.textarea.value = note;
        that.textarea.style.top = y + 'px';
        that.textarea.style.left = x + 'px';
        that.textarea.style.height = height + 'px';
        that.textarea.style.width = width + 'px';
        that.textarea.style.fontWeight = 'bold';
        
        that.textarea.style.color = options.DefaultEditorFontColour;
        
        
        
        that.textarea.style.transform = 'rotate('+ angle +'deg)';
        that.textarea.style.transformOrigin = '0% 0%';
        
        if(!options.IsTransparent)
            that.textarea.style.backgroundColor = options.DefaultNoteColour;
        else
            that.textarea.style.backgroundColor = 'transparent';
            
        this.textarea.style.borderColor = options.DefaultEditorBorderColour;
        
        
        
        //data.DefaultNoteColour;
        //data.IsTransparent;
        
        // we need to somehow pass in the dims from the imageviewer
        // we also need to receive permission from imageviewer to do this in the first place
        // so what pass in a call back xxx
        
        // handle textarea load here like with perform click
};

AnnotaterView.prototype.ClearActiveTextArea = function () {
    
    if(this.textarea!= null)
    {
        $(this.textarea).remove();
        this.textarea =null;
    }
};

AnnotaterView.prototype.GetTextAreaDetails = function () {
    
    if(this.textarea!= null)
    {
        var y = $(this.textarea).css( "top").replace("px","");
        var h = $(this.textarea).css( "height").replace("px","");
        var x = $(this.textarea).css( "left").replace("px","");
        var w = $(this.textarea).css( "width").replace("px","");
        
        var text = $(this.textarea).val();
        
      //  b = Number(t) + Number(b);
       // r = Number(l) + Number(r)+5;
        
        var angleUtils = new AngleUtils();
        
        var result = {
            "x" : x,
            "y" : y,
            "width" : Number(w)+5,
            "height" : h,
            "d":angleUtils.getAngle(),
            "text" : text
        };
        
        
        return result;
    }
};

//SAVE OPTIONS CLICKED
AnnotaterView.prototype.SaveOptionsClicked = function(action){
        var that = this;
        
        $('#btnSaveOptions').click(function (e) {            
        
        var options = {
            "hexval": $("#txtChosenColour").val(),
            "font" :  $('#fontSelect').fontSelector('selected'),
            "isTransparent" : $("#chkTransparentBackground").val()
        }
        
        e.preventDefault();
        
        action(options);
    });   
};

//CALLED FROM MODEL AND UPDATES OPTIONS DATA TO UI
AnnotaterView.prototype.UpdateOptions = function(data, firstHex){
 
        $("#txtChosenColour").css("background-color", firstHex);
        $("#txtChosenColour").val(firstHex);

        $("#chkTransparentBackground").val(data.IsTransparent);
        
        $('#fontSelect').fontSelector('select',data.DefaultFont);
};


//COLOUR PICKER BUTTON CLICKED
//SAVES COLOUR BACK TO MODEL
AnnotaterView.prototype.ColourPickerClicked = function (action,saveFunc){
   
   
    $('#btnPickColour').click(function (e) {            

        action(function(rgb,hex){
            // we need to call imageviewer here
            // pass in the new values
            // or else save them locally somehow
            
            $("#txtChosenColour").val("#"+hex);
            $("#txtChosenColour").css("background-color", "#"+hex);
            
            $( "#colourComponentList option:selected" ).each(function() {
              
                saveFunc($( this ).val(), "#"+hex);
            });
        });

        e.preventDefault();
    });
}

//POPULATES COLOUR PICKER COMPONENT LIST
AnnotaterView.prototype.UpdateColourPickerComponents = function (data){
    var that = this;
    var output = [];
    
    $.each(data, function(key, value)
    {
      output.push('<option value="'+ value.id +'">'+ value.name +'</option>');
    });

    $('#colourComponentList').html(output.join(''));

  //  var myDDL = $('#colourComponentList');
   // myDDL[0].selectedIndex = 0;
}

//LIST CHANGED AND UI UPDATED
//get existing hex value for component
AnnotaterView.prototype.ColourComponentChanged = function (action) {
    var that = this;
    
   $("#colourComponentList")
      .change(function () {
        
        var str = "";
        $( "#colourComponentList option:selected" ).each(function() {
          str = $( this ).val();
        });
        
        console.log('colour component changed: '+ str);
      
        var hex = action(str);
        
        $("#txtChosenColour").val(hex);
        $("#txtChosenColour").css("background-color", "#"+hex);
        
      })
      .change();
};




//USER CLICKS ADD
AnnotaterView.prototype.DisplayUpdateNoteAdd = function (status) {
    
    
    console.log('DisplayUpdateNoteAdd: ' + status);
    if(!status){
        $("#controllabel").html('select edit mode');
    }
    else
    {
        $("#controllabel").html('click drawing to add');
    }
    $("#btnOptions").toggle();
    $("#btnAddNote").toggle();
    $("#btnCancel").toggle();
    //btnSaveNote
    $("#btnSaveNote").toggle();
    
    //btnDeleteNote
    $("#btnDeleteNote").toggle();
    
    $("#angleGroup").toggle(); 
 
};

//USER CLICKS DELETE
AnnotaterView.prototype.DisplayUpdateDelete= function (status) {
    console.log('View DisplayUpdateDelete: ' + status);
     
    //controllabel btnSaveNote
    if(!status){
        $("#controllabel").html('select mode');
        $("#btnDeleteNote").val('Delete');
    }
    else
    {
        $("#controllabel").html('Click note to delete');
        $("#btnDeleteNote").val('Cancel');
    }
    
    $("#btnAddNote").toggle();
    $("#btnOptions").toggle();
};

//TRIGGERED BY MODEL WHEN DIAGRAM IS READY/NOT READY TO BE RUN
AnnotaterView.prototype.DisplayUpdateRunButton= function (status) {

    console.log('View DisplayUpdateRunButton: ' + status);
 
    if(status){
        $("#btnRunImage").val('Run');
        $("#btnRunImage").removeAttr('disabled');
    }
    else
    {
        $("#btnRunImage").val('loading');
        $("#btnRunImage").attr('disabled','disabled');
    }
    
};

AnnotaterView.prototype.URLNew = function (action) {
        var that = this;
        $('#btnNewURL').click(function (e) {
            // get values
            
            $('#txtName').val('');
            $('#txtUrl').val('');
            $('#txtGroup').val('');
            $('#txtDefault').val('');
            $('#txtUrlId').val('-1');

            action();

            e.preventDefault();
        });
    };

AnnotaterView.prototype.URLSave = function (urlSaveAction, urlListRefreshAction) {
        var that = this;
        $('#btnSaveURL').click(function (e) {
            // get values
            
            var isDefault = $('.myCheckbox').is(':checked');
            
            
            
            urlSaveAction(  $('#txtName').val() , $('#txtUrl').val(), $('#txtGroup').val(),isDefault, function(id){
                $('#txtUrlId').val(id);
                 
                 urlListRefreshAction($('#txtFilter').val());
                 
                 
            } );

            e.preventDefault();
        });
    };

AnnotaterView.prototype.URLDelete = function (action) {
    var that = this;
    $('#btnDelURL').click(function (e) {            
        action();
        e.preventDefault();
    });        
};

AnnotaterView.prototype.URLChanged = function (action) {
    var that = this;
    
   $("#fileList")
      .change(function () {
        var str = "";
        $( "#fileList option:selected" ).each(function() {
          str = $( this ).val();
        });
      
        action(str, function(result) {
             if(result != undefined)
                {
                    $('#txtUrlId').val(result.urlId);
                    $('#txtName').val(result.urlName);
                    $('#txtUrl').val(result.url);
                    $('#txtGroup').val(result.urlGroup);
                    
                    if(String(result.urlDefault) == "true")
                        $('#txtDefault').prop('checked', true);
                    else
                        $('#txtDefault').prop('checked', false);
                    
                    
                }       
                
                console.log(result);
            
        });
        
       
        
      })
      .change();
      
  
};

AnnotaterView.prototype.FillUrls = function (data) {
    var that = this;
    
  //  $("#fileList option").remove();
    
    var output = [];
    
    $.each(data, function(key, value)
    {
      output.push('<option value="'+ value.urlId +'">'+ value.urlName +'</option>');
    });

    $('#fileList').html(output.join(''));


    var myDDL = $('#fileList');
    myDDL[0].selectedIndex = 0;
};

AnnotaterView.prototype.URLFilterList = function (action) {
    var that = this;
    $('#btnFilterUrl').click(function (e) {            
        action($('#txtFilter').val());
        e.preventDefault();
    });        
};

AnnotaterView.prototype.RunButtonClicked = function (action) {
    var that = this;
    
    $('#btnRunImage').click(function (e) {            
        
        var urlId = "";
        $( "select option:selected" ).each(function() {
          urlId = $( this ).val();
        });
        
      
        action(urlId);
        
        that.hideLoader();
        
        e.preventDefault();
    });        
};