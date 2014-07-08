// PRODUCTION
var ModelConfig = function(){

}

ModelConfig.getServerURLRoot = function(){ return 'https://' + StorageManagerInstance.get( 'api_hostname' ) + '/Service.svc/'; }

ModelConfig.CONFIG = {
    NETWORK_ERROR_RETRY: 3,
    API_ERROR_RETRY: 3,
    DISABLE_CERT_VALIDATION: 0,
    CERT_VALIDATION: "all.pem"			
}

ModelConfig.API_ERROR = -100;

ModelConfig.httpClientObj = engine.createHttpClient();
ModelConfig.httpClientObj.timeout = 15 * 1000;