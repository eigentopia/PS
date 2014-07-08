
include( "js/app/com/dadc/lithium/view/widgets/InnovidTimelineWidget.js" );

/**
 * this will basically just be the
 * ------------------------------------
 * blu-meter
 * controls
 * key input will make them visible
 * will timeout after inactivity
 */
var SecondaryMediaWidget = function( interactiveAdConfigObj, mediaGalleryAdViewObj ){
    
    // control bar configs
    var TIMEOUT_MS = 4000;
    var CONTROL_BAR_HEIGHT = 236;
    var CONTROL_BAR_BACKGROUND_COLOR = [0/255, 0/255, 0/255, 0.8];
    var CONTROLS_Y = 140;
    var DIRECTION_BTN = "Artwork/controls/Direct_Pad_RightLeft.png";
    var CIRCLE_BTN = "Artwork/controls/Circle.png";
    var CROSS_BTN = "Artwork/controls/Cross.png";
    var TITLE_SAFE_LEFT_WIDTH = 144;
    var CONTROL_FONT = "fonts/sans.ttf";
    var CONTROL_FONT_SIZE = 24;
    var DPAD_TEXT = Dictionary.getText( Dictionary.TEXT.SEEK )
    var CIRCLE_TEXT = Dictionary.getText( Dictionary.TEXT.BACK )
    var CROSS_TEXT = Dictionary.getText( Dictionary.TEXT.PAUSE );
    var TIMECODE_X = 100;
    var TIMECODE_Y = 100;
    
    var m_root_node;
    var m_innovid_timeline_widget;
    
    
    this.getDisplayNode = function(){
	Logger.log("SecondaryMediaWidget::getDisplayNode()");
        return m_root_node;
    }
    
    this.update = function( engine_timer ){

        if(m_innovid_timeline_widget.isVisible()){
            m_innovid_timeline_widget.update( engine_timer );
	        Logger.log("SecondaryMediaWidget::update()");
        }
        
//        m_timecode_widget.setCurrentTime( engine_timer );
//        m_timecode_widget.refresh();
    }
    
    this.isTimelineVisible = function(){
        return m_innovid_timeline_widget.isVisible();
    }
    
    this.getSeekTime = function( ){
        return m_innovid_timeline_widget.getSeekTime();
    }
    
    this.setCurrentPlayerTime = function( time ){
        //Logger.log("updating w/ time: " + time + ", duration: " + duration );
        m_innovid_timeline_widget.setTime( time );
    }
    
    this.refreshPlayerInfo = function( time, duration ){
        m_innovid_timeline_widget.refreshWidget( time, duration );
    }
    
    this.onUp = function( ) { 
        m_innovid_timeline_widget.setVisible( true );
        Logger.log("SecondaryMediaWidget::onUp()"); 
    } 
    this.onDown = function( ) { 
        m_innovid_timeline_widget.setVisible( true );
        Logger.log("SecondaryMediaWidget::onDown()");
    }
    this.onLeft = function( ){ 
        m_innovid_timeline_widget.setVisible( true );
        if( ! m_innovid_timeline_widget.isCursorVisible() ){
            m_innovid_timeline_widget.showCursor();
        }else{
            m_innovid_timeline_widget.scanBackward();
        }
        Logger.log("SecondaryMediaWidget::onLeft()");
    }
    this.onRight = function( ){ 
        m_innovid_timeline_widget.setVisible( true );
        if( ! m_innovid_timeline_widget.isCursorVisible() ){
            m_innovid_timeline_widget.showCursor();
        }else{
            m_innovid_timeline_widget.scanForward();
        }
        Logger.log("SecondaryMediaWidget::onRight()");
    }
    this.onEnter = function( ){ 
        m_innovid_timeline_widget.setVisible( true );
        Logger.log("SecondaryMediaWidget::onEnter()");
    }
    this.onBack = function( ){ 
        m_innovid_timeline_widget.setVisible( true );
        Logger.log("SecondaryMediaWidget::onBack()");
    }
    
    // set up the timeline
    function construct(){
        Logger.log("SecondaryMediaWidget - construct");
        m_root_node = engine.createContainer();
                
        // create the timecodes
        m_innovid_timeline_widget = new InnovidTimelineWidget( 0, 10000 );
        m_innovid_timeline_widget.x = TIMECODE_X;
        m_innovid_timeline_widget.Y = TIMECODE_Y;
        m_innovid_timeline_widget.setVisible( true );
        m_innovid_timeline_widget.showCursor();
        m_innovid_timeline_widget.getDisplayNode().x = 0;
        m_innovid_timeline_widget.getDisplayNode().y = 850;
        
        m_root_node.addChild( m_innovid_timeline_widget.getDisplayNode() );
        m_innovid_timeline_widget.update( );
    }
    
    construct();
}