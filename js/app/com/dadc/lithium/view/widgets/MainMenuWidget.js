/**
 * Menu Widget
 * 
 * Widget to render a menu. If its constructor parameter is null, an empty
 * container is created.
 * 
 * Call refreshWidget() with an array of MenuItem model's objects to pass the
 * menu items to be displayed
 * 
 * @param MenuItemObjs An array of MenuItem model's objects
 */
var MainMenuWidget = function( MenuItemObjs ) {
    var m_root_node                         = engine.createContainer();
    var m_nodes_container                   = engine.createContainer();
    var m_menu_item_objs                    = MenuItemObjs;
    
    // This array will hold a list of containers for each menu item
    // This list consists of:
    // - menu_container
    // - selected_container
    // - disabled_container
    //
    // Therefore, to access the disabled container of the first menu item, we
    // should call:
    // m_menu_entry_containers[0].disabled_container
    var m_menu_entry_containers = [];
    
    // To keep track of the last y's position for a menu item container in 
    // order to position a new container underneath the last one
    var m_menu_container_last_y;
    
    var MENU_CONTAINER_INITIAL_Y = 0;
    var TEXT_OFFSET_Y = 25;
    
    var m_selected_container;
    var m_disabled_container;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'MainMenuWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( MenuItemObjs ){
        m_menu_item_objs = MenuItemObjs;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    /**
     * Select row at index. This method will remove the disable container
     * if exists and add the selection container
     */
    this.selectRow = function( index ){
        if ( m_nodes_container.contains( m_disabled_container ) ){
            m_nodes_container.removeChild( m_disabled_container );
        }
        if ( !m_nodes_container.contains( m_selected_container ) ){
            m_nodes_container.addChildAt( m_selected_container, 0 );
        }
        m_selected_container.y = m_menu_entry_containers[ index ].y - TEXT_OFFSET_Y;
        m_selected_container.x = -96;
    }
    
    /**
     * Disable row at index. This method will remove the selected container
     * if exists and add the disabled container
     * 
     * Note that this is not the same as unselect a row. A disabled row
     * contains a gray background whereas an unselected row doesn't contain
     * anything else but the menu text
     */
    this.disableRow = function( index ){
        if ( !m_nodes_container.contains( m_disabled_container ) ){
            m_nodes_container.addChildAt( m_disabled_container, 0 );
        }
        if ( m_nodes_container.contains( m_selected_container ) ){
            m_nodes_container.removeChild( m_selected_container );
        }
        m_disabled_container.y = m_menu_entry_containers[ index ].y - TEXT_OFFSET_Y;
        m_disabled_container.x = -96;
        
    }
    
    /**
     * Remove all the background containers (disabled and selected) at row index
     */
    this.unselectRow = function( index ){
        if ( m_nodes_container.contains( m_disabled_container ) ){
            m_nodes_container.removeChild( m_disabled_container );
        }
        if ( m_nodes_container.contains( m_selected_container ) ){
            m_nodes_container.removeChild( m_selected_container );
        }
    }
    
    /**
     * Create a single container that holds a menu item including an icon if
     * it exists
     */
    function createMenuEntryContainer( MenuItemObj, index ){
        var tmp_container = engine.createContainer();
        
        var tblock = engine.createTextBlock( MenuItemObj.getText(), FontLibraryInstance.getFont_MENUNAME(), 500 );
        tmp_container.addChild( tblock );
        tmp_container.height = tblock.naturalHeight;
        tmp_container.width = tblock.naturalWidth;
        tblock.x = 65;
        
        if ( MenuItemObj.getIcon() ){
            // If we have to show an icon
            var icon_container = engine.createContainer();
            var tmp_slate = engine.createSlate();
            tmp_slate.width = MenuItemObj.getIcon().width;
            tmp_slate.height = MenuItemObj.getIcon().height;
            tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
            tmp_slate.shader.texture = MenuItemObj.getIcon().shader.texture;
            icon_container.addChild( tmp_slate );
            icon_container.x = 10;
            tmp_container.addChild( icon_container );
            icon_container.y = 0;
            Logger.log( 'MenuItemObj.getIcon().width ' + MenuItemObj.getIcon().width );
            Logger.log( 'MenuItemObj.getIcon().height ' + MenuItemObj.getIcon().height );
        }
        
        switch( parseInt( index ) ){
            case 0:
                tblock.y = -5;
                icon_container.y = 0;
                break;
            case 1:
                tblock.y = -4;
                icon_container.y = 0;
                break;
            case 2:
                tblock.y = -7;
                icon_container.y = 3;
                break;
            case 3:
                tblock.y = -5;
                icon_container.y = 4;
                break;
            case 4:
                tblock.y = -7;
                icon_container.y = 0;
                break;
        }

        Logger.log( 'tblock.naturalHeight = ' + tblock.naturalHeight );
        Logger.log( 'tmp_slate.height = ' + tmp_slate.height );
        
        return tmp_container;
    }
    
    function createMenuSeparatorContainer( ){
        var tmp_container = engine.createContainer();
        var tmp_slate = engine.createSlate();
        
        tmp_container.height = 10;
        tmp_container.width = 200;
        
        tmp_slate.height = 1;
        tmp_slate.width = 200;
        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getGRAY( 1 ) );
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }

    function initWidget(){
        m_menu_container_last_y = MENU_CONTAINER_INITIAL_Y;
        while ( m_nodes_container.numChildren > 0 ){
            m_nodes_container.removeChildAt( 0 );
        }
            
        for ( var i in m_menu_item_objs ){
            var menu_item_obj = m_menu_item_objs[ i ];
            
            if ( ! menu_item_obj.getText() ){

                // Menu separator
                var menu_separator_container = createMenuSeparatorContainer();
                menu_separator_container.x = 50;
                menu_separator_container.y = m_menu_container_last_y;
                m_menu_container_last_y = m_menu_container_last_y + m_selected_container.height;
                m_nodes_container.addChild( menu_separator_container );
                m_menu_entry_containers.push( {
                    menu_container: null,
                    selected_container: null,
                    disabled_container: null
                });
                
            }else{
                // Create the container that will hold the menu item
                var menu_entry_container = createMenuEntryContainer( menu_item_obj, i );

                menu_entry_container.y = m_menu_container_last_y + TEXT_OFFSET_Y;

                m_menu_container_last_y = m_menu_container_last_y + m_selected_container.height;

                m_nodes_container.addChild( menu_entry_container );

                // Add to recent created container to our array of containers
                m_menu_entry_containers.push( menu_entry_container );
            }
        }
    }
    
    /**
     * Return a container that will be added to a row upon a selectRow call
     */
    function getCellSelectionContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/global_nav_button_orange.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 410;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }

    /**
     * Return a container that will be added to a row upon a disableRow call
     */
    function getCellDisabledContainer(){
        var tmp_slate = engine.createSlate();
        var slice_shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slice_shader.texture = AssetLoaderInstance.getImage( "Artwork/global_nav_button_gray.png" ).shader.texture;
        tmp_slate.shader = slice_shader;
        
        tmp_slate.width = 410;
        tmp_slate.height = 90;
        
        return tmp_slate;
    }
    
    m_root_node.addChild( m_nodes_container );
    m_selected_container = getCellSelectionContainer();
    m_disabled_container = getCellDisabledContainer();
    
    if ( MenuItemObjs ){
        initWidget();
    }

};