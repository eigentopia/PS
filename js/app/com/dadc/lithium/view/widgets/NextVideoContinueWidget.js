
var ContinueWidget = function( ) {
    this.rootNode = engine.createContainer();
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
    // this.getDisplayNode = function(){
    //     return rootNode;
    // };
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

    var tblock = engine.createTextBlock( message, FontLibraryInstance.PLAYNEXTDETAILS, 700 );

    yesButton = Button(Dictionary.getText( Dictionary.TEXT.YES), true);
    noButton = Button(Dictionary.getText( Dictionary.TEXT.NO), false);

    bg_slate.height = tblock.naturalHeight + 84 + 85
    
    tblock.x = ( bg_slate.width / 2 ) - ( tblock.naturalWidth / 2 );
    tblock.y = 30;

    yesButton.rootNode.x = bg_slate.x + 100
    noButton.rootNode.x = bg_slate.x + bg_slate.width - 220
    yesButton.rootNode.y = noButton.rootNode.y = bg_slate.height - 100;

    this.rootNode.addChild( bg_slate );
    this.rootNode.addChild( tblock );
    this.rootNode.addChild( yesButton.rootNode );
    this.rootNode.addChild( noButton.rootNode );
            
        // }catch( e ){
        //     if( bg_slate && m_root_node.contains( bg_slate ) ){
        //         m_root_node.removeChild( bg_slate );
        //     }
        //     if( tblock && m_root_node.contains( tblock ) ){
        //         m_root_node.removeChild( tblock );
        //     }
        // }
    //}
    
    function getBackgroundSlate(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.9) );
        //tmp_slate.shader.texture    = AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).shader.texture;
        tmp_slate.width             = 610//AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).width;
        tmp_slate.height            = 100//AssetLoaderInstance.getImage( "Artwork/error_dialog.png" ).height;

        return tmp_slate;
    }
    
    function Button(text, state){

        var rootNode = engine.createContainer();
        var selected = state

        var selectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        var notSelectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_gray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );  
   
        selectedSlate.width = notSelectedSlate.width = 100 //AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ).width;
        selectedSlate.height = notSelectedSlate.height = 50//AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ).height;

        if(state == true ){
            rootNode.addChild( selectedSlate );
        }
        else{   
            rootNode.addChild( notSelectedSlate );
        }
        
        
        var tblock = engine.createTextBlock( text, FontLibraryInstance.PLAYNEXTDETAILS, 20 );
        tblock.x = selectedSlate.width/2 - tblock.naturalWidth/2;
        tblock.y = selectedSlate.height/2 - tblock.naturalHeight/2;
        rootNode.addChild( tblock );
        
        return {
            rootNode:rootNode,
            selected:function (){return selected},
            select: function(state){
                selected = state;
                rootNode.removeChildAt[1]
                var slate;
                if(state == true){
                    slate = selectedSlate
                }
                else{
                    slate = notSelectedSlate; 
                }
                
                rootNode.addChildAt(slate, 1)
            }
        };
    }

    this.navLeft = function(){
        if(noButton.selected){
            yesButton.select(true);
            noButton.select(false);
        }
    }
    this.navRight = function(){
        if(yesButton.selected){
            yesButton.select(false);
            noButton.select(true);            
        }
    }
    

    // if ( message ){
    //     initWidget();
    // }
};
