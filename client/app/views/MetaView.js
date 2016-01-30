var MetaView = function (view, channel) {
    
    var that = this;
    
    this._baseView = view;
    this._channel = channel;
    
    this._channel.subscribe("SetMetaData", function(data, envelope) {
        that.SetMetaData(data.value);
    });
    
    this._channel.subscribe("SetSelectedMetaData", function(data, envelope) {
        that.SetSelectedMetaData(data.value);
    });
    
    // this._channel.subscribe("SetSelectedMetaData", function(data, envelope) {
    //     that.SetSelectedMetaData(data.value);
    // });

    this._channel.subscribe("SetTemplates", function(data, envelope) {
        that.SetTemplates(data.value);
    });
    
    this._channel.subscribe("SetEnabledState", function(data, envelope) {
        that.SetEnabledState(data.value);
    });
    
    this.PublishAddButtonState();
    this.PublishSaveButtonState();
};

MetaView.prototype.SetMetaData= function (metaData){
     
    var idx =0;
    
    var constructRow = function(id, descrip){
        var html = '<option value = '+ id +' >'+ descrip+'</option>';
 
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < metaData.length){
        metaContent += constructRow(metaData[idx].id, metaData[idx].name);
        idx++;
    }

    $('#metatypesList').html(metaContent);
    
    
    this.PublishMetaState();
};

MetaView.prototype.SetSelectedMetaData= function (dataTypes){
    var idx =0;

    var constructRow = function(id, descrip,short){
        var html = '<div class = "row">';
        html += '<div class = "col node-col" data-id = '+ id +' >'+ descrip+'</div>';
        html += '<div class = "col short-col">'+ '{' +short+ '}' + '</div>';
        html += '<div class = "col del-col"><a href="" data-id = "'+ id +'" data-prop = "delete">delete</a> </div>';
        html += '</div>';
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < dataTypes.length){
        metaContent += constructRow(dataTypes[idx].meta.id, dataTypes[idx].meta.name, dataTypes[idx].template.short);
        idx++;
    }

    $('#selectedMetatypesList').html(metaContent);
    
    this.PublishDeleteButtonState();
};

MetaView.prototype.SetTemplates= function (dataTypes){
     
    var idx =0;
    
    var constructRow = function(id, descrip){
        var html = '<option value = '+ id +' >'+ descrip+'</option>';
 
        html += '<br/>';
        
        return html;
    };
    
    var metaContent ='';
    while(idx < dataTypes.length){
        metaContent += constructRow(dataTypes[idx].id, dataTypes[idx].name);
        idx++;
    }

    $('#templateList').html(metaContent);
    
    this.PublishTemplateState();

};

MetaView.prototype.SetEnabledState= function (state){
    if(state)
    {
        $("#meta-group-active").show(); 
        $("#meta-group-inactive").hide();
    }
    else
    {
        $("#meta-group-active").hide(); 
        $("#meta-group-inactive").show();
    }
};

//QryMetaState
MetaView.prototype.PublishMetaState = function (callback){
    var that = this;
    var currentComponent =1;
 
    $("#metatypesList")
      .change(function () {
        // console.log('colour component changed: '+ str);
        
        currentComponent = $( "#metatypesList option:selected" ).val();
        
        that._channel.publish( "MetaState", { value: currentComponent } );
    })
    
    .change();
}; 

MetaView.prototype.PublishTemplateState = function (callback){
    var that = this;
    var currentComponent =1;
    $("#templateList")
      .change(function () {
        currentComponent = $( "#templateList option:selected" ).val();
        
        that._channel.publish( "TemplateState", { value: currentComponent } );
    })
    .change();
}; 

//QryDeleteButtonState
MetaView.prototype.PublishDeleteButtonState = function (callback){
     this.metaButtonCallback=callback;
     var that = this;
     
     $('#selectedMetatypesList a').click(function (e) {
        
        if($(e.target).data().prop == 'delete'){
            var d = {
                id: $(e.target).data().id,
                value: '',
                type : 'delete'
            };
            
            that._channel.publish( "MetaDeleteButtonState", { value: d } );
        }
        
        return false;
     });
}; 

MetaView.prototype.PublishAddButtonState = function (callback){
    var that = this;
    
     $('#btnAddMetaInfo').click(function (e) {
        that._channel.publish( "MetaAddButtonState", { value: e } );
     });
}; 

//QrySaveButtonState
MetaView.prototype.PublishSaveButtonState = function (callback){
    var that = this;
    
    $('#btnSaveMetaInfo').click(function (e) {
        that._channel.publish( "MetaSaveButtonState", { value: e } );
    });
}; 


