include( "js/app/com/dadc/lithium/parsers/XMLParser.js" );

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var BrowseFiltersRequest = function( BrowseFiltersRequest_CHANNEL_NAME, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/browse/movies/filters?format=json
    var url = ModelConfig.getServerURLRoot() + "browse/" + BrowseFiltersRequest_CHANNEL_NAME + "/filters?format=json";
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

    function initHttpRequest(){
        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

        httpRequestObj =  ModelConfig.httpClientObj.request( "GET", url, null, AuthenticationInstance.getAuthorizationHeader( url ) );
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
                var json_data = new BrowseFilters( JSON.parse( data ) );
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
var BrowseFiltersTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var browseFiltersTests = new BrowseFiltersRequest( BrowseFiltersRequest.CHANNEL_NAME.MOVIES, function( BrowseFiltersObj ){
    // DO THE ASSERTIONS
        assertEquals( BrowseFiltersObj.getFilters(), "all,full,trailers,clips" );
        assertEquals( BrowseFiltersObj.getFiltersAsArray().length, 4 );

    });
    browseFiltersTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var BrowseFilters = function( json_data ){
    this.m_data = json_data;
    //CREATING OBJECTS
    var statusObj           = new BrowseFiltersStatus( this.m_data.status );

    this.getFilters         = function(){ return json_data.Filters; };
    this.getFiltersAsArray  = function(){ return json_data.Filters.split( ',' ); };
}

var BrowseFiltersStatus = function( data ){
     this.getMessageCode                = function(){ return data.messageCode; }
     this.getMessageCodeDescription     = function(){ return data.messageCodeDescription; }
     this.getMessage                    = function(){ return data.message; }
     this.getmessageSubCode             = function(){ return data.messageSubCode; }
     this.getMessageSubCodeDescription  = function(){ return data.messageSubCodeDescription; }
     this.getAdditionalInfo             = function(){ return data.additionalInfo; }
}


BrowseFiltersRequest.CHANNEL_NAME = {
    MOVIES: "movies",
    TELEVISION: "television",
    ORIGINALS: "originals",
    SHOWS: "shows"
};
