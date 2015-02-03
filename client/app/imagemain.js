
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

        var options = new Options(noteDataManager,appView);
        var optionsController = new OptionsController(appView,options);



        var model = new ImageViewer(noteDataManager,appView,  new CanvasTools(), 
                                    metadata.QryNodeMetaData, 
                                    options);
        
        
        var diagramController =  new DiagramController(appView, model);
    
    

    
        var urls= new Urls(new UrlWriter(),noteDataManager,appView,model.setImageObject);
        
        var urlController = new UrlController(appView,urls);
        
        var layer = new Layer(noteDataManager,appView, model);
        var layerController = new LayerController(appView,layer);

        

    });
}