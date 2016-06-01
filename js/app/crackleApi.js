/* jshint asi:true, lastsemic: true */
//Make sure HTTP abstraction is loaded first
include("js/app/com/dadc/lithium/util/HTTP.js")
var CrackleApi = {
    apiUrl: null,
    lang:'us',
    Config:{
        geo:function (cb){
            var url = "http://api.crackle.com/Service.svc/geo/country?format=json";
            Logger.log( "GeoCountryRequest url = " + url );

            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status == 200){
                    cb && cb(data, status)
                }
                else{
                    cb && cb(null, status)
                }
            })
        },
        app: function(cb){
            var url = "http://api.crackle.com/Service.svc/appconfig?format=json";
               
            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status == 200){
                    cb && cb(data, status)
                }
                else{
                    cb && cb(null, status)
                }
            }, true)
       },
       regionApp: function(apiUrl, cb){
            var url = "https://"+ apiUrl+"/Service.svc/appconfig?format=json";
               
            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status == 200){
                    var regionForce = data.ForcedRegistrationOn
                    cb && cb(regionForce)
                }
                else{
                    cb && cb(null, status)
                }
            })
       },
       //stub for now
       getApiUrl: function(){
            return StorageManagerInstance.get( 'api_hostname');
       }
    },
    User:{
        moreUserInfo: function(userData, cb){
            var url = CrackleApi.apiUrl +"profile/"
            var newUserData = userData;
            Http.requestJSON(url + userData.CrackleUserId+"?format=json", "GET", null, null, function(data, status){
                var moreData = data
                if(moreData && moreData.status.messageCode == 0){
                    newUserData.userAge = moreData.age;
                    newUserData.userGender = moreData.gender;
                }

                cb(newUserData)
            })
        },
        watchlist: function(crackleUser, cb){
            var url = CrackleApi.apiUrl + "queue/queue/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' ) +"?format=json";
            if(crackleUser.id != null){
                var d = new Date();
                //var ord = "&ord=" + (d.getTime() + Math.floor((Math.random()*100)+1)).toString();
            
                Http.requestJSON(url, "GET", null, null, function(data, status){
                    if(data != null && status == 200){
                        crackleUser.watchlist = [];
                        var items = data.Items;
                        crackleUser.watchlist = items.slice(0);

                        cb(data, status)
                    }
                    else{
                        cb(null, status)
                    }
                })
            }
        },
        history: function(cb){
            if(crackleUser.id != ""){
                var url = CrackleApi.apiUrl + "queue/history/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
                Http.request(url, "GET", null, null, function(data, status){
                    if(data != null && status == 200){
                        if(cb){
                            cb(data, status)
                        }
                    }
                    else{
                        if(cb){
                            cb(null, status)
                        }
                    }
                })
            }
        },
        addToWatchlist: function (id, type, cb){
            var url =  CrackleApi.apiUrl + "queue/queue/add/member/"+ crackleUser.id +"/"+type+"/"+id;
            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status ==200){
                    ApplicationController.getUserWatchList(function(data, status){
                        cb && cb(true)
                    })
                }
                else{
                    cb && cb(false, status)
                }
            })
        },
        removeFromWatchlist : function(id, type, callback){
            var url =  CrackleApi.apiUrl + "queue/queue/remove/member/"+ crackleUser.id +"/"+type+"/"+id;
            Http.requestJSON(url, "GET", null, null, function(data, status){
                if(data != null && status ==200){
                    ApplicationController.getUserWatchList(function(data, status){
                        callback && callback(true)
                    })
                }
                else{
                    callback && callback(false, status)
                }
            })
        },
        pauseResumeList: function(callback){
            if(Crackle.User.id != ""){
                var url =  CrackleApi.apiUrl + "pauseresume/list/member/"+ crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
                Http.requestJSON(url, "GET", null, null, function(data, status){
                    if(data != null && status ==200 && data.Progress && data.Progress.length>0){
                        for(var i=0; i<data.Progress.length; ++i){
                            var item = data.Progress[i];
                            StorageManagerInstance.set( 'video_progress_' + item.MediaId, item.DurationInSeconds );
                        }
                        callback&&callback(true)
                    }
                    else{
                        callback&&callback(false, status)
                    }
                })
                HTTP.startRequest()
            }
            else{
                callback&&callback(true)
            }
        },
        sso: function(cb) {
            var authUrl = "externaluser/sso?format=json";
            var returnData = null;
            var id = (PlaystationConfig.hashedDeviceID !== null)?PlaystationConfig.hashedDeviceID:"testeridforplaystation"
            var body = { data:JSON.stringify({"AffiliateUserId": id}) }
            //console.log(self.apiUrl + authUrl)
            //HTTP.request(self.apiUrl + authUrl, "POST", body,
            Http.requestJSON(CrackleApi.apiUrl + authUrl, "POST", body, null, function(data, status){
                if (data !== null) {
                    //console.log("NOT NULL");
                    //console.log(JSON.stringify(data));.
                    if (data.status && data.status.messageCode){
                        if (data.status.messageCode == "0") {
                            returnData = data //could be a code or user information- check on the back end
                        }
                    }
                }
                
                cb && cb(returnData)
            }, true)
        },

        silentAuth: function (id, cb) {
            var silentUrl = "externaluser/sso/auto?format=json";
            var body ={data: JSON.stringify({ "AffiliateUserId": PlaystationConfig.hashedDeviceID, "CrackleUserId": parseInt(id) }), dataType:"Application/Json"}
            //console.log("SILENT " + deviceId + " " + crackleUserId)
            //console.log("URL: " + self.apiUrl + silentUrl)
            Http.requestJSON(CrackleApi.apiUrl + silentUrl, "POST", body, null, function(data, status){
                if (data !== null) {
                    if (data.status && data.status.messageCode) {
                        //console.log("SILENT 0st" + JSON.stringify(data.status));
                        if (data.status.messageCode == "0") {
                            //console.log("SILENT 1st" + data.status.message);
                            sso(function (user) {
                                if (user.status.messageCode == "0") {
                                    if (user.CrackleUserId !== "") { //Did we get a userID back?
                                        cb && cb(user)
                                    }
                                }
                            })
                        }
                    }
                }
            })
        },

        deactivate: function(usrId) {

            var deactivateUrl = "externaluser/deactivate?format=json"
            var userId = (usrId) ? usrId : id;
            var body = { data: JSON.stringify({"AffiliateUserId": PlaystationConfig.hashedDeviceID, "CrackleUserId": parseInt(userId) })}
            //console.log(self.apiUrl + deactivateUrl)
            Http.requestJSON(CrackleApi.apiUrl + deactivateUrl, "POST", body, null, function(data, status){
                if (data !== null) {
                    if (data.status && data.status.messageCode) {
                        //console.log("DEACT" + JSON.stringify(data.status));
                        if (data.status.messageCode == "0") {
                            //check here for bizarre message from server.
                            return true
                        }
                        else {
                            return false
                        }
                    }
                } else {
                    console.error('Failed to deactivate this device.');
                    return false
                }
            })
        },

    }, //End User
    MediaItem:{
        setPauseResumePoint : function(id, duration, callback){
            var d  = parseInt(duration)
            var url =  "pauseresume/media/"+id+"/set/"+ d+"/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
            Http.request(CrackleApi.apiUrl + url, "GET", null, null, function(data, status){
                console.log("CALLING setPauseResumePoint ")
                if(data != null && status ==200){
                    StorageManagerInstance.set( 'video_progress_' + id, duration)
                    callback&&callback(true)
                }
                else{
                    callback&&callback(false, status)
                }
            })
        }
    }, //End Media Item
    Collections:{
        slideShow: function(category, callback){
            var url = "slideshow/"+ category +"/"+StorageManagerInstance.get( 'geocode' );
            Http.request(CrackleApi.apiUrl + url, "GET", null, null, function(data, status){
                if(data != null && status ==200){
                    var slideList = data.slideList

                    var slideShowList = []
                    for (var i; i< slideList.length;i++){
                        slide.ItemID = item[i].slideID;
                        slide.Title = item[i].title;
                        slide.Description = item[i].slideDescription;
                        slide.Showcase720p = item[i].SlideImage_567x194
                        slide.Showcase1080p = item[i].slideImage; // this should be 920x332
                        slide.ItemID = item[i].appDataID;
                        slide.NextScreenType = item[i].appNextScreenType;

                    }

                    callback&&callback(slideShowList)
                }
                else{
                    callback&&callback(false, status)
                }

            })
        },
        showEpisodeList: function(id, cb){
            var url = "channel/" + id + "/folders/" + StorageManagerInstance.get( 'geocode' ) + "?format=json";
            Logger.log( "showEpisodeList " + url );
            Http.request(CrackleApi.apiUrl + url, "GET", null, null, function(data, status){
                if(data != null && status ==200){
                    channel_folder_list = data;
                    
                    for( var i = 0; i < folders_cnt; i++ ){
                        var folder_obj  = channel_folder_list.getItem( i );
                        var folder_name = folder_obj.getName();
                        var playlistListObj = folder_obj.getPlaylistList();
                        
                        if( playlistListObj.getTotalLockedToChannel() > 0 ){
                            for( var ii = 0; ii < playlistListObj.getTotalLockedToChannel(); ii++ ){
                                var playlistObj = playlistListObj.getLockedToChannelItem( ii );
                                for( var iii = 0; iii < playlistObj.getMediaList().getTotalItems(); iii++ ){
                                    var a = playlistObj.getMediaList()
                                    var b =playlistObj.getMediaList().getItem( iii );
                                    var id =b.getID()
                                    media_objs.push( playlistObj.getMediaList().getItem( iii ) );
                                }
                            }
                        }
                    }

                    cb&&cb(media_objs, status)

                }
                else{
                    cb&&cb(false, status)
                }
            })
        },
        channelFeature:function(nextVideo){
            var channel_details_request = new ChannelDetailsRequest( nextVideo.ID, StorageManagerInstance.get( 'geocode' ), function( ChannelDetailsObj, status ){
                if ( status != 200 ){
    //                // inform our parent controller our request failed
                    ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                }else{
                    var channelId = ChannelDetailsObj.getID();
                    var channel_folder_list_request = new ChannelFolderListRequest( channelId, StorageManagerInstance.get( 'geocode' ), function( ChannelFolderListObj, status ){
                        if ( status != 200 ){
                            // inform our parent controller our request failed
                            ParentControllerObj.notifyPreparationStatus( m_unique_id, Controller.PREPARATION_STATUS.STATUS_ERROR );                    
                        }else{

                            var folder_obj  = ChannelFolderListObj.getItem( 0);
                            var folder_name = folder_obj.getName();
                            var playlistListObj = folder_obj.getPlaylistList();

                            if( playlistListObj.getTotalLockedToChannel() > 0 ){
                                var playlistObj = playlistListObj.getLockedToChannelItem( 0 );
                                var item =playlistObj.getMediaList().getItem( 0 );
                                //console.log("**** iiiget"+item.getID())
                                //if( ChannelDetailsObj.getFeaturedMedia() == null ){
                                currentMediaList.splice(currentMediaListIndex, 1, item)
                               // }else{
                               //     doMediaRequest( channelId );
//                                }
                            }

                        }

                    })
                    channel_folder_list_request.startRequest();
                    
                
                }
            });
            channel_details_request.startRequest();
        },
        featured: function(){

        }
    }// End Collections.
}

