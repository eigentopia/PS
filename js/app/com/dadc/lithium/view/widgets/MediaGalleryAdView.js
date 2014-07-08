include( "js/app/com/dadc/lithium/view/widgets/GalleryWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/PrimaryMediaWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/SecondaryMediaWidget.js" );

var MediaGalleryAdView = function( interactiveAdWidgetObj )
{
    var VIDEO_SOURCE_PROFILE = "mp4-720";
    
    // declare our layers
    var m_root_node, m_primary_media_widget, m_gallery_widget, m_secondary_media_widget;
    // our config
    var m_interactive_ad_config;
    // this is the active layer
    var m_active_layer;
    // scoping
    var This = this;
    // gallery is disabled by default (we can't accept key presses until we're ready, and video will immediately begin playing (by design))
    var m_gallery_enabled = false;
    // use the below to calculate successful gallery load
    var FULLY_ENABLED_COUNTER = 2; 
        // 1- PrimaryMediaWidget, 
        // 1- GalleryWidget [background path, controlBar, createPreviewCarousel]
        // 1- SecondaryMediaWidget // todo, makes total as 3
    var m_load_successes = [];
    var m_load_failures = [];
    var m_curr_secondary_video = null;
    var m_curr_secondary_video_duration = 300;
    var m_curr_secondary_video_analytics;
    var m_primary_playback_started = false;
    
    this.getDisplayNode = function(){
	Logger.log("MediaGalleryAdView::getDisplayNode()");
        return m_root_node;
    }
        
    this.onStart = function(){
        // if not ready or failure, exit early
        return
    }
    
    this.onUp = function( ) { 
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onUp()");
        switch( m_active_layer ){
            case m_secondary_media_widget:
                handleUpPressedOnSecondary();
                break;
        }
    }
    
    this.onDown = function( ) {
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onDown()"); 
        switch( m_active_layer ){
            case m_secondary_media_widget:
                handleDownPressedOnSecondary();
                break;
        }
    }

    this.onLeft = function( ){
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onLeft()");
        switch( m_active_layer ){
            case m_gallery_widget:
                handleLeftPressedOnGallery();
                break;
            case m_secondary_media_widget:
                handleLeftPressedOnSecondary()
                break;
        }
    }

    this.onRight = function( ){
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onRight()");
        switch( m_active_layer ){
            case m_gallery_widget:
                handleRightPressedOnGallery();
                break;
            case m_secondary_media_widget:
                handleRightPressedOnSecondary();
                break;
        }
    }

    this.onEnter = function( ){
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onEnter()");
        switch( m_active_layer ){
            case m_primary_media_widget:
                Logger.log("enter pressed during primary media widget");
                handleEnterPressedOnPrimary();
                break;
            case m_gallery_widget:
                Logger.log("enter pressed during gallery media widget");
                handleEnterPressedOnGallery();
                break;
            case m_secondary_media_widget:
                handleEnterPressedOnSecondary();
                break;
        }
        //m_active_layer && m_active_layer.onEnter();
    }

    this.onBack = function( ){
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;        
	Logger.log("MediaGalleryAdView::onBack()");
        switch( m_active_layer ){
            case m_gallery_widget:
                handleCirclePressedOnGallery();
                break;
            case m_secondary_media_widget:
                handleCirclePressedOnSecondary();
                break;
        }
    }
    
    // called by InteractiveAdWidget.update
    this.update = function( engine_timer ){
        // if not ready or failure, exit early
        if( ! m_gallery_enabled ) return;
        // handle update calls
        switch( m_active_layer ){
            case m_primary_media_widget:
                processPrimaryVideoAnalytics( engine_timer );
                break;
            case m_gallery_widget:
                m_gallery_widget.update( engine_timer );
                break;
            case m_secondary_media_widget:
                m_secondary_media_widget.setCurrentPlayerTime( m_curr_secondary_video.getResumeTime() );
                m_secondary_media_widget.update( engine_timer );
//                m_secondary_media_widget.update( engine_timer );
                break;
        }
    }
    
    
    // called by InteractiveAdWidget.close
    this.clearWidget = function(){
        Logger.log("clearWidget called");
        m_active_layer = null;
        m_root_node = null;
        m_primary_media_widget = null;
        m_gallery_widget = null;
        m_secondary_media_widget = null;
        m_gallery_enabled = false;
    }
        
    // called by InteractiveAdWidget.buildView
    this.buildView = function( interactiveAdConfigObj ){
	Logger.log("MediaGalleryAdView::buildView()");
        
        // store
        m_interactive_ad_config = interactiveAdConfigObj;
        
        // create analytics
        m_innovid_analytics = new InnovidAnalytics( interactiveAdConfigObj, interactiveAdWidgetObj );
        
        // create root node
        m_root_node = engine.createContainer();
                
        // create the PrimaryMediaWidget
        m_primary_media_widget = new PrimaryMediaWidget( interactiveAdConfigObj, This );
        
        // create the GalleryWidget
        m_gallery_widget = new GalleryWidget( interactiveAdConfigObj, This );
        
        // create the SecondaryMediaWidget
        m_secondary_media_widget = new SecondaryMediaWidget( interactiveAdConfigObj, This );
        
        // this is odd, but... add self to parent display node. 
        // parent is clearly not adding this to it, so we need to add self to parent... very bad breach of protocol!
        interactiveAdWidgetObj.getDisplayNode().addChild( This.getDisplayNode() );
    }
    
    this.notifyLoadStatus = function( is_successful, message ){
        if( is_successful ){
            Logger.log("load status success: " + message );
            m_load_successes.push( message );
        }else{
            Logger.log("load status failure! " + message );
            m_load_failures.push( message );
        }      
        // see if we're done loading everything now
        if( m_load_successes.length == FULLY_ENABLED_COUNTER && m_load_failures.length == 0 ){
            notifyLoadingCompletedSuccessfully();
        }
    }
    
    function setActiveLayer( layer ){
        // remove current if it exists
        while( m_root_node.numChildren != 0 ){
            m_root_node.removeChildAt( 0 );
            Logger.log("- - - - child removed");
        }
            
        // store and add new layer
        m_active_layer = layer;
        // add new active layer
        m_root_node.addChild( layer.getDisplayNode() );
    }

    // called on initial playback of the primary video
    this.onPlaying = function(){
        m_primary_playback_started = true;
        if( m_gallery_enabled )
            displayScreenBug();
    }
    
    this.onPlaybackEvent = function( playbackEventObj, videoObj ){
        Logger.log("MediaGalleryAdView notified of event on a secondary video (internal video)");
        switch( playbackEventObj.getEventType() ){
            
            case PlaybackEvent.TYPE.ENDED:
            case PlaybackEvent.TYPE.ENDOFMEDIA:
                processEndOfMediaAnalytics();
                m_curr_secondary_video.stop();
                setActiveLayer( m_gallery_widget );
                break;
                
            case PlaybackEvent.TYPE.PAUSED:
                // ?
                break;
                
            case PlaybackEvent.TYPE.PLAYING:
                Logger.log("playing event recieved from secondary video!");
                processPlayingAnalytics();
                break;
                
            case PlaybackEvent.TYPE.MARKREACHED:
                Logger.log("a mark was reached! mark num: " + playbackEventObj.getMarkNumber() );
                processMarkReachedAnalytics( playbackEventObj );
                break;
        }
    }
    
    function processMarkReachedAnalytics( markReachedEventObj ){
        switch( markReachedEventObj.getMarkNumber() ){
            case 1: m_curr_secondary_video_analytics.fire25Percent();
                break;
            case 2: m_curr_secondary_video_analytics.fire50Percent();
                break;
            case 3: m_curr_secondary_video_analytics.fire75Percent();
                break;
        }
    }
    
    function processEndOfMediaAnalytics(){
        m_curr_secondary_video_analytics.fire100Percent();
    }
    
    function processPlayingAnalytics(){
        m_curr_secondary_video_analytics.firePlay();
    }
    
    function displayScreenBug(){
        // SET THIS TO TRUE, ONLY IF WE CAN ACTIVATE!
        setActiveLayer( m_primary_media_widget );
    }
    
    function notifyLoadingCompletedSuccessfully(){
        Logger.log("TODO: notifyLoadingCompletedSuccessfully! still needs some work");
        
        m_gallery_enabled = true;
        
        if( m_primary_playback_started ){
            displayScreenBug();
        }
    }
    
    function processPrimaryVideoAnalytics( engine_timer ){
        // analytics
        var duration = interactiveAdWidgetObj.getConfigurationObject().getAdVideo().getDuration();
        var current = VideoManagerInstance.getPlaybackTimePTS();
        if( current >= duration * 0.25 && interactiveAdWidgetObj.getAnalytics().fire25Percent.hasFired == false )
            interactiveAdWidgetObj.getAnalytics().fire25Percent();
        if( current >= duration * 0.50 && interactiveAdWidgetObj.getAnalytics().fire50Percent.hasFired == false )
            interactiveAdWidgetObj.getAnalytics().fire50Percent();
        if( current >= duration * 0.75 && interactiveAdWidgetObj.getAnalytics().fire75Percent.hasFired == false )
            interactiveAdWidgetObj.getAnalytics().fire75Percent();
        if( current >= duration * 0.99 && interactiveAdWidgetObj.getAnalytics().fire100Percent.hasFired == false )
        {
            interactiveAdWidgetObj.getAnalytics().fire100Percent();
            This.clearWidget();
        }
    }
        
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // PRIMARY KEY PRESSES AND ANALYTICS!
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    
    function handleEnterPressedOnPrimary(){
        // analytics
        interactiveAdWidgetObj.getAnalytics().fireClick();      // called unconditionally, will send numerous times
        interactiveAdWidgetObj.getAnalytics().fireOpenSlate();  // called unconditionally, will send numerous times
        interactiveAdWidgetObj.getAnalytics().fireEngagement(); // called unconditionally, will only send once!
        // get the main video to stop playback
        interactiveAdWidgetObj.getVideoReference().pause( true );
        // update the gallery layer to position 0
        m_gallery_widget.resetNavigationIndex();
        // enter the gallery by throwing it's page on screen
        setActiveLayer( m_gallery_widget );
    }
    
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // GALLERY KEY PRESSES AND ANALYTICS!
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
        
    function handleLeftPressedOnGallery(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_gallery_widget.onLeft();
    }
    
    function handleRightPressedOnGallery(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_gallery_widget.onRight();
    }
    
    function handleCirclePressedOnGallery(){
        // analytics
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick(); 
        interactiveAdWidgetObj.getAnalytics().fireCloseSlate();
        
        // switch back to primary
        setActiveLayer( m_primary_media_widget );
        // get the main video playing again
        if( VideoManagerInstance.getCurrentJSVideo() == interactiveAdWidgetObj.getVideoReference() ){
            interactiveAdWidgetObj.getVideoReference().pause( false );
        }else{
            interactiveAdWidgetObj.getVideoReference().play();
        }
    }
    
    function handleEnterPressedOnGallery(){
        // analytics
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();      // called unconditionally
        
        // query nav index from carousel
        var nav_index = m_gallery_widget.getCurrentItemIndex();
        
        // get the app info : VideoGalleryInteractiveAdApp @ 0
        var interactiveApp = m_interactive_ad_config.getInteractiveAdApps()[0];
        
        // InteractiveAdVideoGalleryData
        var appData = interactiveApp.getData();
        
        // InteractiveAdVideoGalleryVideoDataItem @ nav_index
        var videoDataItem = appData.getVideoItemList()[ nav_index ]; 
        
        // InteractiveAdVideoGalleryDataItemSource
        var videoItemSource = videoDataItem.getSourceFor( VIDEO_SOURCE_PROFILE );
        
        // update duration 
        m_curr_secondary_video_duration = videoDataItem.getDuration();
        
        // create the analytics for this new secondary video
        m_curr_secondary_video_analytics = new InnovidSecondaryVideoAnalytics( m_interactive_ad_config.getInteractiveAdAnalytics(), videoDataItem.getID() );
        
        // play it!
        playGalleryVideo( videoItemSource.getURL(), videoDataItem.getDuration() );
    }
    
    function playGalleryVideo( video_url ){
        // creates a new player each time. so, resume tc is NOT remembered!
        m_curr_secondary_video = new InnovidInternalVideo( video_url, This );
        m_curr_secondary_video.addPlaybackMark( m_curr_secondary_video_duration * .25 );
        m_curr_secondary_video.addPlaybackMark( m_curr_secondary_video_duration * .50 );
        m_curr_secondary_video.addPlaybackMark( m_curr_secondary_video_duration * .75 );
        m_curr_secondary_video.play();
        setActiveLayer( m_secondary_media_widget );
        //m_secondary_media_widget.setCurrentPlayerTime( 0 );
        m_secondary_media_widget.refreshPlayerInfo( 0, m_curr_secondary_video_duration );
        m_secondary_media_widget.onUp(); // will call internal bump
    }
    
    
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // SECONDARY PRESSES AND ANALYTICS!
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    // *************************************************************************
    
    function handleUpPressedOnSecondary(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_secondary_media_widget.onUp();
    }
    
    function handleDownPressedOnSecondary(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_secondary_media_widget.onDown();
    }
    
    function handleLeftPressedOnSecondary(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_secondary_media_widget.onLeft();
    }
    
    function handleRightPressedOnSecondary(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_secondary_media_widget.onRight();
    }

    function handleEnterPressedOnSecondary(){
        // if the timeline is open, then seek to time
        Logger.log("handleEnterPressedOnSecondary - begin");
        if( m_secondary_media_widget.isTimelineVisible() ){
            Logger.log("handleEnterPressedOnSecondary - timeline is visible");
            interactiveAdWidgetObj.getAnalytics().fireClick();
            interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
            m_curr_secondary_video.setCurrentTime( m_secondary_media_widget.getSeekTime() );
        }
    }
    
    function handleCirclePressedOnSecondary(){
        interactiveAdWidgetObj.getAnalytics().fireClick();
        interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        m_curr_secondary_video.stop();
        setActiveLayer( m_gallery_widget );
    }
    
    var isPaused = false;
    function handleStartPressedOnSecondary(){
        //come on, who pauses an ad?
        // interactiveAdWidgetObj.getAnalytics().fireClick();
        // interactiveAdWidgetObj.getAnalytics().fireInUnitClick();
        // if(isPaused){

        //     m_curr_secondary_video.pause(false);
        //     isPaused = true   
        // }
        // else{
        //     m_curr_secondary_video.pause(true);
        //     isPaused = false
        // }
        // m_secondary_media_widget.onUp(); // paused, so bump it.
    }
}

