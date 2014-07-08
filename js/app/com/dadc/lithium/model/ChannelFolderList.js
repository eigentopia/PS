// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var ChannelFolderListRequest = function( channel_id, geocode, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/channel/919/folders/us?format=json
    var url = ModelConfig.getServerURLRoot() + "channel/" + channel_id + "/folders/" + geocode + "?format=json";
    Logger.log( url );
    var httpRequestObj;
    var api_retries;
    var http_retries;
    var This = this;

    this.startRequest = function( ){
        http_retries = 0;
        api_retries = 0;
        initHttpRequest();
        httpRequestObj.start();
    }
    this.cancelRequest = function(){
        if(httpRequestObj && httpRequestObj.cancel()){
           httpRequestObj.cancel();
       }
    }

    function initHttpRequest(){
        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

	//httpRequestObj =  ModelConfig.httpClientObj.request( "GET", url, null, AuthenticationInstance.getAuthorizationHeader( url ) );
        // TL 1.3.3 UPDATE
        httpRequestObj =  ModelConfig.httpClientObj.createRequest( "GET", url, { headers: AuthenticationInstance.getAuthorizationHeader( url ) }, null );
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function( data, status ){
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            try{
                var json_data = new ChannelFolderList( JSON.parse( data ) );
                Logger.logObj( JSON.parse( data ) );

                if ( json_data.getStatus().getMessageCode() != 0 && api_retries < ModelConfig.CONFIG.API_ERROR_RETRY ){
                    api_retries++;
                    initHttpRequest();
                    httpRequestObj.start();
                }else if ( json_data.getStatus().getMessageCode() != 0 && api_retries >= ModelConfig.CONFIG.API_ERROR_RETRY ){
                    callback( null, ModelConfig.API_ERROR );
                }else{
                    callback( json_data, status );
                }
            }catch( e ){
                Logger.log( '!!! EXCEPTION !!!' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    }
}
//TESTING BATTING LEADERBOARD
var ChannelFolderListTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var channelFolderListTests = new ChannelFolderListRequest( 919, 'us', function( channelFolderListObj ){
    // DO THE ASSERTIONS
        assertEquals( channelFolderListObj.getItem(0).getName(), "Movie");
        assertEquals( channelFolderListObj.getItem(0).getPlaylistList().getItem(0).getMediaList().getItem(0).getTitle(), "Tortured");
    });
    channelFolderListTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var ChannelFolderList = function( json_data ){
    this.m_data = json_data;
    var itemArray = new Array();

    //CREATING OBJECTS
    var statusObj       = new ChannelFolderListStatus( this.m_data.status );
    this.getTotalItems  = function(){return itemArray.length;}
    this.getItem        = function( index ){return itemArray[ index ]};
    this.getStatus      = function(){return statusObj;}

    //GET ALL THE ITEMS
    for( var i = 0;i < json_data.FolderList.length; i++ ){
        itemArray[ i ] = new ChannelFolder( json_data.FolderList[ i ] );
    }
}

var ChannelFolderListStatus = function( data ){
    this.getMessageCode                 = function(){return data.messageCode;}
    this.getMessageCodeDescription      = function(){return data.messageCodeDescription;}
    this.getMessage                     = function(){return data.message;}
    this.getmessageSubCode              = function(){return data.messageSubCode;}
    this.getMessageSubCodeDescription   = function(){return data.messageSubCodeDescription;}
    this.getAdditionalInfo              = function(){return data.additionalInfo;}
}

var ChannelFolder = function( data ){
    var channelFolderPlaylistListObj    = new ChannelFolderPlaylistList( data.PlaylistList );
    this.getID                          = function(){return data.ID;};
    this.getName                        = function(){return data.Name;};
    this.getDisplayOrder                = function(){return data.DisplayOrder;};
    this.getDateAdded                   = function(){return data.DateAdded;};
    this.getDateLastModified            = function(){return data.DateLastModified;};
    this.getPlaylistList                = function(){return channelFolderPlaylistListObj;};
}

var ChannelFolderPlaylistList = function( data ){
    var itemArray               = new Array();
    var lockedToChannelArray    = new Array();

    //CREATING OBJECTS
    this.getTotalItems              = function(){return itemArray.length;}
    this.getItem                    = function( index ){return itemArray[ index ]};
    this.getLockedToChannelItem     = function( index ){return lockedToChannelArray[ index ];}
    this.getTotalLockedToChannel    = function(){return lockedToChannelArray.length;}

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new ChannelFolderPlaylist( data[ i ] );
    }
    for( i in itemArray ){
        var item = itemArray[ i ];
        if( item.getLockedToChannel() ){
            lockedToChannelArray.push( item );
        }
    }
}

var ChannelFolderPlaylist = function( data ){
    var channelFolderPlaylistMediaListObj = new ChannelFolderPlaylistMediaList( data.MediaList );
    this.getID                          = function(){return data.ID;};
    this.getName                        = function(){return data.Name;};
    this.getDisplayChannelImage         = function(){return data.DisplayChannelImage;};
    this.getHiddenPlaylist              = function(){return data.HiddenPlaylist;};
    this.getMoviePlaylist               = function(){return data.MoviePlaylist;};
    this.getLockedToChannel             = function(){return data.LockedToChannel;};
    this.getDateCreated                 = function(){return data.DateCreated;};
    this.getDateLastModified            = function(){return data.DateLastModified;};
    this.getXItemId                     = function(){return data.XItemId;};
    this.getMediaList                   = function(){return channelFolderPlaylistMediaListObj;};
}

var ChannelFolderPlaylistMediaList = function( data ){
    var itemArray = new Array();
    var dubbedArray = new Array();
    var nonDubbedArray = new Array();

    //CREATING OBJECTS
    this.getTotalItems          = function(){return itemArray.length;}
    this.getItem                = function( index ){return itemArray[ index ]};
    this.getTotalDubbedItems    = function(){return dubbedArray.length;}
    this.getDubbedItem          = function( index ){return dubbedArray[ index ]};
    this.getTotalNonDubbedItems = function(){return nonDubbedArray.length;}
    this.getNonDubbedItem       = function( index ){return nonDubbedArray[ index ]};
    this.getDubbedItemObj       = function(){return dubbedArray;}
    this.getNonDubbedItemObj    = function(){return nonDubbedArray;}

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new ChannelFolderPlaylistMedia( data[ i ] );
    }
    for( i in itemArray ){
        var item = itemArray[ i ];
        if( item.getIsDubbed() ){
            dubbedArray.push( item );
        }
    }
    for( i in itemArray ){
        var item = itemArray[ i ];
        if( !item.getIsDubbed() ){
            nonDubbedArray.push( item );
        }
    }
}

