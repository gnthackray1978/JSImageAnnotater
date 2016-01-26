
/** @constructor */
function AnnotaterView(channel) {       
   
    this.textarea = null;
    this._channel = channel;
    //this._pickEnabled =false;
    
    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.showImageUI = true;
    this.showLayers = true;
    this.showmeta = true;
    this.showoptions = true;
    this.showCropper = true;
    this.showEdges =true;
    this.showMatches = true;
    this.showTextCreator =true;
    this.showToolBar =true;
    
    this.dataLoader = true;
    this.millisecondsInterval =1000;
    this.selectedFontChanged;
    
    
    this.layerButtonCallback;
    this.layerInputCallback;
    this.metaButtonCallback;
    
    this.canvasMouseupLock ='';
    this.canvasMouseupLocks = [];
    
    this.canvasMousedownLock ='';
    this.canvasMousedownLocks = [];
    
    this.canvasMousemoveLock ='';
    this.canvasMousemoveLocks = [];
    
    this.canvasMouseClickLock ='';
    this.canvasMouseClickLocks = [];
   
    this.canvasMouseLastXClick;
    this.canvasMouseLastYClick;
    
    this.openNodeEditor;
    this.closeNodeEditor;
    var that = this;
          
    if(this._channel){
        
        this._channel.subscribe("lockmouseup", function(data, envelope) {
            
            var key = data.value ? data.value : '';
            
            that.canvasMouseupLock =  key;
            
            if(key == '')
                that.canvasMouseupLocks.pop();
            else{
                if(that.canvasMouseupLocks.indexOf(key)==-1)
                    that.canvasMouseupLocks.push(key);
            }
            
        });
        
        this._channel.subscribe("lockmousedown", function(data, envelope) {
            var key = data.value ? data.value : '';
            
            that.canvasMousedownLock = key;
            
            if(key == '')
                that.canvasMousedownLocks.pop();
            else{
                if(that.canvasMousedownLocks.indexOf(key)==-1)
                    that.canvasMousedownLocks.push(key);
            }
        });
        
        this._channel.subscribe("lockmouseclick", function(data, envelope) {
            var key = data.value ? data.value : '';
            
            that.canvasMouseClickLock = key;
            
            if(key == '')
                that.canvasMouseClickLocks.pop();
            else{
                if(that.canvasMouseClickLocks.indexOf(key)==-1)
                    that.canvasMouseClickLocks.push(key);
            }
        });
        
        this._channel.subscribe("lockmousemove", function(data, envelope) {
            var key = data.value ? data.value : '';
            
            that.canvasMousemoveLock = key;
            
            if(key == '')
                that.canvasMousemoveLocks.pop();
            else{
                if(that.canvasMousemoveLocks.indexOf(key)==-1)
                    that.canvasMousemoveLocks.push(key);
            }
        });

    }

    this.InitGenericMouseClicks();
    
    this.InitNodePositioning();

    this.InitVis();
} 


AnnotaterView.prototype.InitGenericMouseClicks = function (){
    var key = '';
    
    var that = this;

    $("#myCanvas").dblclick(function (evt) {
        var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
        
        that.canvasMouseLastXClick = evt.clientX - boundingrec.left;
        that.canvasMouseLastYClick = evt.clientY - boundingrec.top;
        
        that._channel.publish( "doubleClick", { value: 
                {
                    x : that.canvasMouseLastXClick,
                    y : that.canvasMouseLastYClick
                } 
            } );
        
    });
    
},

 
AnnotaterView.prototype.GetKey = function (array){
    return array[array.length-1]!=undefined ? array[array.length-1] : '';
    
},
 
