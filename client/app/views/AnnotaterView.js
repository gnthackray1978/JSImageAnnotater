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

 
   
AnnotaterView.prototype.RunDiagClicked = function (personId, action) {
    $('#btnRunImage').click(function (e) {

            action(personId);

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

                $('*[aria-describedby="imageLoader"]').css("width", "330px");
                $('*[aria-describedby="imageLoader"]').css("height", "330px");
                
                $("#fileList").css("width", "260px");
                
                
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

                $('*[aria-describedby="map_imageUI"]').css("width", "250px");
           
                $("#map_imageUI").css("padding", "0px");
                
                //font-size: 1.1em; */
                that.showImageUI = false;
            } else {
              
                that.showImageUI = true;
            }
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

AnnotaterView.prototype.DisplayNodeSelection = function (x,y,width,height,note) {

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
        var t = $(this.textarea).css( "top").replace("px","");
        var b = $(this.textarea).css( "height").replace("px","");
        var l = $(this.textarea).css( "left").replace("px","");
        var r = $(this.textarea).css( "width").replace("px","");
        var text = $(this.textarea).val();
        
        b = Number(t) + Number(b);
        r = Number(l) + Number(r);
        
        var result = {
            "y1" : t,
            "y2" : b,
            "x1" : l,
            "x2" : r,
            "text" : text
        };
        
        
        return result;
    }
};

AnnotaterView.prototype.DisplayUpdateNoteAdd = function () {

    $("#btnAddNote").toggle();
    $("#btnCancel").toggle();
};

AnnotaterView.prototype.DisplayUpdateSave= function () {

    $("#btnSaveNote").show();
};

AnnotaterView.prototype.DisplayUpdateDelete= function () {

    $("#btnDeleteNote").show();
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
        $( "select option:selected" ).each(function() {
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
        
        var str = "";
        $( "select option:selected" ).each(function() {
          str = $( this ).val();
        });
        
      
        action(str);
        
        that.hideLoader();
        
        e.preventDefault();
    });        
};