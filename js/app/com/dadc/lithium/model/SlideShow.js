// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var SlideShowRequest = function( SlideShowRequest_CHANNEL_NAME, geo_code, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/slideshow/movies/us?format=json
    var url = ModelConfig.getServerURLRoot() + "slideshow/"
        + SlideShowRequest_CHANNEL_NAME + "/"
        + geo_code + "?format=json";

    // Http.request(url, "GET", null,  function(data, status){
    //     if(data != null){ 
    //         var json_data = new SlideShow( data ); 
    //     } 
    // }) 

    Logger.log( "**********************" + url );
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
                var json_data = new SlideShow( JSON.parse( data ) );
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
var SlideShowTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var slideShowTests = new SlideShowRequest( SlideShowRequest.CHANNEL_NAME.MOVIES, 'us', function( SlideShowObj ){
    // DO THE ASSERTIONS
        assertEquals( SlideShowObj.getDescription(), "MOVIES_US_2012");

    });
    slideShowTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var SlideShow = function( json_data ){
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj     = new SlideStatus( this.m_data.status );
    var itemListObj   = new SlideShowList( this.m_data.slideList );

    //GETTERS
    this.getStatus      = function(){ return statusObj; };
    this.getItemList    = function(){ return itemListObj; };

    this.getID          = function(){ return json_data.ID; };
    this.getDescription = function(){ return json_data.description; };
    this.getDuration    = function(){ return json_data.duration; };
}

var SlideStatus = function( data ){
     this.getMessageCode                = function(){ return data.messageCode; }
     this.getMessageCodeDescription     = function(){ return data.messageCodeDescription; }
     this.getMessage                    = function(){ return data.message; }
     this.getmessageSubCode             = function(){ return data.messageSubCode; }
     this.getMessageSubCodeDescription  = function(){ return data.messageSubCodeDescription; }
     this.getAdditionalInfo             = function(){ return data.additionalInfo; }
}

var SlideShowList = function( data ){
        var itemArray = new Array();
        this.getTotalItems       = function(){ return itemArray.length; }
        this.getItem             = function( index ){ return itemArray[ index ]};

        //GET ALL THE ITEMS
        for( var i = 0;i < data.length; i++ ){
            itemArray[ i ] = new SlideShowItem( data[ i ] );
        }
}

var SlideShowItem = function( data ){
    this.getSlideID                 = function(){ return data.slideID; };
    this.getSlideDescription        = function(){ return data.slideDescription; };
    this.getSlideImage              = function(){ return data.slideImage; };
    this.getLink                    = function(){ return data.link; };
    this.getLinkText                = function(){ return data.linkText; };
    this.getTitle                   = function(){ return data.title; };
    this.getTitleImage              = function(){ return data.titleImage; };
    this.getAdditionalInfo          = function(){ return data.additionalInfo; };
    this.getSponsoredByImage        = function(){ return data.SponsoredByImage; };
    this.getSponsoredByImage_240x100= function(){ return data.SponsoredByImage_240x100; };
    this.getLabel                   = function(){ return data.label; };
    this.getAppNextScreenType       = function(){ return data.appNextScreenType; };
    this.getAppDataID               = function(){ return data.appDataID; };
    this.getMobileImage             = function(){ return data.MobileImage; };
    this.getSlideImage_421x316      = function(){ return data.SlideImage_421x316; };
    this.getRating                  = function(){ return data.Rating; };
    this.getRootChannel             = function(){ return data.RootChannel; };
    this.getRootChannelID           = function(){ return data.RootChannelID; };
    this.getParentChannelID         = function(){ return data.ParentChannelID; };
    this.getParentChannelName       = function(){ return data.ParentChannelName; };
    this.getOneSheetImage_185_277   = function(){ return data.OneSheetImage_185_277; };
    this.getSlideImage_1510x516     = function(){ return data.SlideImage_1510x516; };
}

SlideShowRequest.CHANNEL_NAME = {
    MOVIES: "movies",
    HOME: "home",
    SHOWS: "shows"
};
