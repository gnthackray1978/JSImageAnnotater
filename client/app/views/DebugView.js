var DebugView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;

    this.Init();
};

DebugView.prototype.Init= function (){
    var that = this;
    
   
    var d = new Date();
    
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
};

DebugView.prototype.AddDebugRow= function (time, name, description){
    
    var row = time + ' - ' + name + ' - ' + description;
    
    $('#debugoutput').append( "<p>"+ row +"</p>" );
     
}

