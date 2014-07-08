/**
 * Show Detail Text Widget
 */
var ShowDetailThumbWidget = function( ChannelDetailsObj ) {
    var m_root_node                         = engine.createContainer();
    var m_channel_details_obj               = ChannelDetailsObj;
    var m_image_container;
    var This = this;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ShowDetailThumbWidget update() ' + engine_timer );
    };
    this.destroy = function(){
        try{
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }
            if( m_image_container ){
                while( m_image_container.numChildren > 0 ){
                    m_image_container.removeChildAt( 0 );
                }
            }
        }catch( e ){
            Logger.log( '!!! ShowDetailThumbWidget EXCEPTION destroy()' );
            Logger.logObj( e );
        }finally{
            m_channel_details_obj = null;
            m_image_container = null;
            m_root_node = null;
        }
    }
    this.refreshWidget = function( ChannelDetailsObj ){
        m_channel_details_obj = ChannelDetailsObj;
       initWidget();
    };
    
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }
    
    function initWidget(){
        var container;
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        // Thumbnail container
        m_image_container = engine.createContainer();
        
        loadImage( m_channel_details_obj.getChannelArtTileLarge() );
        m_root_node.addChild( m_image_container );
    }
    
    function addImageToContainer( js_image ){
        if( js_image ){
            js_image.getRawImage().width = 260;
            js_image.getRawImage().height = 390;
            if( m_image_container ){
                m_image_container.addChild( js_image.getRawImage() );
            }
        }
    }
    
    function loadImage( url ){
        var js_image = ImageManagerInstance.requestImage( url );
        
        if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
            addImageToContainer( js_image );
        }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
            // TODO: Handle image failures
        }else{
            js_image.addImageReadyListener( This );
        }
    }
    
    if ( m_channel_details_obj ){
        initWidget();
    }

};