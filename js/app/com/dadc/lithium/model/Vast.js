                                                                     
                                                                     
                                                                     
                                             
include( "js/app/com/dadc/lithium/parsers/XMLParser.js" );



var VastModel = function(){};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// REQUEST OBJECTS BELOW
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
VastModel.VastRequest = function( url, callback )
{
    // SAMPLE URL
    // http://req.tidaltv.com/tpas1.aspx?mt=1&pid=794&pd1=PS3Home&xf=7&rand=8180154&amtype=mp4
    
    Logger.log( "ADTRACKER: VastRequest new - VAST URL: " + url );
    var httpRequestObj;
    var This = this;

    this.startRequest = function( )
    {
        initHttpRequest();
        httpRequestObj.start();
    };
    
    function initHttpRequest()
    {
        // BENUPDATE: CONFIGURABLE SDK TYPE
        httpRequestObj = ModelConfig.createRequest( "GET", url, null, null );        
        httpRequestObj.onComplete = This.onRequestComplete;
    }

    this.onRequestComplete = function( data, status )
    {
        if ( status === 200 )
    {
            try
        {
                callback( new VastModel.Vast( XMLParser_DAC.XMLToJSON( data ) ), status );
            }
        catch( e )
        {
                Logger.log( 'VastModel.onRequestComplete()  EXCEPTION RAISED' );
                Logger.logObj( e );
                callback( null, ModelConfig.API_ERROR );
            }
        }
    else
    {
        callback( null, status );
        }
    };
};

// =============================================================================
//              MODEL OBJECTS
// =============================================================================

/**
 * Logs an error from Vast Model parsing
 * @param {String} obj
 * @param {String} msg
 */
function logVastError( obj, msg )
{
    Logger.critical("VastModel." + obj + " - error: " + msg);
    return null;
}

VastModel.Vast = function( data )
{
    this.m_adList   = data.Ad ? new VastModel.AdList( data.Ad ) : logVastError("Vast", "no ad list");
    data = null;
};
VastModel.Vast.prototype = 
{
    getAdList:          function() { return this.m_adList; }
};



VastModel.AdList = function( data )
{
    this.m_adList         = [];
    
    if( isArray( data.Ad ) === true )
    {
        Logger.log("VastModel.AdList() - array of creatives found");
        for( var i = 0; i < data.creative.length; i++ )
        {
            Logger.log("VastModel.adList() - pushing iteration: " + i);
            this.m_adList.push( new VastModel.Ad( data.creative[ i ] ) );
        }
    }
    else
    {
        Logger.log("VastModel.AdList() - pushing 1 ad");
        this.m_adList.push( new VastModel.Ad( data ) );
    };
    
    data = null;
};
VastModel.AdList.prototype = 
{
    getTotalAds:        function() { return this.m_adList.length; },
    getAd:              function( idx ) { return this.m_adList[ idx ]; }
};



VastModel.Ad = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_inline = this.m_jsonData.InLine ? new VastModel.InLine( this.m_jsonData.InLine ) : logVastError("Ad", "no inline (not an error)");
    this.m_wrapper = this.m_jsonData.Wrapper ? new VastModel.Wrapper( this.m_jsonData.Wrapper ) : logVastError("Ad", "no wrapper (not an error)");
};
VastModel.Ad.prototype = 
{
    getAdId:            function() { return getTextFromNode( this.m_jsonData.attributes['id'] ); },
    getInLine:          function() { return this.m_inline; },
    getWrapper:         function() { return this.m_wrapper; }
};



