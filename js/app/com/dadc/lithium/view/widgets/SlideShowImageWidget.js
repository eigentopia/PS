/**
 * Slide Show Image Widget
 * 
 * @params image_url Image URL to load
 */
var SlideShowImageWidget = function( image_url, renderImage ) {
    var m_root_node = engine.createContainer();
    var m_image_url = image_url;
    var m_render_image = renderImage;
    var m_image;
    var This = this;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SlideShowImageWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( image, renderImage ){
        m_image = image;
        m_render_image = renderImage;
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }
    this.renderImage = function(){
        doRenderImage();
    }
    
    function addImageToContainer( js_image ){
//        js_image.getRawImage().width = 1511;
//        js_image.getRawImage().height = 580;
        m_root_node.addChild( js_image.getRawImage() );        
    }
    
    function doRenderImage(){
        var js_image = ImageManagerInstance.requestImage( m_image_url );
        
        if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
            addImageToContainer( js_image );
        }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
            // TODO: Handle image failures
        }else{
            js_image.addImageReadyListener( This );
        }
    }
    
    function initWidget(){
        if( m_render_image ){
            doRenderImage();
        }
    }
    
    if ( m_image_url ) initWidget();

};