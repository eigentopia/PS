/*
 * InteractiveAdModel.js - Crackle
 * @author Daniel Cuccia
 *
 * This is the model component to interactive ads, we request data from servers
 * and pass it along for view processing
 */


var InteractiveAdModel = function( adUrl, callback )
{
    var This                = this;
    var m_tryCount          = 0;                // current try count
    var m_requestIsActive   = false;            // is the httpRequest active?
    var m_requestObj        = null;             // handle to the httpRequestObj


    this.startRequest = function()
    {
        this.initRequest();
    }

    // Send the request to the given URL
    this.initRequest = function( )
    {
        Logger.log("InteractiveAdModel::init() - Initializing httpRequest, try: " + m_tryCount + ", " + "url: " + adUrl);

        //m_requestObj = ModelConfig.httpClientObj.request( "GET", adUrl );
        
        // BENUPDATE: CONFIGURABLE SDK TYPE
        m_requestObj = ModelConfig.createRequest( "GET", adUrl );
        
        if( m_requestObj )
        {
            m_requestObj.onComplete = parseResponse;
            m_requestObj.onResponse = statusUpdate;
            m_requestObj.start();
            m_requestIsActive = true;
        }
        else
        {
            Logger.log("InteractiveAdModel::initRequest() - Error getting HTTP Request Object");
            callback( null );
        }
    };

    // Parse the response to a usable dictionary for view construction
    function parseResponse( data, status )
    {
        if( 200 == status )
        {
            Logger.log("InteractiveAdModel::parseResponse() - response came with status 200!");

            m_requestIsActive = false;
            try
            {
                var output = JSON.parse( data );
            }
            catch(e)
            {
                Logger.log("InteractiveAdModel::parseResponse() - unable to parse response, will try again");
                if( ++m_tryCount < ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
                {
                    This.initRequest();
                    return;
                }
                else
                {
                    Logger.log("InteractiveAdModel::parseResponse() - Was not able to parse response, exceeded maximum try count");
                    callback( null ); // Failure!
                    return;
                }
            }
            
            if( output )
            {
                var configObj = new InteractiveAdConfig( output );
                if( configObj ) callback( configObj ); // SUCCESS!!
                else callback( null ); // Failure!
            }
            else
            {
                Logger.log("InteractiveAdModel::parseResponse() - unable to create JSON object");
                callback( null ); // Failure!
            }
        }
        else
        {
            if( ++m_tryCount < ModelConfig.CONFIG.NETWORK_ERROR_RETRY )
            {
                This.initRequest();
            }
            else
            {
                Logger.log("InteractiveAdModel::parseResponse() - Was not able to get request, exceeded maximum try count");
                callback( null ); // Failure!
            }
        }
    }

    // http request status updates
    function statusUpdate( response )
    {
        Logger.log("InteractiveAdModel::statusUpdate() working...");
    }

    // Cancel the request, reset variables, clean up any memory necessary
    this.dispose = function( )
    {
        if( true === m_requestIsActive )
        {
            if( m_requestObj && m_requestObj.cancel())
            {
                m_requestObj.cancel();
            }
        }
        m_tryCount = 0;
        m_requestObj = null;
        m_requestIsActive = false;
    }

    // Accessors
    this.getUrl = function( ) { return adUrl; }
    this.getCurrentTryCount = function( ) { return this.m_tryCount; }
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                          DATA OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var InteractiveAdConfig = function( jsonData )
{
    var m_videoClicks = new InteractiveAdVideoClicks( jsonData["video-clicks"] );
    var m_video = new InteractiveAdVideoConfig( jsonData["video"] );
    var m_analytics = new InteractiveAdAnalyticConfig( jsonData["placement-config"] );

    // DAN: innovid phase 2
    // Apps section of the JSON response is the only thing that changes between interactive ad types
    // everything else is reused, but we need to switch() what type of "app" model to build
    var m_apps = [];
    var title = jsonData["apps"][0]["title"];
    Logger.log("InteractiveAdConfig - " + title);
    switch( title )
    {
	case "Image Gallery":
	    for( var index in jsonData["apps"] )
		m_apps.push( new ImageGalleryInteractiveAdApp( jsonData["apps"][index] ) );
	    break;

	case "Media Gallery":
	    for( var idx in jsonData["apps"] )
		m_apps.push( new VideoGalleryInteractiveAdApp( jsonData["apps"][idx] ) );
	    break;

	default:
	    Logger.log("InteractiveAdConfig - UNSUPPORTED INTERACTIVE AD FOUND!");
	    throw new Error("InteractiveAdConfig - UNSUPPORTED INTERACTIVE AD FOUND");
	    break;
    }

    this.data = jsonData;
    // Accessors
    this.getId = function() { return jsonData["id"]; }
    this.getName = function() { return jsonData["campaign-name"]; }
    this.getVideoClicks = function() { return m_videoClicks; }
    this.getVersion = function() { return jsonData["version"]; }
    this.getInteractiveAdApps = function() { return m_apps; }
    this.getAdVideo = function() { return m_video; }
    this.getInteractiveAdAnalytics = function() { return m_analytics; }
}

var InteractiveAdAnalyticConfig = function( jsonData )
{
    // makes an alpha-numeric random hash string
    function makeid( n )
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < n; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    var m_startTime = null;
    this.markStartTime = function() { m_startTime = engine.getTimer(); }
    this.getElapsedTime = function() { return engine.getTimer() - m_startTime; }

    var m_hotspotClicks = [];
    for(var index in jsonData["hotspot-clicks"] )
        m_hotspotClicks.push( new InteractiveAdAnalyticHotspotClick( jsonData["hotspot-clicks"][index] ) );
    var m_trackingEvents = [];
    for(var idx in jsonData["tracking-events"] )
        m_trackingEvents.push( new InteractiveAdAnalyticTrackingEvent( jsonData["tracking-events"][idx] ) );
    var m_sessionId = makeid( 40 );
    var m_viewerId = m_sessionId;       // Innovid requests these 3 values are all the same
    var m_impressionId = m_sessionId;   // Innovid requests these 3 values are all the same

    // Accessors
    this.getPlacementHash = function() { return jsonData["placement-hash"]; }
    this.getProjectHash = function() { return jsonData["project-hash"]; }
    this.getClientID = function() { return jsonData["client-id"]; }
    this.getChannelID = function() { return jsonData["channel-id"]; }
    this.getPublisherID = function() { return jsonData["publisher-id"]; }
    this.getVideoID = function() { return jsonData["video-id"]; }
    this.getPlacementTagID = function() { return jsonData["placement-tag-id"]; }
    this.getProjectState = function() { return jsonData["project-state"]; }
    this.getRealEstateID = function() { return jsonData["real_estate_id"]; }
    this.getHotspotClicks = function() { return m_hotspotClicks; }
    this.getTrackingEvents = function() { return m_trackingEvents; }
    this.getSessionID = function() { return m_sessionId; }
    this.getRandomNumber = function() { return Math.floor( Math.random() * 10000000000000 ); }
    this.getImpressionID = function() { return m_impressionId; }
    this.getViewerID = function() { return m_viewerId; }
    this.getWebsite = function() { return ApplicationController.PLATFORM.toUpperCase(); }
    this.getDomain = function() { return "http://s.innovid.com/1x1.gif?"; }
}

var InteractiveAdAnalyticHotspotClick = function( jsonData )
{
    // Accessors
    this.getID = function() { return jsonData["id"]; }
    this.getType = function() { return jsonData["click-thru"]; }
    this.getMain = function() { return jsonData["main"]; }
}

var InteractiveAdAnalyticTrackingEvent = function( jsonData )
{
    // ??? - json response hasn't had any data here
}

var InteractiveAdVideoConfig = function( jsonData )
{
    var m_sources = [];
    for(var index in jsonData["source"])
        m_sources.push( new InteractiveAdVideoSource( jsonData["source"][index] ) );
    var m_decidedSource = null;

    // Accessors
    this.data = jsonData
    this.getSources = function() { return m_sources; }
    this.getDuration = function() { return jsonData["duration"]; }
    this.setDecidedSource = function( interactiveAdVideoSource ) { m_decidedSource = interactiveAdVideoSource; }
    this.getDecidedSource = function() { return m_decidedSource; }
}

var InteractiveAdVideoSource = function( jsonData )
{
    this.getProfile = function() { return jsonData["profile"]; }
    this.getWidth = function() { return jsonData["width"]; }
    this.getHeight = function() { return jsonData["height"]; }
    this.getFormat = function() { return jsonData["format"]; }
    this.getUrl = function() { return jsonData["url"]; }
}

var InteractiveAdVideoClicks = function( jsonData )
{
    // Accessors
    this.getClickThruUrl = function() { return jsonData["click-thru-url"]; };
}

var ImageGalleryInteractiveAdApp = function( jsonData )
{
    var m_data = new InteractiveAdAppData( jsonData["data"] );
    var m_placeHolder = new InteractiveAdAppPlaceholder( jsonData["placeholder"] );
    var m_customLauncher = new InteractiveAdAppCustomLauncher( jsonData["customLauncher"] );

    // Accessors
    this.getId = function() { return jsonData["id"]; }
    this.getTitle = function() { return jsonData["title"]; }
    this.getAppId = function() { return jsonData["app-id"]; }
    this.getAppVersion = function() { return jsonData["app-version"]; }
    this.getData = function() { return m_data; }
    this.getPlaceHolder = function() { return m_placeHolder; }
    this.getUseIconAsImage = function() { return jsonData["useIconAsImage"]; }
    this.getCustomLauncher = function() { return m_customLauncher; }
}

var InteractiveAdAppCustomLauncher = function( jsonData )
{
    var m_sources = [];
    for(var index in jsonData["source"])
        m_sources.push( new InteractiveAdAppCustomLauncherSource( jsonData["source"][index] ) );
    var m_reporting = new InteractiveAdAppReporting( jsonData["reporting"] );

    // Accessors
    this.getType = function() { return jsonData["type"]; }
    this.getWidth = function() { return jsonData["width"]; }
    this.getHeight = function() { return jsonData["height"]; }
    this.getScale = function() { return jsonData["scale"]; }
    this.getData = function() { return jsonData["data"]; }
    this.getSources = function() { return m_sources; }
    this.getReporting = function() { return m_reporting; }
}

var InteractiveAdAppReporting = function( jsonData )
{
    // Accessors
    this.getNamespace = function() { return jsonData["namespace"]; }
}

var InteractiveAdAppCustomLauncherSource = function( jsonData )
{
    // Accessors
    this.getProfile = function() { return jsonData["profile"]; }
    this.getFormat = function() { return jsonData["format"]; }
    this.getUrl = function() { return jsonData["url"]; }
}

var InteractiveAdAppPlaceholder = function( jsonData )
{
    // Accessors
    this.getType = function()		{ return jsonData["type"]; }
    this.getTop = function()		{ return jsonData["top"]; }
    this.getLeft = function()		{ return jsonData["left"]; }
    this.getScale = function()		{ return jsonData["scale"]; }
    this.getOffsetX = function()	{ return jsonData["offsetX"]; }
    this.getOffsetY = function()	{ return jsonData["offsetY"]; }
}

var InteractiveAdAppData = function( jsonData )
{
    var m_items = [];
    for(var index in jsonData.items)
        m_items.push( new InteractiveAdAppDataItem( jsonData["items"][index] ) );

    // Accessors
    this.getItems = function()		{ return m_items; }
}

var InteractiveAdAppDataItem = function( jsonData )
{
    var m_sources = [];
    for(var index in jsonData["source"])
        m_sources.push( new InteractiveAdAppDataItemSource( jsonData["source"][index] ) );

    // Accessors
    this.getId = function()		{ return jsonData["id"]; }
    this.getSources = function()	{ return m_sources; }
    this.getAutoFit = function()	{ return jsonData["autoFit"]; }
}

var InteractiveAdAppDataItemSource = function( jsonData )
{
    // Accessors
    this.getProfile = function()	{ return jsonData["profile"]; }
    this.getHeight = function()		{ return jsonData["height"]; }
    this.getWidth = function()		{ return jsonData["width"]; }
    this.getFormat = function()		{ return jsonData["format"]; }
    this.getUrl = function()		{ return jsonData["url"]; }
}


//===========================================================================
//			PHASE 2 VIDEO-GALLERY MODELS
// - this is only the "apps" object, and everything it contains
// - the rest is reused objects from above
//===========================================================================

var VideoGalleryInteractiveAdApp = function( jsonData )
{
    /** @class InteractiveAdVideoGalleryData */
    var m_data;
    /** @class InteractiveAdAppCustomLauncher */
    var m_launcher;
    /** @class InteractiveAdAppPlaceholder */
    var m_placeHolder;

    // constructor, auto fires! (does this work? haven't tested it yet.)
    (function construct(){
        m_data = new InteractiveAdVideoGalleryData( jsonData["data"] );
        m_launcher = new InteractiveAdAppCustomLauncher( jsonData["customLauncher"] );
        m_placeHolder = new InteractiveAdAppPlaceholder( jsonData["placeholder"] );
    })();

    /** @return {string} - looks like xo39o, etc. */
    this.getID = function(){ 
        return jsonData["id"]; 
    }
    /** @return {string} */
    this.getTitle = function(){ 
        return jsonData["title"];
    }
    /** @return {string} */
    this.getAppID = function(){ 
        return jsonData["app-id"]; 
    }
    /** @return {string} */
    this.getAppVersion = function(){ 
        return jsonData["app-version"]; 
    }
    /** @return {InteractiveAdVideoGalleryData} */
    this.getData = function(){ 
        return m_data; 
    }
    /** @return {InteractiveAdAppCustomLauncher} */
    this.getCustomLauncher = function(){ 
        return m_launcher; 
    }
    /** @return {boolean} */
    this.getUseIconAsImage = function(){ 
        return jsonData["useIconAsImage"]; 
    }
    /** @return {InteractiveAdAppPlaceholder} */
    this.getPlaceHolder = function(){ 
        return m_placeHolder; 
    }
}

var InteractiveAdVideoGalleryData = function( jsonData )
{
    var m_all_items = [];
    var m_video_items = [];
    var m_image_items = [];
    for(var index in jsonData["items"])
    {
        // generally, this is the background image
	if( jsonData["items"][index]["type"] == "Image" )
	{
            var imageDataItem = new InteractiveAdVideoGalleryImageDataItem( jsonData["items"][index] )
            m_all_items.push( imageDataItem );
            m_image_items.push( imageDataItem );
	}
        // this is the video & it's associated image preview
	else if( jsonData["items"][index]["type"] == "Video")
	{
            var videoDataItem = new InteractiveAdVideoGalleryVideoDataItem( jsonData["items"][index] );
	    m_all_items.push( videoDataItem );
            m_video_items.push( videoDataItem );
	}
	else throw new Error("InteractiveAdVideoGalleryData - unknown type found");
    }
    
    /** @return {array} */
    this.getItemList = function(){ return m_all_items; }
    /** @return {array} */
    this.getVideoItemList = function(){ return m_video_items; }
    /** @return {array} */
    this.getImageItemList = function(){ return m_image_items; }
}

var InteractiveAdVideoGalleryImageDataItem = function( jsonData )
{
    var m_sources = [];
    for(var ind in jsonData["source"])
	m_sources.push( new InteractiveAdVideoGalleryDataItemSource( jsonData["source"][ind] ) );

    this.getID = function()		{ return jsonData["id"]; }
    this.getCaption = function()	{ return jsonData["caption"]; }
    this.getType = function()		{ return jsonData["type"]; }
    this.getAutofit = function()	{ return jsonData["autoFit"]; }
    this.getSourceList = function()	{ return m_sources; }
    
    // iterate InteractiveAdVideoGalleryDataItemSource objects and see which matches?
    this.getSourceFor = function( profile_type ){

        for( var i = 0; i < m_sources.length; i++ ){
            Logger.log("profile: " + m_sources[ i ].getProfile() + " == " + profile_type + "?" );
            if( m_sources[ i ].getProfile() == profile_type ){
                return m_sources[ i ];
            }
        }
        return null;
    }
    
}

var InteractiveAdVideoGalleryVideoDataItem = function( jsonData )
{
    var m_sources = [];
    for( var idx in jsonData["source"] )
	m_sources.push( new InteractiveAdVideoGalleryDataItemSource( jsonData["source"][idx] ) )

    var m_preview = new InteractiveAdVideoGalleryDataItemPreview( jsonData["preview"] );

    this.getID = function()		{ return jsonData["id"]; }
    this.getCaption = function()	{ return jsonData["caption"]; }
    this.getType = function()		{ return jsonData["type"]; }
    this.getDuration = function()       { return jsonData["duration"]; }
    this.getSourceList = function()	{ return m_sources; }
    this.getAutoFit = function()	{ return jsonData["autoFit"]; }
    this.getPreview = function()	{ return m_preview; }
    /**
     * get a data item source of a specific profile type.
     * profiles look like: mp4-480, mp4-720
     * @return InteractiveAdVideoGalleryDataItemSource - may be null if not found
     */
    this.getSourceFor = function( profile_type ){
        for( var i = 0; i < m_sources.length; i++ ){
            if( m_sources[ i ].getProfile() == profile_type )
                return m_sources[ i ];
        }
        return null;
    }
}

var InteractiveAdVideoGalleryDataItemPreview = function( jsonData )
{
    var m_sources = [];
    for( var i in jsonData["source"] )
	m_sources.push( new InteractiveAdVideoGalleryDataItemSource( jsonData["source"][i] ) )

    this.getType = function()		{ return jsonData["type"]; }
    this.getSourceList = function()	{ return m_sources; }
    this.getAutoFit = function()	{ return jsonData["autofit"]; }
    /**
     * get a data item source of a specific profile type.
     * profiles look like: jpg-720, jpg-144
     * @return InteractiveAdVideoGalleryDataItemSource - may be null if not found
     */
    this.getSourceFor = function( profile_type ){
        for( var i = 0; i < m_sources.length; i++ ){
            if( m_sources[ i ].getProfile() == profile_type )
                return m_sources[ i ];
        }
        return null;
    }
}

var InteractiveAdVideoGalleryDataItemSource = function( jsonData )
{
    this.getProfile = function()	{ return jsonData["profile"]; }
    this.getHeight = function()		{ return jsonData["height"]; }
    this.getWidth = function()		{ return jsonData["width"]; }
    this.getFormat = function()		{ return jsonData["format"]; }
    this.getURL = function()		{ return jsonData["url"]; }
}