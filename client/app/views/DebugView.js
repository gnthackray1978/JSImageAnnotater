var DebugView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;

    this.Init();
};

DebugView.prototype.Init= function (){
    var that = this;
    
    var table = $('#example').DataTable( {
        "paging":   false,
        "ordering": false,
        "info":     false,
        "searching": false
    } );
   
    table.row.add( [ 1, 2, 3 ] ).draw();
};