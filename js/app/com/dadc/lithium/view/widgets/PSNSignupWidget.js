/**
 * Disclaimer Widget
 */
var PSNSignupWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    
    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'PSNSignupWidget update() ' + engine_timer );
    }


    function init(){
        var tmp_container;
        var tblock;

        tmp_container = engine.createContainer();
        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.PSNSIGNUP_1 ), FontLibraryInstance.getFont_DISCLAIMERTITLE(), 1500 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 250;

        tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.PSNSIGNUP_2), FontLibraryInstance.getFont_DISCLAIMERTEXT(), 1100 );
        tmp_container.addChild( tblock );
        tblock.x = ( 1920 / 2 ) - ( tblock.naturalWidth / 2 );
        tblock.y = 450;

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