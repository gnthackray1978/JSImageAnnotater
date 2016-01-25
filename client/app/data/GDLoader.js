/*global gapi*/

var GDLoader = function (channel, driveLib) {

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
   
    
    this._channel = channel;
    this._driveLib = driveLib;
};


GDLoader.prototype.init = function(loaded){
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

GDLoader.prototype.GAPIStage_Authenticate = function(authenticated){
    var that = this;
    
    gapi.auth.authorize({'client_id': this.CLIENT_ID, 'scope': this.SCOPES, 'immediate': true},
        function(authResult){
            if (authResult && !authResult.error) {
                that._shout('GAPIStage_Authenticate','Authenticated');
                authenticated(authResult);
            }
            else {
                that._shout('GAPIStage_Authenticate','Couldnt authenticate!');
            }
        }
    );
},

GDLoader.prototype.GAPIStage_GetConfigFileId = function(ocallback){
    var that = this;
    that.CONFIGFILEID =-1;
    
    var searchForId = function(fileList){
        that._shout('GAPIStage_GetConfigFileId','Retrieved list of files');
        var idx =0;
         
        while(idx < fileList.length){
            that._shout('GAPIStage_GetConfigFileId',fileList[idx].title + ' present');
            
            if(fileList[idx].title == that.CONFIGFILENAME){
                that.CONFIGFILEID = fileList[idx].id;
                ocallback(fileList[idx].id);
                that._shout('GAPIStage_GetConfigFileId','ConfigFile ID: ' + fileList[idx].id);
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
    
    that._shout('GAPIStage_GetConfigFileId','Searching for: '+ pstr);
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    retrievePageOfFiles(initialRequest, []);
},

GDLoader.prototype.GAPIStage_ProcessConfigFile = function( loaded){
   
    var that =this;

    var loadConfigFile = function(configFileId){
        //create config file if doesnt exist.
        that._shout('GAPIStage_ProcessConfigFile','Attempt Load Config: ' + configFileId);
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

GDLoader.prototype.GAPIStage_GetConfigFolderId = function(ocallback){
    var that = this;
    
    var searchForId = function(fileList){
        that._shout('GAPIStage_GetConfigFolderId','Retrieved File List');
        
        var idx =0;
        
        // if(fileList[idx].title == that.CONFIGFILEFOLDER){
        //     console.log('folder id: '+ fileList[idx].id);
        // }
            
        while(idx < fileList.length){
            that._shout('GAPIStage_GetConfigFolderId',fileList[idx].title + ' present');
            
            if(fileList[idx].title == that.CONFIGFILEFOLDER){
                //FILEID=resp[idx].id;
                ocallback(fileList[idx].id);
                that._shout('GAPIStage_GetConfigFolderId',fileList[idx].id + ' found ID');
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
    
    that._shout('GAPIStage_GetConfigFolderId', 'searching for: '+ pstr);
    
    var initialRequest = gapi.client.drive.files.list({ 'q': pstr});
    retrievePageOfFiles(initialRequest, []);
},

GDLoader.prototype.GAPIStage_CreateConfigFile = function(callback){
    var that = this;
    
    var content = this.GAPIStage_CreateDummyFile();
    
    content =JSON.stringify(content);
    
    that._shout('GAPIStage_CreateConfigFile', 'Creating Config with content');
    
    this._driveLib._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, null, content,function(id){
        that.CONFIGFILEID = id;
        that._shout('GAPIStage_CreateConfigFile', 'Config created: ' + id);
        callback(id);
    });
},

GDLoader.prototype.GAPIStage_CreateDummyFile = function(){
    
    this._shout('GAPIStage_CreateDummyFile', 'Creating default content');
    
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

GDLoader.prototype.GAPIStage_LoadConfigFile = function(loaded){
    var that = this;
    that._shout('GAPIStage_LoadConfigFile', 'Loading config file');     
    
    that._driveLib.ReadConfigFile(that.CONFIGFILEID,function(d){
        that.generations = d.generations;
        that.options = d.options;
        that.layers = d.layers;
        loaded();  
    });
     
},

GDLoader.prototype.GAPIStage_ProcessResponse = function(resp,loaded){
    
    var that = this;
    that._shout('GAPIStage_ProcessResponse', 'Getting config file details from response'); 
    
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
    
GDLoader.prototype.GAPIStage_ObtainMainFileInfo = function(loaded){
    
    
    var that = this;
    
    that._shout('GAPIStage_ObtainMainFileInfo', 'Getting file details'); 
    
    
    var qryString = window.location.search.replace('?','');
        qryString = decodeURI(qryString).replace('state=','');
 
    var data = JSON.parse(qryString);
 
    that._shout('GAPIStage_ObtainMainFileInfo', 'Qry string data:' + data);
    
    that.FILEID = data.ids[0];
    
    
    
    var request = gapi.client.drive.files.get({
        'fileId': that.FILEID
    });
    
    request.execute(function(resp) {
        
        
        that._shout('GAPIStage_ObtainMainFileInfo', 'Title: '+resp.title);
        that._shout('GAPIStage_ObtainMainFileInfo', 'Description: '+resp.description);
        that._shout('GAPIStage_ObtainMainFileInfo', 'MimeType: '+resp.mimeType);
        that._shout('GAPIStage_ObtainMainFileInfo', 'DownloadUrl: '+resp.downloadUrl);
        that._shout('GAPIStage_ObtainMainFileInfo', 'ParentFolderId: '+resp.parents[0].id);
        that._shout('GAPIStage_ObtainMainFileInfo', 'WebContentLink: '+resp.webContentLink);
        that._shout('GAPIStage_ObtainMainFileInfo', 'WebViewLink: '+resp.webViewLink);
        
        that.CONFIGFILENAME = resp.title;
        that.FILENAME = resp.title;
        that.IMAGEURL = resp.downloadUrl;
        that.IMAGEWIDTH =resp.imageMediaMetadata.width;
        that.IMAGEHEIGHT=resp.imageMediaMetadata.height;
        
        loaded(resp);
    });
},

GDLoader.prototype.GAPIStage_LoadAPI = function(loaded){
    //load the drive api api
    this._shout('GAPIStage_LoadAPI', 'Drive ');
    
    gapi.client.load('drive', 'v2', function(r){
        loaded(r);
    });
},

GDLoader.prototype._makeFolder = function(parentId, folderName, callback){
    
    
    this._shout('_makeFolder', 'Attempting to make folder');
    
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
            
            this._shout('_makeFolder', 'Folder created' + data.id);
        }
    });
        
};

GDLoader.prototype._shout = function(method, message){
    
    
    this._channel.publish( "DebugMessage", {name : 'App Load' , description : message } );
};