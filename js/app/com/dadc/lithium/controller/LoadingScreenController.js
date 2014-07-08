include( "js/app/com/dadc/lithium/view/widgets/LoadingWidget.js" );

var LoadingScreenController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_loading_widget            = null;
    var m_loading_assets_ready      = false;
    // Widgets
    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'LoadingScreenController';};
    this.open = function( ){
        Logger.log( 'LOADING OPEN' );
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        Logger.log( 'LOADING CLOSE' );
        if ( m_root_node.contains( m_master_container ) ) m_root_node.removeChild( m_master_container );
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'LoadingScreenController update() ' + engine_timer );
        
        // if loading screen assets ready, fire it off
        if( m_loading_assets_ready ){
            if ( !m_loading_widget ){
                m_loading_widget = new LoadingWidget( null );
                m_master_container.addChild( AssetLoaderInstance.getImage( "Artwork/crackle_loading.png" ) );
                m_master_container.addChild( m_loading_widget.getDisplayNode() );
            }

            m_loading_widget.getDisplayNode().x = 1920 / 2;
            m_loading_widget.getDisplayNode().y = 760;
            m_loading_widget.update( engine_timer );
        // if not ready, check assets
        }else{
            // if assets ready, create the slates for the loading menu
            if( AssetLoaderInstance.checkAssetsReady( [ "Artwork/loading.png", "Artwork/crackle_loading.png" ] ) ){
                m_loading_assets_ready = true;
            }
        }
    };
    this.closeLoadingWidget = function(){
        if( m_master_container.contains( m_loading_widget.getDisplayNode() ) ){
            m_master_container.removeChild( m_loading_widget.getDisplayNode() );
        }
    }
    this.prepareToOpen = function(){
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
    };
    this.requestParentAction = function( json_data_args ){};
    this.notifyPreparationStatus = function( controller_id ){};
    this.getUniqueID = function(){return m_unique_id;};
    this.navLeft = function(){
    };
    this.navRight = function(){
    };
    this.navDown = function(){
    };
    this.enterPressed = function(){
    };
    this.navUp = function(){
    };
    
    m_root_node = engine.createContainer();
}
