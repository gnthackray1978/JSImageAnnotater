
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

        this._channel.subscribe("ClearActiveTextArea", function(data, envelope) {
            that.ClearActiveTextArea();
        });
        
        this._channel.subscribe("EditDisplayNodeSelection", function(data, envelope) {
            var p = data.value;
            
            that.EditDisplayNodeSelection(p.x,
                                        p.y,
                                        p.w,
                                        p.h,
                                        p.d,
                                        p.a,
                                        p.o,
                                        p.fnTextChanged);
        });
        
        this._channel.subscribe("AddDisplayNodeSelection", function(data, envelope) {
            var p = data.value;
            
            that.AddDisplayNodeSelection(p.x,
                                        p.y,
                                        p.w,
                                        p.h,
                                        p.d,
                                        p.a,
                                        p.o,
                                        p.fnTextChanged);
        });
    }

    this.InitGenericMouseClicks();
    
    this.InitNodeManager();

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

AnnotaterView.prototype.InitNodeManager = function (state){
    var that = this;
    
    $('#btnDeleteNote').click(function (e) {            
        that._channel.publish( "nmDelete", { value: e} );
        e.preventDefault();
    });
    
    $('#btnAddNote').click(function (e) {
        that._channel.publish( "nmAdd", { value: e} );
        e.preventDefault();
    });
    
    $('#btnCancel').click(function (e) {
        that._channel.publish( "nmCancel", { value: e} );
        e.preventDefault();
    });
    
    $("#delnodebtn").click(function (e) {
        that._channel.publish( "nmDelBtn", { value: e} );
        e.preventDefault();
    });
    
    $("#delsinglenodebtn").click(function (e) {
        that._channel.publish( "nmDelSng", { value: e} );
        e.preventDefault();
    });
    
    $("#addnodebtn").click(function (e) {
        that._channel.publish( "nmAddNode", { value: e} );
        e.preventDefault();
    });
    
    $("#btnNodeCancel").click(function (e) {
        that._channel.publish( "nmNodeCancel", { value: e} );
        e.preventDefault();
    });
    
    $('#btnSave').click(function (e) {
        that.GetTextAreaDetails(function(data){
           that._channel.publish( "nmSave", { value: data} );
        });
        e.preventDefault();
    }); 
},

AnnotaterView.prototype.InitPanelVisibility = function () {


    var that = this;

    $("#minimized_options").removeClass("hidePanel").addClass("displayPanel");
      
    var createDialog = function(buttonId,dialogUI, displaySwitch, className, closeButton){
            
            $(buttonId).click(function (e) {
                if (displaySwitch) {
              
                    $(dialogUI).dialog();
                    $(dialogUI).closest('.ui-dialog').addClass(className);
                    
                    displaySwitch = false;
                } else {
              
                    $(dialogUI).dialog("close");
                    displaySwitch = true;
                }
            });
            
            $(buttonId).live("dialogclose", function(){
                displaySwitch = true;
            });
            
            if(closeButton){
                $(closeButton).click(function (e) {
                    $(dialogUI).dialog("close");
                        displaySwitch = true;
                });
            }
        };
        
    createDialog('#show_controls',"#map_control",that.showMapControls,'controldialog');

    createDialog('#show_debugbox',"#map_message",that.showDebug,'debugdialog');

    createDialog('#show_imageUI',"#map_imageUI",that.showImageUI,'uidialog');
    
    createDialog('#show_layers',"#map_layers",that.showLayers,'layersdialog');

    createDialog('#show_meta',"#map_metadata",that.showmeta,'metadialog','#btnCancelMetaInfo');

    createDialog('#show_options',"#map_options",that.showoptions,'optionsdialog','#btnCancelOptions');

    createDialog('#show_cropper',"#map_crop",that.showCropper,'cropdialog','#btnCancelCropper');

    createDialog('#show_edges',"#map_edge_add",that.showEdges,'edgesdialog','#btnCancelEdge');

    createDialog('#show_matcher',"#map_matches",that.showMatches,'matchesdialog','#btnCancelMatches');

    createDialog('#show_textCreator',"#map_textFiles",that.showTextCreator,'textdialog','#btnCancelTextFile');

    createDialog('#show_tools',"#map_toolbar",that.showToolBar,'toolbardialog','#btnCancelToolBar');

};

AnnotaterView.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
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
