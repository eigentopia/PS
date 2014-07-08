include( "js/app/com/dadc/lithium/view/widgets/LoadingWidget.js" );

/**
 * Movie List Tile Widget
 */
var MovieListTileWidget = function( DataObj, renderOnStart ) {
    var This                = this;
    var m_root_node         = engine.createContainer();
    var m_data_obj          = DataObj;
    var m_loading_widget    = null;
    var m_render_on_start   = renderOnStart;
    var m_render_status     = MovieListTileWidget.RENDER_STATUS.NOT_RENDERED;
    var m_cleared           = false;
    var m_active_container;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MovieListTileWidget update() ' + engine_timer );
        if( m_render_status == MovieListTileWidget.RENDER_STATUS.RENDERING && m_loading_widget )
            m_loading_widget.update( engine_timer );
    };
    this.destroy = function(){
        Logger.log( 'MovieListTileWidget destroy()' );
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        m_loading_widget = null;
        m_root_node = null;
    }
    this.refreshWidget = function( FeaturedItemObj ){
        m_data_obj = FeaturedItemObj;
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    this.setActive = function(){
        if ( m_active_container && !m_root_node.contains( m_active_container ) ){
            m_root_node.addChildAt( m_active_container, 0 );
        }
    }
    
    this.setInactive = function(){
        if ( m_active_container && m_root_node.contains( m_active_container ) ){
            m_root_node.removeChild( m_active_container );
        }
    }
    this.isDataPopulated = function(){
        return ( m_data_obj ? true : false );
    }
    this.canRender = function(){
        return( m_render_status == MovieListTileWidget.RENDER_STATUS.NOT_RENDERED );
    }
    this.notifyJSImageUpdated = function( js_image ){
        if ( m_loading_widget && m_root_node.contains( m_loading_widget.getDisplayNode() ) ){
            m_root_node.removeChild( m_loading_widget.getDisplayNode() );
        }
        addImageToContainer( js_image );
    }
    this.render = function(){
        var image_url;
        var js_image;
        m_cleared = false;
        if( m_render_status == MovieListTileWidget.RENDER_STATUS.NOT_RENDERED ){
            m_render_status = MovieListTileWidget.RENDER_STATUS.RENDERING;
            
            while( m_root_node.numChildren > 0 ){
                m_root_node.removeChildAt( 0 );
            }            
            
            var tmp_container = engine.createContainer();
            var tmp_slate = engine.createSlate();

            m_root_node.width = 220;
            m_root_node.height = 320;

            tmp_container.width = m_root_node.width;
            tmp_container.height = m_root_node.height;

            tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader([ 149/255, 149/255, 149/255, 1 ]);
            tmp_slate.width = 200;
            tmp_slate.height = 300;
            tmp_container.addChild( tmp_slate );
            tmp_container.x = 10;
            tmp_container.y = 10;
            m_root_node.addChild( tmp_container );

            m_active_container = engine.createContainer();
            tmp_slate = engine.createSlate();
            tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader([ 255/255, 102/255, 0/255, 1 ]);
            tmp_slate.width = 220;
            tmp_slate.height = 320;
            m_active_container.x = 0;
            m_active_container.y = 0;
            m_active_container.addChild( tmp_slate );
            
            m_loading_widget = new LoadingWidget();
            m_root_node.addChild( m_loading_widget.getDisplayNode() );
            m_loading_widget.getDisplayNode().x = 110;
            m_loading_widget.getDisplayNode().y = 160;
            
            if ( m_data_obj.getOneSheetImage ){
                image_url = m_data_obj.getOneSheetImage();
            }else if ( m_data_obj.getChannelArt_185_277 ){
                image_url = m_data_obj.getChannelArt_185_277();
            }else if ( m_data_obj.getImageUrl10 ){
                image_url = m_data_obj.getImageUrl10();
            }

            js_image = ImageManagerInstance.requestImage( image_url );

            if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
                addImageToContainer( js_image );
            }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
                m_render_status = MovieListTileWidget.RENDER_STATUS.RENDERED;
                if ( m_root_node.contains( m_loading_widget.getDisplayNode() ) ){
                    m_root_node.removeChild( m_loading_widget.getDisplayNode() );
                }
            }else{
                js_image.addImageReadyListener( This );
            }        
        }
    }
    this.clear = function(){
        m_cleared = true;
        while( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        if( m_loading_widget ) m_loading_widget.clear();
        m_loading_widget = null;
        m_active_container = null;
        m_render_status = MovieListTileWidget.RENDER_STATUS.NOT_RENDERED;
    }
    function addImageToContainer( js_image ){
        var img_slate = engine.createSlate();
        
        if( m_cleared ) {
            m_render_status = MovieListTileWidget.RENDER_STATUS.NOT_RENDERED;
            return;
        }
        
        m_render_status = MovieListTileWidget.RENDER_STATUS.RENDERED;
        img_slate.width = 200;
        img_slate.height = 300;
        img_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        img_slate.shader.texture = js_image.getRawImage().shader.texture;
        
        //js_image.getRawImage().unload && js_image.getRawImage().unload();
        
        img_slate.x = 10;
        img_slate.y = 10;
        m_root_node.addChild( img_slate );
    }
    
    function initWidget(){
        if( m_render_on_start ){
            This.render();
        }
    }
    

    
    if ( DataObj ){
        initWidget();
    }
};

MovieListTileWidget.RENDER_STATUS = {
    RENDERING: 1,
    RENDERED: 2,
    NOT_RENDERED: 3
}