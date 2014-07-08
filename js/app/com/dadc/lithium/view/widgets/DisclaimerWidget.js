/**
 * Disclaimer Widget
 */
var DisclaimerWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    
    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'DisclaimerWidget update() ' + engine_timer );
    }


    function init(){
        var tmp_container;
        var tblock;

        tmp_container = engine.createContainer();
        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_1 ), FontLibraryInstance.getFont_DISCLAIMERTITLE(), 1500 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 250;

        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_2), FontLibraryInstance.getFont_DISCLAIMERTEXT(), 1300 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 450;

        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_3 ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1728 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 500;
        
        var last_height = tblock.naturalHeight;
        var last_y = tblock.y;

        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_4 ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1728 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = last_y + last_height;

        var button_slate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_large_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        
        button_slate.width = 400;
        button_slate.height = 84;
        
        button_slate.x = ( 1920 / 2 ) - ( button_slate.width / 2 );
        button_slate.y = 800;
        tmp_container.addChild( button_slate );
        
        
        var tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.CONTINUE ), FontLibraryInstance.getFont_DISCLAIMERBUTTON(), 500 );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 810;
        tmp_container.addChild( tblock );
        
        m_master_container.addChild( tmp_container );
        m_master_container.width = tblock.naturalWidth;
        m_master_container.height = tblock.naturalHeight;
    }
    
    
    function getBackgroundContainer(){
        var tmp_slate = engine.createSlate();
        var tmp_container = engine.createContainer();

        tmp_slate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getBLACK( 1 ) );
        tmp_slate.height = 5000;
        tmp_slate.width = 5000;
        
        tmp_container.addChild( tmp_slate );
        
        return tmp_container;
    }
        
    m_master_container.addChild( getBackgroundContainer() );
    m_root_node.addChild( m_master_container );
    
    init();
    
//    m_root_node.width = m_master_container.width;
//    m_root_node.height = m_master_container.height;

};