VastModel.InLine = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_creativeList = new VastModel.CreativeList( this.m_jsonData.Creatives );
    this.m_impressionList = [];
    
    if( this.m_jsonData.Impression )
    {
        if( isArray( this.m_jsonData.Impression ) === true )
        {
            Logger.log("VastModel.InLine() - array of impressions");
            for( var i = 0; i < this.m_jsonData.Impression.length; i++ )
            {
                Logger.log("VastModel.InLine() - pushing iteration: " + i);
                this.m_impressionList.push( getTextFromNode( this.m_jsonData.Impression[i] ) );
            }
        }
        else 
        {
            Logger.log("VastModel.InLine() - pushing 1 impression");
            this.m_impressionList.push( getTextFromNode( this.m_jsonData.Impression ) );
        }
    }
    else Logger.critical("VastModel.InLine() - there are no impressions");
    Logger.log("VastModel.InLine() - " + this.m_impressionList.length + " impression(s)");
};
VastModel.InLine.prototype = 
{
    getAdSystem:            function() { return getTextFromNode( this.m_jsonData.AdSystem );},
    getAdTitle:             function() { return getTextFromNode( this.m_jsonData.AdTitle ); },
    getDescription:         function() { return getTextFromNode( this.m_jsonData.Description ); },
    getSurvey:              function() { return getTextFromNode( this.m_jsonData.Survey ); },
    getError:               function() { return getTextFromNode( this.m_jsonData.Error ); },
    getImpression:          function() { return this.m_impressionList; },
    getCreativeList:        function() { return this.m_creativeList; }
};



VastModel.Wrapper = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_creativeList = new VastModel.CreativeList( this.m_jsonData.Creatives );
    this.m_impressionList = [];
    
    if( this.m_jsonData.Impression )
    {
        if( isArray( this.m_jsonData.Impression ) === true )
        {
            Logger.log("VastModel.Wrapper() - array of impressions");
            for( var i = 0; i < this.m_jsonData.Impression.length; i++ )
            {
                Logger.log("VastModel.Wrapper() - pushing iteration: " + i );
                this.m_impressionList.push( getTextFromNode( this.m_jsonData.Impression[i] ) );
            }
        }
        else 
        {
            Logger.log("VastModel.Wrapper() - pushing 1 impression");
            this.m_impressionList.push( getTextFromNode( this.m_jsonData.Impression ) );
        }
    }
    else Logger.critical("VastModel.Wrapper() - there are no Impressions");
    Logger.log("VastModel.Wrapper() - " + this.m_impressionList.length + " impression(s)");
};
VastModel.Wrapper.prototype =
{
    getAdSystem:            function() { return getTextFromNode( this.m_jsonData.AdSystem ); },
    getVASTAdTagURI:        function() { return getTextFromNode( this.m_jsonData.VASTAdTagURI ); },
    getDescription:         function() { return getTextFromNode( this.m_jsonData.Description ); },
    getSurvey:              function() { return getTextFromNode( this.m_jsonData.Survey ); },
    getError:               function() { return getTextFromNode( this.m_jsonData.Error ); },
    getImpression:          function() { return this.m_impressionList; },
    getCreativeList:        function() { return this.m_creativeList;}
};



VastModel.CreativeList = function( data )
{
    this.m_creativeList = [];
    
    if( isArray( data.Creative ) === true )
    {
        Logger.log("VastModel.CreativeList() - array of creatives found");
        for( var i = 0; i < data.Creative.length; i++ )
        {
            Logger.log("VastModel.CreativeList() - pushing iteration: " + i);
            this.m_creativeList.push( new VastModel.Creative( data.Creative[ i ] ) );
        }
    }
    else
    {
        Logger.log("VastModel.CreativeList() - pushing 1 creative");
        this.m_creativeList.push( new VastModel.Creative( data.Creative ) );
    }
    
    data = null;
};
VastModel.CreativeList.prototype =
{
    getTotalCreatives:      function() { return this.m_creativeList.length; },
    getCreative:            function( index ) { return this.m_creativeList[ index ]; }
};



