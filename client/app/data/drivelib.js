/*global gapi*/

var MyDrive = function () {

    this.CLIENT_ID = '67881158341-i31rcec2rf6bi26elnf8njnrb7v9ij8q.apps.googleusercontent.com';
    this.SCOPES = 'https://www.googleapis.com/auth/drive';
    this.data = null;
    
    
    this.IMAGEURL = '';
    this.IMAGEWIDTH = 0;
    this.IMAGEHEIGHT =0;
    
    this.CONFIGFILEID = null;
    this.CONFIGFILEFOLDER = '.meta';
    this.CONFIGFILEEXT = '.info';
    this.CONFIGFOLDERID =-1;
    this.CONFIGFILENAME = 'info.config';
    this.FILENAME = '';
    
    this.PARENTFOLDERID=0;
    this.FILEID = null;
    
    this.authResult = null;
    
    this.generations =null;
    this.options =null;
    this.layers =null;
    this.searchCache = [];
};


MyDrive.prototype.init = function(loaded){
    var that = this;
 
    var checkAuth = function() {
        that.GAPIStage_Authenticate(function(result){
            that.GAPIStage_LoadAPI(function(){
                that.GAPIStage_ObtainMainFileInfo(function(info){
                    that.GAPIStage_ProcessResponse(info,loaded);
                });
            });
        });
    };

    window.setTimeout(checkAuth, 1);
    
    var timer = window.setInterval(function()
    {
        that.GAPIStage_Authenticate(function(result){});
    }, 1800000);


};

MyDrive.prototype.GAPIStage_Authenticate = function(authenticated){
    gapi.auth.authorize({'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': true},
        function(authResult){
            if (authResult && !authResult.error) {
                console.log('Authenticated');
                authenticated(authResult);
            }
            else {
                console.log('Couldnt authenticate!');
            }
        }
    );
},

MyDrive.prototype.GAPIStage_GetConfigFileId = function(ocallback){
    var that = this;
    that.CONFIGFILEID =-1;
    
    var searchForId = function(fileList){
        console.log('retrieved list of files');
        var idx =0;
         
        while(idx < fileList.length){
            console.log(fileList[idx].title);
            
            if(fileList[idx].title == that.CONFIGFILENAME){
                that.CONFIGFILEID = fileList[idx].id;
                ocallback(fileList[idx].id);
                console.log('found id: '+ fileList[idx].id);
                return;
            }
            
            idx++;
        }    
        
        ocallback(-1);
    };
        
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };
        
    var pstr= '\'' + that.CONFIGFOLDERID+ '\'' + ' in parents';
    
    console.log('searching for: '+ pstr);   
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    retrievePageOfFiles(initialRequest, []);
},

MyDrive.prototype.GAPIStage_ProcessConfigFile = function( loaded){
   
    var that =this;

    var loadConfigFile = function(configFileId){
        //create config file if doesnt exist.            
        if(configFileId == -1){
            that.GAPIStage_CreateConfigFile(function(fileId){
                that.GAPIStage_LoadConfigFile(loaded);
            });
        }
        else {
            that.GAPIStage_LoadConfigFile(loaded);
        }
    };
 
    that.GAPIStage_GetConfigFileId(loadConfigFile);
    
    
},

MyDrive.prototype.GAPIStage_GetConfigFolderId = function(ocallback){
    var that = this;
    
    var searchForId = function(fileList){
        console.log('retrieved list of files');
        var idx =0;
        
        // if(fileList[idx].title == that.CONFIGFILEFOLDER){
        //     console.log('folder id: '+ fileList[idx].id);
        // }
            
        while(idx < fileList.length){
            console.log(fileList[idx].title);
            
            if(fileList[idx].title == that.CONFIGFILEFOLDER){
                //FILEID=resp[idx].id;
                ocallback(fileList[idx].id);
                console.log('found id: '+ fileList[idx].id);
                return;
            }
            
            idx++;
        }    
        
        ocallback(-1);
    };
        
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };
        
    var pstr= '\'' + that.PARENTFOLDERID+ '\'' + ' in parents';
    
    console.log('searching for: '+ pstr);   
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    retrievePageOfFiles(initialRequest, []);
},


