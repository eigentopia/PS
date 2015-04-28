var AuthScreen = (function(){
	var self = {};

	var authCode;

	self.rootNode;
	var codeDrawn = false
	var finishedCallback;
	var activationText;
	var pollTimer
	var background
	var containerWidth = 1600
	var containerHeight = 900
	var padding = 170

	function pollActivation() {
	    var done = false;
        CrackleApi.User.sso(function (ssoResponse) {
            if (ssoResponse.ActivationCode) {
                if (ssoResponse.ActivationCode != authCode) {
                	authCode = ssoResponse.ActivationCode
					activationText = engine.createTextBlock(ssoResponse.ActivationCode,  FontLibraryInstance.AUTHSCREEN, 1920 )
					activationText.x = (1920 - activationText.naturalWidth)/2
					activationText.y  = (1080)/2 + padding
					self.rootNode.addChild(activationText)

                }

            	pollTimer = setTimeout(function () {
					pollActivation()
	    		
	    		}, 3000);
            }
            else if (ssoResponse.CrackleUserId) {
               	//clearTimeout(pollTimer);
                if (!done) {
                	//Because CrackleAPI- that's why.
                	CrackleApi.User.moreUserInfo(ssoResponse, function(fullUserData){
	                    finishedCallback && finishedCallback(true, fullUserData);
	                    done = true;
                		
                	})
                            
	
                }
            }
            else if (ssoResponse.error) {
                if (ssoResponse.error != 'authing') {
                    //clearTimeout(pollTimer);
                    if (!done) {
                        finishedCallback && finishedCallback( false, ssoResponse.error)
                        done = true;
                    }
                }
            }
        });

	}

	function drawScreen(){
	 	self.rootNode = engine.createContainer();

		self.rootNode.addChild( AssetLoaderInstance.getImage( "Artwork/activationScreen.png" ) );

		var nowWithTextFont = FontLibraryInstance.AUTHYOU
		if(CrackleApi.lang == 'es' || CrackleApi.lang == 'pt'){
			nowWithTextFont = FontLibraryInstance.AUTHYOUES
		}

		var nowWithText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.NOW_WITH ),  nowWithTextFont, 1920 )
		nowWithText.x = (1920 - nowWithText.naturalWidth)/2
		nowWithText.y  = (1080)/2 - 250
		self.rootNode.addChild(nowWithText)

		var activateText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ACTIVATE ),  FontLibraryInstance.AUTHACTIVATE, 980 )
		activateText.x = (1920 - activateText.naturalWidth)/2
		activateText.y  = (1080)/2 - 130  
		self.rootNode.addChild(activateText)
		var activateText2 = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ACTIVATE2 ),  FontLibraryInstance.AUTHACTIVATE, 980 )
		activateText2.x = (1920 - activateText2.naturalWidth)/2
		activateText2.y  = (1080)/2 - 95  
		self.rootNode.addChild(activateText2)

		var loginText = engine.createTextBlock([Dictionary.getText( Dictionary.TEXT.LOGIN_TO ), 'crackle.com/activate'],  [FontLibraryInstance.AUTHLOGIN, FontLibraryInstance.AUTHLOGINURL], 1920 )
		loginText.x = 600
		loginText.y  = (1080)/2 - 20  
		self.rootNode.addChild(loginText)

		var enterCodeText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.ENTER_CODE ),  FontLibraryInstance.AUTHLOGIN, 1920 )
		enterCodeText.x = 600
		enterCodeText.y  = (1080)/2 + 80 
		self.rootNode.addChild(enterCodeText)

		var validAccountText = engine.createTextBlock(Dictionary.getText( Dictionary.TEXT.VALID_ACCOUNT ),  FontLibraryInstance.PLAYNEXTDETAILSALT, 1920 )
		validAccountText.x = (1920 - validAccountText.naturalWidth)/2
		validAccountText.y  = (1080)/2 + 340 
		self.rootNode.addChild(validAccountText)
		

	}

	self.startAuth = function(cb){

		finishedCallback = cb
		drawScreen()
		pollActivation()
		pollTimer = setTimeout(function () {
			pollActivation()
	    }, 3000);

	}



	return self



}())