VastModel.Creative = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_linear = this.m_jsonData.Linear ? new VastModel.Linear( this.m_jsonData.Linear ) : logVastError("Creative", "no creative");
};
VastModel.Creative.prototype = 
{
    getId:              function() { return getTextFromNode( this.m_jsonData.attributes['id'] ); },
    getSequence:        function() { return getTextFromNode( this.m_jsonData.attributes['sequence'] ); },
    getAdID:            function() { return getTextFromNode( this.m_jsonData.attributes['AdID'] ); },
    getLinear:          function() { return this.m_linear; }
};



VastModel.Linear = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_videoClicks = this.m_jsonData.VideoClicks ? new VastModel.VideoClicks( this.m_jsonData.VideoClicks ) : logVastError("Linear", "no videoClicks (not an error)");
    this.m_mediaFileList = this.m_jsonData.MediaFiles ? new VastModel.MediaFilesList( this.m_jsonData.MediaFiles ) : logVastError("Linear", "no mediaFiels");
};
VastModel.Linear.prototype = 
{
    getDuration:            function() { return getTextFromNode( this.m_jsonData.Duration ); },
    getTrackingEvents:      function() { return this.m_jsonData.TrackingEvents; },
    getAdParameters:        function() { return getTextFromNode( this.m_jsonData.AdParameters ); },
    getVideoClicksList:     function() { return this.m_videoClicks; },
    getMediaFilesList:      function() { return this.m_mediaFileList; }
};



VastModel.VideoClicks = function( data )
{
    this.m_jsonData = data; data = null;
};
VastModel.VideoClicks.prototype = 
{
    getClickThrough:        function() { return getTextFromNode( this.m_jsonData.ClickThrough ); },
    getClickTracking:       function() { return getTextFromNode( this.m_jsonData.ClickTracking ); },
    getCustomClick:         function() { return getTextFromNode( this.m_jsonData.CustomClick ); }
};



VastModel.MediaFilesList = function( data )
{
    this.m_jsonData = data; data = null;
    this.m_mediaFileList = [];
    
    if( isArray( this.m_jsonData.MediaFile ) === true )
    {
        Logger.log("VastModel.MediaFilesList() - array of media files found");
        for( var i = 0; i < this.m_jsonData.MediaFile.length; i++ )
        {
            Logger.log("VastModel.MediaFilesList() - pushing iteration: " + i);
            this.m_mediaFileList.push( new VastModel.MediaFile( this.m_jsonData.MediaFile[ i ] ) );
        }
    }
    else
    {
        Logger.log("VastModel.MediaFilesList() - pushing 1 mediaFile");
        this.m_mediaFileList.push( new VastModel.MediaFile( this.m_jsonData.MediaFile ) );
    }
};
VastModel.MediaFilesList.prototype = 
{
    getTotalMediaFiles:     function() { return this.m_mediaFileList.length; },
    getMediaFile:           function( index ) { return this.m_mediaFileList[ index ]; }
};
    
    

VastModel.MediaFile = function( data )
{
    this.m_jsonData = data; data = null;
};
VastModel.MediaFile.prototype = 
{
    getId:                  function() { return getTextFromNode( this.m_jsonData.attributes['id'] ); },
    getDelivery:            function() { return getTextFromNode( this.m_jsonData.attributes['delivery'] ); },
    getType:                function() { return getTextFromNode( this.m_jsonData.attributes['type'] ); },
    getBitrate:             function() { return getTextFromNode( this.m_jsonData.attributes['bitrate'] ); },
    getWidth:               function() { return getTextFromNode( this.m_jsonData.attributes['width'] ); },
    getHeight:              function() { return getTextFromNode( this.m_jsonData.attributes['height'] ); },
    getScalable:            function() { return getTextFromNode( this.m_jsonData.attributes['scalable'] ); },
    getMaintainAspectRatio: function() { return getTextFromNode( this.m_jsonData.attributes['maintainAspectRatio'] ); },
    getApiFramework:        function() { return getTextFromNode( this.m_jsonData.attributes['apiFramework'] ); },
    getUrl:                 function() { return getTextFromNode( this.m_jsonData ); }
};