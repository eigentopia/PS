include( "js/app/com/dadc/lithium/config/LoggerConfig.js" );
include( "js/app/com/dadc/lithium/util/Logger.js" );

include( "js/app/com/dadc/lithium/model/Login.js" );
include( "js/app/com/dadc/lithium/controller/ApplicationController.js" );

include( "js/app/com/dadc/lithium/util/InputManager.js" );

/**
 * Engine class will be used to handle and dispatch any engine events,
 * but it will not control the application flow
 */
var Engine = function(){
   
    var m_application_controller_obj;

    this.init = function( screen ){

        screen.width = 1920
        screen.height= 1080

        if(!engine.networkStatus){  //Yo, plug yo console in, bro.

            var text =""
            switch (engine.stats.locale){
                case 'fr_FR':
                    text = "Une erreur réseau s'est produite. Vérifiez votre connexion Internet et réessayez."
                    break;
                case 'es_ES':
                case 'es_LA':
                    text = 'Se ha producido un error en la red. Por favor verifica tu conexión a internet e intenta nuevamente.'
                    break
                case 'pt_BR':
                case 'pt_PT':
                    text = 'Ocorreu um erro em a rede. Por favor verifique sua conexão a internet e tente novamente.'
                    break;
                default:
                    text = 'A network error has occurred. Please check your internet connection and try again.'
                    break;
            }

            var container = engine.createContainer();
            var message = engine.createTextBlock(text, {font: "Fonts/arial.ttf", size: 41, color: [1,1,1, 1.0], preserveSpaces: true, alignment: 'center'}, 800)
            var bg = engine.loadImage("Artwork/concrete_bg.png", function(img){
                img.width = 1920;
                img.height = 1080;
                img.x = 0;
                img.y = 0;

                message.y = 1080/2 - 80;
                message.x = 1920/2 - 400

                container.addChild(img)
                container.addChild(message)
                screen.addChild(container)

            })

            var timer;
            noNetwork(); 
            function noNetwork(){
                timer = setTimeout(function(){ //because no setInterval
                    if(engine.networkStatus){
                        goodNetwork()
                    }
                    else{
                        noNetwork();
                    }
                }, 1000)

            }
            function goodNetwork(){
                clearTimeout(timer);
                screen.removeChild(container)
                var storage = engine.storage.local;
                storage.platform = engine.stats.device.platform;
/*                console.log("****1")
                console.dir(storage)*/
                m_application_controller_obj = new ApplicationController( screen );
                start();
                //checkStorge(screen);
            }

        }
        else{
            var storage = engine.storage.local;
            storage.platform = engine.stats.device.platform;
            // console.log("****2")
            // console.dir(storage)

            m_application_controller_obj = new ApplicationController( screen );
            start();
            //checkStorge(screen);
        }

    }
    // function checkStorge(screen){

    //     var storage = engine.storage.local;
    //     storage.platform = engine.stats.device.platform;

    //     if(storage){
    //         var email = storage.userEmailAddress;
    //         var pwd = storage.userPass

    //         //m_login_widget.unsetFocus();
    //         if((email && email !=="") && (pwd && pwd !=="") ){
    //             var request = new LoginRequest(email, pwd, function(data, status){
    //                 Logger.log("ENGINE DATA")
    //                 Logger.logObj(data)
    //                 Logger.log(status)

    //                 if(status == 200 && data != null){
    //                     var loginResult = data.m_data;
    //                     if(loginResult.status.messageCode == 105 || loginResult.status.messageCode == 110){

    //                         storage.userEmailAddress = ""
    //                         storage.userPass = ""
    //                         storage.userId = ""

    //                     }
    //                 }
    //                 else{  
    //                     storage.userEmailAddress = ""
    //                     storage.userPass = ""
    //                     storage.userId = ""
    //                 }

    //                 m_application_controller_obj = new ApplicationController( screen );
    //                 start();
    //             })
    //             request.startRequest();
    //         }
    //         else{   //over protective
    //             m_application_controller_obj = new ApplicationController( screen );
    //             start();
    //         }
    //     }
    //     else{   //no storage- unlikely
    //         storage.userEmailAddress = ""
    //         storage.userPass = ""
    //         storage.userId = ""
    //         m_application_controller_obj = new ApplicationController( screen );
    //         start();
    //     }              
    // }
   
    function start(){
        engine.onEnterFrame = onEnterFrame; 
        engine.onKey = ApplicationController.onKey;
        
    }
    
    function pause(){ }
    
    function exit(){ }    
    
    function onEnterFrame( ){
        // notify input manager of frame start
        InputManager.frameStarted();

        // dispatch 1 level, to the app controller. let the app controller dispatch further
        m_application_controller_obj.update( engine.getTimer() );
        
        // notify input manager of frame stop
        InputManager.frameEnded();
    }

}

// CREATE AN INSTANCE OF ENGINE THAT CAN BE REFERENCED GLOBALLY
var EngineInstance = new Engine();


//// KEEP THIS FOR TESTING API IF NEEDED
//include( "js/app/com/dadc/lithium/util/SHA1.js" );
//include( "js/app/com/dadc/lithium/util/DateFormat.js" );
//include( "js/app/com/dadc/lithium/parsers/tinyxmlsax.js" );
//
///**
// * Engine class will be used to handle and dispatch any engine events,
// * but it will not control the application flow
// */
//var Engine = function(){
//   
//    var PARTNER_KEYWORD = 'HTADOJZIIDMPQKBR';
//    var PARTNER_ID = 40;
//   
//    var url = "https://ps3-api-es.crackle.com/Service.svc/slideshow/home/MX?format=json";
//    
//    this.init = function( screen ){
//        
//        var client = engine.createHttpClient();
//        client.setCertificateAuthority( "all.pem" );
////        httpclient.disablePipelining();
////        httpclient.disableCertValidation( true );
//        var httpRequestObj = client.request( "GET", url );//, {}, getAuthHeader( url ) );
//        
////        console.log("url: " + url );
////        console.dir("auth: " + getAuthHeader( url ) );
//        
//        httpRequestObj.onComplete = onComplete;
//        
//        //console.dir(httpRequestObj);
//                
//        httpRequestObj.start();
//                
//    }
//    
//    function onComplete( data, status ){
//        console.log("completed...");
//        console.log("status is: " + status);
////        console.dir( data );
//        var jsondata = JSON.parse( data );
//        console.log("total slides: " + jsondata.slideList.length );
//        
//        var last_slide_obj = jsondata.slideList[ jsondata.slideList.length - 1 ];
//        var image = last_slide_obj.slideImage;
//        
//        console.log("image is: " + image);
//        
//        console.log("is wrong? " + ( image == "http://images-es-az.crackle.com/profiles/slideshow/additionalimages/Image_1691_970x332.jpg?ts=20120717173954" ) );
//    }
//   
//   function getAuthHeader( url ){
//        var date            = new Date();
//        var timestamp       = date.format('yyyyMMddHHmm');
//        var encrypt_url     = url + "|" + timestamp;
//        var hmac            = Crypto.HMAC( Crypto.SHA1, encrypt_url, PARTNER_KEYWORD );
//
//        var authorization   = hmac + "|" + timestamp + "|" + PARTNER_ID + "|1";
//        var resp            = {'Authorization': authorization.toUpperCase()};
//        
//        console.log("URL: " + url );
//        console.log("Authorization: " + authorization.toUpperCase());
//        
//        return resp;
//   }
//
//}
//
//// CREATE AN INSTANCE OF ENGINE THAT CAN BE REFERENCED GLOBALLY
//var EngineInstance = new Engine();
