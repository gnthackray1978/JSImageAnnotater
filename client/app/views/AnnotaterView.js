var postal;

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
function AnnotaterView() {       
   
    this.textarea = null;
 
   
    this._pickEnabled =false;
    this.showGed = true;
    this.showMapControls = true;
    this.showDebug = true;
    this.showDataControls = true;
    this.showImageUI = true;
    this.showLayers = true;
    this.showmeta = true;
    this.showoptions = true;
    this.showCropper = true;
    this.dataLoader = true;
    this.millisecondsInterval =1000;
    this.selectedFontChanged;
    
    
    this.layerButtonCallback;
    this.layerInputCallback;
    this.metaButtonCallback;
    
    this.canvasMouseupLock ='';
    this.canvasMousedownLock ='';
    this.canvasMousemoveLock ='';
    this.canvasMouseclickLock ='';
    
    this.cropperLockKey = 'CROP';
    
    if(postal)
        this.channel = postal.channel("canvas");
} 

AnnotaterView.prototype.LockCanvasMouseUp = function (state){
    //console.log('LockCanvasMouseUp: ' + state);
    this.canvasMouseupLock =  state ? state : '';
},
AnnotaterView.prototype.LockCanvasMouseDown = function (state){
    //console.log('LockCanvasMouseDown: ' + state);
    this.canvasMousedownLock = state ? state : '';
},
AnnotaterView.prototype.LockCanvasMouseMove = function (state){
    //console.log('LockCanvasMouseMove: ' + state);
    this.canvasMousemoveLock = state ? state : '';
},
AnnotaterView.prototype.LockCanvasMouseClick = function (state){
   // console.log('LockCanvasMouseClick: ' + state);
    this.canvasMouseclickLock = state ? state : '';
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

    };



