// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var MediaDetailsRequest = function( media_id, geocode, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/details/media/2482483/us?format=json
    var url = ModelConfig.getServerURLRoot() + "details/media/" + media_id + "/" + geocode + "?format=json";
    Logger.log( "MEDIA DETAILS URL:" + url );
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
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            try{
                var json_data = new MediaDetails( JSON.parse( data ) );
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
var MediaDetailsTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var mediaDetailsTests = new MediaDetailsRequest( 2482483, 'us', function( mediaDetailsObj ){
    // DO THE ASSERTIONS
        assertEquals( mediaDetailsObj.getTitle(), "Tortured");
        assertEquals( mediaDetailsObj.getPermaLink(), "http://www.crackle.com/c/Tortured/Tortured/2482483");
        assertEquals( mediaDetailsObj.getChapters().getItem(0).getName(), "pre-roll");
    });
    mediaDetailsTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var MediaDetails = function( json_data ){
    this.m_data = json_data;
    this.data = json_data;
    var self = this;
    //CREATING OBJECTS
    var statusObj                                       = new MediaDetailsStatus( this.m_data.status );
    //var mediaDetailsParentChannelDetailsSummaryObj;
    var mediaDetailsChaptersListObj;
    //var mediaDetailsThumbnailScourDetailsObj;
    var mediaDetailsOmnitureTrackingVarsListObj;

    //if ( this.m_data.ParentChannelDetailsSummary )
    //    mediaDetailsParentChannelDetailsSummaryObj      = new MediaDetailsParentChannelDetailsSummary( this.m_data.ParentChannelDetailsSummary );
    if ( this.m_data.Chapters )
        mediaDetailsChaptersListObj                     = new MediaDetailsChaptersList( json_data.Chapters );
    //if ( this.m_data.ThumbnailScourDetails )
    //    mediaDetailsThumbnailScourDetailsObj            = new MediaDetailsThumbnailScourDetails( json_data.ThumbnailScourDetails );
    if ( this.m_data.OmnitureTrackingVars )
        mediaDetailsOmnitureTrackingVarsListObj         = new MediaDetailsOmnitureTrackingVarsList( json_data.OmnitureTrackingVars );

    this.getDimensionWidth = function(){
        var dim_arr = this.m_data.Dimensions.split( 'x' );

        if( dim_arr.length == 2 ){
            return dim_arr[ 0 ];
        }else{
            return 1920;
        }
    }
    this.getDimensionHeight = function(){
        var dim_arr = this.m_data.Dimensions.split( 'x' );

        if( dim_arr.length == 2 ){
            return dim_arr[ 1 ];
        }else{
            return 1080;
        }
    }

    this.getStatus      = function(){ return statusObj; };

    //this.getParentChannelDetailsSummary = function(){return mediaDetailsParentChannelDetailsSummaryObj;};
    this.getID                          = function(){return this.m_data.ID;};
    //this.getGUID                        = function(){return this.m_data.GUID;};
    this.getTitle                       = function(){return this.m_data.Title;};
    this.getShowName                    = function(){return this.m_data.ShowName;};
    this.getRootChannel                 = function(){return this.m_data.RootChannel;};
    this.getRootChannelID               = function(){return this.m_data.RootChannelID; };
    //this.getReleaseYear                 = function(){return this.m_data.ReleaseYear;};
    //this.getReleaseDate                 = function(){return this.m_data.ReleaseDate;};
    //this.getSEOTitle                    = function(){return this.m_data.SEOTitle;};
    this.getDescription                 = function(){return this.m_data.Description;};
    //this.getTags                        = function(){return this.m_data.Tags;};
    //this.getAmazonLink                  = function(){return this.m_data.AmazonLink;};
    //this.getITunesLink                  = function(){return this.m_data.ITunesLink;};
    this.getEpisode                     = function(){return this.m_data.Episode;};
    this.getSeason                      = function(){return this.m_data.Season;};
    //this.getAspectRatio                 = function(){return this.m_data.AspectRatio;};
    this.getMediaType                   = function(){return this.m_data.MediaType;};
    this.getItemType                   = function(){return this.m_data.ItemType;};
    //this.getShowAdBefore                = function(){return this.m_data.ShowAdBefore;};
    //this.getShowAdAfter                 = function(){return this.m_data.ShowAdAfter;};
    this.getScrubbingForgiveness        = function(){return 30 }//this.m_data.ScrubbingForgiveness;};
    //this.getPromotion                   = function(){return this.m_data.Promotion;};
    //this.getPromoted                    = function(){return this.m_data.Promoted;};
    //this.getEditorDescription           = function(){return this.m_data.EditorDescription;};
    this.getCast                        = function(){return this.m_data.Cast;};
    this.getDirectors                   = function(){return this.m_data.Directors;};
    this.getWriters                     = function(){return this.m_data.Writers;};
    //this.getProducers                   = function(){return this.m_data.Producers;};
    //this.getStudio                      = function(){return this.m_data.Studio;};
    this.getGenre                       = function(){return this.m_data.Genre;};
    //this.getShowRatingCard              = function(){return this.m_data.ShowRatingCard;};
    //this.getPremium                     = function(){return this.m_data.Premium;};
    //this.getPermaLink                   = function(){return this.m_data.PermaLink;};
    //this.getCountViewsDaily             = function(){return this.m_data.CountViewsDaily;};
    //this.getCountViews                  = function(){return this.m_data.CountViews;};
    this.getDuration                    = function(){return this.m_data.Duration;};
    this.getDurationInSeconds           = function(){return this.m_data.DurationInSeconds;};
    this.getChannelArtTileLarge         = function(){return this.m_data.Thumbnail_OneSheet185x277;};
    //this.getDimensions                  = function(){return this.m_data.Dimensions;};
    //this.getFrameRate                   = function(){return this.m_data.FrameRate;};
    //this.getThumbnail_OneSheet          = function(){return this.m_data.Thumbnail_OneSheet;};
    //this.getThumbnail_Wide              = function(){return this.m_data.Thumbnail_Wide;};
    //this.getThumbnail_Large16x9         = function(){return this.m_data.Thumbnail_Large16x9;};
    //this.getThumbnailLarge140x79        = function(){return this.m_data.ThumbnailLarge140x79;};
    //this.getThumbnailExternal           = function(){return this.m_data.ThumbnailExternal;};
    //this.getThumbnail_Large208x156      = function(){return this.m_data.Thumbnail_Large208x156;};
    //this.getThumbnail_Large315x236      = function(){return this.m_data.Thumbnail_Large315x236;};
    //this.getThumbnail_Large421x316      = function(){return this.m_data.Thumbnail_Large421x316;};
    this.getThumbnail_OneSheet185x277   = function(){return this.m_data.Thumbnail_OneSheet185x277;};
    //this.getThumbnail_OneSheet400x600   = function(){return this.m_data.Thumbnail_OneSheet400x600;};
    this.getUserRating                  = function(){return this.m_data.UserRating;};
    this.getRating                      = function(){return this.m_data.Rating;};
    this.getWhyItCrackles               = function(){return this.m_data.WhyItCrackles;};
    this.getXItemId                     = function(){return this.m_data.XItemId;};
    this.getRightsExpirationDate        = function(){return this.m_data.RightsExpirationDate;};
    this.getChapters                    = function(){return mediaDetailsChaptersListObj;};
    this.getRelatedItemsByMPM           = function(){return this.m_data.getRelatedItemsByMPM}
    this.getFeaturedMedia               = function(){return self;}

    this.getMediaURLs = function(){
        var mediaUrls =[]
        //LL must be here for text display
        //mediaUrls.push({Path:"http://ottusns-s.akamaihd.net/ondemand/1/m/wm/urfyb_OTT_SmoothStreaming.ism/Manifest",LocalizedLanguage:"en"})
        //return mediaUrls;
        try{
            var defaultMediaUrl = getVideoURLFromList(this.m_data.MediaURLs);
            defaultMediaUrl.LocalizedLanguage = this.m_data.LocalizedLanguage;

            //mediaUrls.push("http://ottusns-s.akamaihd.net/ondemand/1/m/wm/urfyb_OTT_SmoothStreaming.ism/Manifest")
            // console.log("URLS")
            // console.dir(mediaUrls)
            // console.dir(this.m_data.MediaURLs)

            //So this is where related things are hidden
            //m_data.RelatedItemsByMPM[ofObjects].LocalizedLanguage - for display in Row
            //m_data.RelatedItemsByMPM[ofObjects].MediaUrls[ofObjects].Path
            if(this.m_data.RelatedItemsByMPM && this.m_data.RelatedItemsByMPM.length > 0){
                var relatedItems = this.m_data.RelatedItemsByMPM;
                for(var item = 0; item< relatedItems.length;item++){
                    if(relatedItems[item].MediaURLs && relatedItems[item].MediaURLs.length > 0){
                        var url = getVideoURLFromList( relatedItems[item].MediaURLs);
                        //LL must be here for text display
                        url.LocalizedLanguage = relatedItems[item].LocalizedLanguage
                        mediaUrls.push(url);
                    }
                }
            }
                
            return mediaUrls;
        }
        catch(e){
            return null
        }
    };

    this.getClosedCaptionFiles = function(){
        var ccFiles = (this.m_data.ClosedCaptionFiles)?this.m_data.ClosedCaptionFiles:[]
        // console.log("GETCCFILES")
        // console.dir(ccFiles)
        //So this is where related things are hidden
        //m_data.RelatedItemsByMPM[ofObjects].ClosedCaptionFiles[ofObjects].Path
        if(this.m_data.RelatedItemsByMPM && this.m_data.RelatedItemsByMPM.length > 0){
            var relatedItems = this.m_data.RelatedItemsByMPM;
            for(var item =0;item<relatedItems.length;item++){
                if(relatedItems[item].ClosedCaptionFiles && relatedItems[item].ClosedCaptionFiles.length > 0){
                    var relatedCCFiles = relatedItems[item].ClosedCaptionFiles
                    for(var ccFile in relatedCCFiles){
                        ccFiles.push(relatedCCFiles[ccFile]);

                    }
                }
            }
        }

        return ccFiles;
    };

    this.getLanguage = function(urlToMatch){
        var lLang = null
        var allMediaUrls = self.getMediaURLs()

        for (var i =0; i<allMediaUrls.length; i++){
            if (allMediaUrls[i].Path == urlToMatch){
                lLang = allMediaUrls[i].LocalizedLanguage;
                break;
            }
        }

        return lLang;
    }
    //this.getThumbnailScourDetails       = function(){return mediaDetailsThumbnailScourDetailsObj;};
    this.getOmnitureTrackingVars        = function(){return mediaDetailsOmnitureTrackingVarsListObj;};


    function getVideoURLFromList( list ){
        var urlArray = []
        for( var i=0;i<list.length;i++ ){
            var video_urls = list[ i ];
            //Logger.logObj( video_urls );
            if ( video_urls && video_urls.Type && video_urls.Type ==='OTTSmoothStreaming.ism' ){
                if(video_urls.UseDRM == "True"){
                    video_urls.Path = video_urls.DRMPath;
                }
                
                return video_urls;
            }
        }
        for( var i=0;i<list.length;i++ ){
            var video_urls = list[ i ];
            if ( video_urls && video_urls.Type && video_urls.Type === ApplicationController.PLATFORM.toUpperCase()+'_Trilithium.m3u8' ){
               return video_urls;
            }
        }

        return null;
    }
}


var MediaDetailsStatus = function( data ){
    this.getMessageCode                 = function(){return data.messageCode;}
    //this.getMessageCodeDescription      = function(){return data.messageCodeDescription;}
    this.getMessage                     = function(){return data.message;}
    //this.getmessageSubCode              = function(){return data.messageSubCode;}
    //this.getMessageSubCodeDescription   = function(){return data.messageSubCodeDescription;}
    //this.getAdditionalInfo              = function(){return data.additionalInfo;}
}

var MediaDetailsChaptersList = function( data ) {
    var itemArray = new Array();
    //this.getTotalItems       = function(){return itemArray.length;}
    this.getItem             = function( index ){return itemArray[ index ]};

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new MediaDetailsChapter( data[ i ] );
    }
}

