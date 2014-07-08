/**
 * Widget template
 */
var SampleWidget = function( list_obj ) {
    var m_root_node                         = engine.createContainer();
    var m_list_obj                          = list_obj;

    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'SampleWidget update() ' + engine_timer );
        
    };
    
    this.refreshWidget = function( PlayerListObj ){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };

};