include( "js/app/com/dadc/lithium/util/UtilLibrary.js" );
include( "js/app/com/dadc/lithium/util/StorageManager.js" );
include( "js/app/com/dadc/lithium/util/md5.js")

var PlaystationConfig = {
        setConfig:function(cb){
            //First, where are you?
            CrackleApi.Config.geo(function(data, status){
                console.log("GOT API GEO CONFIG")
                console.log(status)
                console.dir(data)
                if(data !== null){
                    var id = data.ID
                    var cc = data.CountryCode
                    var cn = data.CountryName
                    var ip = data.IPAddress
                    
                    if( LoggerConfig.GeocodeConfig.hasOwnProperty( 'FAKE_COUNTRY' ) && LoggerConfig.GeocodeConfig.FAKE_COUNTRY ){
                        console.log("Found a fake " + LoggerConfig.GeocodeConfig.FAKE_COUNTRY)
                        cc = LoggerConfig.GeocodeConfig.FAKE_COUNTRY;
                    }
                    StorageManagerInstance.set( 'geocode', cc);
                    StorageManagerInstance.set( StorageManager.STORAGE_KEYS.IPADDRESS, ip );
                    
                    //Second, based on where you are, which API URL should we use?
                    CrackleApi.Config.app(function(configdata, status){
                        if(configdata !== null){
                            var supportedRegions = configdata.SupportedRegions;
                            var lang = null;
                            var apiUrl = null;

                            for( var i in supportedRegions ){
                                if( supportedRegions[ i ].CountryCode == cc ){
                                    apiUrl = supportedRegions[ i ].ApiHostName;
                                    lang = supportedRegions[ i ].Language;
                                    PlaystationConfig.forcedRegistration = supportedRegions[ i ].ForcedRegistrationOn
                                    console.log("API URL "+ apiUrl)
                                    break;
                                }
                            }

                            if (apiUrl == null){
                                // error in app config
                                cb && cb(null)
                                return;
                            }


                            //StorageManagerInstance.set( 'api_hostname', apiUrl );
                            CrackleApi.apiUrl = "https://"+apiUrl+"/Service.svc/"
                            //CrackleApi.apiUrl = ModelConfig.getServerURLRoot()
                            
                            //CrackleApi.apiUrl = "https://staging-v1-api-us.crackle.com/Service.svc/"
                            //CrackleApi.apiUrl = "https://staging-api-us.crackle.com/Service.svc/"
                            //ES
                            // StorageManagerInstance.set( 'geocode', 'MX');
                            // CrackleApi.apiUrl = "https://ps3-api-es.crackle.com/Service.svc/"
                                
                            if(engine.stats.locale && engine.stats.locale == "fr_FR"){
                                StorageManagerInstance.set( 'lang', 'fr');
                                CrackleApi.lang = 'fr'
                            }
                            else{
                                StorageManagerInstance.set( 'lang', lang );
                                CrackleApi.lang = lang
                            }
                            // StorageManagerInstance.set( 'lang', 'es' );
                            // CrackleApi.lang = 'es'
                            cb && cb("YAY")
                        }
                        else{
                            //error in app configuration
                            cb && cb(null)
                        }
                    })
                }
                else{
                    //error with geo
                    cb && cb(null)
                }
            })
        },
        hashedDeviceID: Crypto.HMAC( Crypto.SHA1, engine.stats.device.id, engine.stats.device.platform ),
        forcedRegistration: false
}

