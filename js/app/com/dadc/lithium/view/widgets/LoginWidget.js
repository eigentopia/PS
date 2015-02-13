/**
 * Login Widget
 */
include( "js/app/com/dadc/lithium/view/widgets/TabbedButtonWidget.js" );
include( "js/app/com/dadc/lithium/view/widgets/TextBoxWidget.js" );

var LoginWidget = function( ) {
    var m_root_node = engine.createContainer();
    var m_master_container = engine.createContainer();
    var submitButton;
    var logOutButton;
    var emailSlate = null;
    var passSlate = null;
    var currentScreen = "login"
    var focus = false;
    var activeField;
    var self = this;

    var loginNode = engine.createContainer();
    var logOutNode = engine.createContainer();

    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };

    this.getActive = function(){
        return activeField;
    }
    this.setActive = function(){
        //if active screen is submit
        // Logger.log("LOGWIDG SETTING ACTIVE " + currentScreen)
        // focus = true;
        // if(currentScreen == "login"){
        //     emailSlate.setActive();
        //     activeField = "emailSlate"
        //     logOutButton && logOutButton.setInactive();
        // }
        // else{
        //     logOutButton.setActive();
        // }
    }
    this.setInactive = function(){
        // if(currentScreen == "login"){
        //     submitButton.setInactive();
        //     passSlate.setInactive();
        //     emailSlate.setInactive();
        // }
        // else{

        //     logOutButton.setInactive()
        // }
    }
    this.clearLogin = function(){
        //focus = false;
        if(currentScreen == "login"){
            //submitButton.setInactive();
            //passSlate.setInactive();
            //emailSlate.setInactive();
            //logOutButton && logOutButton.setInactive()
            //activeField = "emailSlate";
        }
    }
    this.update = function( engine_timer ){
        if( LoggerConfig.CONFIG.UPDATE_DEBUG ) Logger.log( 'LoginWidget update() ' + engine_timer );
        
    }


    this.init = function(){
        // var user = ApplicationController.getUserInfo();
        // if( user && user.id != null){
            self.showLoggedInScreen()
        // }
        // else{
        //     self.showLoginScreen()
        // }
    }

    this.showLoggedInScreen = function(){
        currentScreen = "logOut"
        if(m_master_container.contains(loginNode)){
            m_master_container.removeChild(loginNode);
        }

        var user = ApplicationController.getUserInfo();

        var logOutInfo = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.LOGOUT_SCREEN_TEXT ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 500 );
        logOutInfo.x=( 1200 / 2 ) - ( logOutInfo.naturalWidth / 2 );
        logOutInfo.y=150;

        var logOutEmail = engine.createTextBlock( user.name, FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 500 );
        logOutEmail.x=( 1200 / 2 ) - ( logOutEmail.naturalWidth / 2 );
        logOutEmail.y=200;

        // logOutButton = new PlaylistMenuButtonWidget(Dictionary.getText( Dictionary.TEXT.LOGOUT_BUTTON_TEXT ));
        // logOutButtonNode =  logOutButton.getDisplayNode();
        // logOutButtonNode.x = 470;
        // logOutButtonNode.y = 350;
       
        // logOutNode.addChild( logOutButtonNode );
        logOutNode.addChild(logOutInfo);
        logOutNode.addChild(logOutEmail);
        
        m_master_container.addChild( logOutNode );
        activeField = "logOutButton"
        m_master_container.width = logOutNode.naturalWidth;
        m_master_container.height = logOutNode.naturalHeight;
    }
    
    this.showLoginScreen = function(){
        currentScreen = "login"
        if(m_master_container.contains(logOutNode)){
            m_master_container.removeChild(logOutNode);
        }

        var logInInfo = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.LOGIN_SCREEN_TEXT ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1000 );
        logInInfo.x=100;
        logInInfo.y=50;
        loginNode.addChild(logInInfo);

        // var emailLabel = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.EMAIL_INFO ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), 500 );
        // emailLabel.x = 100
        // emailLabel.y = 300;
        // loginNode.addChild( emailLabel );

        // emailSlate = new TextBoxWidget(" ", true, 1000)
        // emailSlateNode = emailSlate.getDisplayNode()
        // emailSlateNode.x         = 90;
        // emailSlateNode.y         = 350;
        // loginNode.addChild( emailSlateNode);

        // var passLabel = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.PASSWORD_INFO ), FontLibraryInstance.getFont_MOVIEDETAILTEXT(), 500 );
        // passLabel.x = 100
        // passLabel.y = 450;
        // loginNode.addChild( passLabel );

        // passSlate = new TextBoxWidget(" ", false, 1000)
        // passSlateNode = passSlate.getDisplayNode()
        // passSlateNode.x         = 90
        // passSlateNode.y         = 500;
        // loginNode.addChild( passSlateNode );

        // submitButton = new PlaylistMenuButtonWidget(Dictionary.getText( Dictionary.TEXT.LOGIN ));
        // submitButtonNode =  submitButton.getDisplayNode();
        // submitButtonNode.x = 825;
        // submitButtonNode.y = 600;
        // loginNode.addChild( submitButtonNode );
        
        m_master_container.addChild( loginNode );
        m_master_container.width = submitButtonNode.naturalWidth;
        m_master_container.height = submitButtonNode.naturalHeight;

        this.setActive();
        
    }

    this.addEmailText = function(text){
        // if(emailSlate != null){
        //     emailSlate.refreshWidget(text, true)
        // }


    }
    this.addPassText = function(text){
        // if(passSlate != null){
        //     passSlate.refreshWidget(text, true)
        // }

    }

    this.navUp = function(){
        //Logger.log("LOGWIDG UP "+submitButton.isActive())
        // if (logOutButton && logOutButton.isActive()){
        //     return
        // }
        // // if(submitButton.isActive()){
        // //     passSlate.setActive();
        // //     submitButton.setInactive();
        // //     activeField = passSlate;
        // // }
        // // else 
        // if(passSlate !== null && passSlate.isActive()){
        //     emailSlate.setActive()
        //     passSlate.setInactive();
        //     activeField = "emailSlate";
        // }

    }
    this.navDown = function(){
        //Logger.log("LOGWIDG DN "+emailSlate.isActive()+" " +passSlate.isActive()+" "+ activeField)
        // if (logOutButton && logOutButton.isActive()){
        //     return
        // }
        // if(emailSlate !== null && emailSlate.isActive()){
        //     passSlate.setActive();
        //     emailSlate.setInactive();
        //     activeField = "passSlate";
        // }
        // else if(passSlate !== null && passSlate.isActive()){
        //     //submitButton.setActive()
        //     passSlate.setInactive();
        //     activeField = "submitButton";
        // }

    }

    m_root_node.addChild( m_master_container );
    
    //init();
    
//    m_root_node.width = m_master_container.width;
//    m_root_node.height = m_master_container.height;

};