MyDrive.prototype.GAPIStage_CreateConfigFile = function(callback){
    var that = this;
    
    var content = this.GAPIStage_CreateDummyFile();
    
    content =JSON.stringify(content);
    
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, null, content,function(id){
        that.CONFIGFILEID = id;
        callback(id);
    });
},

MyDrive.prototype.GAPIStage_CreateDummyFile = function(){
    var addNode = function(id,fileId,note,x,y,w,h) {
        var node = {
                    Annotation: note,
                    Index: id,
                    UrlId: fileId,
                    Layer:0,
                    X:Number(x),
                    Y:Number(y),
                    Width:Number(w),
                    Height:Number(h),
                    D:Number(0),
                    Visible: true,
                    LayerId: 2,
                    CropArea:false,
                    IsOpen:false
                };
                
        return node;
    };
        
    var tgs =[];
   
    tgs.push(addNode(1,1,'some test string',100,100,200,65));
    tgs.push(addNode(2,1,'another value',150,200,200,65));
    tgs.push(addNode(3,1,'hello monkey',200,400,200,65));
    
    var options = {
        LayerId: 0,
        UrlId: 1,
        DefaultFont: "\'Times New Roman\'\, Times\, serif" ,
        DefaultNoteColour: '#9B9E8F' ,
        DefaultEditorFontColour: '#FFFFFF' ,
        DefaultEditorBorderColour: '#FFFFFF' ,
        DefaultNoteFontColour: '#272D45' ,
        IsTransparent: true,
        Visible: true
    };
    
    var oarray = [];
    
    oarray.push(options);
    
    var c = {
        urlId : 1,
        generations: tgs,
        options : oarray,
        layers: 1
    };
    
    return c;
},


MyDrive.prototype.GAPIStage_LoadConfigFile = function(loaded){
    var that = this;
         
    that.ReadConfigFile(that.CONFIGFILEID,function(d){
        that.generations = d.generations;
        that.options = d.options;
        that.layers = d.layers;
        loaded();  
    });
     
},

MyDrive.prototype.GAPIStage_ProcessResponse = function(resp,loaded){
    
    var that = this;
    
    var stripped =  resp.title.substr(0, resp.title.lastIndexOf('.')) || resp.title;
    
    that.CONFIGFILENAME = stripped + that.CONFIGFILEEXT;
     
    that.PARENTFOLDERID = resp.parents[0].id;
    
    that.GAPIStage_GetConfigFolderId(function(folderId){
        that.CONFIGFOLDERID =folderId;
        
        //config folder doesnt exist    
        if(that.CONFIGFOLDERID == -1){
            that._makeFolder(that.PARENTFOLDERID,that.CONFIGFILEFOLDER,function(newId){
                that.CONFIGFOLDERID =newId;
                that.GAPIStage_ProcessConfigFile(loaded);
            } );
        }
        else{
            that.GAPIStage_ProcessConfigFile(loaded);
        }
            
    });
},
    


MyDrive.prototype.GAPIStage_ObtainMainFileInfo = function(loaded){
    
    var that = this;
    
    var qryString = window.location.search.replace('?','');
        qryString = decodeURI(qryString).replace('state=','');
      //  console.log('Qry string data: ' + qryString);    
    var data = JSON.parse(qryString);
    console.log('Qry string data:' + data);
    
    that.FILEID = data.ids[0];
    
    
    
    var request = gapi.client.drive.files.get({
        'fileId': that.FILEID
    });
    
    request.execute(function(resp) {
        
        console.log('Title: '+resp.title);
        console.log('Description: '+resp.description);
        console.log('MimeType: '+resp.mimeType);
        console.log('DownloadUrl: '+resp.downloadUrl);
        console.log('ParentFolderId: '+resp.parents[0].id);
        console.log('WebContentLink: '+resp.webContentLink);
        console.log('WebViewLink: '+resp.webViewLink);
        
        
        that.CONFIGFILENAME = resp.title;
        that.FILENAME = resp.title;
        that.IMAGEURL = resp.downloadUrl;
        that.IMAGEWIDTH =resp.imageMediaMetadata.width;
        that.IMAGEHEIGHT=resp.imageMediaMetadata.height;
        
        loaded(resp);
    });
},

