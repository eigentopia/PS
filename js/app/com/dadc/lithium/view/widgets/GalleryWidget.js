include( "js/app/com/dadc/lithium/view/widgets/PreviewCarousel.js" );
/**
 * this is the comples widget for the innovid gallery ad
 * ------------------------------------
 * large background
 * carousel
 * control bar
 */
var GalleryWidget = function( interactiveAdConfigObj, mediaGalleryAdViewObj ){
        
    // feed configs
    var MEDIA_PATH_IDENTIFIER = "Video";
    var MEDIA_SOURCE_IDENTIFIER = "mp4-720";
    var PREVIEW_PATH_IDENTIFIER = "Image";
    var PREVIEW_SOURCE_IDENTIFIER = "jpg-144";
    var BACKGROUND_PATH_IDENTIFIER = "Image";
    var BACKGROUND_SOURCE_IDENTIFIER = "png-720";
    
    // control bar configs
    var CONTROL_BAR_HEIGHT = 236;
    var CONTROL_BAR_BACKGROUND_COLOR = [0/255, 0/255, 0/255, 0.8];
    var DIRECTION_BTN = "Artwork/controls/Direct_Pad_RightLeft.png";
    var CIRCLE_BTN = "Artwork/controls/Circle.png";
    var CROSS_BTN = "Artwork/controls/Cross.png";
    var TITLE_SAFE_LEFT_WIDTH = 144;
    var CONTROL_FONT = "fonts/sans.ttf";
    var CONTROL_FONT_SIZE = 24;
    var DPAD_TEXT = "Select Video";
    var CIRCLE_TEXT = "Exit";
    var CROSS_TEXT = "Play";
    
    // each of these tasks must be accomplished before the gallery widget is considered ready
    var TASKS = [
        LOAD_BACKGROUND = 0,
        INITIALIZE_CAROUSEL = 1
        //LOAD_CONTROLS: 2
    ];
    
    var This = this;
    var m_completed_tasks = 0;
    var m_root_node;
    var m_carousel;
    var m_background_image;
    
    // constructor
    (function construct(){
	Logger.log("GalleryWidget.construct()");
        m_root_node = engine.createContainer();       
        loadBackgroundImage(); // success, fail, fail handled
        createPreviewCarousel(); // fail handled, success/fail handled within carousel image load
    })();
    
    this.getDisplayNode = function(){
	Logger.log("GalleryWidget::getDisplayNode()");
        return m_root_node;
    }
    
    this.update = function( engine_timer ){
	   Logger.log("GalleryWidget::update()");        
    }
    
    this.resetNavigationIndex = function(){
        m_carousel.resetNavitationIndex();
    }
    
    this.onLeft = function( ){
        Logger.log("GalleryWidget::onLeft()");
        m_carousel.onLeft();
    }
    
    this.onRight = function( ){
        Logger.log("GalleryWidget::onRight()");
        m_carousel.onRight();
    }
    
    // no implementation needed for these, logging is fine
    this.onUp = function( ) { Logger.log("GalleryWidget::onUp()"); } 
    this.onDown = function( ) {Logger.log("GalleryWidget::onDown()");}
    this.onEnter = function( ){Logger.log("GalleryWidget::onEnter()");}
    this.onBack = function( ){Logger.log("GalleryWidget::onBack()");}
    
    this.getCurrentItemIndex = function(){
        return m_carousel.getCurrentItemIndex();
    }
    
    this.taskCompleted = function( message ){
        Logger.log("task completed: " + message);
        // increment counter
                // notify the ad view of completion
    m_completed_tasks++;
        // if done
        if( m_completed_tasks == TASKS.length ){
            // log
            Logger.log("all tasks completed for the gallery!");
            // assemble our parts into the main widget root node
            assembleGalleryWidget();
            mediaGalleryAdViewObj.notifyLoadStatus( true, "gallery is ready to roll!");
        }else{
            Logger.log("still waiting on some tasks to be completed");
        }
    }
    
    this.taskFailed = function( message ){
        // notify failure. should keep gallery from ever becomming available
        mediaGalleryAdViewObj.notifyLoadStatus( false, "gallery encountered an error: " + message );
    }
         
    // engine callback when the background loads
    function onBackgroundLoad( img ){
	Logger.log("background image loaded");
        m_background_image = img;
        
        m_background_image.width = 1920;
	m_background_image.height = 1080;
	m_background_image.x = 0;
        m_background_image.y = 0;
        
        This.taskCompleted( "background loaded" );
    }

    // engine callback when the background fails to load
    function onBackgroundError(){
        This.taskFailed("background image failed to load!");
    }
    
//    function fakeIt(){
//        onBackgroundLoad( AssetLoaderInstance.getImage( "Artwork/buttons/test_e7edd9c326323f3df33e67234928d662.png") );
//    }
    
    // do the background image loading / failing
    function loadBackgroundImage(){
//        setTimeout( fakeIt, 12 );
        var background_path = null;
	var itemList = interactiveAdConfigObj.getInteractiveAdApps()[0].getData().getItemList();
	for(var i = 0; i < itemList.length; i++){
	    if( itemList[i].getType() == BACKGROUND_PATH_IDENTIFIER ){
		var sourceList = itemList[i].getSourceList();
		for( var s = 0; s < sourceList.length; s++ ){
		    if( sourceList[s].getProfile() == BACKGROUND_SOURCE_IDENTIFIER ){
			background_path = sourceList[s].getURL();
                        Logger.log("background path : " + background_path );
                        break;
		    }
		}
	    }
	}
        
        if( background_path != null ){
            engine.loadImage( background_path, onBackgroundLoad, onBackgroundError);
        }else{
            This.taskFailed( "could not find a background image!" );
        }
    }
    
    // create and return the control bar
    function getControlBar(){
	Logger.log("GalleryWidget.getControlBar()");

        // create the main container, and position it
        var control_bar = engine.createContainer();
        control_bar.x = 0;
        control_bar.y = 1080 - CONTROL_BAR_HEIGHT;
        control_bar.width = 1920;
        control_bar.height = CONTROL_BAR_HEIGHT;

        // create the translucent background and add it to the container
    	var shader = ShaderCreatorInstance.createSolidColorShader( CONTROL_BAR_BACKGROUND_COLOR );
    	var bkg = engine.createSlate();
    	bkg.shader = shader;
    	bkg.width = 1920;
    	bkg.height = CONTROL_BAR_HEIGHT;
    	control_bar.addChild( bkg );

            // add the D-Pad and text
    	var dpad_slate = AssetLoaderInstance.getSlate( DIRECTION_BTN, 1 );
    	var dpad_text = engine.createTextBlock( DPAD_TEXT, { font: CONTROL_FONT, size: CONTROL_FONT_SIZE }, 512 );
    	var totalWidth = dpad_slate.width + 6 + dpad_text.naturalWidth;
    	dpad_slate.x = TITLE_SAFE_LEFT_WIDTH + totalWidth * 0.5 - 16;
    	dpad_text.x = dpad_slate.x + dpad_slate.width + 6;
    	dpad_slate.y = 72;
    	dpad_text.y = (dpad_slate.y + dpad_slate.height * 0.25) - (dpad_text.naturalHeight * 0.5) + 7;
    	control_bar.addChild( dpad_slate );
    	control_bar.addChild( dpad_text );
            
            // add the circle and text
    	var circ_rightSide = 1920 - ( 1920 * .075 ); // title safe right side
    	var circ_leftSide = (1920 * 0.5) + 350;
    	var circ_centerX = (circ_rightSide - circ_leftSide) * 0.5;
    	var circ_slate = AssetLoaderInstance.getSlate( CIRCLE_BTN, 1 );
    	var circ_txt = engine.createTextBlock( CIRCLE_TEXT, { font: CONTROL_FONT, size: CONTROL_FONT_SIZE }, 512 );
    	totalWidth = AssetLoaderInstance.getImage( CIRCLE_BTN ).width + circ_txt.naturalWidth;
    	circ_slate.x = circ_leftSide + circ_centerX - (totalWidth * 0.5) + 96;
    	circ_txt.x = circ_slate.x + circ_slate.width + 6;
    	circ_slate.y = 72;
    	circ_txt.y = (circ_slate.y + circ_slate.height * 0.25) - (circ_txt.naturalHeight * 0.5) + 8;
    	control_bar.addChild( circ_slate );
    	control_bar.addChild( circ_txt );
        
            // add the x button and text
    	var rightSide = 1920 - ( 1920 * .075 ); // title safe right side
    	var leftSide = (1920 * 0.5) + 350;
    	var cross_slate = AssetLoaderInstance.getSlate( CROSS_BTN, 1 );
        var cross_txt = engine.createTextBlock( CROSS_TEXT, { font: CONTROL_FONT, size: CONTROL_FONT_SIZE }, 512 );
    	totalWidth = cross_slate.width + cross_txt.naturalWidth;
    	cross_slate.x = leftSide + totalWidth * 0.5 - cross_slate.width - 3 + 96;
    	cross_txt.x = cross_slate.x + cross_slate.width + 3;
    	cross_slate.y = 72;
    	cross_txt.y = (cross_slate.y + cross_slate.height * 0.25) - (cross_txt.naturalHeight * 0.5) + 6;
    	control_bar.addChild( cross_slate );
    	control_bar.addChild( cross_txt );
        
        // return the final node
        return control_bar;
    }
    
    // called when everything is ready to be assembled and there were no errors reported
    function assembleGalleryWidget(){
        
        // placeholder background for now
        var tmp_slate = AssetLoaderInstance.getImage( "Artwork/promo_background.png" );
        tmp_slate.width = 1920;
        tmp_slate.height = 1080;
        tmp_slate.x = 0;
        tmp_slate.y = 0;
        m_root_node.addChild( tmp_slate );
        
        // add the background image first
	m_root_node.addChild( m_background_image );        

        // add the control widget on top of that
        m_root_node.addChild( getControlBar() );
        
        // add the carousel widget last
        m_root_node.addChild( m_carousel.getDisplayNode() );
    }    
    
    
    // PICKUP
    function createPreviewCarousel(){
        // interactiveApp instanceof {VideoGalleryInteractiveAdApp}
        var interactiveApp = interactiveAdConfigObj.getInteractiveAdApps()[0];
        // appData instanceof {InteractiveAdVideoGalleryData}
        var appData = interactiveApp.getData();
        // imageItemList instanceof array[] {InteractiveAdVideoGalleryImageDataItem}
        var videoItemArray = appData.getVideoItemList();
        
        // if there are no image items, then error!
        if( videoItemArray.length == 0 ){
            This.taskFailed( "failed to initialize carousel, there are no video preview items" );
            
        // if there are image items, the call constructor
        }else{
            m_carousel = new PreviewCarousel( This, videoItemArray );
        }
    }
    
    
}