include("js/app/com/dadc/lithium/util/HTTP.js")

 var CrackleApi = {
	appconfig: function(cb){
		var url = "https://api.crackle.com/Service.svc/appconfig?format=json";
           
        HTTP.request(url, "GET", function(data, status){
            if(data != null && status == 200){
                crackleUser.watchlist = [];
                var items = data.Items;
                crackleUser.watchlist = items.slice(0);

                cb && cb(data, status)
            }
            else{
                cb && cb(null, status)
            }
        })
	},
    User:{
    	watchList: function(cb){
    		var url = ModelConfig.getServerURLRoot() + "queue/queue/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
            HTTP.request(url, "GET", function(data, status){
                if(data != null && status == 200){


                    cb && cb(data, status)
                }
                else{
                    cb && cb(null, status)
                }
            })
        },
        history: function(cb){
            if(crackleUser.id != ""){
                var url = ModelConfig.getServerURLRoot() + "queue/history/list/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
                HTTP.request(url, "GET", function(data, status){
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
            var url =  ModelConfig.getServerURLRoot() + "queue/queue/add/member/"+ crackleUser.id +"/"+type+"/"+id;
            HTTP.request(url, "GET", function(data, status){
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
            var url =  ModelConfig.getServerURLRoot() + "queue/queue/remove/member/"+ crackleUser.id +"/"+type+"/"+id;
            HTTP.request(url, "GET", function(data, status){
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
                var url =  ModelConfig.getServerURLRoot() + "pauseresume/list/member/"+ crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
                HTTP.request(url, "GET", function(data, status){
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
    }, //End User
    MediaItem:{
        setPauseResumePoint : function(id, duration, callback){
            var d  = parseInt(duration)
            var url =  ModelConfig.getServerURLRoot() + "pauseresume/media/"+id+"/set/"+ d+"/member/"+crackleUser.id+"/"+StorageManagerInstance.get( 'geocode' );
            HTTP.request(url, "GET", function(data, status){
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
            HTTP.request(url, "GET", function(data, status){
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
            var channelUrl = ModelConfig.getServerURLRoot() + "channel/" + id + "/folders/" + StorageManagerInstance.get( 'geocode' ) + "?format=json";
            Logger.log( "showEpisodeList " + channelUrl );
            HTTP.request(channelUrl, "GET", function(data, status){
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

    //send whole object? getAPI: function(obj, cb) {var foo = ObjectByType(obj) do stuff return something based on foo}
}
