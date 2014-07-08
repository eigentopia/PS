/**
 * Background Widget
 */
var BackgroundWidget = function( ) {
    var m_root_node                         = engine.createContainer();

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'BackgroundWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( ){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    
    m_root_node.addChild( AssetLoaderInstance.getImage( "Artwork/concrete_bg.png" ) );
};