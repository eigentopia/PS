/**
 */
var TextBoxWidget = function( caption, default_active, size) {
    var m_root_node = engine.createContainer();
    var m_caption = caption;
    var m_default_active = default_active;
    var size = size;
    var m_selected_container;
    // var m_disabled_container;
    var m_inactive_container;
    var m_text_container = engine.createContainer();
    var This = this;
    
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'TextBoxWidget update() ' + engine_timer );
    };
    
    this.refreshWidget = function( caption, default_active ){
        m_caption = caption;
        m_default_active = default_active;
        initWidget();
    };
    this.getDisplayNode = function(){return m_root_node;};
    this.getCaption = function(){return m_caption;};
    
    this.isActive = function(){return m_root_node.contains( m_selected_container )}
    
    this.setActive = function(){
        if ( !m_root_node.contains( m_selected_container ) ){
            m_root_node.addChildAt( m_selected_container, 0 );
        }

        if ( m_root_node.contains( m_inactive_container ) ){
            m_root_node.removeChild( m_inactive_container );
        }
    }
    this.setInactive = function(){
        if ( !m_root_node.contains( m_inactive_container ) ){
            m_root_node.addChildAt( m_inactive_container, 0 );
        }
        if ( m_root_node.contains( m_selected_container ) ){
            m_root_node.removeChild( m_selected_container );
        }
    }

    function initWidget(){
        var tmp_container = engine.createContainer();
        
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        
        tmp_container.width = size;
        tmp_container.height = 50;

        while ( m_text_container.numChildren > 0 ){
            m_text_container.removeChildAt( 0 );
        }
        
        m_root_node.addChild( m_text_container );
        
        var tblock = engine.createTextBlock( m_caption, FontLibraryInstance.getFont_PLAYLISTMENUBUTTON(), 1000 );
        tblock.x = 15
        tblock.y = 8         
        m_text_container.addChild( tblock );
        
        if ( m_default_active ){
            This.setActive();
        }else{
            This.setInactive();
        }
    }
    
    function getCellSelectionContainer( ){
        //Right now this is weird
        //TODO:understand the shader problem.
        if(ApplicationController.PLATFORM !== 'ps4'){
            var tmp_container = engine.createContainer();
            var button_slate = engine.createSlate();
            button_slate.shader =  ShaderCreatorInstance.createBoxShader( 1, 13, RGBLibraryInstance.getDARKGRAY(1), 
                0, RGBLibraryInstance.getWHITE(1), 
                12, RGBLibraryInstance.getORANGE(1), 
                RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), 
                RGBLibraryInstance.getDARKGRAY(1));
            
            button_slate.width = size;
            button_slate.height = 62;
            
            tmp_container.addChild( button_slate );
            
            return tmp_container;
        }
        else{
            var padding = 10;
            var main = engine.createContainer();
            var inner_slate = engine.createSlate();
            var outer_slate = engine.createSlate();

            outer_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getORANGE(1) );
            
            outer_slate.width = size + (padding*2);
            outer_slate.height = 62 + (padding*2);
            outer_slate.x = -padding;
            outer_slate.y = -padding

            main.addChild( outer_slate );

            inner_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(1) );

            inner_slate.width = size;
            inner_slate.height = 62;

            
            main.addChild( inner_slate );
            
            return main;
        }
    }

    function getCellInactiveContainer(){
        if(ApplicationController.PLATFORM !== 'ps4'){
            var tmp_container = engine.createContainer();
            var button_slate = engine.createSlate();
            button_slate.shader =  ShaderCreatorInstance.createBoxShader( 1, 10, RGBLibraryInstance.getDARKGRAY(1), 
                0, RGBLibraryInstance.getWHITE(1), 
                0, RGBLibraryInstance.getORANGE(1), 
                RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), RGBLibraryInstance.getDARKGRAY(1), 
                RGBLibraryInstance.getDARKGRAY(1));
            
            button_slate.width = size;
            button_slate.height = 62;
            
            tmp_container.addChild( button_slate );
            
            return tmp_container;
        }
        else{

            var tmp_container = engine.createContainer();
            var button_slate = engine.createSlate();
            button_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(1) );

            
            button_slate.width = size;
            button_slate.height = 62;
            
            tmp_container.addChild( button_slate );
            
            return tmp_container;
        }
    }

    m_selected_container = getCellSelectionContainer();
    m_inactive_container = getCellInactiveContainer();
    if ( caption ){
        initWidget();
    }

};