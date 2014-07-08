// STAGING
var ModelConfig = function(){

}

ModelConfig.getServerURLRoot = function(){ 
    return "https://staging-api-us.crackle.com/Service.svc/"; 
}

ModelConfig.CONFIG = {
    NETWORK_ERROR_RETRY: 3,
    API_ERROR_RETRY: 3,
    DISABLE_CERT_VALIDATION: 0,
    CERT_VALIDATION: "staging-api-us.crackle.com.crt+root.pem"
}

ModelConfig.API_ERROR = -100;

ModelConfig.httpClientObj = engine.createHttpClient();
ModelConfig.httpClientObj.timeout = 15 * 1000;