MyDrive.prototype.GAPIStage_LoadAPI = function(loaded){
    //load the drive api api
    gapi.client.load('drive', 'v2', function(r){
        loaded(r);
    });
},




MyDrive.prototype.ReadConfigFile = function(configId, callback){
    var that = this;        
    var request = gapi.client.drive.files.get({
      'fileId': configId
    });
    
    request.execute(function(resp) {
      if (resp.id) {
        var token = gapi.auth.getToken();
        
        $.ajax(resp.downloadUrl, {
          headers: {Authorization: 'Bearer ' + token.access_token},
          success: function(data) {
            
            var d = JSON.parse(data);
        
            
            callback(d);
          }
        });
      }
    });
        
        
};


MyDrive.prototype.QrySearchCache = function(text, callback){
    var nidx =0;
    var result = [];
    
    while(nidx < this.searchCache.length){
        if(((typeof this.searchCache[nidx].Annotation) == "string") 
            && this.searchCache[nidx].Annotation.indexOf(text) > -1){
                result.push(this.searchCache[nidx]);
        }
        nidx++;   
    }
    
    callback(result);
    
};

MyDrive.prototype.BuildSearchCache = function(callback){
    var that = this;
    this.searchCache =[];
    var fileCount =0;
    
    var searchForId = function(fileList){
        console.log('retrieved list of files');
        
        var idx =0;
          
        while(idx < fileList.length){
            console.log(fileList[idx].title);
            
            var title = fileList[idx].title;
            if(that.FILEID == fileList[idx].id) continue;
            
            that.ReadConfigFile(fileList[idx].id,function(d){
                var nidx =0;
                
                while(nidx < d.generations.length){
                    d.generations[nidx].title = title;
                    console.log('adding: ' + d.generations[nidx].Annotation);
                    that.searchCache.push(d.generations[nidx]);
                    nidx++;    
                }
                
                fileCount++;
                
                //erm hopefully this should everything has got populated 
                if(fileList.length == fileCount){
                    callback();
                }
            });
                
            idx++;
        }    
         
    };
    
    var retrievePageOfFiles = function(request, result) {
        request.execute(function(resp) {
            result = result.concat(resp.items);
            var nextPageToken = resp.nextPageToken;
           
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } 
            else {
                searchForId(result);
            }
        });
    };
    
    var pstr= '\'' + this.CONFIGFOLDERID+ '\'' + ' in parents';
  
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    
    retrievePageOfFiles(initialRequest, []);
  
};

MyDrive.prototype._makeFolder = function(parentId, folderName, callback){
    
    console.log('attempting to make folder');
    
    var metadata = {
        title: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [{id: parentId}]
    };
    
    var data = new FormData();
    data.append("metadata", new Blob([ JSON.stringify(metadata) ], { type: "application/json" }));
    
    var token = gapi.auth.getToken();
    
    $.ajax("https://www.googleapis.com/upload/drive/v2/files", {
        data: data,
        headers: {Authorization: 'Bearer ' + token.access_token},
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data) {           
            if(callback)
                callback(data.id);    
            console.log('Folder created' + data.id);
        }
    });
        
};

