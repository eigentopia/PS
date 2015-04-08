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
    var user;
    var loginNode = engine.createContainer();
    var logOutNode = engine.createContainer();
    var pollOk = false

    this.refreshWidget = function(){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };

    this.getActive = function(){
        return activeField;
    }
    this.setActive = function(){
        pollOk = true
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
        pollOk = false
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
            showStatusScreen()
        // }
        // else{
        //     self.showLoginScreen()
        // }
    }

    function showStatusScreen(){
        user = ApplicationController.getUserInfo();
        var whichScreen;

        if((PlaystationConfig.forcedRegistration == true && user.name !== undefined) || user.name !== undefined) {
            whichScreen =  showHome()
        }
        else{
            whichScreen =  showActivate()
            pollActivation()
        }
        

        //DISCLAIMER SCREEN CLONE
        //DISCLAIMER_AUTHSCREEN
        currentScreen = "logOut"
        // if(m_master_container.contains(loginNode)){
        //     m_master_container.removeChild(loginNode);
        // }

        // logOutButton = new PlaylistMenuButtonWidget(Dictionary.getText( Dictionary.TEXT.LOGOUT_BUTTON_TEXT ));
        // logOutButtonNode =  logOutButton.getDisplayNode();
        // logOutButtonNode.x = 470;
        // logOutButtonNode.y = 350;
       
        // logOutNode.addChild( logOutButtonNode );
        logOutNode.addChild(whichScreen);
        
        m_master_container.addChild( logOutNode );
        activeField = "logOutButton"
        m_master_container.width = logOutNode.naturalWidth;
        m_master_container.height = logOutNode.naturalHeight;

        //HELLO
        //DEVICE_ACTIVE
        //
    }

    function showHome(){
        if(m_master_container.contains(rootNode)){
             m_master_container.removeChild(rootNode);
        }
        var homeScreen = engine.createContainer()

        var logOutInfo = engine.createTextBlock( [Dictionary.getText( Dictionary.TEXT.HELLO ), user.name], 
            [FontLibraryInstance.getFont_DISCLAIMERBUTTON(),FontLibraryInstance.getFont_DISCLAIMERBUTTON()], 500 );
        logOutInfo.x=( 1200 / 2 ) - ( logOutInfo.naturalWidth / 2 );
        logOutInfo.y=150;
        homeScreen.addChild(logOutInfo)

        var deviceActiveText = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DEVICE_ACTIVE), FontLibraryInstance.getFont_DISCLAIMERBUTTON(), 900 );
        deviceActiveText.x=( 1200 / 2 ) - ( deviceActiveText.naturalWidth / 2 );
        deviceActiveText.y=220;
        homeScreen.addChild(deviceActiveText)

        var deactivateText = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DEACTIVATE_HOW), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1100 );
        deactivateText.x=( 1200 / 2 ) - ( deactivateText.naturalWidth / 2 );
        deactivateText.y=400;
        homeScreen.addChild(deactivateText)

        return homeScreen

    }
    
    var rootNode = engine.createContainer();
    function showActivate(){
        // var tmp_container;
        // var tblock;

        // tmp_container = engine.createContainer();
        // tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_1 ), FontLibraryInstance.getFont_DISCLAIMERTITLE(), 1400 );
        // tmp_container.addChild( tblock );
        // tblock.x = ( 1250 / 2 ) - ( tblock.naturalWidth / 2 );
        // tblock.y = 150;

        // tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_2), FontLibraryInstance.getFont_DISCLAIMERTEXT(), 1100 );
        // tmp_container.addChild( tblock );
        // tblock.x = ( 1200 / 2 ) - ( tblock.naturalWidth / 2 );
        // tblock.y = 250;

        // tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_3 ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1100 );
        // tmp_container.addChild( tblock );
        // tblock.x = ( 1200 / 2 ) - ( tblock.naturalWidth / 2 );
        // tblock.y = 350;
        
        // var last_height = tblock.naturalHeight;
        // var last_y = tblock.y;

        // tblock = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.DISCLAIMER_AUTHSCREEN ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1100);
        // tmp_container.addChild( tblock );
        // tblock.x = ( 1200 / 2 ) - ( tblock.naturalWidth / 2 );
        // tblock.y = last_y + last_height + 50;


        //self.rootNode.addChild( AssetLoaderInstance.getImage( "Artwork/activationScreen.png" ) );

        var nowWithText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.NOW_WITH ),  FontLibraryInstance.AUTHYOU, 1200 )
        nowWithText.x = (1200 - nowWithText.naturalWidth)/2
        nowWithText.y  = (1080)/2 - 550
        rootNode.addChild(nowWithText)

        var activateText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ACTIVATE ),  FontLibraryInstance.AUTHACTIVATE, 1200 )
        activateText.x = (1200 - activateText.naturalWidth)/2
        activateText.y  = (1080)/2 - 420  
        rootNode.addChild(activateText)

        var loginText = engine.createTextBlock([Dictionary.getText( Dictionary.TEXT.LOGIN_TO ), 'http://crackle.com/activate'],  [FontLibraryInstance.AUTHLOGIN, FontLibraryInstance.AUTHLOGINURL], 1200 )
        loginText.x = (1200 - loginText.naturalWidth)/2
        loginText.y  = (1080)/2 - 320  
        rootNode.addChild(loginText)

        var enterCodeText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ENTER_CODE ),  FontLibraryInstance.AUTHLOGIN, 1200 )
        enterCodeText.x = (1200 - enterCodeText.naturalWidth)/2
        enterCodeText.y  = (1080)/2 -220 
        rootNode.addChild(enterCodeText)

        var validAccountText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.VALID_ACCOUNT ),  FontLibraryInstance.PLAYNEXTDETAILSALT, 1200 )
        validAccountText.x = (1200 - validAccountText.naturalWidth)/2
        validAccountText.y  = (1080)/2 + 40 
        rootNode.addChild(validAccountText)
        
        return rootNode
    }

    // this.showLoginScreen = function(){
    //     currentScreen = "login"
    //     if(m_master_container.contains(logOutNode)){
    //         m_master_container.removeChild(logOutNode);
    //     }

    //     var logInInfo = engine.createTextBlock( Dictionary.getText( Dictionary.TEXT.LOGIN_SCREEN_TEXT ), FontLibraryInstance.getFont_DISCLAIMERCENTERTEXT(), 1000 );
    //     logInInfo.x=100;
    //     logInInfo.y=50;
    //     loginNode.addChild(logInInfo);

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
        
        //m_master_container.addChild( loginNode );
        //m_master_container.width = submitButtonNode.naturalWidth;
        //m_master_container.height = submitButtonNode.naturalHeight;

        //this.setActive();
        
    //  }
    var pollTimer;
    var authCode=""
       
    function pollActivation() {
        var done = false;
        CrackleApi.User.sso(function (ssoResponse) {
            if (ssoResponse.ActivationCode) {
                if (ssoResponse.ActivationCode != authCode) {
                    authCode = ssoResponse.ActivationCode
                    activationText = engine.createTextBlock(ssoResponse.ActivationCode,  FontLibraryInstance.AUTHSCREEN, 1200 )
                    activationText.x = (1200 - activationText.naturalWidth)/2
                    activationText.y  = (1080)/2 - 100
                    rootNode.addChild(activationText)

                }
                if(pollOk == true){
                    pollTimer = setTimeout(function () {
                        pollActivation()
                
                    }, 3000);
                }
            }
            else if (ssoResponse.CrackleUserId) {
                //clearTimeout(pollTimer);
                if (!done) {
                    //Because CrackleAPI- that's why.
                    CrackleApi.User.moreUserInfo(ssoResponse, function(fullUserData){
                        ApplicationController.setUserInfo(fullUserData, showStatusScreen)
                        done = true;
                    })   
                }
            }
            else if (ssoResponse.error) {
                if (ssoResponse.error != 'authing') {
                    //clearTimeout(pollTimer);
                    if (!done) {
                        showStatusScreen && showStatusScreen( false, ssoResponse.error)
                        done = true;
                    }
                }
            }
        });

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