/*global $*/

var DebugView = function (channel) {
    var that = this;
    
    //this._baseView = view;
    this._channel = channel;
    this._channel.subscribe("DebugMessage", function(data, envelope) {
        var d = new Date();
        
        that.AddDebugRow(d.toLocaleTimeString(),data.name,data.description);
    });

    // AnnotaterView.prototype.UpdateInfoWindow = function(data){
    this._channel.subscribe("InfoMessage", function(data, envelope) {
        if(data!=undefined){
            $("#map_image").html(data.title);
            $("#map_zoom").html(data.zoomlevel);
            $("#map_dims").html(data.dims);
            $("#map_noteCount").html(data.noteCount);
            $("#map_count").html(data.size);
        }
    });
        
    this.Init();
};

DebugView.prototype.Init= function (){
 
    // that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
    var that = this;
    
    $('#btnDebugScaleToScreen').click(function (e) {
         
        var data= $("#txtDebugData").val();
        
        that._channel.publish( "dbgScaleToScreen", { value: data} );
    });
    
    $('#btnDebugMoveNode').click(function (e) {
         
        var data= $("#txtDebugData").val();
        
        that._channel.publish( "dbgDebugMoveNode", { value: data} );
    });
    
    
};

DebugView.prototype.AddDebugRow= function (time, name, description){
    
    var row = time + ' - ' + name + ' - ' + description;
    
    $('#debugoutput').prepend( "<div>"+ row +"</div>" );
     
}

