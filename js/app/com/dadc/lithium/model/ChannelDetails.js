// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var ChannelDetailsRequest = function( channel_id, geocode, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/details/channel/919/us?format=json
    var url = ModelConfig.getServerURLRoot() + "details/channel/" + channel_id + "/" + geocode + "?format=json";
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

        // TL 1.3.3 UPDATE
        httpRequestObj =  ModelConfig.httpClientObj.createRequest( "GET", url, { headers: AuthenticationInstance.getAuthorizationHeader( url ) }, null );
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function( data, status ){
        Logger.log( data );
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            try{
                var json_data = new ChannelDetails( JSON.parse( data ) );
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
var ChannelDetailsTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var channelDetailsTests = new ChannelDetailsRequest( 919, 'us', function( channelDetailsObj ){
    // DO THE ASSERTIONS
        assertEquals( channelDetailsObj.getName(), "Tortured");
        assertEquals( channelDetailsObj.getFeaturedMedia().getRootChannel(), "Movies");
        assertEquals( channelDetailsObj.getFeaturedMedia().getChapters().getItem(0).getName(), "pre-roll");
    });
    channelDetailsTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var ChannelDetails = function( json_data ){
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj                       = new ChannelDetailsStatus( this.m_data.status );
    var channelDetailsFeaturedMediaObj  = null;

    this.getStatus                      = function(){ return statusObj; }

    if ( json_data.FeaturedMedia ){
        channelDetailsFeaturedMediaObj  = new ChannelDetailsFeaturedMedia( json_data.FeaturedMedia );
    }

    this.getID                          = function(){return json_data.ID;};
    this.getName                        = function(){return json_data.Name;};
    this.getChannelUrl                  = function(){return json_data.ChannelUrl;};
    this.getSEOTitle                    = function(){return json_data.SEOTitle;};
    this.getParentId                    = function(){return json_data.ParentId;};
    this.getRating                      = function(){return json_data.Rating;};
    this.getDescription                 = function(){return json_data.Description;};
    this.getClipsOnly                   = function(){return json_data.ClipsOnly;};
    this.getTags                        = function(){return json_data.Tags;};
    this.getSynopsis                    = function(){return json_data.Synopsis;};
    this.getWhyItCrackles               = function(){return json_data.WhyItCrackles;};
    this.getStarring                    = function(){return json_data.Starring;};
    this.getDirector                    = function(){return json_data.Director;};
    this.getReleaseYear                 = function(){return json_data.ReleaseYear;};
    this.getGenre                       = function(){return json_data.Genre;};
    this.getChannelArtTileSmall         = function(){return json_data.ChannelArtTileSmall;};
    this.getChannelArtTileWide          = function(){return json_data.ChannelArtTileWide;};
    this.getChannelArtTileOneSheet      = function(){return json_data.ChannelArtTileOneSheet;};
    this.getChannelArtTileLarge         = function(){return json_data.ChannelArtTileLarge;};
    this.getChannelArtLandscape         = function(){return json_data.ChannelArtLandscape;};
    this.getChannelArt_156_156          = function(){return json_data.ChannelArt_156_156;};
    this.getChannelArt_208_156          = function(){return json_data.ChannelArt_208_156;};
    this.getChannelArt_315_236          = function(){return json_data.ChannelArt_315_236;};
    this.getChannelArt_185_277          = function(){return json_data.ChannelArt_185_277;};
    this.getThumbnailURL                = function(){return json_data.ThumbnailURL;};
    this.getDisclaimer                  = function(){return json_data.Disclaimer;};
    this.getRanking                     = function(){return json_data.Ranking;};
    this.getCount                       = function(){return json_data.Count;};
    this.getDateContentLastUpdated      = function(){return json_data.DateContentLastUpdated;};
    this.getXItemId                     = function(){return json_data.XItemId;};
    this.getSplashVideoUrl              = function(){return json_data.SplashVideoUrl;};
    this.getFeaturedMedia               = function(){return channelDetailsFeaturedMediaObj;};
    this.getFeaturedTrailer             = function(){return json_data.FeaturedTrailer;};
    this.getRootChannel                 = function(){return json_data.RootChannel;};
    this.getRootChannelID               = function(){return json_data.RootChannelID; };
    this.getShowName                    = function(){return json_data.ShowName;};

    //GETTERS
}

var ChannelDetailsStatus = function( data ){
    this.getMessageCode                 = function(){return data.messageCode;}
    this.getMessageCodeDescription      = function(){return data.messageCodeDescription;}
    this.getMessage                     = function(){return data.message;}
    this.getmessageSubCode              = function(){return data.messageSubCode;}
    this.getMessageSubCodeDescription   = function(){return data.messageSubCodeDescription;}
    this.getAdditionalInfo              = function(){return data.additionalInfo;}
}

this.ChannelDetailsFeaturedMedia = function( data ){
    var channelDetailsFeaturedMediaChaptersListObj;
    var channelDetailsFeaturedMediaParentChannelDetailsSummaryObj;
    var channelDetailsFeaturedMediagetThumbnailScourDetailsObj;

    if ( data.Chapters )
        channelDetailsFeaturedMediaChaptersListObj = new ChannelDetailsFeaturedMediaChaptersList( data.Chapters );
    if ( data.ParentChannelDetailsSummary )
        channelDetailsFeaturedMediaParentChannelDetailsSummaryObj= new ChannelDetailsFeaturedMediaParentChannelDetailsSummary( data.ParentChannelDetailsSummary );
    if ( data.ThumbnailScourDetails )
        channelDetailsFeaturedMediagetThumbnailScourDetailsObj= new ChannelDetailsFeaturedMediaThumbnailScourDetails( data.ThumbnailScourDetails );

    this.getStatus                      = function(){return data.status;};
    this.getParentChannelDetailsSummary = function(){return channelDetailsFeaturedMediaParentChannelDetailsSummaryObj;};
    this.getID                          = function(){return data.ID;};
    this.getGUID                        = function(){return data.GUID;};
    this.getTitle                       = function(){return data.Title;};
    this.getShowName                    = function(){return data.ShowName;};
    this.getRootChannel                 = function(){return data.RootChannel;};
    this.getRootChannelID               = function(){return data.RootChannelID;};
    this.getReleaseYear                 = function(){return data.ReleaseYear;};
    this.getReleaseDate                 = function(){return data.ReleaseDate;};
    this.getSEOTitle                    = function(){return data.SEOTitle;};
    this.getDescription                 = function(){return data.Description;};
    this.getTags                        = function(){return data.Tags;};
    this.getAmazonLink                  = function(){return data.AmazonLink;};
    this.getITunesLink                  = function(){return data.ITunesLink;};
    this.getEpisode                     = function(){return data.Episode;};
    this.getSeason                      = function(){return data.Season;};
    this.getAspectRatio                 = function(){return data.AspectRatio;};
    this.getMediaType                   = function(){return data.MediaType;};
    this.getShowAdBefore                = function(){return data.ShowAdBefore;};
    this.getShowAdAfter                 = function(){return data.ShowAdAfter;};
    this.getScrubbingForgiveness        = function(){return 30 }//data.ScrubbingForgiveness;};
    this.getPromotion                   = function(){return data.Promotion;};
    this.getPromoted                    = function(){return data.Promoted;};
    this.getEditorDescription           = function(){return data.EditorDescription;};
    this.getCast                        = function(){return data.Cast;};
    this.getDirectors                   = function(){return data.Directors;};
    this.getWriters                     = function(){return data.Writers;};
    this.getProducers                   = function(){return data.Producers;};
    this.getStudio                      = function(){return data.Studio;};
    this.getGenre                       = function(){return data.Genre;};
    this.getShowRatingCard              = function(){return data.ShowRatingCard;};
    this.getPremium                     = function(){return data.Premium;};
    this.getPermaLink                   = function(){return data.PermaLink;};
    this.getCountViewsDaily             = function(){return data.CountViewsDaily;};
    this.getCountViews                  = function(){return data.CountViews;};
    this.getDuration                    = function(){return data.Duration;};
    this.getDurationInSeconds           = function(){return data.DurationInSeconds;};
    this.getDimensions                  = function(){return data.Dimensions;};
    this.getFrameRate                   = function(){return data.FrameRate;};
    this.getThumbnail_OneSheet          = function(){return data.Thumbnail_OneSheet;};
    this.getThumbnail_Wide              = function(){return data.Thumbnail_Wide;};
    this.getThumbnail_Large16x9         = function(){return data.Thumbnail_Large16x9;};
    this.getThumbnailLarge140x79        = function(){return data.ThumbnailLarge140x79;};
    this.getThumbnailExternal           = function(){return data.ThumbnailExternal;};
    this.getThumbnail_Large208x156      = function(){return data.Thumbnail_Large208x156;};
    this.getThumbnail_Large315x236      = function(){return data.Thumbnail_Large315x236;};
    this.getThumbnail_Large421x316      = function(){return data.Thumbnail_Large421x316;};
    this.getThumbnail_OneSheet185x277   = function(){return data.Thumbnail_OneSheet185x277;};
    this.getThumbnail_OneSheet400x600   = function(){return data.Thumbnail_OneSheet400x600;};
    this.getUserRating                  = function(){return data.UserRating;};
    this.getRating                      = function(){return data.Rating;};
    this.getWhyItCrackles               = function(){return data.WhyItCrackles;};
    this.getXItemId                     = function(){return data.XItemId;};
    this.getRightsExpirationDate        = function(){return data.RightsExpirationDate;};
    this.getChapters                    = function(){return channelDetailsFeaturedMediaChaptersListObj;};
    this.getMediaURLs                   = function(){return data.MediaURLs;};
    this.getThumbnailScourDetails       = function(){return channelDetailsFeaturedMediagetThumbnailScourDetailsObj;};
}

var ChannelDetailsFeaturedMediaChaptersList = function( data ) {
    var itemArray = new Array();
    this.getTotalItems       = function(){return itemArray.length;}
    this.getItem             = function( index ){return itemArray[ index ]};

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new ChannelDetailsFeaturedMediaChapter( data[ i ] );
    }
}

var ChannelDetailsFeaturedMediaThumbnailScourDetails = function( data ){
    this.getUrlPattern              = function(){return data.UrlPattern;};
    this.getIntervalSeconds         = function(){return data.IntervalSeconds;};

}
var ChannelDetailsFeaturedMediaParentChannelDetailsSummary = function( data ){
    this.getID                      = function(){return data.ID;};
    this.getName                    = function(){return data.Name;};
    this.getDescription             = function(){return data.Description;};
    this.getWhyItCrackles           = function(){return data.WhyItCrackles;};
    this.getSplashVideoUrl          = function(){return data.SplashVideoUrl;};
}

var ChannelDetailsFeaturedMediaChapter = function( data ){
    this.getName                    = function(){return data.Name;};
    this.getStartTime               = function(){return data.StartTime;};
    this.getStartTimeInMilliSeconds = function(){return data.StartTimeInMilliSeconds;};
    this.getShowAdBefore            = function(){return data.ShowAdBefore;};
}

var ChannelDetailsFeaturedMediaOmnitureTrackingVarsList = function( data ) {
    var itemArray = new Array();
    this.getTotalItems       = function(){return itemArray.length;}
    this.getItem             = function( index ){return itemArray[ index ]};

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new ChannelDetailsFeaturedMediaOmnitureTrackingVar( data[ i ] );
    }
}

var ChannelDetailsFeaturedMediaOmnitureTrackingVar = function( data ){
    this.getKey     = function(){return data.Key;};
    this.getValue   = function(){return data.Value;};
}