var ChannelFolderPlaylistMedia = function( data ){
    this.getID                          = function(){return data.ID;};
    this.getTitle                       = function(){return data.Title;};
    this.getMediaType                   = function(){return data.MediaType;};
    this.getDetailsURL                  = function(){return data.DetailsURL;};
    this.getDuration                    = function(){return data.Duration;};
    this.getDurationInSeconds           = function(){return data.DurationInSeconds;};
    this.getOneSheetImage               = function(){return data.OneSheetImage;};
    this.getChannelArtTileSmall         = function(){return data.ChannelArtTileSmall;};
    this.getChannelArtTileWide          = function(){return data.ChannelArtTileWide;};
    this.getThumbnail_Wide              = function(){return data.Thumbnail_Wide;};
    this.getThumbnail_Large16x9         = function(){return data.Thumbnail_Large16x9;};
    this.getThumbnailLarge140x79        = function(){return data.ThumbnailLarge140x79;};
    this.getThumbnailExternal           = function(){return data.ThumbnailExternal;};
    this.getThumbnail_Large208x156      = function(){return data.Thumbnail_Large208x156;};
    this.getThumbnail_Large315x236      = function(){return data.Thumbnail_Large315x236;};
    this.getThumbnail_Large421x316      = function(){return data.Thumbnail_Large421x316;};
    this.getOneSheetImage185x277        = function(){return data.OneSheetImage185x277;};
    this.getSeason                      = function(){return data.Season;};
    this.getEpisode                     = function(){return data.Episode;};
    this.getRating                      = function(){return data.Rating;};
    this.getGenre                       = function(){return data.Genre;};
    this.getReleaseDate                 = function(){return data.ReleaseDate;};
    this.getDescription                 = function(){return data.Description;};
    this.getUserRating                  = function(){return data.UserRating;};
    this.getRootChannel                 = function(){return data.RootChannel;};
    this.getRootChannelID               = function(){return data.RootChannelID;};
    this.getXItemId                     = function(){return data.XItemId;};
    this.getParentChannelID             = function(){return data.ParentChannelID;};
    this.getParentChannelName           = function(){return data.ParentChannelName;};
    this.getRightsExpirationDate        = function(){return data.RightsExpirationDate;};
    this.getIsDubbed                    = function(){return data.IsDubbed;};
    this.data = data;
}