AnnotaterView.prototype.InitNodePositioning = function (state){
    
    var that = this;
    var key = 'NP';
    
    $("#myCanvas").click(function (evt) {
        if(that.GetKey(that.canvasMouseClickLocks) == key) {
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
            
            that.canvasMouseLastXClick = evt.clientX - boundingrec.left;
            that.canvasMouseLastYClick = evt.clientY - boundingrec.top;
            
            that._channel.publish( "positionClick", { value: 
                {
                    x : that.canvasMouseLastXClick,
                    y : that.canvasMouseLastYClick
                } 
            } );
        }
    });
    
    $("#myCanvas").mousedown(function (evt) {
        if(that.GetKey(that.canvasMousedownLocks) == key){
            that._channel.publish( "positionMouseDown", { value: evt } );
        }
    });

    $("#myCanvas").mouseup(function (evt) {
        if(that.GetKey(that.canvasMouseupLocks) == key)
            that._channel.publish( "positionMouseUp", { value: evt } );
    });

    $("#myCanvas").mousemove(function (evt) {
        //argh argh
        if(that.GetKey(that.canvasMousemoveLocks) == key){
           that._channel.publish( "positionMouseMove", { value: evt } );
        }
        
        evt.stopPropagation();
    });

},

AnnotaterView.prototype.InitVis = function (state){
    var that = this;
    var key = '';
    
    $("#myCanvas").click(function (evt) {
        if(that.GetKey(that.canvasMouseClickLocks) == key) {
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
            
            that.canvasMouseLastXClick = evt.clientX - boundingrec.left;
            that.canvasMouseLastYClick = evt.clientY - boundingrec.top;
            
            that._channel.publish( "visSingleClick", { value: 
                {
                    x : that.canvasMouseLastXClick,
                    y : that.canvasMouseLastYClick
                } 
            } );
        }
    });
    
    
    $("#myCanvas").mousedown(function (evt) {
        if(that.GetKey(that.canvasMousedownLocks) == key)
            that._channel.publish( "visMouseDown", { value: evt } );
    });

    $("#myCanvas").mouseup(function (evt) {
        if(that.GetKey(that.canvasMouseupLocks) == key)
            that._channel.publish( "visMouseUp", { value: evt } );
    });

    $("#myCanvas").mousemove(function (evt) {
        
        if(that.GetKey(that.canvasMousemoveLocks) == key){
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
    
            var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
        
            that._channel.publish( "visMouseMove", { value: _point } );
        }
         
    });
    
    
},

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

                 $('*[aria-describedby="map_message"]').css("width", "330px");
                 //$('*[aria-describedby="map_message"]').css("height", "300px");

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
                if(that.closeNodeEditor)
                    that.closeNodeEditor();
            } else {
                if(that.openNodeEditor)
                    that.openNodeEditor();
                    
                that.showImageUI = true;
            }
        });




        $('#show_layers').click(function (e) {

            if (that.showLayers) {
                $("#map_layers").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_layers"]').css("width", "293px");
           
                $("#map_layers").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showLayers = false;
            } else {
                $("#map_layers").dialog("close");
                that.showLayers = true;
            }
        });
        
       
        $('#map_layers').live("dialogclose", function(){
           that.showLayers = true;
        });



        $('#show_meta').click(function (e) {

            if (that.showmeta) {
                $("#map_metadata").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_metadata"]').css("width", "293px");
           
                $("#map_metadata").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showmeta = false;
            } else {
                $("#map_metadata").dialog("close");
                that.showmeta = true;
            }
        });
        
       
        $('#map_metadata').live("dialogclose", function(){
           that.showmeta = true;
        });

        $('#btnCancelMetaInfo').click(function (e) {
             $("#map_metadata").dialog("close");
                that.showmeta = true;
         });

        

        $('#show_options').click(function (e) {

            if (that.showoptions) {
                $("#map_options").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_options"]').css("width", "293px");
           
                $("#map_options").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showoptions = false;
            } else {
                $("#map_options").dialog("close");
                that.showoptions = true;
            }
        });
        
       
        $('#map_options').live("dialogclose", function(){
           that.showoptions = true;
        });

        $('#btnCancelOptions').click(function (e) {
             $("#map_options").dialog("close");
                that.showoptions = true;
         });


        $('#show_cropper').click(function (e) {

            if (that.showCropper) {
                $("#map_crop").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_options"]').css("width", "293px");
           
                $("#map_crop").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showCropper = false;
            } else {
                $("#map_crop").dialog("close");
                that.showCropper = true;
            }
        });
        
        $('#map_crop').live("dialogclose", function(){
           that.showCropper = true;
        });

        $('#btnCancelCropper').click(function (e) {
            $("#map_crop").dialog("close");
            that.showCropper = true;
        });



        $('#show_edges').click(function (e) {

            if (that.showEdges) {
                $("#map_edge_add").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_edge_add"]').css("width", "293px");
           
                $("#map_edge_add").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showEdges = false;
            } else {
                $("#map_edge_add").dialog("close");
                that.showEdges = true;
            }
        });

        $('#map_edge_add').live("dialogclose", function(){
           that.showEdges = true;
        });

        $('#btnCancelEdge').click(function (e) {
            $("#map_edge_add").dialog("close");
            that.showEdges = true;
        });
        
        
        $('#show_matcher').click(function (e) {

            if (that.showMatches) {
                $("#map_matches").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_matches"]').css("width", "350px");
           
                $("#map_matches").css("padding", "0px");
                $("#map_matches").css("height", "150px");
                //font-size: 1.1em; */
                that.showMatches = false;
            } else {
                $("#map_matches").dialog("close");
                that.showMatches = true;
            }
        });

        $('#map_matches').live("dialogclose", function(){
           that.showMatches = true;
        });

        $('#btnCancelMatches').click(function (e) {
            $("#map_matches").dialog("close");
            that.showMatches = true;
        });
        
        
        
        $('#show_textCreator').click(function (e) {

            if (that.showTextCreator) {
                $("#map_textFiles").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_textFiles"]').css("width", "293px");
           
                $("#map_textFiles").css("padding", "0px");
                $("#map_textFiles").css("height", "120px");
                
                //font-size: 1.1em; */
                that.showTextCreator = false;
            } else {
                $("#map_textFiles").dialog("close");
                that.showTextCreator = true;
            }
        });

        $('#map_textFiles').live("dialogclose", function(){
           that.showTextCreator = true;
        });

        $('#btnCancelTextFile').click(function (e) {
            $("#map_textFiles").dialog("close");
            that.showTextCreator = true;
        });
        
        
        
        $('#show_tools').click(function (e) {

            if (that.showToolBar) {
                $("#map_toolbar").dialog();

                $(".ui-widget-header").css("height", "7px");

                $(".ui-dialog-title").css("position", "absolute");
                $(".ui-dialog-title").css("top", "0px");
                $(".ui-dialog-title").css("left", "0px");

                $('*[aria-describedby="map_toolbar"]').css("width", "110px");
           
                $("#map_toolbar").css("padding", "0px");
                $("#map_toolbar").css("height", "400px");
                
                //font-size: 1.1em; */
                that.showToolBar = false;
            } else {
                $("#map_toolbar").dialog("close");
                that.showToolBar = true;
            }
        });

        $('#map_toolbar').live("dialogclose", function(){
           that.showToolBar = true;
        });

        $('#btnCancelToolBar').click(function (e) {
            $("#map_toolbar").dialog("close");
            that.showToolBar = true;
        });
    };

