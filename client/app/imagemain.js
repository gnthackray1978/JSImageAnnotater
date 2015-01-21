
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

        var model = new ImageViewer(noteDataManager,appView, new UrlWriter(), new CanvasTools());
        var diagramController =  new DiagramController(appView, model);
    
    
        var layer = new Layer(noteDataManager,appView);
        var layerController = new LayerController(appView,layer);

    });
}