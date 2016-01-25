var DebugView = function (channel) {
    var that = this;
    
    //this._baseView = view;
    this._channel = channel;
    this._channel.subscribe("DebugMessage", function(data, envelope) {
        var d = new Date();
        
        that.AddDebugRow(d.toLocaleTimeString(),data.name,data.description);
    });
        
    this.Init();
};

DebugView.prototype.Init= function (){
 
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
};

DebugView.prototype.AddDebugRow= function (time, name, description){
    
    var row = time + ' - ' + name + ' - ' + description;
    
    $('#debugoutput').prepend( "<div>"+ row +"</div>" );
     
}

