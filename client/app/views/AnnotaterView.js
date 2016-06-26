
/*CRUD related
  add edit delete nodes
*/

/** @constructor */
function AnnotaterView(channel) {       
   
    this.textarea = null;
    this._channel = channel;

 
    this.millisecondsInterval =1000;
 
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
        
        
        this._channel.subscribe("deactivateFocusedSelection", function(data, envelope) {
            that.DeSelectSingleDelete();            
        });
        
        this._channel.subscribe("activateFocusedSelection", function(data, envelope) {
            that.SelectSingleDelete();            
        });
    }

 
    this.InitNodeManager();

    this.InitVis();
    
    
} 

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
    
    //var that = this;
    
    $("#up").mousedown(function (evt) {
        that._channel.publish( "visZoomInButton", { value: undefined } );
    });
    
    $("#dn").mousedown(function (evt) {
        that._channel.publish( "visZoomOutButton", { value: undefined } );
    });
    
    
    
    $("#we").mousedown(function (evt) {
        that._channel.publish( "visLeftButton", { value: undefined } );
    });
    
    $("#es").mousedown(function (evt) {
        that._channel.publish( "visRightButton", { value: undefined } );
    });
    
    $("#so").mousedown(function (evt) {
        that._channel.publish( "visDownButton", { value: undefined } );
    });
    
    $("#no").mousedown(function (evt) {
        that._channel.publish( "visUpButton", { value: undefined } );
    });
    
    $(".button_box").mouseup(function () {
        that._channel.publish( "visButtonReleased", { value: undefined } );
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
        that._shout('View btnSave event','Save pressed');
        that.GetTextAreaDetails(function(data){
            that._shout('View btnSave event','Save Text Area details sent');
            that._channel.publish( "nmSave", { value: data} );
        });
        e.preventDefault();
    }); 
},


// the options param is only used here for altering the note text area styling
AnnotaterView.prototype.AddDisplayNodeSelection = function (x,y,width,height,angle,note,options, keyChanged) {
    this.EditDisplayNodeSelection(x,y,width,height,angle,note,options, keyChanged);
};

AnnotaterView.prototype.EditDisplayNodeSelection = function (x,y,width,height,angle,note,options, keyChanged) {

    var that = this;
    var mouseDownOnTextarea = function (e) {
        console.log('mouse down');
        var x = that.textarea.offsetLeft - e.clientX,
            y = that.textarea.offsetTop - e.clientY;
        function drag(e) {
            console.log('mouse drag');
            that.textarea.style.left = e.clientX + x + 'px';
            that.textarea.style.top = e.clientY + y + 'px';
        }
        function stopDrag() {
            console.log('mouse stop drag');
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    };

    if (!that.textarea) {
        console.log('!that.textarea');
        that.textarea = document.createElement('textarea');
        that.textarea.className = 'info';
        that.textarea.addEventListener('mousedown', mouseDownOnTextarea);
        that.textarea.addEventListener('keyup', keyChanged);
        document.body.appendChild(that.textarea);
    }

    height = height -5;
    
    console.log('EditDisplayNodeSelection');
    
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

AnnotaterView.prototype.SelectSingleDelete= function () {
    $("#delsinglenodebtn").val('[DC]');
};

AnnotaterView.prototype.DeSelectSingleDelete= function () {
    $("#delsinglenodebtn").val('DC');
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
 
AnnotaterView.prototype._shout = function(method, message){
    this._channel.publish( "DebugMessage", {name : 'SLC' , description : method + '.'+ message } );
};