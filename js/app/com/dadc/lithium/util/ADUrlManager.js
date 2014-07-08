/**
 * ADUrlManager.js
 * @author unknown
 */

 include( "js/app/com/dadc/lithium/util/ImpressionTracker.js" );

/** @returns {ADUrlManager} */
var ADUrlManager = function()
{
    var m_queue = [];
    var m_isActive = false;

    /** API to fire a analytic URL @param {string} url */
    this.fireUrl = function( url )
    {
    	m_queue.push( url );

        if( typeof ImpressionTracker !== "undefined" )
            ImpressionTracker.receiveSentUrl( url );

    	if( m_isActive === false )
    	{
    	    m_isActive = true;
    	    requestUrl( m_queue.pop() );
    	}
    	Logger.log( "ADUrlManager.fireURL() | count: " + m_queue.length );
    };

    /** privately called to fire a url @param {string} url */
    function requestUrl( url )
    {
        if( typeof url === "string" )
        {
            //Logger.log( "ADUrlManager | count: " + m_queue.length + ", requestUrl: " + url );
            try
            {
                ModelConfig.httpClientObj.disableCertValidation( true );

                var headers = 
                {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.162 Safari/535.19'
                };

                // TL 1.3.3 UPDATE
                var httpRequestObj = ModelConfig.httpClientObj.createRequest( "GET", url, { headers: headers }, null );
                httpRequestObj.onComplete = onRequestComplete;
                httpRequestObj.start();
            }
    	    catch( e )
    	    {
                Logger.log( '!!! EXCEPTION requestUrl !!!' );
                Logger.logObj( e );
            }
        }
	    else Logger.log("ADUrlManager.requestURL() - url was found invalid");
    }

    /** response callback @param data {object} @param status {number} */
    function onRequestComplete( data, status )
    {
        Logger.log( 'ADUrlManager.onRequestComplete, status = ' + status );
        if( m_queue.length > 0 )
	    {
            requestUrl( m_queue.pop() );
        }
    	else 
    	{
    	    m_isActive = false;
    	}
    	Logger.log("ADUrlManager.onRequestComplete() - count: " + m_queue.length );
    }
};