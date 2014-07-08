/**
 * Menu Widget
 * 
 * Widget to render a menu. If its constructor parameter is null, an empty
 * container is created.
 * 
 * @param MenuItemObj A MenuItem model's object
 */
var SubMenuItemWidget = function( MenuItemObj ) {
    var m_root_node     = engine.createContainer();
    var m_menu_item_obj = MenuItemObj;
    var m_caption;
    
    // To keep track of the last y's position for a menu item container in 
    // order to position a new container underneath the last one
    var m_menu_container_last_y;
    
    var m_is_focussed = false;
    
    var MENU_CONTAINER_INITIAL_Y = 0;
    var TEXT_OFFSET_Y = 17;

    var ANIMATION_DIRECTION = {
        UP: 1,
        DOWN: 2
    };
    
    var ANIMATION_STEPS = 5;
    var ANIMATION_INTERVAL = .09;
    var ANIMATION_INCREMENT = 3;
    var CLIPRECT_INCREMENT = 5;
    var ANIMATION_START = 1;
    
    var m_text_container = engine.createContainer();
    
    var m_animation_scrolling_initial_container = -1;
    var m_animation_direction = -1;
    var m_last_engine_timer = 0;
    var m_animation_enabled = false;
    var m_animation_final_cliprect_x = -1;
    var m_animation_steps = ANIMATION_STEPS;
    var m_animation_interval = ANIMATION_INTERVAL;    

    var m_selected_container;
    var m_disabled_container;

    this.getFocus = function(){ return m_is_focussed; }
    this.setFocus = function(){ 
        m_is_focussed = true;
        m_last_engine_timer = engine.getTimer() + ANIMATION_START;
    }
    this.removeFocus = function(){ 
        m_is_focussed = false;
        if ( m_text_container ){
            m_text_container.x = 0;
            m_text_container.clipRect.x = 40;
            m_animation_direction = SubMenuItemWidget.DIRECTION.LEFT;
        }
    }

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SubMenuItemWidget update() ' + engine_timer );
        
        if ( m_is_focussed ){
            if ( m_animation_enabled && m_last_engine_timer + m_animation_interval < engine_timer ){
                if ( m_animation_direction == SubMenuItemWidget.DIRECTION.LEFT ){
                    m_text_container.clipRect.x += 1;
                    m_text_container.x -= 1;
                    if ( m_text_container.clipRect.x + 300 - 40 > m_text_container.textWidth ){
                        m_last_engine_timer = engine_timer + ANIMATION_START;
                        m_animation_direction = SubMenuItemWidget.DIRECTION.RIGHT;
                    }
                } else if( m_animation_direction == SubMenuItemWidget.DIRECTION.RIGHT ){
                    m_text_container.clipRect.x -= 1;
                    m_text_container.x += 1;
                    if ( m_text_container.x == 0 ){
                        m_last_engine_timer = engine_timer + ANIMATION_START;
                        m_animation_direction = SubMenuItemWidget.DIRECTION.LEFT;
                    }
                }
            }
        }
    };
    
    this.refreshWidget = function( MenuItemObj ){
        m_menu_item_obj = MenuItemObj;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    /**
     * Select row at index. This method will remove the disable container
     * if exists and add the selection container
     */
    this.setActive = function(){
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( !m_root_node.contains( m_selected_container ) ){
            m_root_node.addChildAt( m_selected_container, 0 );
        }
//        m_selected_container.x = 10;
//        m_selected_container.y = m_menu_entry_containers[ index ].y - TEXT_OFFSET_Y;
    }
    
    /**
     * Disable row at index. This method will remove the selected container
     * if exists and add the disabled container
     * 
     * Note that this is not the same as unselect a row. A disabled row
     * contains a gray background whereas an unselected row doesn't contain
     * anything else but the menu text
     */
    this.setDisabled = function(){
        if ( !m_root_node.contains( m_disabled_container ) ){
            m_root_node.addChildAt( m_disabled_container, 0 );
        }
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
//        m_disabled_container.x = 10;
//        m_disabled_container.y = m_menu_entry_containers[ index ].y - TEXT_OFFSET_Y;
    }
    
    /**
     * Remove all the background containers (disabled and selected) at row index
     */
    this.setInactive = function(){
        if ( m_root_node.contains( m_disabled_container ) ){
            m_root_node.removeChild( m_disabled_container );
        }
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
    }
    
    this.scrollIfNeeded = function( SubMenuWidget_DIRECTION ){
//        var diff = m_selected_container.y - 450;
//        Logger.log( 'diff = ' + diff );
//        Logger.log( 'm_selected_container.y = ' + m_selected_container.y );
//        if ( m_selected_container.y > 450 ){
//            if ( SubMenuWidget_DIRECTION == SubMenuWidget.DIRECTION.UP ){
//                m_nodes_container.y += 90;
//            }else{
//                m_nodes_container.y -= 90;
//            }
//        }
//        
//        if ( m_selected_container.y <= 450 && m_nodes_container.y != 90 * 2 && SubMenuWidget_DIRECTION == SubMenuWidget.DIRECTION.UP ){
//            m_nodes_container.y += 90;
//        }
//        Logger.log( 'm_nodes_container.y = ' + m_nodes_container.y );
    }
    
    /**
     * Create a single container that holds a menu item including an icon if
     * it exists
     */
    function createMenuEntryContainer( MenuItemObj ){
        var tmp_container = engine.createContainer();
        var tblock;
        
        m_caption = MenuItemObj.getText();
        tblock = engine.createTextBlock( MenuItemObj.getText(), FontLibraryInstance.getFont_SUBNAV(), 1100 );
        if ( tblock.naturalWidth > 300 ){
            m_animation_enabled = true;
            m_animation_direction = SubMenuItemWidget.DIRECTION.LEFT;
        }
        
        tmp_container.addChild( tblock );
        tmp_container.height = tblock.naturalHeight;
        tmp_container.width = tblock.naturalWidth;
        tmp_container.textWidth = tblock.naturalWidth;
        tblock.x = 40;
        tblock.y = 2;
        
        if ( MenuItemObj.getIcon() ){
            // If we have to show an icon
            var icon_container = engine.createContainer();
            var tmp_slate = engine.createSlate();
            tmp_slate.width = MenuItemObj.getIcon().width;
            tmp_slate.height = MenuItemObj.getIcon().height;
            tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
            tmp_slate.shader.texture = MenuItemObj.getIcon().shader.texture;
            icon_container.addChild( tmp_slate );
            tmp_container.addChild( icon_container );
            tmp_container.width += tmp_slate.width;
        }
        
        return tmp_container;
    }
    
    function createMenuSeparatorContainer( ){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_container.height = 1;
        tmp_container.width = 300;
        
        tmp_slate.height = 1;
        tmp_slate.width = 388;
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_container.addChild( tmp_slate );
        tmp_container.x = -40;
        
        return tmp_container;
    }

    function initWidget(){
        if ( ! m_menu_item_obj.getText() ){
            // Menu separator
            m_text_container = createMenuSeparatorContainer();
            m_text_container.y = 1;
        }else{
            m_text_container = createMenuEntryContainer( m_menu_item_obj );
            m_text_container.y = TEXT_OFFSET_Y;
        }
        
        m_text_container.clipRect.x = 40;
        m_text_container.clipRect.height = 90;
        m_text_container.clipRect.width = 300;
        
        m_root_node.addChild( m_text_container );
        
//        m_menu_container_last_y = MENU_CONTAINER_INITIAL_Y;
//        while ( m_nodes_container.numChildren > 0 ){
//            m_nodes_container.removeChildAt( 0 );
//        }
//            
//        for ( var i in m_menu_item_objs ){
//            var menu_item_obj = m_menu_item_objs[ i ];
//            
//                menu_separator_container.x = 30;
//                menu_separator_container.y = m_menu_container_last_y;
////                m_menu_container_last_y = m_menu_container_last_y + 1;
//                m_nodes_container.addChild( menu_separator_container );
//                m_menu_entry_containers.push( {
//                    menu_container: null,
//                    selected_container: null,
//                    disabled_container: null
//                });
//                
//            }else{
//                // Create the container that will hold the menu item
//                var menu_entry_container = createMenuEntryContainer( menu_item_obj );
//
//                menu_entry_container.y = m_menu_container_last_y + TEXT_OFFSET_Y;
//
//                m_menu_container_last_y = m_menu_container_last_y + m_selected_container.height;
//
//                m_nodes_container.addChild( menu_entry_container );
//
//                // Add to recent created container to our array of containers
//                m_menu_entry_containers.push( menu_entry_container );
//            }
//        }
    }
    
    /**
     * Return a container that will be added to a row upon a selectRow call
     */
    function getCellSelectionContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/subnav_button_orange.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 360;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }

    /**
     * Return a container that will be added to a row upon a disableRow call
     */
    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/subnav_button_gray.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 360;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }
    
    m_selected_container = getCellSelectionContainer();
    m_disabled_container = getCellDisabledContainer();
    
    if ( MenuItemObj ){
        initWidget();
    }

};

SubMenuItemWidget.DIRECTION = {
    LEFT: 1,
    RIGHT: 2
};