//var MediaDetailsThumbnailScourDetails = function( data ){
//    this.getUrlPattern              = function(){return data.UrlPattern;};
//    this.getIntervalSeconds         = function(){return data.IntervalSeconds;};
//
//}
//var MediaDetailsParentChannelDetailsSummary = function( data ){
//    this.getID                      = function(){return data.ID;};
//    this.getName                    = function(){return data.Name;};
//    this.getDescription             = function(){return data.Description;};
//    this.getWhyItCrackles           = function(){return data.WhyItCrackles;};
//    this.getSplashVideoUrl          = function(){return data.SplashVideoUrl;};
//}

var MediaDetailsChapter = function( data ){
    this.getName                    = function(){return data.Name;};
    this.getStartTime               = function(){return data.StartTime;};
    this.getStartTimeInMilliSeconds = function(){return data.StartTimeInMilliSeconds;};
    this.getShowAdBefore            = function(){return data.ShowAdBefore;};
}

var MediaDetailsOmnitureTrackingVarsList = function( data ) {
    var itemArray = new Array();
    this.getTotalItems       = function(){return itemArray.length;}
    this.getItem             = function( index ){return itemArray[ index ]};

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new MediaDetailsOmnitureTrackingVar( data[ i ] );
    }
}

var MediaDetailsOmnitureTrackingVar = function( data ){
    this.getKey     = function(){return data.Key;};
    this.getValue   = function(){return data.Value;};
}