MyDrive.prototype._saveFile = function(parentId, fileName, fileId, content,callback){
    
    console.log('attempting to savefile: ' + parentId + ' filename ' + fileName + ' file id ' + fileId);
 
    var metadata = {
      title: fileName,
      mimeType: 'application/json',
      parents: [{id: parentId}]
    };
    
    var state = content;
    var data = new FormData();
    data.append("metadata", new Blob([ JSON.stringify(metadata) ], { type: "application/json" }));
    data.append("file", new Blob([ JSON.stringify(state) ], { type: "application/json" }));

    var token = gapi.auth.getToken();
    
    if(token == null || token == undefined || token.access_token == null){
        console.log('TOKEN UNAVAILABLE file not written');
        
        if(callback)
            callback();
    }
    else
    {
        var up = fileId != null ? '/' + fileId : '';
        
        $.ajax("https://www.googleapis.com/upload/drive/v2/files" + up + "?uploadType=multipart", {
          data: data,
          headers: {Authorization: 'Bearer ' + token.access_token},
          contentType: false,
          processData: false,
          type: fileId != null ? 'PUT' : 'POST',
          success: function(data) {           
              console.log('File written');
              if(callback)
                callback(data.id);
          }
        });
    }   
};

//GetNoteData: function (urlId, callback)
MyDrive.prototype.GetNoteData = function(urlId, callback){
   
    
    callback(this.generations);
};
    
MyDrive.prototype.GetAccessToken = function(){
    return gapi.auth.getToken().access_token;
};


//WriteNoteData: function (note)    
MyDrive.prototype.WriteNoteData = function(data,callback){
    // add note into array
    // then update file contents to reflect that
    
    var idx =0;
    
    while(idx < this.generations.length){
        if(this.generations[idx].Index == data.Index){
            this.generations[idx] = data;
            idx=-1;
            break;        
        }
        idx++;
    }
    
    if(idx!=-1)
        this.generations.push(data);
    
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
        
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        callback(data);
    });
};

MyDrive.prototype.GetOptions= function (urlId,callback){
    
    callback(this.options);
};

MyDrive.prototype.PopulatedDummyLaterData = function () {
    this.layers =  [
            {id:1 , order:1 , name : 'image', visible: true, current: false},
            {id:2 , order:2 , name : 'notes', visible: true, current: true},
            {id:3 , order:3 , name : 'metadata', visible: true, current: false},
            {id:4 , order:4 , name : 'cropdata', visible: true, current: false},
            {id:5 , order:5 , name : 'matches', visible: true, current: false}
        ];
};

