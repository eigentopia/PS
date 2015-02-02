/** 
 * This file is the interaction point for engine's 'np' object,
 * which has been replaced with the LithiumNetworkPlatform.sprx plugin
 */
include( "js/app/com/dadc/lithium/config/LoggerConfig.js" );
var PSN = function( )
{
    var k_npVersionString = "3.0";
    var k_npServiceID;
    var platform = engine.stats.device.platform;
    if(platform === 'ps4'){
        //ps4
        k_npServiceID = LoggerConfig.PSN.PS4;
    }
    else{
        //ps3
        k_npServiceID = LoggerConfig.PSN.PS3;
        
    }
    
    var m_callback = null;

    // DO this to WEbGL
    if(platform !== 'html'){
        var npPlugin = engine.loadPlugin("LithiumNetworkPlatform.sprx");
    
        this.getNPPlugin = function() { return npPlugin; }
    }
    
    this.requestTicketCallback = function( callback )
    {
         m_callback = callback;
         doRequest();
    }

    this.setNpListener = function( callback )
    {
        if(npPlugin){
            npPlugin.np.onNpEvent = callback;
        }
    }

    this.userHasAccount = function()
    {
        Logger.log( "PSN::userHasAccount()" );
        // DO this to WEbGL
        if(platform === 'html'){

            return true;
        }
        return npPlugin.np.hasAccount;
    }
   
    function doRequest()
    {
      // DO this to WEbGL
        if(platform === 'html'){
            ticketRequestCallback()
            return;
        }
         try
         {
             Logger.log( "PSN::doRequest() - requesting ticket" );
             setTimeout( function()
                 {
                     try
                     {
                         npPlugin.np.requestTicket( k_npVersionString, k_npServiceID, ticketRequestCallback );
                     }
                     catch( e )
                     {
                         Logger.log( "PSN::doRequest() - !!! PSN EXCEPTION doRequest" );
                         Logger.logObj( e );
                         m_callback( true );
                     }
                 }, 100 );
         }
         catch( e )
         {
             Logger.log( 'PSN::doRequest() - !!! PSN EXCEPTION doRequest' );
             Logger.logObj( e );
             m_callback( true );
         }

         Logger.log( 'PSN::doRequest() - after requestTicket()' );
     }

     function ticketRequestCallback( event )
     {
        // DO this to WEbGL
        if(platform === 'html'){
            m_callback( true );
            return;
        }
         Logger.log( "PSN::ticketRequestCallback() - *** ticketRequestCallback: event type = " + event );
         
         if ( event == npPlugin.np.ERROR ) 
         {
             Logger.log( "PSN::ticketRequestCallback() - error!" );
             m_callback( false );
             return;
         }
         else if (event == npPlugin.np.GOT_TICKET) 
         {
             Logger.log( "PSN::ticketRequestCallback() - got ticket" );
             m_callback( true );
             return;
         }
         else if (event == npPlugin.np.SERVICE_UNAVAILABLE)
         {
             Logger.log( "PSN::ticketRequestCallback() - service unavailable" );
             m_callback( true );
             return;
         }
         else if (event == npPlugin.np.USER_ABORTED)
         {
             Logger.log( "PSN::ticketRequestCallback() - user aborted" );
             m_callback( false );
             return;
         }
         else 
         {   // should never land here
             Logger.log( "PSN::ticketRequestCallback() - *** ticketRequestCallback: unsupported event type" );
             m_callback( true );
         }
     }
}