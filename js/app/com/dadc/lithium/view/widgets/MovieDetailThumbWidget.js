include( "js/app/com/dadc/lithium/view/widgets/LoadingWidget.js" );

var MovieDetailThumbWidget = function( ChannelDetailsObj ) {
    var m_root_node                         = engine.createContainer();
    var m_channel_details_obj               = ChannelDetailsObj;
    var m_loading_widget                    = new LoadingWidget();
    var m_image_container;
    var m_image_added = false;
    var This = this;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MovieDetailThumbWidget update() ' + engine_timer );
        if( !m_image_added ){
            m_loading_widget.update( engine_timer );
        }
    };
    
    this.refreshWidget = function( ChannelDetailsObj ){
        m_channel_details_obj = ChannelDetailsObj;
       initWidget();
    };
    
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.clear = function(){
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }        
    }
    
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }
    
    function initWidget(){
        var container;
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        m_root_node.addChild( m_loading_widget.getDisplayNode() );
        m_loading_widget.getDisplayNode().x = 400/2 - ( m_loading_widget.getDisplayNode().width / 2 );
        m_loading_widget.getDisplayNode().y = 600/2 - ( m_loading_widget.getDisplayNode().height / 2 );
        // Thumbnail container
        m_image_container = engine.createContainer();
        
            loadImage( m_channel_details_obj.getChannelArtTileLarge() );
        m_root_node.addChild( m_image_container );
    }
    
    function addImageToContainer( js_image ){
        m_image_added = true;
        
        if( m_root_node.contains( m_loading_widget.getDisplayNode() ) ){
            m_root_node.removeChild( m_loading_widget.getDisplayNode() );
        }
        
        js_image.getRawImage().width = 400;
        js_image.getRawImage().height = 600;
        m_root_node.width = 400;
        m_root_node.height = 600;
        m_image_container.addChild( js_image.getRawImage() );
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