// - InteractiveAdWidget.build() loops through adType values
// - this ad type is encountered "Media Gallery"
// - input handler is assigned w/ MediaGalleryInputHandler
// - adView is assigned w/ MediaGalleryAdView
// - if input handler exists (which it does), the MediaGalleryAdView obj is set w/ 
//          MediaGalleryInputHandler.setView( MediaGalleryAdView Obj )
// this is constructed from InteractiveAdWidget 
var MediaGalleryInputHandler = function( interactiveAdWidget ){
    
    var m_mediaGalleryAdView = null;
    
    this.setView = function( mediaGalleryAdViewObj ) { m_mediaGalleryAdView = mediaGalleryAdViewObj; }
    
    this.close = function( ) { m_mediaGalleryAdView = null; }
    
    this.onUp = function( ) { 
        Logger.log("MediaGalleryInputHandler::onUp()"); 
	m_mediaGalleryAdView.onUp();
    }
    this.onDown = function( ) { 
        Logger.log("MediaGalleryInputHandler::onDown()"); 
	m_mediaGalleryAdView.onDown();
    }

    this.onLeft = function( ){
	Logger.log("MediaGalleryInputHandler::onLeft()");
	m_mediaGalleryAdView.onLeft();
    }

    this.onRight = function( ){
	Logger.log("MediaGalleryInputHandler::onRight()");
	m_mediaGalleryAdView.onRight(); 
    }

    this.onEnter = function( ){
	Logger.log("MediaGalleryInputHandler::onEnter()");
	m_mediaGalleryAdView.onEnter();
    }

    this.onBack = function( ){
	Logger.log("MediaGalleryInputHandler::onBack()");
	m_mediaGalleryAdView.onBack();
    }
    
    this.onStart = function( ) {
        m_mediaGalleryAdView.onStart();
    }
    
}   
    