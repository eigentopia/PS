include( "js/app/com/dadc/lithium/model/Analytics.js" );
include( "js/app/com/dadc/lithium/util/SHA1.js" );


var AnalyticsManager = function(){

//    var m_analytics_model_obj = new Analytics( null );

    

    function sendRequest( key_values ){
        var analytics_request_obj = new AnalyticsRequest( new Analytics( key_values ), function( AnalyticsResponseObj ){
            if ( !AnalyticsResponseObj || 
                ( AnalyticsResponseObj && AnalyticsResponseObj.getStatus() == 'FAILURE' ) ){
                // TODO: Handle FAILURE responses
                Logger.log( 'Analytics response FAILURE' );
            }
        });
        
//        m_analytics_model_obj.setKeyValues( key_values );
        analytics_request_obj.startRequest( );
    }
    this.hasUniqueIDGenerated = function(){
        //return ( StorageManagerInstance.get( 'omnuid' ) != null );
        return ( StorageManagerInstance.get( StorageManager.STORAGE_KEYS.OMNITURE_UNIQUE_ID ) != null );
    }
    this.getUniqueID = function(){
        //if( StorageManagerInstance.get( 'omnuid' ) ){
        if( StorageManagerInstance.get( StorageManager.STORAGE_KEYS.OMNITURE_UNIQUE_ID ) ){
           // return StorageManagerInstance.get( 'omnuid' );
            return StorageManagerInstance.get( StorageManager.STORAGE_KEYS.OMNITURE_UNIQUE_ID );
        }else{
            //var ip_address = StorageManagerInstance.get( 'IPADDRESS' );
            var ip_address = StorageManagerInstance.get( StorageManager.STORAGE_KEYS.IPADDRESS );
            Logger.log("* * * IPADDRESS * * * " + StorageManagerInstance.get( StorageManager.STORAGE_KEYS.IPADDRESS ) );
            
            var to_encrypt = ip_address + Math.round( Math.random() * ( 10000 - 10 ) + 10 );
            var encrypted_text = Crypto.HMAC( Crypto.SHA1, to_encrypt, ApplicationController.DEVICE_TYPE.toUpperCase()+"_Trilithium" );
            //StorageManagerInstance.set( 'omnuid', encrypted_text );
            StorageManagerInstance.set( StorageManager.STORAGE_KEYS.OMNITURE_UNIQUE_ID, encrypted_text );
            return encrypted_text;
        }
    }
    /**
     * EVENT METHODS
     */
    this.firePageViewEvent = function( pageStats ){
        Logger.log( 'firePageViewEvent' );
        return; //This is here until we get pageViews sorted out

        //pn shows:browse:horror
        //evar1 - shows cc0
        //evar2 - shows:browse cc1
        //evar3 - page_name cc2
        var content0 = (pageStats.cc0 != '')?pageStats.cc0:'';
        var content1 =(pageStats.cc1 != '')?':'+pageStats.cc1:''
        var content2 =(pageStats.cc2 != '')?':'+pageStats.cc2:''
        var contentTitle = (pageStats.title != '')?':'+pageStats.title:'';

        var page_name = content0 + content1 + content2 + contentTitle

        sendRequest({ 'events': 'event13', 
            'evar1': content0,
            'evar2': content0 + content1,
            'evar3': content0 + content1 + content2,
            'evar16': ApplicationController.DEVICE_TYPE.toUpperCase()+' Trilithium App:'+ page_name,
            'pagename': page_name } );
    }
    this.fireHomePageViewEvent = function( page_name ){
        Logger.log( 'firePageViewEvent' );
        sendRequest({ 'events': 'event13', 'evar16': ApplicationController.DEVICE_TYPE.toUpperCase()+' Trilithium: Home' } );
    }
    this.fireInstallationEvent = function(){
        Logger.log( 'fireInstallationEvent1' );
        sendRequest({ 'events': 'event44' });
    }
    this.fireCrashEvent = function(){
        Logger.log( 'fireCrashEvent' );
        sendRequest( {'events': 'event45' } );
    }    
    this.fireVideoStartEvent = function( MediaDetailsObj ){
        Logger.log( 'fireVideoStartEvent' );
        fireVideoEvent( 'event18', MediaDetailsObj );
    }
    this.fireVideo25PctEvent = function( MediaDetailsObj ){
        Logger.log( 'fireVideo25PctEvent' );
        fireVideoEvent( 'event22', MediaDetailsObj );
    }
    this.fireVideo50PctEvent = function( MediaDetailsObj ){
        Logger.log( 'fireVideo50PctEvent' );
        fireVideoEvent( 'event23', MediaDetailsObj );
    }
    this.fireVideo75PctEvent = function( MediaDetailsObj ){
        Logger.log( 'fireVideo75PctEvent' );
        fireVideoEvent( 'event24', MediaDetailsObj );
    }
    this.fireVideoCompleteEvent = function( MediaDetailsObj ){
        Logger.log( 'fireVideoCompleteEvent' );
        fireVideoEvent( 'event19', MediaDetailsObj );
    }

    function fireVideoEvent( event_name, MediaDetailsObj ){
        Logger.log( 'fireVideoEvent' );
        
        var omni_vars = MediaDetailsObj.getOmnitureTrackingVars();
        var omni_params = [];
        
        for( var i = 0; i < omni_vars.getTotalItems(); i++ ){
            omni_params[ omni_vars.getItem( i ).getKey() ] = omni_vars.getItem( i ).getValue();
        }
        var event52 = getEvent52();

        omni_params[ 'events' ] = event_name+","+event52;
        sendRequest( omni_params );
    }

    var event52Time = 0;
    
    this.resetTime = function(){
        event52Time = 0
    }

    function getEvent52(){

        if(event52Time == 0){
            event52Time = parseInt(engine.getTimer())
            
            return('event52=0')

        }
        else{
            var time = parseInt(engine.getTimer())
            var spentTime = time - event52Time;
            event52Time = time;
            return ('event52='+spentTime)

        }
    }

    function parseMediaObj(mediaObj){
        var omni_params = []
        if(mediaObj.getOmnitureTrackingVars){
            var omni_vars = mediaObj.getOmnitureTrackingVars();

            for( var i = 0; i < omni_vars.getTotalItems(); i++ ){
                omni_params[ omni_vars.getItem( i ).getKey() ] = omni_vars.getItem( i ).getValue();
            }
    
        }
        return omni_params;
    }

    this.fireAdStartEvent = function( mediaObj ){
        Logger.log( 'fireAdStartEvent' );
        //if ( !ad_id ){
        var ad_id = 'Freewheel';
        //}
        var evtObj = parseMediaObj(mediaObj);
        var event52 = getEvent52()
        evtObj.evar41 = ad_id;
        evtObj.events = 'event25, '+event52
        sendRequest( evtObj );

    }

    this.loginEvent = function(){
        sendRequest( {'events': 'event8' } )
    }
    this.logoutEvent = function(){
         sendRequest( {'events': 'event57' } )
    }
    this.slideshowEvent = function(title, pos){
        sendRequest({'events': 'event13',
            'evar1':'slideshow',
            'evar2':'home', 
            's.pev':'Slideshow', 
            'prop30':title, 
            'prop32':'Slideshow:'+pos})
    }
    this.addToWatchlistEvent = function(mediaObj){
        var mediaProps = parseMediaObj(mediaObj.pageName,mediaObj.media);
        mediaProps.events = 'event46'
        sendRequest( mediaProps );
    }
    this.removeFromWatchlistEvent = function(mediaObj){
        var mediaProps = {}
        if(mediaObj.pageName == "ShowDetailsItem" || mediaObj.pageName == "MovieDetails"){ //individual item
            mediaProps = parseMediaObj(mediaObj.media)
        }
        mediaProps.events = 'event37';
        mediaProps.pagename = mediaObj.pageName; 
        sendRequest( mediaProps );
    }
    this.subTitleOnEvent = function(){
        sendRequest( {'events': 'event50' } )
    }
    this.subTitleOffEvent = function(){
        sendRequest( {'events': 'event51' } )
    }
    
}

AnalyticsManager.PAGENAME = {
    HOME: 1
};

var AnalyticsManagerInstance = new AnalyticsManager();