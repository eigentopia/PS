/**
 *
 * imageItemList instanceof array[] {InteractiveAdVideoGalleryVideoDataItem}
 * 
 */
var PreviewCarousel = function( galleryWidgetObj, videoItemList )
{    
    var SELECTOR_IMAGE_PATH = "Artwork/innovid_mediaGallery_selector.png";
    var ANIMATION_DURATION = 400; //ms
    var CAROUSEL_WIDTH = 792;
    var CAROUSEL_HEIGHT = 236;
    var SOURCE_PROFILE_IDENTIFIER = "jpg-144";
    var PREVIEW_IMAGE_WIDTH = 256;
    var PREVIEW_IMAGE_HEIGHT = 144;
    var PREVIEW_IMAGE_Y = 36;
    var SPACING = 12;
    var SELECTOR_XY = [
        { x: 0, y: 36 },
        { x: 268, y: 36 },
        { x: 537, y: 36 }
    ];
    var CAROUSEL_ORIGIN_Y = 835;
    
    var m_selector = undefined; // this is the square w/ the play button in it
    var m_node,m_previewNode, m_cropNode;
    var m_currentIndex = 0;			// which index the user has currently selected
    var m_lastTime = null;			// because we don't have deltaTime
    var m_isAnimating = false;		// flag to run animation math
    var m_start = null;
    var m_end = null;
    var m_currentDuration = null;
    var m_total_images_needed = 0;
    var m_total_images_loaded = 0;
    var m_video_item_captions = new Array();
    
    (function construct(){
        
        // it is assumed that each image item will have the profile we need "jpg-144", and can be loaded below.
        m_total_images_needed = videoItemList.length;
        
        // create display nodes/ animation nodes
        m_node = engine.createContainer();
        m_previewNode = engine.createContainer();
        m_cropNode = engine.createContainer();
        m_selector = engine.createContainer();
                
        // add nodes and position
        m_cropNode.addChild( m_previewNode );
        m_cropNode.x = 0;
        m_cropNode.y = PREVIEW_IMAGE_Y;
        m_cropNode.clipRect.height = PREVIEW_IMAGE_HEIGHT;
        m_cropNode.clipRect.width = ( PREVIEW_IMAGE_WIDTH * 3 ) + ( SPACING * 2 );
        m_cropNode.clipRect.x = 0;
        m_cropNode.clipRect.y = 0;
        
        // add crop node to the main node
        m_node.addChild( m_cropNode );
        
        // create graphics
        m_node.x = (1920 * 0.5) - (CAROUSEL_WIDTH * 0.5);
        m_node.y = CAROUSEL_ORIGIN_Y;
        m_node.width = CAROUSEL_WIDTH;
        m_node.height = CAROUSEL_HEIGHT;
        m_previewNode.x = 0;
        m_previewNode.width = CAROUSEL_WIDTH;
        m_previewNode.height = CAROUSEL_HEIGHT;

        Logger.log("total items is: " + videoItemList.length );

        // imageItemList_array is [] => InteractiveAdVideoGalleryVideoDataItem
        for( var i = 0; i < videoItemList.length; i++ )
        {
            // videoDataItem instanceof {InteractiveAdVideoGalleryDataItemSource}
            var videoDataItem = videoItemList[ i ];
            // previewItem instanceof InteractiveAdVideoGalleryDataItemPreview
            var previewItem = videoDataItem.getPreview();
            // itemSource instanceof InteractiveAdVideoGalleryDataItemSource
            var itemSource = previewItem.getSourceFor( SOURCE_PROFILE_IDENTIFIER );
            
            // if we fail to find the proper source for this preview item
            if( itemSource == null ){
                galleryWidgetObj.taskFailed( "cannot find proper profile item source for carousel image item" );
                break;
            }
            
            // get the text
            Logger.log("caption is: " + videoDataItem.getCaption());
            m_video_item_captions.push( videoDataItem.getCaption() );
            
            // get the url
            var image_url = itemSource.getURL();
            Logger.log("image source is: " + image_url );
                
            // if there is a problem with the image source
            if( image_url == null || image_url.length == 0 ){
                // error out!
                galleryWidgetObj.taskFailed( "missing image url for carousel image item" );
                break;
            }
            
            engine.loadImage(
                //previewList[i].preview,
                image_url,
                ( function( index )
                        {
                            return function( img )
                            {
                                img.width = PREVIEW_IMAGE_WIDTH;
                                img.height = PREVIEW_IMAGE_HEIGHT;
                                img.y = 0;
                                img.x = ( index * PREVIEW_IMAGE_WIDTH ) + ( index * SPACING );
                                m_previewNode.addChild( img );
                                notifyImageLoadedOK();
                            }
                        } 
                    )( i ),
                function()
                    {
                        galleryWidgetObj.taskFailed( "failed to load carousel image" );
                    }
            );
        }
            
        // set the index to zero always
        m_currentIndex = 0;

        // set the preview node x position (same for all lengths)
        m_previewNode.x = 0; 
    })();
    
    function notifyImageLoadedOK(){
        // bump the counter
        m_total_images_loaded++;
        Logger.log("notifyImageLoadedOK - " + m_total_images_loaded + " loaded, " + m_total_images_needed + " needed");
        // if we're done loading images, notify the widget that created us
        if( m_total_images_loaded == m_total_images_needed ){
            // finalize the creation process
            finalizeCreationProcess();
            // task completed!
            galleryWidgetObj.taskCompleted( "carousel loaded" );
        }
    }
    
    function finalizeCreationProcess(){
        Logger.log("finalizeCreationProcess");
        // get the selector image on screen and positioned
        var selector_img = AssetLoaderInstance.getSlate( SELECTOR_IMAGE_PATH, 1 );
        // add the slate to the container
        m_selector.addChild( selector_img );
        // position the container
        m_selector.x = SELECTOR_XY[ 0 ].x; //(m_node.width * 0.5) - (m_selector.width * 0.5);
        m_selector.y = SELECTOR_XY[ 0 ].y; //previewImageY;
        m_node.addChild( m_selector );
        
        refreshSelectorCaption();
        //m_selector.addChild( text );
    }
    
    function refreshSelectorCaption(){
        // remove old caption
        if( m_selector.numChildren == 2 )
            m_selector.removeChildAt( 1 );
        
        var selector_img_width = m_selector.getChildAt( 0 ).naturalWidth;
        
        // get the text that should be above the selector
        var caption = m_video_item_captions[ m_currentIndex ];
        var text = engine.createTextBlock( caption, { font: "fonts/sans.ttf", size: 20 }, 512 );
        m_selector.addChild( text );
        
        
        text.y = -25;
        text.x = ( selector_img_width / 2 ) - ( text.naturalWidth / 2 );
    }

    function refreshSelectorPosition(){        
        if( m_currentIndex == 0 ){
            m_selector.x = SELECTOR_XY[ 0 ].x;
        
        }else if( m_currentIndex == 1 ){
            m_selector.x = SELECTOR_XY[ 1 ].x;
        
        }else if( m_currentIndex > 1 && m_currentIndex < m_total_images_needed - 1 ){
            m_selector.x = SELECTOR_XY[ 1 ].x;
        
        }else{
            m_selector.x = SELECTOR_XY[ 2 ].x;
        }
    }
    
    function refreshPreviewPosition(){
        if( m_currentIndex == 0 || m_currentIndex == 1 ){
            m_previewNode.x = 0;
        
        }else if( m_currentIndex > 1 && m_currentIndex < m_total_images_needed - 1 ){
            m_previewNode.x = 0 - ((m_currentIndex-1) * (PREVIEW_IMAGE_WIDTH + SPACING));
        
        }else{
            //m_previewNode.x = 0;
        }
    }
    
    this.onLeft = function(){
        // decrement our index bounds-safe
        m_currentIndex -= ( m_currentIndex > 0 ) ? 1 : 0;
        Logger.log("current index is now: " + m_currentIndex );
        
        refreshSelectorPosition();
        refreshPreviewPosition();
        refreshSelectorCaption();
    }

    this.onRight = function(){
        // increment our index bounds-safe
        m_currentIndex += ( m_currentIndex < m_total_images_needed - 1 ) ? 1 : 0;
        Logger.log("current index is now: " + m_currentIndex );
        
        refreshSelectorPosition();
        refreshPreviewPosition();
        refreshSelectorCaption();
    }

    this.onUp = function(){

    }

    this.onDown = function(){

    }

    this.onEnter = function(){

    }

    this.onBack = function(){

    }
    

    this.getDisplayNode = function() { 
        return m_node; 
    }
    
    // clear references
    this.dispose = function()
    {
        adView = null;
        previewList = null;
        // TODO!!!!
    }

    // per-cycle update
    this.update = function( time )
    {
        if( m_lastTime == null )
        {
            m_lastTime = time;
            return;
        }

        if( m_isAnimating == true )
        {
            var delta = (time - m_lastTime) * 1000;
            m_currentDuration += delta;
            var scalar = m_currentDuration / ANIMATION_DURATION;

            if( scalar >= 1 )
                scalar = 1;

            m_previewNode.x = m_start + getToAdd( m_start, m_end, scalar );

            if( scalar == 1 )
            {
                m_isAnimating = false;
                m_start = null;
                m_end = null;
                m_currentDuration = null;
            }
        }

        m_lastTime = time;
    }

    /** @return int - current item highlighted in the carousel */
    this.getCurrentItemIndex = function(){
        return m_currentIndex;
    }
    
    this.resetNavitationIndex = function(){
        m_currentIndex = 0;
        refreshSelectorPosition();
        refreshPreviewPosition();
        refreshSelectorCaption();
    }

    // get distance to add with a quadratic curve
    function getToAdd( one, two, scalar )
    {
        scalar = 1 - scalar;
        return (two - one) - (two - one) * (scalar * scalar);
    }

}