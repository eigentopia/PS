// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

//my id 272424
var LoginRequest = function( uname, pwd, callback ){
    //SAMPLE URL
    //http://api.crackle.com/Service.svc/featured/movies/all/us/30?format=json
    var url = ModelConfig.getServerURLRoot() + "login?format=json";

    Logger.log( url + " GEO "+ StorageManagerInstance.get( 'geocode' ));
    var geoCode = StorageManagerInstance.get( 'geocode' )
    var httpRequestObj;
    var http_retries;
    var api_retries;
    var This = this;
    var creds = {"emailAddress":uname,"password":pwd,"geoCode":geoCode}  

       // creds = {"emailAddress":'eigenstates@yahoo.com',"password":'solid5',"geoCode":geoCode}
    this.cancelRequest = function(){
        if(httpRequestObj && httpRequestObj.cancel()){
            httpRequestObj.cancel();
        }
    }

    this.startRequest = function( ){
        http_retries = 0;
        api_retries = 0;
        initHttpRequest();
        //httpRequestObj.sendBody(creds, "data")
        httpRequestObj.start();
        Logger.log( 'startrequest' );
        //Logger.logObj( engine.stats.memory );
    }

    function initHttpRequest(){
        if( ModelConfig.CONFIG.DISABLE_CERT_VALIDATION )
            ModelConfig.httpClientObj.disableCertValidation( true );
        else if( ModelConfig.CONFIG.CERT_VALIDATION )
            ModelConfig.httpClientObj.setCertificateAuthority( ModelConfig.CONFIG.CERT_VALIDATION );

        Logger.log(url)
        // TL 1.3.3 UPDATE
        httpRequestObj =  ModelConfig.httpClientObj.createRequest( "POST", url, { headers: AuthenticationInstance.getAuthorizationHeader( url )  } )
        httpRequestObj.sendBody(JSON.stringify(creds), 'Application/Json');
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function( data, status ){
        Logger.log( 'requestcomplete ' + status );
        Logger.log(data)
        if ( status != 200 && http_retries < ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            http_retries++;
            initHttpRequest();
            Logger.log( 'requestcomplete ' + status );
            Logger.log(data)
            httpRequestObj.start();
        } else if ( status != 200 && http_retries >= ModelConfig.CONFIG.NETWORK_ERROR_RETRY ){
            callback( null, status );
        }else {
            try{
                var json_data =  new Login(JSON.parse( data ));
                var storage = engine.storage.local;
                if(storage){
                    storage.userPass = pwd;
                    storage.userEmailAddress = uname;
                    storage.userId = json_data.m_data.userID;
                }
                callback( json_data, status );
            }catch( e ){
                Logger.log( '!!! EXCEPTION !!!' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    }
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var Login = function( json_data ){
    this.m_data = json_data;

    //CREATING OBJECTS
    var statusObj           = new LoginStatus( this.m_data.status );

    //GETTERS
    this.getStatus    = function(){return statusObj;}
}

var LoginStatus = function( data ){
     this.getMessageCode                = function(){return data.messageCode;}
     this.getMessageCodeDescription     = function(){return data.messageCodeDescription;}
     this.getMessage                    = function(){return data.message;}
     this.getmessageSubCode             = function(){return data.messageSubCode;}
     this.getMessageSubCodeDescription  = function(){return data.messageSubCodeDescription;}
     this.getAdditionalInfo             = function(){return data.additionalInfo;}
}