MyDrive.prototype.GetLayers = function (callback) {
    
    if(this.layers == 1 || this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    
    callback(this.layers);
};

MyDrive.prototype.GetActiveLayer = function (callback) {
    
    if(this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    
    var idx =0;
    var layerId=0;
    
    while(idx < this.layers.length){
        
        if(this.layers[idx].current){
            layerId = this.layers[idx].id;
        }
        idx++;
    }
    
    callback(layerId);
};

MyDrive.prototype.GetVisibleLayer = function (callback) {
    
    if(this.layers == undefined){
        this.PopulatedDummyLaterData();
    }
    var idx =0;
    var layerIds = [];
    while(idx < this.layers.length){
        
        if(this.layers[idx].visible){
            layerIds.push(this.layers[idx].id);
        }
        idx++;
    }
    
    callback(layerIds);
};

MyDrive.prototype.GetMetaData=function(callback){
    var metaData =  [
            {id:1 , dts :'6', name : 'image tag'},
            {id:2 , dts :'1,2,3', name : 'witness'},
            {id:3 , dts :'1,2,3', name : 'father'},
            {id:4 , dts :'1,2,3', name : 'mother'},
            {id:5 , dts :'1,2,3', name : 'son'},
            {id:6 , dts :'1,2,3', name : 'daughter'},
            {id:7 , dts :'1,2,3', name : 'cousin'},
            {id:8 , dts :'1,2,3', name : 'undescribed person'},
            {id:9 , dts :'6', name : 'source'},
            {id:10 , dts :'6', name : 'testator'}
        ];
        
    callback(metaData);
};
    
MyDrive.prototype.GetMetaDataTypes=function(types, callback){
    var dataTypes =  [
        {id:1 , name : 'name name surname', short : 'nns'},
        {id:2 , name : 'name surname', short : 'ns'},
        {id:3 , name : 'surname', short : 's'},
        {id:4 , name : 'place', short : 'p'},
        {id:5 , name : 'year', short : 'y'},
        {id:6 , name : 'general', short : 'g'} 
    ];
    
    var contains = function(array, id){
        
        var cdx=0;
        
        if(array.length){
            while(array.length > cdx){
                if(array[cdx] == id){
                    return true;
                }
                cdx++;
            }
        }
        else
        {
            if(array && id == array){
                return true;
            }
            else
            {
                return false;
            }
        }
        
        return false;
    };
    
    if(types){
        var tp = [];
        var idx =0;
        
        while(dataTypes.length > idx){
             
            if(contains(types, dataTypes[idx].id))
                tp.push(dataTypes[idx]);
            idx++;
        }
        
         callback(tp);
    }
    else
    {
        callback(dataTypes);
    }
    
   
};
    
    

MyDrive.prototype.SaveLayers= function (layers, cacheOnly){
    this.layers = layers;
    // when using drive only want to write to disk
    // when save button is pressed
    // however we do want to update the cached layer variable
    // because then we get real time changes when its accessed by 
    // the image model
    
    if(cacheOnly) return;
     
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
    
};


MyDrive.prototype.SaveOptions= function (options){
    this.options[0] = options;
    
     var c = {
            urlId : this.FILEID,
            generations: this.generations,
            options : this.options,
            layers : this.layers 
        };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
};


MyDrive.prototype.deleteConfig = function(){
    
      var request = gapi.client.drive.files.delete({
        'fileId': fileId
      });
      
      request.execute(function(resp) { });
    
};

MyDrive.prototype.GetImageData= function(callback){
        
        //dummy values not intended to be used
        var imageData = {
            title:this.FILENAME,
            url: this.IMAGEURL,
            urlId :this.FILEID,
            width :this.IMAGEWIDTH,
            height:this.IMAGEHEIGHT
        };
        
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', this.IMAGEURL);
        xhr2.responseType = "blob";
        
        xhr2.setRequestHeader('Authorization', 'Bearer ' + this.GetAccessToken());
        
        xhr2.onload = function () {
            
            imageData.url = window.URL.createObjectURL(xhr2.response);
         
            callback(imageData);
        };
        
        xhr2.send();

    };

MyDrive.prototype.Type = function(){
    return 'GDRIVE';
};

MyDrive.prototype.GetCroppingNode = function (callback) {
    var idx =0;
    while(idx < this.generations.length){
        if(this.generations[idx].CropArea){
            callback(this.generations[idx]);
            return;
        }
        idx++;
    }
    callback();
};

MyDrive.prototype.CleanGenerations = function () {
    
    //always layer 4 and only ever 1
    //generations
   
    
    var idx =0;
    var layerId=4;
    
    var cleanArray = [];
    
    while(idx < this.generations.length){
        //111111111
        if(this.generations[idx].LayerId !=4
        && this.generations[idx].LayerId !=-4
        && this.generations[idx].Annotation != ''
        && this.generations[idx].Index != "111111111" 
        && this.generations[idx].Index != "11111111" 
        && this.generations[idx].Index != "1111111" 
        && this.generations[idx].Index != "111111" 
        && this.generations[idx].Index != "11111" 
        && this.generations[idx].Index != "1111" 
        ){
            cleanArray.push(this.generations[idx]);
        }
        
        idx++;
    }
    
    this.generations = cleanArray;
    
    var c = {
        urlId : this.FILEID,
        generations: this.generations,
        options : this.options,
        layers : this.layers 
    };
        
        
    this._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, this.CONFIGFILEID, JSON.stringify(c),function(){
        
    });
 
};



 