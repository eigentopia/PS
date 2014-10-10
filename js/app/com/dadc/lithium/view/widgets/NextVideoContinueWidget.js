/**
 * Error Widget
 */
var ContinueWidget = function( ) {
    var rootNode = engine.createContainer();
    var message = Dictionary.getText( Dictionary.TEXT.WANTTOCONTINE );
    this.yesButton;
    this.noButton;
    // this.refreshWidget = function( message, ErrorWidget_BUTTON_CAPTION ){
    //     Logger.log( 'refreshWidget() message: ' + message );
    //     m_message = message;
    //     m_button_caption = ErrorWidget_BUTTON_CAPTION;
    //     while ( m_root_node.numChildren > 0 ){
    //         m_root_node.removeChildAt( 0 );
    //     }
    //     initWidget();
    // };
    this.getDisplayNode = function(){
        return rootNode;
    };
    // this.update = function( engine_timer ){
    //     if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'ErrorWidget update() ' + engine_timer );
    // }
    /**
     * Load image from m_image_url and add it to our root container
     */
    //function initWidget(){
    var bg_slate = getBackgroundSlate();


//            tblock = engine.createTextBlock( 'Error', FontLibraryInstance.getFont_ERRORTITLE(), 1100 );
//            m_root_node.addChild( tblock );

    var tblock = engine.createTextBlock( message, FontLibraryInstance.getFont_ERRORMESSAGE(), 1100 );

    yesButton = getButtonContainer(Dictionary.getText( Dictionary.TEXT.YES), 'selected');
    yesButton.selected = true;
    noButton = getButtonContainer(Dictionary.getText( Dictionary.TEXT.NO), 'unselected');
    noButton.selected = false;

    bg_slate.height = tblock.naturalHeight + 84 + 85
    
    tblock.x = ( bg_slate.width / 2 ) - ( tblock.naturalWidth / 2 );
    tblock.y = 30;

    yesButton.x = 10
    noButton.x = bg_slate.width - 10
    yesButton.y = noButton.y = bg_slate.height - 114;

    m_root_node.addChild( bg_slate );
    m_root_node.addChild( tblock );
    m_root_node.addChild( yesButton );
    m_root_node.addChild( noButton );
            
        }catch( e ){
            if( bg_slate && m_root_node.contains( bg_slate ) ){
                m_root_node.removeChild( bg_slate );
            }
            if( tblock && m_root_node.contains( tblock ) ){
                m_root_node.removeChild( tblock );
            }
        }
    //}
    
    function getBackgroundSlate(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createAlphaShader( 1 );
        tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).shader.texture;
        tmp_slate.width             = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).width;
        tmp_slate.height            = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).height;

        return tmp_slate;
    }
    
    function getButtonContainer(text, state){

        var button_container = engine.createContainer();

        var button_slate 
        if(state == "selected"){
            button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        }else{
            button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_unselected.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );  
        }
        
        button_slate.width = AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ).width;
        button_slate.height = AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ).height;
    
        button_container.addChild( button_slate );
        
        
        var tblock = engine.createTextBlock( text, FontLibraryInstance.getFont_ERRORBUTTON(), 500 );
        tblock.x = button_slate.width/2 - tblock.naturalWidth/2;
        tblock.y = button_slate.height/2 - tblock.naturalHeight/2;
        button_container.addChild( tblock );
        
        return button_container;
    }

    this.navLeft = function(){
        if(noButton.selected){
            yesButton.selected = true;
            noButton.selected = false;
        }
    }
    this.navRight = function(){
        if(yesButton.selected){
            yesButton.selected = false;
            noButton.selected = true;
        }
    }
    

    // if ( message ){
    //     initWidget();
    // }
};
