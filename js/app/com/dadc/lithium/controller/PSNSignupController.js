include( "js/app/com/dadc/lithium/view/widgets/PSNSignupWidget.js" );
var PSNSignupController = function( ParentControllerObj ){
    var m_unique_id                 = Controller.reserveUniqueID();
    var m_parent_controller_obj     = ParentControllerObj;
    var m_root_node                 = engine.createContainer();
    var m_master_container          = engine.createContainer();
    var m_callback_func;
    var m_psn_signup_widget         = new PSNSignupWidget( null );

    // Widgets
    
    this.getParentController = function(){return m_parent_controller_obj;};
    this.getDisplayNode = function( ){return m_root_node;};
    this.getControllerName = function(){return 'PSNSignup';};
    this.open = function( ){
        m_root_node.addChild( m_master_container );
    };
    this.close = function( ){
        m_root_node.removeChild( m_master_container );
    };
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'PSNSignup update() ' + engine_timer );
        
    };
    this.prepareToOpen = function( ){
        while ( m_master_container.numChildren > 0 ){
            m_master_container.removeChildAt( 0 );
        }
        m_master_container.addChild( m_psn_signup_widget.getDisplayNode() );
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
};