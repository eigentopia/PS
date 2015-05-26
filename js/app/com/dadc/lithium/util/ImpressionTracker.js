
/**
 * This object will track what impressions has or has not been sent
 * (USED FOR DEBUGGING ONLY - THIS DOES NOT HAVE ANY FUNCTIONAL PURPOSE)
 * @returns {ImpressionTracker}
 */
var ImpressionTracker = function()
{
    var m_freewheelTracking = null;
    var m_vastTracking = null;
    var m_sentTracking = null;
    
    /** clear the tracking lists */
    function clear()
    {
	Logger.log("ImpressionTracker.clear()");
	m_freewheelTracking = null;
	m_vastTracking = null;
	m_sentTracking = null;
    }
    
    /**
     * Get a new freewheel tracking list
     * @param {Array} trackingList
     */
    this.receiveFreewheelTracking = function( trackingList )
    {
	if( isArray( trackingList ) === true )
	{
	    if( m_freewheelTracking !== null )
	    {
		Logger.warn("ImpressionTracker.receiveFreewheelTracking() - did you not call report()?");
		m_freewheelTracking = null;
	    }
	    m_freewheelTracking = trackingList;
	}
	else Logger.warn("ImpressionTracker.receiveFreewheelTracking() - not an array");
    };
    
    /**
     * Get a new Vast tracking list
     * @param {Array} trackingList
     */
    this.receiveVastTracking = function( trackingList )
    {
	if( isArray( trackingList ) === true )
	{
	    if( m_vastTracking !== null )
	    {
		Logger.warn("ImpressionTracker.receiveVastTracking() - did you not call report()?");
		m_vastTracking = null;
	    }
	    m_vastTracking = trackingList;
	}
	else Logger.warn("ImpressionTracker.receiveVastTracking() - not an array");
    };
    
    /**
     * ADUrlManager will report urls being sent here
     * @param {string} url
     */
    this.receiveSentUrl = function( url )
    {
	if( m_sentTracking === null )
	    m_sentTracking = [];
	m_sentTracking.push( url );
    };
    
    /**
     * report to the logs what is in the freewheel/vast tracking lists, but is NOT in the sent list
     * note: after calling report(), the lists will be cleared after reporting is complete
     */
    this.report = function()
    {
	console.log("");
	console.log("");
	console.log("");
	Logger.log("=========== Impression Tracker ===========");
	reportFreewheel();
	reportVast();
	Logger.log("==========================================");
	console.log("");
	console.log("");
	console.log("");
	clear();
    };
    
    /** privately called to perform checks on freewheel tracking events */
    function reportFreewheel()
    {
	if( m_freewheelTracking === null )
	{
	    Logger.warn("ImpressionTracker.reportFreewheel() - no freewheel tracking events to check (this is an error!)");
	    return;
	}
	
	var notSent = [];
	
	// iterate the freewheel tracking list
	for( var fwIndex = 0; fwIndex < m_freewheelTracking.length; fwIndex++ )
	{
	    var found = false;
	    // iterate the sent tracking list
	    for( var sIndex = 0; sIndex < m_sentTracking.length; sIndex++ )
	    {
		// if we found a match, the impression was sent
		if( m_freewheelTracking[fwIndex] === m_sentTracking[sIndex] )
		{
		    found = true;
		    break;
		}
	    }
	    // if the impression wasn't sent, push it for reporting
	    if( found === false )
	    {
		notSent.push( m_freewheelTracking[ fwIndex ] );
	    }
	}
	
	if( notSent.length !== 0 )
	{
	    Logger.warn("Found un-sent Freewheel impression urls:");
	    for( var i = 0; i < notSent.length; i++ )
		Logger.warn( notSent[i] );
	}
	else
	{
	    Logger.log("Freewheel Impressions reported OK!");
	}
    }
    
    /** privately called to perform checks on vast tracking events */
    function reportVast()
    {
	if( m_vastTracking === null )
	{
	    Logger.warn("ImpressionTracker.reportVast() - no vast tracking events to check (this may not be an error)");
	    return;
	}
	
	var notSent = [];
	
	// iterate the vast tracking list
	for( var vIndex = 0; vIndex < m_vastTracking.length; vIndex++ )
	{
	    var found = false;
	    // iterate the sent tracking list
	    for( var sIndex = 0; sIndex < m_sentTracking.length; sIndex++ )
	    {
		// if we found a match, the impression was sent
		if( m_vastTracking[vIndex] === m_sentTracking[sIndex] )
		{
		    found = true;
		    break;
		}
	    }
	    // if the impression wasn't sent, push it for reporting
	    if( found === false )
	    {
		notSent.push( m_vastTracking[ vIndex ] );
	    }
	}
	
	if( notSent.length !== 0 )
	{
	    Logger.warn("Found un-sent Vast impression urls:");
	    for( var i = 0; i < notSent.length; i++ )
		Logger.warn( notSent[i] );
	}
	else
	{
	    Logger.log("Vast Impressions reported OK!");
	}
    }
};

ImpressionTracker = new ImpressionTracker();