AnnotaterView.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
};
    
    
AnnotaterView.prototype.SaveNote = function (action) {

    var that = this;
    $('#btnSaveNote').click(function (e) {
        action(that.GetTextAreaDetails());
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

AnnotaterView.prototype.UpdateCanvas = function (caller, data) {
   // console.log('canvas publish');
    if(this.channel){
        this.channel.publish("canvas", {
            caller: caller,
            data: data
        });
    }
},

AnnotaterView.prototype.CanvasUpdated = function (action) {
    
    if(this.channel){
        var subscription = this.channel.subscribe("canvas", function(data, envelope) {
            /*do stuff with data */
        //    console.log('calling draw');
            action();
        });
    }

};


// ok so when this click happens we need to determine 
// if we're inside an existing node
// if so get the dims for that node.

AnnotaterView.prototype.CanvasClick = function (action) {
    var that = this;
    //here look multiple event firing problems    
    $("#myCanvas").click(function (evt) {
        if(that.canvasMouseclickLock == ''){
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
            action(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
        }
    });
};

AnnotaterView.prototype.CanvasMouseUp = function (action) {
    var that = this;
    
    $("#myCanvas").mouseup(function (evt) {
        if(that.canvasMouseupLock == ''){
            evt.preventDefault();
            action();
        }
    });
};

AnnotaterView.prototype.CanvasMouseDown = function (action) {
    var that = this;
    
    $("#myCanvas").mousedown(function (evt) {
        if(that.canvasMousedownLock == ''){
            evt.preventDefault();
            action();
        }
    });
};
    
    
AnnotaterView.prototype.CanvasMouseMove = function (action) {
    var that = this;
    
    $("#myCanvas").mousemove(function (evt) {
        if(that.canvasMousemoveLock == ''){
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
    
            var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
        
            action(_point);
        }
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
        
      
       // that.textarea.style.color = options.DefaultEditorFontColour;
        
        if(!options.IsTransparent)
            $('textarea.info').css('background-color',options.DefaultNoteColour);
        else
            $('textarea.info').css('background-color','transparent');
            //that.textarea.style.backgroundColor = 'transparent';  //that.textarea.style.backgroundColor = options.DefaultNoteColour;
        
        $('textarea.info').css('border-color',options.DefaultEditorBorderColour);
       // this.textarea.style.borderColor = options.DefaultEditorBorderColour;
        
        
        
        // enable buttons to control formatting of newly created textarea
        
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
         
        
        var angleUtils = new AngleUtils();
        
        // this needs changing to get this stuff out of the model!
        var options = this._getOptionDetails(true);
        
        var result = {
            "x" : x,
            "y" : y,
            "width" : Number(w)+5,
            "height" : h,
            "d":angleUtils.getAngle(),
            "text" : text,
            "options" : options
        };
        
        
        return result;
    }
};


//CALLED FROM MODEL AND UPDATES OPTIONS DATA TO UI
AnnotaterView.prototype.UpdateInfoWindow = function(data){
    
    $("#map_image").html(data.title);
    $("#map_zoom").html(data.zoomlevel);
    $("#map_dims").html(data.dims);
    $("#map_noteCount").html(data.noteCount);
    $("#map_count").html(data.size);
      
};

// LAYERS
AnnotaterView.prototype.SetLayers= function (layers){
    
        
    var idx =0;
    
    var constructRow = function(id, name, visible, current,order){
        
        var html = '<div class = "row">';
        
       
        if(current)
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "current"  value = "S" style="color:green "></div>';
        else
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "current"  value = "s" style="color: red"></div>';
            
        if(visible)
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "visible" value = "V" style="color: green"></div>';
        else
            html +=  '<div class = "col letter"><input type="submit" data-id = "'+ id +'" data-prop = "visible"  value = "v" style="color: red"></div>';

        html +=  '<div class = "col name"><input type="text" data-id = "'+ id +'" data-prop = "name"  value = "'+ name +'"/></div>';
        html +=  '<div class = "col order"><input  type="text" data-id = "'+ id +'" data-prop = "order"  value = "'+ order +'"/></div>';
        
      
        html +=  '<div class = "col letter"><input  type="submit" data-id = "'+ id +'"  data-prop = "delete" value = "X"/></div>';
        
        html += '</div>';
        html += '<br/>';
        
        return html;
    };
    
    var content ='';
    while(idx < layers.length){
        content += constructRow(layers[idx].id, layers[idx].name, layers[idx].visible, layers[idx].current,layers[idx].order);
        idx++;
    }
    
    $('#layerslist').html(content);
    
    if(this.layerInputCallback)
        this.QryInputState(this.layerInputCallback)
    
    if(this.layerButtonCallback)
        this.QryLayerButtonState(this.layerButtonCallback)
};

AnnotaterView.prototype.QryNewState = function (callback) {
   
    $('#btnNewLayer').click(function (e) {
        callback();
    });
};

AnnotaterView.prototype.QrySaveState = function (callback) {
   
    $('#btnSaveLayers').click(function (e) {
        callback();
    });
};

AnnotaterView.prototype.QryInputState = function (callback) {
   
   
    
    this.layerInputCallback=callback;
   
    $( "#layerslist input[type='text']" ).change(function(e) {
        var d;
 
        if($(e.target).data().prop == 'name'){
            d = {
                id: $(e.target).data().id,
                value: $(e.target).val(),
                type : 'name'
            };
            callback(d);
        }
        
        if($(e.target).data().prop == 'order'){
           
            d = {
                id: $(e.target).data().id,
                value: $(e.target).val(),
                type : 'order'
            };
            
            callback(d);
        }
    });

   
};

AnnotaterView.prototype.QryLayerButtonState = function (callback) {
   
    this.layerButtonCallback=callback;
   
    $('#layerslist input').click(function (e) {
        console.log(e);
        //which button was pressed 
        //rowid
        //property being changed
        //new value
        var n,d;
 
        
        if($(e.target).data().prop == 'current'){
            if($(e.target).val() =='S')
                n= false;
            else
                n =true;
                
            d = {
                id: $(e.target).data().id,
                value: n,
                type : 'current'
            };
            callback(d);
        }
        
        if($(e.target).data().prop == 'visible'){
            if($(e.target).val() =='V')
                n= false;
            else
                n =true;
        
            d = {
                id: $(e.target).data().id,
                value: n,
                type : 'visible'
            };
            
            callback(d);
        }
        
        if($(e.target).data().prop == 'delete'){
            d = {
                id: $(e.target).data().id,
                value: '',
                type : 'delete'
            };
            
            callback(d);
        }
        
    }); 
};

//CROPPER

AnnotaterView.prototype.SetAddButtonCancel = function(){
    $("#btnAddCropping").prop('value', 'Cancel'); 
};

AnnotaterView.prototype.SetAddButtonAdd = function(){
    $("#btnAddCropping").prop('value', 'Add'); 
};


AnnotaterView.prototype.SetCropSaveEnabled = function(){
    $("#btnSaveCrop").show(); 
};

AnnotaterView.prototype.SetCropSaveDisabled = function(){
    $("#btnSaveCrop").hide(); 
};



AnnotaterView.prototype.QryCropSaveButton = function(action){
   
    $('#btnSaveCrop').click(function (e) {            
        e.preventDefault();
        action();
    });   
};

AnnotaterView.prototype.QryCropAddButton = function(action){
   
    $('#btnAddCropping').click(function (e) {            
        e.preventDefault();
        action();
    });   
};

AnnotaterView.prototype.QryCropDeleteButton = function(action){
  
    $('#btnDeleteCropping').click(function (e) {            
        e.preventDefault();
        action();
    });   
};


AnnotaterView.prototype.QryCropSaveButton = function(action){

    $('#btnSaveCrop').click(function (e) {            
        e.preventDefault();
        action();
    });   
};



AnnotaterView.prototype.QryCanvasMouseDown= function (action) {
    var that = this;
    
    $("#myCanvas").mousedown(function (evt) {
        if(that.canvasMousedownLock == that.cropperLockKey)
            action(evt);
    });
};

AnnotaterView.prototype.QryCanvasMouseUp= function (action) {
    var that = this;
    
    $("#myCanvas").mouseup(function (evt) {
        if(that.canvasMouseupLock == that.cropperLockKey)
            action(evt);
    });
};

AnnotaterView.prototype.QryCanvasMouseMove = function (action) {
    var that = this;
    
    //   $("#myCanvas").mousemove(function (evt) {
    //     if(this.canvasMousemoveLock == ''){
    //         var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
    
    //         var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
        
    //         action(_point);
    //     }
    // });
    
    $("#myCanvas").mousemove(function (evt) {
       // console.log('QryCanvasMouseMove: ' + that.canvasMousemoveLock +' ' + that.cropperLockKey);
        if(that.canvasMousemoveLock == that.cropperLockKey){
            //console.log('QryCanvasMouseMove: ' + that.canvasMousemoveLock +' ' + that.cropperLockKey);
            action(evt);
        }
    });
};



//METADATA
AnnotaterView.prototype.SetMetaData= function (metaData){
     
    var idx =0;
    
    var constructRow = function(id, descrip){
        var html = '<option value = '+ id +' >'+ descrip+'</option>';
 
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < metaData.length){
        metaContent += constructRow(metaData[idx].id, metaData[idx].name);
        idx++;
    }

    $('#metatypesList').html(metaContent);
    
    // if(this.layerInputCallback)
    //     this.QryInputState(this.layerInputCallback)
    
    // if(this.layerButtonCallback)
    //     this.QryLayerButtonState(this.layerButtonCallback)
};

AnnotaterView.prototype.SetSelectedMetaData= function (dataTypes){
     var idx =0;
    
   
    
    var constructRow = function(id, descrip,short){
        var html = '<div class = "row">';
        html += '<div class = "col node-col" data-id = '+ id +' >'+ descrip+'</div>';
        html += '<div class = "col short-col">'+ '{' +short+ '}' + '</div>';
        html += '<div class = "col del-col"><a href="" data-id = "'+ id +'" data-prop = "delete">delete</a> </div>';
        html += '</div>';
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < dataTypes.length){
        metaContent += constructRow(dataTypes[idx].meta.id, dataTypes[idx].meta.name, dataTypes[idx].template.short);
        idx++;
    }

    $('#selectedMetatypesList').html(metaContent);
    
    if(this.metaButtonCallback)
        this.QryDeleteButtonState(this.metaButtonCallback);
};

AnnotaterView.prototype.SetTemplates= function (dataTypes){
     
    var idx =0;
    
    var constructRow = function(id, descrip){
        var html = '<option value = '+ id +' >'+ descrip+'</option>';
 
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < dataTypes.length){
        metaContent += constructRow(dataTypes[idx].id, dataTypes[idx].name);
        idx++;
    }

    $('#templateList').html(metaContent);
    
    // if(this.layerInputCallback)
    //     this.QryInputState(this.layerInputCallback)
    
    // if(this.layerButtonCallback)
    //     this.QryLayerButtonState(this.layerButtonCallback)
};

AnnotaterView.prototype.SetEnabledState= function (state){
    if(state)
    {
        $("#meta-group-active").show(); 
        $("#meta-group-inactive").hide();
    }
    else
    {
        $("#meta-group-active").hide(); 
        $("#meta-group-inactive").show();
    }
};


AnnotaterView.prototype.QryMetaState = function (callback){
    
     var currentComponent =1;
 
    $("#metatypesList")
      .change(function () {
        // console.log('colour component changed: '+ str);
        
        currentComponent = $( "#metatypesList option:selected" ).val();
        
        callback(currentComponent);
    })
    
    .change();
}; 

AnnotaterView.prototype.QryTemplateState = function (callback){
    var currentComponent =1;
    $("#templateList")
      .change(function () {
        currentComponent = $( "#templateList option:selected" ).val();
        callback(currentComponent);
    })
    .change();
}; 

AnnotaterView.prototype.QryAddButtonState = function (callback){
    
     $('#btnSaveMetaInfo').click(function (e) {
            callback(true);
     });
}; 

AnnotaterView.prototype.QryDeleteButtonState = function (callback){
     this.metaButtonCallback=callback;
     
     $('#selectedMetatypesList a').click(function (e) {
        
        if($(e.target).data().prop == 'delete'){
            var d = {
                id: $(e.target).data().id,
                value: '',
                type : 'delete'
            };
            
            callback(d);
        }
        
        return false;
     });
}; 

AnnotaterView.prototype.QrySaveButtonState = function (callback){
     $('#btnSaveMetaInfo').click(function (e) {
        callback();
     });
}; 



//OPTIONS


AnnotaterView.prototype._getOptionDetails= function (includeColour){
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

//

AnnotaterView.prototype.AngleChangeClicked = function (action) {
    
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



/*COMMANDS*/

// AnnotaterView.prototype.SetOptionsState= function (state){
  
// };

AnnotaterView.prototype.SetOptions = function(options, currentColour){

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

AnnotaterView.prototype.SetChosenColour = function (hex) {
    $("#txtChosenColour").val(hex);
    $("#txtChosenColour").css("background-color", "#"+hex);
};

AnnotaterView.prototype.SetColourComponents = function (data){
 
    var output = [];
    
    $.each(data, function(key, value)
    {
      output.push('<option value="'+ value.id +'">'+ value.name +'</option>');
    });

    $('#colourComponentList').html(output.join(''));

  //  var myDDL = $('#colourComponentList');
   // myDDL[0].selectedIndex = 0;
}

AnnotaterView.prototype.SetDefaultOptionsUI = function (state) {
        
    // this clicks turns on and off default option mode.
   
    // if(state){
    //     $("#optionGroup").hide();
    //     $("#btnAddNote").show();
    //     $("#btnDeleteNote").show();
    //     $('#btnSaveOptions').hide();
    //     $('#btnPickColour').hide();
    //     $("#btnOptions").val('Options');
    // }
    // else
    // {
    //     $("#optionGroup").show();
    //     $("#btnAddNote").hide();
    //     $("#btnDeleteNote").hide();
    //     $('#btnSaveOptions').show();
    //     $('#btnPickColour').show();
    //     $("#btnOptions").val('Cancel');
    // }
    
    // var myDDL = $('#colourComponentList');
    // myDDL[0].selectedIndex = 0;
    $("#angleGroup").show(); 
    $("#optionGroup").show();
    $('#btnPickColour').show();
        
    if(state)
    {
        $("#options-label").html('Options');
    }
    else
    {
        $("#options-label").html('Default Options');
    }
};


/*QUERIES*/

//LIST CHANGED AND UI UPDATED
AnnotaterView.prototype.QrySelectedColourComponent = function (action) {
    //var that = this;
    var currentComponent =1;

    $( "#colourComponentList option:selected" ).each(function() {
        currentComponent = $( this ).val();
    });
    
    $("#colourComponentList")
      .change(function () {
        // console.log('colour component changed: '+ str);
        
        currentComponent = $( "#colourComponentList option:selected" ).val();
        
        action(currentComponent);
    })
    .change();
};

// when picker button clicked this triggers event on model
AnnotaterView.prototype.QryPickedColour = function (clickResult) {
            
    var that = this;
    
    // http://www.javascripter.net/faq/rgbtohex.htm
    function rgbToHex(R,G,B) {
        
        return toHex(R)+toHex(G)+toHex(B)
        
    }
            
    function toHex(n) {
        n = parseInt(n,10);
        if (isNaN(n)) return "00";
        n = Math.max(0,Math.min(n,255));
        return "0123456789ABCDEF".charAt((n-n%16)/16)  + "0123456789ABCDEF".charAt(n%16);
    }
            
    //here look multiple event firing problems        
    $('#myCanvas').click(function(event){
        // getting user coordinates
        
       // console.log("QryPickedColour.click");
        if(that._pickEnabled)
        {
            event.stopImmediatePropagation();

            var canvas = document.getElementById('myCanvas').getContext('2d');
            
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop;
            
            // getting image data and RGB values
            var img_data = canvas.getImageData(x, y, 1, 1).data;
          
            var R = img_data[0];
            var G = img_data[1];
            var B = img_data[2];  
            var rgb = R + ',' + G + ',' + B;
            
            // convert RGB to HEX
            var hex = rgbToHex(R,G,B);
            // making the color the value of the input
           
            that.SetChosenColour(hex);
           
            if(clickResult)
                clickResult(rgb,hex);
            
            that._pickEnabled = false;                        
        }
    });

};

AnnotaterView.prototype.QryPickState = function (callback) {
    var that = this;
    
    $('#btnPickColour').click(function (e) {
        that._pickEnabled =true;
        callback(true);
    }); 
};

//SAVE DEFAULT OPTIONS CLICKED
AnnotaterView.prototype.QryDefaultOptions = function(action){
    var that = this;
    $('#btnSaveOptions').click(function (e) {            
        e.preventDefault();
        action(that._getOptionDetails());
    });   
};
 
AnnotaterView.prototype.QrySelectedFontChanged = function (action) {
     var that = this;
    // $("#fontSelect")
    //   .change(function () {
    //     action(that._getOptionDetails());
    // })
    // .change();
    
    this.selectedFontChanged = function(style){
        console.log('font changed');
        action($('#fontSelect').fontSelector('selected'));
    };
    
    
};

AnnotaterView.prototype.QryTransparencyChanged = function (action) {
    var that = this;
    $("#chkTransparentBackground")
      .change(function () {
        action($("#chkTransparentBackground").is(":checked"));
    })
    .change();
};








/*
URL

*/


//USER CLICKS ADD
AnnotaterView.prototype.DisplayUpdateNoteAdd = function (status) {
    
    
    console.log('DisplayUpdateNoteAdd: ' + status);
    if(!status){
        $("#imagelabel").html('select edit mode');
        
        // $("#angleGroup").hide(); 
        // $("#optionGroup").hide();
        // $('#btnPickColour').hide();
    }
    else
    {
        $("#imagelabel").html('click drawing to add');
        
    }
   // $("#btnOptions").toggle();
    $("#btnAddNote").toggle();
    $("#btnCancel").toggle();
    //btnSaveNote
    $("#btnSaveNote").toggle();
    
    //btnDeleteNote
    $("#btnDeleteNote").toggle();
    

};

//USER CLICKS DELETE
AnnotaterView.prototype.DisplayUpdateDelete= function (status) {
    console.log('View DisplayUpdateDelete: ' + status);
     
    //controllabel btnSaveNote
    if(!status){
        $("#imagelabel").html('select mode');
        $("#btnDeleteNote").val('Delete');
    }
    else
    {
        $("#imagelabel").html('Click note to delete');
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