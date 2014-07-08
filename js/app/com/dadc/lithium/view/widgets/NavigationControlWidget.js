var NavigationControlWidget = function( NavigationControlWidget_CONTROLS ) {
    var m_root_node = engine.createContainer();
    var m_controls = NavigationControlWidget_CONTROLS;
    
    var TEXT_SPACING = 10;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'NavigationControlWidget update() ' + engine_timer );
    };
    
    this.refreshWidget = function( NavigationControlWidget_CONTROLS ){
        m_controls = NavigationControlWidget_CONTROLS;
        
        // Remove all children from root node
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    
    function initWidget(){
        var tmp_container = engine.createContainer();
        var slate;
        var tblock;
        var last_width = 0;
        
        for( var i in m_controls ){
            if( m_controls[ i ].x_offset > 0 ){
                last_width = m_controls[ i ].x_offset;
            }
            
            slate = getSlateByControl( m_controls[ i ].control );
            
            slate.x = last_width;
                    
            tblock = getCaption( m_controls[ i ].caption );
            tblock.x = slate.x + slate.width + TEXT_SPACING;
            tblock.y = 10;
                    
            tmp_container.addChild( slate );
            tmp_container.addChild( tblock );

            last_width = slate.width + tblock.x + tblock.naturalWidth;
                    
        }
        
        m_root_node.addChild( tmp_container );
    }
    

    function getSlateByControl( control_name ){
        switch( control_name ){
            case NavigationControlWidget.CONTROLS.CIRCLE:
                return getCircleSlate();
                break;
            case NavigationControlWidget.CONTROLS.TRIANGLE:
                return getTriangleSlate();
                break;
            case NavigationControlWidget.CONTROLS.START:
                return getStartSlate();
                break;
            case NavigationControlWidget.CONTROLS.DPAD_RIGHT_LEFT:
                return getDpadRightLeftSlate();
                break;
            case NavigationControlWidget.CONTROLS.CIRCLE_NOREFLECTION:
                return getCircleNoReflectionSlate();
        }        
    }
    
    function getCaption( caption ){
        return engine.createTextBlock( caption, FontLibraryInstance.getFont_NAVIGATIONCONTROL(), 1000 );
    }
    
    function getCircleSlate(){
        return getGenericSlate( "Artwork/controls/Circle.png" );
    }
    function getTriangleSlate(){
        return getGenericSlate( "Artwork/controls/Triangle.png" );
    }
    function getCircleNoReflectionSlate(){
        return getGenericSlate( "Artwork/controls/Circle_No_Reflection.png" );
    }
    function getStartSlate(){
        return getGenericSlate( "Artwork/controls/Start.png" );
    }
    function getDpadRightLeftSlate(){
        return getGenericSlate( "Artwork/controls/Direct_Pad_RightLeft.png" );
    }
    function getGenericSlate( img_name ){
        var slate = engine.createSlate();
        var image;
        
        image = AssetLoaderInstance.getImage( img_name );
        slate.width = image.width;
        slate.height = image.height;
        slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
        slate.shader.texture = image.shader.texture;
        
        return slate;
    }
    
    if ( NavigationControlWidget_CONTROLS && NavigationControlWidget_CONTROLS.length > 0 ){
        initWidget();
    }
};

NavigationControlWidget.CONTROLS = {
    CIRCLE: 1,
    START: 2,
    DPAD_RIGHT_LEFT: 3,
    CIRCLE_NOREFLECTION: 4,
    TRIANGLE: 5
}