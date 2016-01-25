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
    //this.searchCache = [];
    
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

GDLoader.prototype.GAPIStage_GetConfigFileId = function(ocallback){
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

GDLoader.prototype.GAPIStage_ProcessConfigFile = function( loaded){
   
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

GDLoader.prototype.GAPIStage_GetConfigFolderId = function(ocallback){
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

GDLoader.prototype.GAPIStage_CreateConfigFile = function(callback){
    var that = this;
    
    var content = this.GAPIStage_CreateDummyFile();
    
    content =JSON.stringify(content);
    
    this._driveLib._saveFile(this.CONFIGFOLDERID, this.CONFIGFILENAME, null, content,function(id){
        that.CONFIGFILEID = id;
        callback(id);
    });
},

GDLoader.prototype.GAPIStage_CreateDummyFile = function(){
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
         
    that._driveLib.ReadConfigFile(that.CONFIGFILEID,function(d){
        that.generations = d.generations;
        that.options = d.options;
        that.layers = d.layers;
        loaded();  
    });
     
},

GDLoader.prototype.GAPIStage_ProcessResponse = function(resp,loaded){
    
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
    
GDLoader.prototype.GAPIStage_ObtainMainFileInfo = function(loaded){
    
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

GDLoader.prototype.GAPIStage_LoadAPI = function(loaded){
    //load the drive api api
    gapi.client.load('drive', 'v2', function(r){
        loaded(r);
    });
},




// GDLoader.prototype.ReadConfigFile = function(configId, callback){
//     var that = this;        
//     var request = gapi.client.drive.files.get({
//       'fileId': configId
//     });
    
//     request.execute(function(resp) {
//       if (resp.id) {
//         var token = gapi.auth.getToken();
        
//         $.ajax(resp.downloadUrl, {
//           headers: {Authorization: 'Bearer ' + token.access_token},
//           success: function(data) {
//             var d = JSON.parse(data);
//             callback(d);
//           }
//         });
//       }
//     });
// };

GDLoader.prototype._makeFolder = function(parentId, folderName, callback){
    
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

// GDLoader.prototype._saveFile = function(parentId, fileName, fileId, content,callback){
    
//     console.log('attempting to savefile: ' + parentId + ' filename ' + fileName + ' file id ' + fileId);
 
//     var metadata = {
//       title: fileName,
//       mimeType: 'application/json',
//       parents: [{id: parentId}]
//     };
    
//     var state = content;
//     var data = new FormData();
//     data.append("metadata", new Blob([ JSON.stringify(metadata) ], { type: "application/json" }));
//     data.append("file", new Blob([ JSON.stringify(state) ], { type: "application/json" }));

//     var token = gapi.auth.getToken();
    
//     if(token == null || token == undefined || token.access_token == null){
//         console.log('TOKEN UNAVAILABLE file not written');
        
//         if(callback)
//             callback();
//     }
//     else
//     {
//         var up = fileId != null ? '/' + fileId : '';
        
//         $.ajax("https://www.googleapis.com/upload/drive/v2/files" + up + "?uploadType=multipart", {
//           data: data,
//           headers: {Authorization: 'Bearer ' + token.access_token},
//           contentType: false,
//           processData: false,
//           type: fileId != null ? 'PUT' : 'POST',
//           success: function(data) {           
//               console.log('File written');
//               if(callback)
//                 callback(data.id);
//           }
//         });
//     }   
// };



