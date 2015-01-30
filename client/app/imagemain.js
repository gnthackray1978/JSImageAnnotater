
function handleClientLoad() {

    loadAll(true);
}

$(document).ready(function () {
   // loadAll (false){
});


 
 
function loadAll (drive){
    console.log('pointess');
    var data;

    if(drive) {
        data = new MyDrive();
    }
    else {
        data = new MongoNoteData();
    }
    var appView = new AnnotaterView();
    var noteDataManager = new NoteDataManager(data);
    
    noteDataManager.init(function(){

        var metadata = new Meta(noteDataManager,appView);
        var metaController = new MetaController(appView,metadata);

        var model = new ImageViewer(noteDataManager,appView, new UrlWriter(), new CanvasTools(), metadata);
        var diagramController =  new DiagramController(appView, model);
    
    
        var layer = new Layer(noteDataManager,appView, model);
        var layerController = new LayerController(appView,layer);

        

    });
}