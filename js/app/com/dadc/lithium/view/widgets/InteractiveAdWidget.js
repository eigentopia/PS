/*
 * InteractiveAdWidget.js - Crackle
 * @author Daniel Cuccia
 *
 * this file contains all of the widget construction and input handling
 * for interactive ads, InteractiveAdVideo wraps this object to fit existing frameworks
 * IInputHandler and IInteractiveAdView are interfaces of common API for the Widget.
 * This is the Strategy Pattern, the widget blindly calls the API from these two interfaces
 * which can be extended and added into m_interactiveAdTypes for completely new functionality.
 * IInteractiveAdView: all visual logic will be in here
 * IInputHandler: all input logic will be here, (and will probably call your own API inside the custom View)
 *
 * Since this widget is going to handle all interactive ads for Innovid, the Analytic object is found here,
 * composed inside of the widget, and implements all analytics Innovid requires
 *
 * note: this hefty file holds all innovid interactive ads. hence it's size
 */

include( "js/app/com/dadc/lithium/view/widgets/InteractiveAdImageGallery.js" );
include( "js/app/com/dadc/lithium/view/widgets/MediaGalleryAdView.js" );

// primary analytics
include( "js/app/com/dadc/lithium/model/InnovidAnalytics.js" );

// internal video specific analytics
include( "js/app/com/dadc/lithium/model/InnovidSecondaryVideoAnalytics.js" );

var InteractiveAdWidget = function( interactiveAdConfig, innovidVideo )
{
    var This = this;

    // The list of all supported interactive ads, and their respective Views and InputHandlers
    var m_interactiveAdTypes =
    [
        {
            type: "Image Gallery",
            api:
            {
                adView: function( iAdWidget ) { return new ImageGalleryAdView( iAdWidget ); },
                inputHandler: function( iAdWidget ) { return new ImageGalleryInputHandler( iAdWidget ); }
            }
        },
        {
            type: "Media Gallery",
            api:
            {
                adView: function( iAdWidget ) { return new MediaGalleryAdView( iAdWidget ); },
                inputHandler: function( iAdWidget ) { return new MediaGalleryInputHandler( iAdWidget ); }
            }
        }
    ];

    var m_rootNode          = engine.createContainer(); // root container m_adView uses
    var m_inputHandler      = null;                     // main input handler
    var m_adView            = null;                     // main visual handler
    var m_analytics         = new InnovidAnalytics( interactiveAdConfig.getInteractiveAdAnalytics(), this );

    // Build the view according to data received from server
    function build( )
    {
        if(! interactiveAdConfig )
        {
            Logger.log("InteractiveAdWidget::build() - adConfig was found invalid");
            innovidVideo&&innovidVideo.onError();
        }

        var adType = interactiveAdConfig.getInteractiveAdApps()[0].getTitle();
        for( var index in m_interactiveAdTypes )
        {
            if( m_interactiveAdTypes[index].type == adType )
            {
                Logger.log("***BUILDING ")
                m_inputHandler = m_interactiveAdTypes[index].api.inputHandler( This );
                m_adView = m_interactiveAdTypes[index].api.adView( This );
                if( m_inputHandler ) m_inputHandler.setView( m_adView );
                else Logger.log("InteractiveAdWidget::build() - inputHandler was found invalid when trying to set view");
                break;
            }
        }

        if( m_adView )
        {
            m_adView&&m_adView.buildView( interactiveAdConfig );
            m_analytics&&m_analytics.fireInit();
        }
        else
        {
            Logger.log("InteractiveAdWidget::build() - unable to find a proper InteractiveAdView");
            innovidVideo&&innovidVideo.onError();
        }

        //m_adView&&m_adView.start();   //DAN: this isn't implemented, and not found in original ImageGallery ad
        m_analytics&&m_analytics.firePlay();

        var config = m_analytics.getConfigObject();
        config&&config.markStartTime();
    }
    
    // fired by the InnovidVideo object
    this.onPlaying = function(){
        m_adView.onPlaying();
    }

    // Per-Cycle Update call
    this.update = function( engine_timer )
    {
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'InteractiveAdWidget::update() - ' + engine_timer );
        m_adView&&m_adView.update( engine_timer );
    }

    // pass close call to the View interface
    this.close = function()
    {
        Logger.log("InteractiveAdWidget::close()");

        m_adView&&m_adView.clearWidget();
        m_adView = null;

        m_inputHandler&&m_inputHandler.close();
        m_inputHandler = null;

        m_analytics = null;
    }

    // User Interactive methods - forwarded to inputHandler, who calls the API from the view
    this.navLeft = function(){ m_inputHandler&&m_inputHandler.onLeft(); }
    this.navRight = function(){ m_inputHandler&&m_inputHandler.onRight(); }
    this.navUp = function(){ m_inputHandler&&m_inputHandler.onUp(); }
    this.navDown = function(){ m_inputHandler&&m_inputHandler.onDown(); }
    this.enterPressed = function(){ m_inputHandler&&m_inputHandler.onEnter(); }
    this.circlePressed = function(){ m_inputHandler&&m_inputHandler.onBack(); }
    this.remotePlay = function(){ m_inputHandler&&m_inputHandler.onEnter(); }
    this.remoteStop = function(){ m_inputHandler&&m_inputHandler.onBack(); }
    this.startPressed = function( ){ m_inputHandler&&m_inputHandler.onStart(); }


    // Un-Used API
    this.trianglePressed = function( ) { }
    this.remotePause = function( ) { }
    this.refreshWidget = function( playerListObj ) { }

    // Accessors
    this.getConfigurationObject = function() { return interactiveAdConfig; }
    this.getInteractiveAdView = function() { return m_adView; }
    this.getInputHandler = function() { return m_inputHandler; }
    this.getDisplayNode = function() {
        Logger.log("InteractiveAdWidget::getDisplayNode() - called");
        return m_rootNode;
    }
    this.getVideoReference  = function() { return innovidVideo; }
    this.getAnalytics = function() { return m_analytics; }

    build();
}

/**
 * This is an interface all children view builders must implement
 */
var IInteractiveAdView = function( )
{
    this.buildView = function( data ) { }
    this.update = function( time ) { }
    this.clearWidget = function( ) { }
}

/**
 * This is an interface all children input handlers must implement
 */
var IInteractiveAdInputHandler = function( )
{
    this.onLeft = function( ) { }
    this.onRight = function( ) { }
    this.onUp = function( ) { }
    this.onDown = function( ) { }
    this.onEnter = function( ) { }
    this.onBack = function( ) { }
    this.setView = function( view ) { }
    this.close = function( ) { }
    this.onStart = function( ) { }
}
