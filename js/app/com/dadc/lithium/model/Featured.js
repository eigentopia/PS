// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var FeaturedRequest = function( FeaturedRequest_CATEGORY, FeaturedRequest_FILTER_TYPE, geo_code, num_results, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/featured/movies/all/us/30?format=json
    var url = ModelConfig.getServerURLRoot() + "featured/" + FeaturedRequest_CATEGORY + "/" + FeaturedRequest_FILTER_TYPE + "/" + geo_code + "/" + num_results + "?format=json";
    Logger.log( url );
    var httpRequestObj;
    var http_retries;
    var api_retries;
    var This = this;

    this.startRequest = function( ){
        http_retries = 0;
        api_retries = 0;
        initHttpRequest();
        httpRequestObj.start();
        Logger.log( 'startrequest' );
        Logger.logObj( engine.stats.memory );
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
                var json_data = new Featured( JSON.parse( data ) );
                if ( json_data.getStatus().getMessageCode() != 0 && api_retries < ModelConfig.CONFIG.API_ERROR_RETRY ){
                    api_retries++;
                    initHttpRequest();
                    httpRequestObj.start();
                }else if ( json_data.getStatus().getMessageCode() != 0 && api_retries >= ModelConfig.CONFIG.API_ERROR_RETRY ){
                    callback( null, ModelConfig.API_ERROR );
                }else{
                    Logger.log( 'afterrequest' );
                    Logger.logObj( engine.stats.memory );

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
var FeaturedTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var featuredTests = new FeaturedRequest( FeaturedRequest.CATEGORY.MOVIES, FeaturedRequest.FILTER_TYPE.ALL, 'us', 30, function( FeaturedObj ){
    // DO THE ASSERTIONS
        assertEquals( FeaturedObj.getItemList().getItem(0).getItemType(), "Channel" );
        Logger.logObj( FeaturedObj.getItemList().getNonClipsRow( 0, 5 ) );

    });
    featuredTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var Featured = function( json_data ){
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj           = new FeaturedStatus( this.m_data.status );
    var itemListObj         = new FeaturedItemList( this.m_data.Items );

    //GETTERS
    this.getStatus    = function(){return statusObj;}
    this.getItemList  = function(){return itemListObj;}
}

var FeaturedStatus = function( data ){
     this.getMessageCode                = function(){return data.messageCode;}
     this.getMessageCodeDescription     = function(){return data.messageCodeDescription;}
     this.getMessage                    = function(){return data.message;}
     this.getmessageSubCode             = function(){return data.messageSubCode;}
     this.getMessageSubCodeDescription  = function(){return data.messageSubCodeDescription;}
     this.getAdditionalInfo             = function(){return data.additionalInfo;}
}

var FeaturedItemList = function( data ){
        var itemArray = new Array();

        this.getTotalItems          = function(){return itemArray.length;}
        this.getItem                = function( index ){return itemArray[ index ]};
        this.getNonClipsRow         = function( row_index, per_row ){
            var tmpArray = [];

            for( var i = row_index * per_row; i < nonClipsItemListObj.length && tmpArray.length < per_row; i++ ){
                tmpArray.push( nonClipsItemListObj[ i ] );
            }

            return tmpArray;
        }
        //GET ALL THE ITEMS
        for( var i = 0;i < data.length; i++ ){
            itemArray[ i ] = new FeaturedItem( data[ i ] );
        }

        var nonClipsItemListObj     = getNonClipsItemList();
        this.countNonClipsRows      = function( per_row ){
            return Math.ceil( nonClipsItemListObj.length / per_row );
        }

        function getNonClipsItemList(){
            var tmpArray = [];
            for( var i = 0; i < itemArray.length; i++ ){
                var item = itemArray[ i ];
                if( ! item.getClipsOnly() ){
                    tmpArray.push( item );
                }
            }
            return tmpArray;
        }
}

var FeaturedItem = function( data ){
    this.getItemType            = function(){return data.ItemType;};
    this.getMediaType           = function(){return data.MediaType;};
    this.getID                  = function(){return data.ID;};
    this.getTitle               = function(){return data.Title;};
    this.getDescription         = function(){return data.Description;};
    this.getClipsOnly           = function(){return data.ClipsOnly;};
    this.getImageUrl1           = function(){return data.ImageUrl1;};
    this.getImageUrl2           = function(){return data.ImageUrl2;};
    this.getImageUrl3           = function(){return data.ImageUrl3;};
    this.getImageUrl4           = function(){return data.ImageUrl4;};
    this.getImageUrl5           = function(){return data.ImageUrl5;};
    this.getImageUrl6           = function(){return data.ImageUrl6;};
    this.getImageUrl7           = function(){return data.ImageUrl7;};
    this.getImageUrl8           = function(){return data.ImageUrl8;};
    this.getImageUrl9           = function(){return data.ImageUrl9;};
    this.getImageUrl10          = function(){return data.ImageUrl10;};
    this.getGenre               = function(){return data.Genre;};
    this.getRating              = function(){return data.Rating;};
    this.getDuration            = function(){return data.Duration;};
    this.getDurationInSeconds   = function(){return data.DurationInSeconds;};
    this.getUserRating          = function(){return data.UserRating;};
    this.getRootChannel         = function(){return data.RootChannel;};
    this.getRootChannelID       = function(){ return data.RootChannelID; };
    this.getXItemId             = function(){return data.XItemId;};
    this.getParentChannelID     = function(){return data.ParentChannelID;};
    this.getParentChannelName   = function(){return data.ParentChannelName;};
    this.getWhyItCrackles       = function(){return data.WhyItCrackles;};
    this.getSeason              = function(){return data.Season;}
    this.getEpisode             = function(){return data.Episode;};
}

FeaturedRequest.CATEGORY = {
    MOVIES: "movies",
    TELEVISION: "television",
    ORIGINALS: "originals",
    SHOWS: "shows"
};

FeaturedRequest.FILTER_TYPE = {
    ALL: "all",
    FULL: "full",
    TRAILERS: "trailers",
    CLIPS: "clips",
    MINISODES: "minisodes"
};