// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var LocaleGenreRequest = function( category, geocode, callback ){
    //SAMPLE URL
    //http://staging-api-us.crackle.com/Service.svc/genres/movies/primary/us
    var url = ModelConfig.getServerURLRoot() + "genres/" + category + "/primary/" + geocode + "?format=json";
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
                var json_data = new LocaleGenre( JSON.parse( data ) );
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
var LocaleGenreTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var localeGenreTests = new LocaleGenreRequest( 'movies', 'us', function( LocaleGenreObj ){
    // DO THE ASSERTIONS
        assertEquals( LocaleGenreObj.getItemList().getItem(0).getName(), "Action" );
        assertEquals( LocaleGenreObj.getItemList().getItem(1).getName(), "Anime" );
        assertEquals( LocaleGenreObj.getItemList().getItem(2).getName(), "Comedy" );
    });
    localeGenreTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var LocaleGenre = function( json_data ){
    Logger.logObj( json_data );
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj           = new LocaleGenreStatus( this.m_data.status );
    var itemListObj         = new LocaleGenreItems( this.m_data.Items );

    this.getStatus          = function(){ return statusObj; };
    this.getItemList        = function(){ return itemListObj; }
}

var LocaleGenreStatus = function( data ){
     this.getMessageCode                = function(){ return data.messageCode; }
     this.getMessageCodeDescription     = function(){ return data.messageCodeDescription; }
     this.getMessage                    = function(){ return data.message; }
     this.getmessageSubCode             = function(){ return data.messageSubCode; }
     this.getMessageSubCodeDescription  = function(){ return data.messageSubCodeDescription; }
     this.getAdditionalInfo             = function(){ return data.additionalInfo; }
}

var LocaleGenreItems = function( data ){
    var itemArray            = new Array();
    this.getTotalItems       = function(){ return itemArray.length; }
    this.getItem             = function( index ){ return itemArray[ index ]};

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new LocaleGenreItem( data[ i ] );
    }
}
var LocaleGenreItem = function( data ){
    this.getID      = function(){ return data.ID; }
    this.getName    = function(){ return data.Name; }
    this.getPrimary = function(){ return data.Primary; }
}