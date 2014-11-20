


$(document).ready(function () {


    var diagramRunner =  new DiagramRunner(new FakeData(), new ImageViewer());

    var appView = new AnnotaterView(diagramRunner);

    diagramRunner.SetNodeSelectionUI(appView.DisplayNodeSelection);
    diagramRunner.SetAddButtonUpdate(appView.DisplayUpdateNoteAdd);
    diagramRunner.SetSaveButtonUpdate(appView.DisplayUpdateSave);
    diagramRunner.SetDeleteButtonUpdate(appView.DisplayUpdateDelete);
    diagramRunner.SetClearTextArea(appView.ClearActiveTextArea);
    diagramRunner.SetGetTextAreaDetails(appView.GetTextAreaDetails);
    diagramRunner.SetLoadUrls(appView.FillUrls);
    

    appView.InitPanelVisibility();

    appView.ApplicationRun($.proxy(diagramRunner.displayUrls, diagramRunner));

    appView.RunButtonClicked($.proxy(diagramRunner.run, diagramRunner));

    appView.CanvasClick($.proxy(diagramRunner.canvasClick, diagramRunner));
 
    appView.CanvasMouseDown($.proxy(diagramRunner.canvasMouseDown, diagramRunner));
    
    appView.CanvasMouseUp($.proxy(diagramRunner.canvasMouseUp, diagramRunner));
    
    appView.CanvasMouseMove($.proxy(diagramRunner.canvasMouseMove, diagramRunner));
    
    appView.ButtonPressDown($.proxy(diagramRunner.boxButtonDown, diagramRunner));
    
    appView.ButtonPressUp($.proxy(diagramRunner.boxButtonUp, diagramRunner));
    
    appView.Add($.proxy(diagramRunner.addButtonClicked, diagramRunner));
    
    appView.Cancel($.proxy(diagramRunner.cancelButtonClicked, diagramRunner));
    
    appView.SaveNote($.proxy(diagramRunner.saveNote, diagramRunner));
   
    appView.URLFilterList($.proxy(diagramRunner.URLFilterList, diagramRunner));
    
    appView.URLNew($.proxy(diagramRunner.URLNew, diagramRunner));
    
    appView.URLSave($.proxy(diagramRunner.URLSave, diagramRunner), $.proxy(diagramRunner.URLFilterList, diagramRunner) );
    
    appView.URLDelete($.proxy(diagramRunner.URLDelete, diagramRunner));
    
    appView.URLChanged($.proxy(diagramRunner.URLChanged, diagramRunner));
    
    
    
});


 