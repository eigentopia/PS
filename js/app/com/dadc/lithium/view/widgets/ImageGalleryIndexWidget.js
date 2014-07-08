/**
 * ImageGalleryIndexWidget.js - Crackle
 * @author Daniel Cuccia
 * 
 * This is the visual used with interactive ad's image gallery,
 * Mocking the Innovid visual, it displays a line of dots, representing
 * which image within the list the user user currently looking at
 * 
 * (EXPERIMENTAL - DO NOT USE)
 */

function ImageGalleryIndexWidget( count, centerX, centerY, color1, color2 )
{
    var This                = this;
    var m_currentIndex      = 0;
    var m_rootNode          = engine.createContainer();
    
    // Set which index is current
    this.setCurrentIndex = function( value )
    {
        if( value >= count )
        {
            Logger.log("ImageGalleryIndexWidget.setCurrentIndex() - invalid value");
            m_currentIndex = count - 1;
        }
        else if( value < 0 )
        {
            Logger.log("ImageGalleryIndexWidget.setCurrentIndex() - invalid value");
            m_currentIndex = 0;
        }
        else
        {
            m_currentIndex = value;
        }
        updateVisuals();
    }
    
    // privately called to initialize visuals
    function buildVisuals()
    {
        Logger.log("ImageGalleryIndexWidget::buildVisuals()");
    }
    buildVisuals();
    
    // privately called to update the visuals
    function updateVisuals()
    {
        Logger.log("ImageGalleryIndexWidget::updateVisuals()");
    }
    
    // privately called to change the widget's location
    function updateLocation()
    {
        Logger.log("ImageGalleryIndexWidget::updateLocation()");
    }
    
    // Accessors
    this.getDisplayNode = function() { return m_rootNode; }
    this.getCurrentIndex = function() { return m_currentIndex; }
    this.getCenterX = function() { return centerX; }
    this.getCenterY = function() { return centerY; }
    this.setCenterX = function( val ) { centerX = val; updateLocation(); }
    this.setCenterY = function( val ) { centerY = val; updateLocation(); }
    
    // Un-Used API
    this.update = function( time ){}
    this.navLeft = function( ) { }
    this.navRight = function( ) { }
    this.navUp = function( ) { }
    this.navDown = function( ) { }
    this.enterPressed = function( ) { }
    this.circlePressed = function( ) { }
    this.remotePlay = function( ) { }
    this.remoteStop = function( ) { }
    this.startPressed = function( ){ }
    this.trianglePressed = function( ) { }
    this.remotePause = function( ) { }
    this.refreshWidget = function( playerListObj ) { }
}