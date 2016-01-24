var DebugView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    this._channel.subscribe("DebugMessage", function(data, envelope) {
        that.AddDebugRow(data.time,data.name,data.description);
    });
        
    this.Init();
};

DebugView.prototype.Init= function (){
    var that = this;
    
   
    var d = new Date();
    
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
};

DebugView.prototype.AddDebugRow= function (time, name, description){
    
    var row = time + ' - ' + name + ' - ' + description;
    
    $('#debugoutput').append( "<div>"+ row +"</div>" );
     
}

