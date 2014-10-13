/** @constructor */
function SelectorImager(diagramRunner) {       
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



    
    
SelectorImager.prototype.newFileLoaded = function (treedate) {

        treedate();
    };

 
   
SelectorImager.prototype.RunDiagClicked = function (personId, action) {
    $('#btnRunImage').click(function (e) {

            action(personId);

            e.preventDefault();
        });
    };
    

    
SelectorImager.prototype.InitPanelVisibility = function () {


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

                $('*[aria-describedby="dataLoader"]').css("width", "350px");
                $('*[aria-describedby="dataLoader"]').css("height", "600px");
                
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

SelectorImager.prototype.hideLoader = function (action) {

    $("#imageLoader").dialog("close");         
};
    
    
SelectorImager.prototype.Save = function (action) {

        var that = this;
        $('#btnSaveNote').click(function (e) {
            action();
            e.preventDefault();
        });               
    };
    
SelectorImager.prototype.Cancel = function (action) {
        var that = this;
        $('#btnCancel').click(function (e) {
            action();

            e.preventDefault();
        });
    };
    
SelectorImager.prototype.Add = function (action) {
        var that = this;
        $('#btnAddNote').click(function (e) {
            action();

            e.preventDefault();
        });
    };

SelectorImager.prototype.Delete = function (action) {
    var that = this;
    $('#btnDeleteNote').click(function (e) {            
        action();
        e.preventDefault();
    });        
};

// ok so when this click happens we need to determine 
// if we're inside an existing node
// if so get the dims for that node.

SelectorImager.prototype.CanvasClick = function (action) {
    var that = this;

    $("#myCanvas").click(function (evt) {
        var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
        
        action(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
    });
};

SelectorImager.prototype.CanvasMouseUp = function (action) {
       
        $("#myCanvas").mouseup(function (evt) {
                evt.preventDefault();
               action();
        });
        
    };

SelectorImager.prototype.CanvasMouseDown = function (action) {
        
        $("#myCanvas").mousedown(function (evt) {
                evt.preventDefault();
                action();
        });
        
    };
    
SelectorImager.prototype.CanvasMouseMove = function (action) {
       
        $("#myCanvas").mousemove(function (evt) {
              
                var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();

                var _point = new Array(evt.clientX - boundingrec.left, evt.clientY - boundingrec.top);
            
                action(_point);
         });
    };
    
SelectorImager.prototype.ButtonPressDown = function (action) {

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

SelectorImager.prototype.ButtonPressUp = function (action) {

        var that = this;
        
        $(".button_box").mouseup(function () {
            action(that.millisecondsInterval);
        });
        
};

SelectorImager.prototype.Dispose = function (action) {

        $("#myCanvas").unbind();
        $(".button_box").unbind();
        
        action();
};

SelectorImager.prototype.DisplayNodeSelection = function (x,y,width,height,note) {

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
        // so what pass in a call back
        
        // handle textarea load here like with perform click
};

SelectorImager.prototype.ClearActiveTextArea = function () {
    
    if(this.textarea!= null)
    {
        $(this.textarea).remove();
        this.textarea =null;
    }
};

SelectorImager.prototype.DisplayUpdateNoteAdd = function () {

    $("#btnAddNote").toggle();
    $("#btnCancel").toggle();
};

SelectorImager.prototype.DisplayUpdateSave= function () {

    $("#btnSaveNote").show();
};

SelectorImager.prototype.DisplayUpdateDelete= function () {

    $("#btnDeleteNote").show();
};