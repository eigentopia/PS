/**
  * Slide Show Thumb List Widget
  * 
  * A widget that display a list of thumbnails pictures. User is able to navigate
  * among these thumbnails
  */
var SlideShowThumbListWidget = function( SlideShowObj ) {
    var This                = this;
    var m_root_node         = engine.createContainer();
    var m_slide_show_obj    = SlideShowObj;
    
    // This array will hold a list of containers for each menu item
    // This list consists of:
    // - thumb_container
    // - selected_container
    //
    // Therefore, to access the selected container of the first menu item, we
    // should call:
    // m_thumb_containers[0].selected_container
    var m_thumb_containers = [];
    
    // To keep track of the last x's position for a menu item container in 
    // order to position a new container underneath the last one
    var m_thumb_last_x = 0;
    
    var m_ix_selected_thumb= null;

    var THUMB_SPACING      = 36;
    
    var THUMB_WIDTH        = 185;
    var THUMB_HEIGHT       = 277;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SlideShowThumbListWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( SlideShowObj ){
        m_slide_show_obj = SlideShowObj;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getSelectedThumbIndex = function(){
        return m_ix_selected_thumb;
    }
    /**
     * Select row at index. This method will remove the disable container
     * if exists and add the selection container
     */
    this.selectRow = function( index ){
        var containers = m_thumb_containers[ index ];
        
        if ( containers && containers.selected_container && !m_root_node.contains( containers.selected_container ) ){
            m_root_node.addChildAt( containers.selected_container, 0 );
        }
        
        m_ix_selected_thumb = index;
    }
    
    /**
     * Remove the selected background container at row index
     */
    this.unselectRow = function( index ){
        var containers = m_thumb_containers[ index ];

        if ( containers && containers.selected_container && m_root_node.contains( containers.selected_container ) ){
            m_root_node.removeChild( containers.selected_container );
        }
    }
    
    this.scrollIfNeeded = function(){
        var selected_tile           = m_thumb_containers[ m_ix_selected_thumb ].thumb_container;
        var selected_tile_x         = selected_tile.x;
        var selected_tile_width     = selected_tile.width;
        var clip_rect_width         = m_root_node.clipRect.width;
        var clip_rect_x             = m_root_node.clipRect.x;
        var diff                    = ( selected_tile_x  + selected_tile_width ) -
                                      ( clip_rect_width + Math.abs( m_root_node.clipRect.x ) );
                                  
        Logger.log( 'selected_tile_x = ' + selected_tile_x );
        Logger.log( 'selected_tile.x = ' + selected_tile.x );
        Logger.log( 'm_root_node.clipRect.x = ' + m_root_node.clipRect.x );
        Logger.log( 'm_root_node.clipRect.width = ' + m_root_node.clipRect.width );
        Logger.log( 'm_root_node.x = ' + m_root_node.x );
        Logger.log( 'm_root_node.width = ' + m_root_node.width );
        Logger.log( 'm_thumb_containers[ m_ix_selected_thumb ].thumb_container.width = ' + m_thumb_containers[ m_ix_selected_thumb ].thumb_container.width );
        Logger.log( 'diff = ' + diff );
        
        if ( selected_tile_x + selected_tile_width > clip_rect_width ){
            Logger.log( 'trigged scroll' );
            m_root_node.clipRect.x += diff;
            m_root_node.x -= diff;
        }else if ( clip_rect_x != 0 ){
            m_root_node.x += m_root_node.clipRect.x;
            m_root_node.clipRect.x = 0 ;
        }
        
    }
    this.notifyJSImageUpdated = function( js_image ){
        addImageToContainer( js_image );
    }
    
    /**
     * Create a single container that holds a menu item including an icon if
     * it exists
     */
    function createThumbContainer( image_url ){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader([ 149/255, 149/255, 149/255, 1 ]);
        tmp_slate.width = THUMB_WIDTH ;
        tmp_slate.height = THUMB_HEIGHT;
        
        tmp_container.addChild( tmp_slate );
        
        loadImage( image_url, tmp_container );
        tmp_container.width = THUMB_WIDTH + 10;
        tmp_container.height = THUMB_HEIGHT + 10;
        
        return tmp_container;
    }

    /**
     * Return a container that will be added to a row upon a selectRow call
     */
    function getCellSelectionContainer( cell_width, cell_height ){
        var slice_shader = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/menu_button_enabled.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        slice_shader.width = cell_width;
        slice_shader.height = cell_height;
        
        return slice_shader;
    }
    
    function addImageToContainer( js_image, container ){
        if( js_image && js_image.getRawImage() ){
            js_image.getRawImage().width = THUMB_WIDTH;
            js_image.getRawImage().height = THUMB_HEIGHT;
            while( container.numChildren > 0 ){
                container.removeChildAt( 0 );
            }

            container.addChild( js_image.getRawImage() );
        }
    }
    
    function loadImage( url, container ){
        var js_image = ImageManagerInstance.requestImage( url );
        var listener = function(){}
        listener.notifyJSImageUpdated = function( js_image ){
            addImageToContainer( js_image, container );
        }
        
        if ( js_image.getStatus() == ImageManager.IMAGESTATUS.READY ){
            addImageToContainer( js_image, container );
        }else if ( js_image.getStatus() == ImageManager.IMAGESTATUS.FAILED ){
            // TODO: Handle image failures
        }else{
            js_image.addImageReadyListener( listener );
        }
        
    }

    /**
    *  Widget initialization. Called by either the construction phase or a
    *  refreshWidget call.
    */
    function initWidget(){
        for ( var i = 0; i < m_slide_show_obj.getItemList().getTotalItems(); i++ ){
            var image_url = m_slide_show_obj.getItemList().getItem( i ).getOneSheetImage_185_277();
            
            // Create the container that holds the thumbnail image
            var thumb_container = createThumbContainer( image_url );
            
            var selected_container = getCellSelectionContainer( THUMB_WIDTH + 20, THUMB_HEIGHT + 20 );
            
            // Specify the y coordinate for the new containers 
            thumb_container.x = m_thumb_last_x + 10;
            thumb_container.y = 10;
            selected_container.x = thumb_container.x - 10;
            selected_container.y = thumb_container.y - 10;
            Logger.log( 'thumb_container.x = ' + thumb_container.x );
            
            m_thumb_last_x = m_thumb_last_x + THUMB_SPACING + thumb_container.width - 10;
            
            m_root_node.addChild( thumb_container );
            
            // Add to recent created container to our array of containers
            m_thumb_containers.push( {
                thumb_container: thumb_container,
                selected_container: selected_container
            });
        }        
    }
    if ( SlideShowObj ){
        initWidget();
    }
    
    m_root_node.clipRect.width = ( ( THUMB_WIDTH ) * 6) + (THUMB_SPACING * 5) + 20;
    m_root_node.clipRect.height = THUMB_HEIGHT + 20;
    m_root_node.width = ( ( THUMB_WIDTH ) * 6) + (THUMB_SPACING * 5) + 20;
};