var SSAuth = function( callback ){
    //SAMPLE URL        sso: function(cb) {
    var authUrl ="https://" + CrackleApi.Config.getApiUrl() +"/externaluser/sso?format=json";
    var id = (PlaystationConfig.hashedDeviceID !== null)?PlaystationConfig.hashedDeviceID:"testeridforplaystation"
    var body = { data:JSON.stringify({"AffiliateUserId": id}) }

    //http://api.crackle.com/Service.svc/recent/movies/all/us/30?format=json
//    var url = "http://localhost/crackle/crackle.php";
    Logger.log( "URL - SSO: " + authUrl );

    var httpRequestObj;
    var This = this;
    var http_retries;

//     var extra_headers =
//           {
// //            'Keep-Alive': 'timeout=15',
//               'Connection': 'Close',
//               'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19',
//               //'X-Forwarded-For': StorageManagerInstance.get( 'IPADDRESS' )
//               'X-Forwarded-For': StorageManagerInstance.get( StorageManager.STORAGE_KEYS.IPADDRESS )
//           };

    this.startRequest = function(){
        http_retries = 0;
        initHttpRequest();
        httpRequestObj.start();
    }

    this.onRequestComplete = function( data, status ){
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else{
            Logger.log( 'onRequestComplete SSO' );
            Logger.log( data );

            callback(data)
        }
    }

    function initHttpRequest(){
        ModelConfig.httpClientObj.disableCertValidation( false );
        ModelConfig.httpClientObj.disablePipelining();

        // TL 1.3.3 UPDATE
        httpRequestObj = ModelConfig.httpClientObj.createRequest( "POST", authUrl,  { headers:{"Authorization":AuthenticationInstance.getAuthorizationHeader( authUrl ),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19',
                    'Contet-Type':'application/json'} }, null );
        httpRequestObj.onComplete = This.onRequestComplete;
        httpRequestObj.onResponse = This.onResponse;
        httpRequestObj.sendBody( body.data );
    }
}