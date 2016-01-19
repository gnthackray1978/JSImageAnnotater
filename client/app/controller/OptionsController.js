var OptionsController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this._view.AngleChangeClicked($.proxy(this.angleChanged, this));
    //this._view.QryDefaultOptions($.proxy(this.qryDefaultOptions, this));
    //this._view.QrySelectedColourComponent($.proxy(this.qrySelectedColourComponent, this));

    //this._view.QrySelectedFontChanged($.proxy(this.qrySelectedFontChanged, this));
   // this._view.QryTransparencyChanged($.proxy(this.qryTransparencyChanged, this));
    
    this.model.CreateComponentList();
    
    
};

OptionsController.prototype = {
    
    angleChanged:function(direction){
        this.model.ChangeAngle(direction);
    },

    // qryDefaultOptions:function(options){
    //     this.model.saveDefaultOptions(options);
    // },
    
    qryPickedColour: function(rgb,hex){
       this.model.updateOptionColour(rgb,hex);
    },

    // qrySelectedColourComponent: function(componentId){
    //     this.model.updateSelectedComponentId(componentId);
    // },
    
    // qrySelectedFontChanged: function(font){
    //     this.model.updateOptionFont(font);
    // },
    // qryTransparencyChanged: function(transparency){
    //     this.model.updateOptionTransparency(transparency);
    // }
    
}