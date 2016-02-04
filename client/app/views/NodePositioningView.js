

var NodePositioningView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this._channel.subscribe("DisableNodePositioning", function(data, envelope) {
        that.DisableNodePositioning(data.value);             
    });
    this._channel.subscribe("ToggleNodePositioning", function(data, envelope) {
        that.ToggleNodePositioning(data.value);            
    });
    this._channel.subscribe("ActivateNodePositioning", function(data, envelope) {
        that.ActivateNodePositioning(data.value);            
    });
    
    this.PublishNodePositioning();
    
    this.InitNodePositioning();
}

NodePositioningView.prototype.PublishNodePositioning = function () {
    var that =this;
    
    $("#enableNodePositioning").click(function (evt) {
        that._channel.publish( "positionNodeActivated", { value: undefined} );
    });
};


NodePositioningView.prototype.DisableNodePositioning = function (state) {
    
    if(!state)
        $("#enableNodePositioning").prop('disabled', false);
    else
    {
        $("#enableNodePositioning").val('PN');
        $("#enableNodePositioning").prop('disabled', true);
    }
};

NodePositioningView.prototype.ToggleNodePositioning = function (state) {
    
    if(!state)
        $("#enableNodePositioning").val('PN');
    else
        $("#enableNodePositioning").val('[PN]');
};

NodePositioningView.prototype.ActivateNodePositioning = function (action) {
    //here look multiple event firing problems    
    $("#enableNodePositioning").click(function (evt) {
        action();
    });
};

NodePositioningView.prototype.InitNodePositioning = function (state){
    
    var that = this;
    var key = 'NP';
    
    $("#myCanvas").click(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMouseClickLocks) == key) {
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
        if(that._baseView.GetKey(that._baseView.canvasMousedownLocks) == key){
            that._channel.publish( "positionMouseDown", { value: evt } );
        }
    });

    $("#myCanvas").mouseup(function (evt) {
        if(that._baseView.GetKey(that._baseView.canvasMouseupLocks) == key)
            that._channel.publish( "positionMouseUp", { value: evt } );
    });

    $("#myCanvas").mousemove(function (evt) {
        //argh argh
        if(that._baseView.GetKey(that._baseView.canvasMousemoveLocks) == key){
           that._channel.publish( "positionMouseMove", { value: evt } );
        }
        
        evt.stopPropagation();
    });

};