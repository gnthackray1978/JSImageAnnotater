
function handleClientLoad() {
     
  //  var _myDrive = new MyDrive();
    
  //  _myDrive.init();
    
    // load main image somehow
    // run application
    loadAll(true);
}

$(document).ready(function () {


    //new FakeData(), 

   // loadAll();
    
});


 
 
function loadAll (drive){
  
    var data;
  
   
    if(drive) {
        data = new MyDrive();
    }
    else {
        data = new MongoNoteData();
    }
    
    var noteDataManager = new NoteDataManager(data);
    
   
    var diagramRunner =  new DiagramRunner(new ImageViewer(noteDataManager, new UrlWriter()), new ColourPicker());

    var appView = new AnnotaterView(diagramRunner);

    //this will be changed to be added in the constructor
    diagramRunner.ancTree.view = appView;



    diagramRunner.SetNodeSelectionUI(appView.DisplayNodeSelection);
    
    diagramRunner.SetAddButtonUpdate(appView.DisplayUpdateNoteAdd);
    diagramRunner.SetDeleteButtonUpdate(appView.DisplayUpdateDelete);
    
    diagramRunner.SetRunButtonUpdate(appView.DisplayUpdateRunButton);
    
    diagramRunner.SetClearTextArea(appView.ClearActiveTextArea);
    
    diagramRunner.SetGetTextAreaDetails(appView.GetTextAreaDetails);
    diagramRunner.SetLoadUrls(appView.FillUrls);
    diagramRunner.SetOptionsUpdate(appView.UpdateOptions);
    
    diagramRunner.SetUpdateInfoWindow(appView.UpdateInfoWindow);
    
    // populates list of components
    diagramRunner.SetModelUpdateColourPickerComponents(appView.UpdateColourPickerComponents);





    appView.InitPanelVisibility();



    if(drive){
        appView.ApplicationRun($.proxy(diagramRunner.startFromDrive, diagramRunner));
    }
    else
    {
        appView.ApplicationRun($.proxy(diagramRunner.init, diagramRunner));
        appView.RunButtonClicked($.proxy(diagramRunner.run, diagramRunner));
    }





    
    appView.AngleChangeClicked($.proxy(diagramRunner.angleChanged, diagramRunner));
    appView.SaveOptionsClicked($.proxy(diagramRunner.saveOptionsClicked, diagramRunner));
    
    

    appView.CanvasClick($.proxy(diagramRunner.canvasClick, diagramRunner));
 
    appView.CanvasMouseDown($.proxy(diagramRunner.canvasMouseDown, diagramRunner));
    
    appView.CanvasMouseUp($.proxy(diagramRunner.canvasMouseUp, diagramRunner));
    
    appView.CanvasMouseMove($.proxy(diagramRunner.canvasMouseMove, diagramRunner));
    
    appView.ButtonPressDown($.proxy(diagramRunner.boxButtonDown, diagramRunner));
    
    appView.ButtonPressUp($.proxy(diagramRunner.boxButtonUp, diagramRunner));
    
    
    //get hex whenever listbox changes selection
    appView.ColourComponentChanged($.proxy(diagramRunner.getColourComponentHex, diagramRunner));
    
    //colour picker 
    //saves colour back to model
    appView.ColourPickerClicked($.proxy(diagramRunner.colourPickerClicked, diagramRunner), 
                                $.proxy(diagramRunner.saveColourComponentToModel, diagramRunner));          
    
    
    
    
    
    //note operations
    appView.Add($.proxy(diagramRunner.addButtonClicked, diagramRunner));
    
    appView.Cancel($.proxy(diagramRunner.cancelButtonClicked, diagramRunner));
    
    appView.SaveNote($.proxy(diagramRunner.saveNote, diagramRunner));
   
    appView.Delete($.proxy(diagramRunner.deleteNote, diagramRunner));
   
   if(!drive){
        //URL operations
        appView.URLFilterList($.proxy(diagramRunner.URLFilterList, diagramRunner));
        
        appView.URLNew($.proxy(diagramRunner.URLNew, diagramRunner));
        
        appView.URLSave($.proxy(diagramRunner.URLSave, diagramRunner), $.proxy(diagramRunner.URLFilterList, diagramRunner) );
        
        appView.URLDelete($.proxy(diagramRunner.URLDelete, diagramRunner));
        
        appView.URLChanged($.proxy(diagramRunner.URLChanged, diagramRunner));
     
   }
     
     
};