AnnotaterView.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
};
    
    
AnnotaterView.prototype.SaveNote = function (action) {

    var that = this;
    $('#btnSave').click(function (e) {
        that.GetTextAreaDetails(function(data){
           action(data); 
        });
        
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





AnnotaterView.prototype.NodeEditorOpen = function (caller) {
   this.openNodeEditor = caller;
    
},


AnnotaterView.prototype.NodeEditorClosed = function (caller) {
   this.closeNodeEditor = caller;
},








// ok so when this click happens we need to determine 
// if we're inside an existing node
// if so get the dims for that node.




AnnotaterView.prototype.DeleteNodeButton = function (action) {
    //here look multiple event firing problems    
    $("#delnodebtn").click(function (evt) {
        action();
    });
};

AnnotaterView.prototype.DeleteSingleNodeButton = function (action) {
    //here look multiple event firing problems    
    $("#delsinglenodebtn").click(function (evt) {
        action();
    });
};

AnnotaterView.prototype.AddNodeButton = function (action) {
    //here look multiple event firing problems    
    $("#addnodebtn").click(function (evt) {
        action();
    });
};

AnnotaterView.prototype.CancelNodeButton = function (action) {
    //here look multiple event firing problems    
    $("#btnNodeCancel").click(function (evt) {
        action();
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


// the options param is only used here for altering the note text area styling
AnnotaterView.prototype.AddDisplayNodeSelection = function (x,y,width,height,angle,note,options, keyChanged) {
    this.EditDisplayNodeSelection(x,y,width,height,angle,note,options, keyChanged);
};

AnnotaterView.prototype.EditDisplayNodeSelection = function (x,y,width,height,angle,note,options, keyChanged) {

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
        that.textarea.addEventListener('keyup', keyChanged);
        document.body.appendChild(that.textarea);
    }

    height = height -5;
    
    that.textarea.value = note;
    that.textarea.style.top = y + 'px';
    that.textarea.style.left = x + 'px';
    that.textarea.style.height = height + 'px';
    that.textarea.style.width = width + 'px';
    that.textarea.style.fontWeight = 'bold';

    that.textarea.style.transform = 'rotate('+ angle +'deg)';
    that.textarea.style.transformOrigin = '0% 0%';
    
    if(options.FontSize){
        if(options.FontSize > 25 ) options.FontSize = 25;
        
        $('textarea.info').css('font-size',options.FontSize + 'pt');
    }
    
    $('textarea.info').css('color',options.DefaultEditorFontColour);

    if(!options.IsTransparent)
        $('textarea.info').css('background-color',options.DefaultNoteColour);
    else
        $('textarea.info').css('background-color','transparent');
        //that.textarea.style.backgroundColor = 'transparent';  //that.textarea.style.backgroundColor = options.DefaultNoteColour;
    
    $('textarea.info').css('border-color',options.DefaultEditorBorderColour);
     
};

AnnotaterView.prototype.ClearActiveTextArea = function () {
    
    if(this.textarea!= null)
    {
        $(this.textarea).remove();
        this.textarea =null;
    }
};

AnnotaterView.prototype.GetTextAreaDetails = function (callback) {
    
    
    if(this.textarea!= null)
    {
        var that = this;
        
        this._channel.publish( "RequestOptions", { value: true } );
        
        this._channel.subscribe("SelectedOptions", function(data, envelope) {
            
            var y = $(that.textarea).css( "top").replace("px","");
            var h = $(that.textarea).css( "height").replace("px","");
            var x = $(that.textarea).css( "left").replace("px","");
            var w = $(that.textarea).css( "width").replace("px","");
            
            var text = $(that.textarea).val();
             
            
            var angleUtils = new AngleUtils();
            
            // this needs changing to get this stuff out of the model!
           
            var result = {
                "x" : x,
                "y" : y,
                "width" : Number(w)+5,
                "height" : h,
                "d":angleUtils.getAngle(),
                "text" : text,
                "options" : data.value
            };
            
            callback(result);
        });
        
    }
};


/*MATCH STUFF*/

AnnotaterView.prototype.QrySetMatches = function(callback){
    $('#btnSetMatches').click(function (e) {
        callback();
    });
};

AnnotaterView.prototype.QryClearDeleted = function(callback){
    $('#btnCleanMatches').click(function (e) {
        callback();
    });
};

//DEBUG STUFF

//CALLED FROM MODEL AND UPDATES OPTIONS DATA TO UI
AnnotaterView.prototype.UpdateInfoWindow = function(data){
    
    if(data!=undefined){
        $("#map_image").html(data.title);
        $("#map_zoom").html(data.zoomlevel);
        $("#map_dims").html(data.dims);
        $("#map_noteCount").html(data.noteCount);
        $("#map_count").html(data.size);
    }
};



AnnotaterView.prototype.QryRunScaleToScreen = function(callback){
    
     $('#btnDebugScaleToScreen').click(function (e) {
         
        var data= $("#txtDebugData").val();
        
        callback(data);
    });
};
 
AnnotaterView.prototype.QryRunMoveNode = function(callback){
    
     $('#btnDebugMoveNode').click(function (e) {
         
        var data= $("#txtDebugData").val();
        
        callback(data);
    });
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

