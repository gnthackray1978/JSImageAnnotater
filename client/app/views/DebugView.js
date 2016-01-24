var DebugView = function (view, channel) {
    var that = this;
    
    this._baseView = view;
    this._channel = channel;

    this.Init();
};

DebugView.prototype.Init= function (){
    var that = this;
    
    $('#example').DataTable( {
        "paging":   false,
        "ordering": false,
        "info":     false,
        "searching": false
    } );
    
    var table = $('#example').DataTable();
    
    table.row.add( {
        "name":       "Bob",
        "position":   "Monkey",
        "office":     "uhh"
      
    } ).draw();
};