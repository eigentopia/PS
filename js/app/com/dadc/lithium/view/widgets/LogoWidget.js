/**
 * Widget template
 */
var LogoWidget = function( ) {
    var m_root_node = engine.createContainer();
    var tmp_slate   = engine.createSlate();

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'LogoWidget update() ' + engine_timer );
    };
    
    this.refreshWidget = function( ){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    tmp_slate.shader = ShaderCreatorInstance.createAlphaShader( 1 );
    tmp_slate.shader.texture = AssetLoaderInstance.getImage( "Artwork/crackle_logo.png" ).shader.texture;
    tmp_slate.width = 254;
    tmp_slate.height = 49;    
    
    m_root_node.addChild( tmp_slate );
};