// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
var AppConfigRequest = function( callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/browse/movies/all/Crime/date/us?format=json
    var url = "https://staging-api-us.crackle.com/Service.svc/appconfig?format=json";
    //var url = "http://api.crackle.com/Service.svc/appconfig?format=json";
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

        //httpRequestObj =  ModelConfig.httpClientObj.request( "GET", url, null, AuthenticationInstance.getAuthorizationHeader( url ) );
        // TL 1.3.3 UPDATE
        httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url, { headers: AuthenticationInstance.getAuthorizationHeader( url ) }, null );
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function(  data, status ){
        Logger.logObj( data );
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            var json_data = new AppConfig( JSON.parse( data ) );
            callback( json_data, status );
        }
    }
}
//TESTING BATTING LEADERBOARD
var AppConfigTests = function( ){

    this.runTests = function(){
    // CREATE THE REQUEST WITH SOME ARGS
    var appConfigTests = new AppConfigRequest( function( AppConfigObj ){
        Logger.logObj( AppConfigObj );
    // DO THE ASSERTIONS
        //assertEquals( AppConfigObj.getSupportedRegionList().getApiHostnameByCountryCode( 'US' ), "staging-api-us.crackle.com");
        assertEquals( AppConfigObj.getSupportedRegionList().getApiHostnameByCountryCode( 'US' ), "api.crackle.com");

    });
    appConfigTests.startRequest();
   }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var AppConfig = function( json_data ){
    var supportedRegionListObj  = new AppConfigSupportedRegionList( json_data.SupportedRegions );

    this.getPartnerName         = function(){return json_data.PartnerName;}
    this.getSoftwareVersion     = function(){return json_data.SoftwareVersion;}
    this.getSupportedRegionList = function(){return supportedRegionListObj;}
};

var AppConfigSupportedRegionList = function( data ){
    var itemArray       = []
    this.getTotalItems  = function(){return itemArray.length;}
    this.getItem        = function( index ){return itemArray[ index ]};

    this.getApiHostnameByCountryCode = function( country_code ){
        for( var i in itemArray ){
            if( itemArray[ i ].getCountryCode() == country_code ){
                return itemArray[ i ].getApiHostName();
            }
        }
        return null;
    }

    this.getLanguageByCountryCode = function( country_code ){
        for( var i in itemArray ){
            if( itemArray[ i ].getCountryCode() == country_code ){
                return itemArray[ i ].getLanguage();
            }
        }
        return null;
    }

    //GET ALL THE ITEMS
    for( var i = 0;i < data.length; i++ ){
        itemArray[ i ] = new AppConfigSupportedRegion( data[ i ] );
    }
}

var AppConfigSupportedRegion = function( data ){
    this.getApiHostName = function(){return data.ApiHostName;}
    this.getCountryCode = function(){return data.CountryCode;}
    this.getCountryName = function(){return data.CountryName;}
    this.getLanguage    = function(){return data.Language;}
    this.getID = function(){return data.ID;}
}