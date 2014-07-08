// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var GenreFiltersRequest = function( callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/browsegenres?format=json
    var url = ModelConfig.getServerURLRoot() + "browsegenres?format=json";
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
                var json_data = new GenreFilters( JSON.parse( data ) );
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
var GenreFiltersTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var genreFiltersTests = new GenreFiltersRequest( function( GenreFiltersObj ){
    // DO THE ASSERTIONS
        assertEquals( GenreFiltersObj.getFilters(), "Crime,Action,Sci-Fi,Comedy,Horror,Thriller,All" );
        assertEquals( GenreFiltersObj.getFiltersAsArray().length, 7 );

    });
    genreFiltersTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var GenreFilters = function( json_data ){
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj           = new GenreFiltersStatus( this.m_data.status );

    this.getFilters         = function(){ return json_data.Filters; };
    this.getFiltersAsArray  = function(){ return json_data.Filters.split( ',' ); };
    this.getStatus          = function(){ return statusObj; };
}

var GenreFiltersStatus = function( data ){
     this.getMessageCode                = function(){ return data.messageCode; }
     this.getMessageCodeDescription     = function(){ return data.messageCodeDescription; }
     this.getMessage                    = function(){ return data.message; }
     this.getmessageSubCode             = function(){ return data.messageSubCode; }
     this.getMessageSubCodeDescription  = function(){ return data.messageSubCodeDescription; }
     this.getAdditionalInfo             = function(){ return data.additionalInfo; }
}