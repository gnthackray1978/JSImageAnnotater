

var SelectionView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    //this.PublishSelectedColourComponent();

    var selectionChange = function(count){
        //console.log('selectionChange: ' + count);
        
        if(count >0){
            that.DisplaySelectionDelete(false);
        }
        else
        {
            that.DisplaySelectionDelete(true);
        }
    };
    
    

    this._channel.subscribe("DisplayRectangleSelection", function(data, envelope) {
        that.DisplayRectangleSelection(data.value);
    });
    this._channel.subscribe("DisplaySelectionState", function(data, envelope) {
        that.DisplaySelectionState();            
    });
    this._channel.subscribe("DisplaySelectionDelete", function(data, envelope) {
        that.DisplaySelectionDelete(data.value);            
    });
    

    
    this._channel.subscribe("DisplayAddState", function(data, envelope) {
        that.DisplayAddState();            
    });
    this._channel.subscribe("DisplaySaveState", function(data, envelope) {
        that.DisplaySaveState();            
    });
    this._channel.subscribe("DisplayNeutralState", function(data, envelope) {
        that.DisplayNeutralState();            
    });

    this._channel.subscribe("DisplaySingleSelection", function(data, envelope) {
        that.DisplaySingleSelection(data.value);            
    });
    
    
    this._channel.subscribe("multiselectingend", function(data, envelope) {
        selectionChange(data.value);
        
    });
    
    this._channel.subscribe("nodeselected", function(data, envelope) {
        selectionChange(data.value);
        
    });
    
    this._channel.subscribe("nodedeselected", function(data, envelope) {
        selectionChange(data.value);
        
    });
    

    //this.PublishNodePositioning();
    
    this.InitSelectionRectangle();
};


SelectionView.prototype.InitSelectionRectangle = function (state){
    
    var that = this;
    var key = 'RS';
    
    $("#myCanvas").click(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMouseClickLocks) == key) {
            var boundingrec = document.getElementById("myCanvas").getBoundingClientRect();
            
            that.canvasMouseLastXClick = evt.clientX - boundingrec.left;
            that.canvasMouseLastYClick = evt.clientY - boundingrec.top;
            
            that._channel.publish( "selectionClick", { value: 
                {
                    x : that.canvasMouseLastXClick,
                    y : that.canvasMouseLastYClick
                } 
            } );
        }
    });
    
    $("#myCanvas").mousedown(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMousedownLocks) == key){
            that._channel.publish( "selectionMouseDown", { value: evt } );
        }
    });

    $("#myCanvas").mouseup(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMouseupLocks) == key)
            that._channel.publish( "selectionMouseUp", { value: evt } );
    });

    $("#myCanvas").mousemove(function (evt) {
        //argh argh
        if(that._baseView.GetKey(that._baseView.canvasMousemoveLocks) == key){
           that._channel.publish( "selectionMouseMove", { value: evt } );
        }
        
        evt.stopPropagation();
    });
    
    $('#rectselstart').click(function (evt) {            
        evt.preventDefault();
        that._channel.publish( "selectionRectangleActivated", { value: evt } );
    });   

    $("#selectnodebtn").click(function (evt) {
        //action();
        
        that._channel.publish( "selectnodebtn", { value: 
            {
                x : that.canvasMouseLastXClick,
                y : that.canvasMouseLastYClick
            } 
        } );
    });

};

SelectionView.prototype.DisplayRectangleSelection= function (state) {
    //console.log('View DisplayRectangleSelection');
    if(!state)
        $("#rectselstart").val('RS');
    else
        $("#rectselstart").val('[RS]');
};

SelectionView.prototype.DisplaySelectionState= function () {
    //console.log('View DisplaySelectionState');
    $("#selectnodebtn").val('[SN]');
     

};

SelectionView.prototype.DisplaySelectionDelete= function (state) {
    //console.log('View DisplaySelectionDelete');
    
    $("#delnodebtn").prop('disabled', state); 

};




SelectionView.prototype.DisplayAddState= function () {
    //console.log('View DisplayAddState');
    $("#addnodebtn").val('[AD]');

    $("#btnNodeCancel").show();
};

SelectionView.prototype.DisplaySaveState= function () {
    //console.log('View DisplaySaveState');

    $("#btnNodeCancel").show();
    $("#btnSave").show();

};

SelectionView.prototype.DisplayNeutralState= function () {
    //console.log('View DisplayNeutralState');

    $("#delnodebtn").prop('disabled', true); 
    
    $("#addnodebtn").val('AD');

    $("#btnNodeCancel").hide();
    
    $("#btnSave").hide();

};



SelectionView.prototype.DisplaySingleSelection= function (state) {
    
    if(!state)
        $("#selectnodebtn").val('SN');
    else
        $("#selectnodebtn").val('[SN]');
};

SelectionView.prototype.SelectNodeButton = function (action) {
    //here look multiple event firing problems    
    $("#selectnodebtn").click(function (evt) {
        action();
    });
};