/**
 * Error Widget
 */
var ErrorWidget = function( message, ErrorWidget_BUTTON_CAPTION ) {
    var m_root_node = engine.createContainer();
    var m_message = message;
    var m_button_caption = ErrorWidget_BUTTON_CAPTION;
    
    this.refreshWidget = function( message, ErrorWidget_BUTTON_CAPTION ){
        Logger.log( 'refreshWidget() message: ' + message );
        m_message = message;
        m_button_caption = ErrorWidget_BUTTON_CAPTION;
        while ( m_root_node.numChildren > 0 ){
            m_root_node.removeChildAt( 0 );
        }
        initWidget();
    };
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ErrorWidget update() ' + engine_timer );
    }
    /**
     * Load image from m_image_url and add it to our root container
     */
    function initWidget(){
        var tblock;
        var bg_slate = getBackgroundSlate();

        try{

//            tblock = engine.createTextBlock( 'Error', FontLibraryInstance.getFont_ERRORTITLE(), 1100 );
//            m_root_node.addChild( tblock );

            tblock = engine.createTextBlock( m_message, FontLibraryInstance.getFont_ERRORMESSAGE(), 1100 );

            var button = getButtonContainer();

            bg_slate.height = tblock.naturalHeight + 84 + 85
            
            tblock.x = ( bg_slate.width / 2 ) - ( tblock.naturalWidth / 2 );
            tblock.y = 30;

            button.y = bg_slate.height - 114;

            m_root_node.addChild( bg_slate );
            m_root_node.addChild( tblock );
            m_root_node.addChild( button );
            
        }catch( e ){
            if( bg_slate && m_root_node.contains( bg_slate ) ){
                m_root_node.removeChild( bg_slate );
            }
            if( tblock && m_root_node.contains( tblock ) ){
                m_root_node.removeChild( tblock );
            }
        }
    }
    
    function getBackgroundSlate(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).shader.texture;
        tmp_slate.width             = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).width;
        tmp_slate.height            = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).height;

        return tmp_slate;
    }
    
    function getButtonContainer(){

        var button_container = engine.createContainer();

        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_large_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        var text;
        
        button_slate.width = AssetLoaderInstance.getImage( "Artwork/buttons/button_large_orange.png" ).width;
        button_slate.height = AssetLoaderInstance.getImage( "Artwork/buttons/button_large_orange.png" ).height;
        
        button_container.x = 350;
    
        button_container.addChild( button_slate );
        
        switch( m_button_caption ){
            case ErrorWidget.BUTTON_CAPTION.OK:
                text = Dictionary.getText( Dictionary.TEXT.OK );
                break;
            default:
                text = Dictionary.getText( Dictionary.TEXT.CONTINUE );
                break;
        }
        var tblock = engine.createTextBlock( text, FontLibraryInstance.getFont_ERRORBUTTON(), 500 );
        tblock.x = button_slate.width/2 - tblock.naturalWidth/2;
        tblock.y = button_slate.height/2 - tblock.naturalHeight/2;
        button_container.addChild( tblock );
        
        return button_container;
    }
    

    if ( message ){
        initWidget();
    }
};

ErrorWidget.BUTTON_CAPTION = {
    CONTINUE: 1,
    OK: 2
}