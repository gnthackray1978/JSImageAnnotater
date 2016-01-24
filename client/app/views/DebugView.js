var DebugView = function (view, channel) {
    var that = this;
    this.table;
    this._baseView = view;
    this._channel = channel;

    this.Init();
};

DebugView.prototype.Init= function (){
    var that = this;
    
    that.table = $('#example').DataTable( {
        "paging":   false,
        "ordering": false,
        "info":     false,
        "searching": false,
        "scrollX": true
    } );
    
    var d = new Date();
    
    that.AddDebugRow(d.toLocaleTimeString(),'mouse','apples and pairs loads of info');
};

DebugView.prototype.AddDebugRow= function (time, name, description){
    
    this.table.row.add( [ time, name, description] ).draw();
}

