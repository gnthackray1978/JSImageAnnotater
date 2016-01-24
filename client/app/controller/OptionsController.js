var OptionsController = function (view, model) {
    this._view = view;

    this.model = model;
    
    this._view.AngleChangeClicked($.proxy(this.angleChanged, this));

    this.model.CreateComponentList();
    
    
};

OptionsController.prototype = {
    
    angleChanged:function(direction){
        this.model.ChangeAngle(direction);
    },

    qryPickedColour: function(rgb,hex){
       this.model.updateOptionColour(rgb,hex);
    },
 
}