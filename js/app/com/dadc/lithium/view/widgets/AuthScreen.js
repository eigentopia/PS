var AuthScreen = (function(){
	var self = this;

	var authCode;

	self.rootNode = engine.createContainer();
	var containerWidth = 300
	var containerHeight = 200
	var padding = 10
	var pfnText = Dictionary.getText( Dictionary.TEXT.PRESSFORNEXT );

	var background = engine.createSlate()
		background.shader = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/button_small_lightgray.png" ), 14, 14, RGBLibraryInstance.getWHITE( .5 ) );
		background.height = containerHeight
		background.width = containerWidth
	var pressForNextSlate = engine.createSlate();
		pressForNextSlate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.5) );
		pressForNextSlate.height = 30
		pressForNextSlate.width = containerWidth
		pressForNextSlate.y = -170


	rootNode.addChild(background)
	rootNode.addChild(pressForNextTextSlate)

	var pressForNextText = engine.createTextBlock( pfnText, FontLibraryInstance.getFont_ERRORBUTTON(), containerWidth );
    	pressForNextText.x = pressForNextSlate.width/2 - pressForNextText.naturalWidth/2;
        pressForNextText.y = pressForNextSlate.y - pressForNextText.naturalHeight/2;
    
    rootNode.addChild( pressForNextText );
	
	var upNext = MediaObj.data.Title;
	var upNextText = engine.createTextBlock( upNext, FontLibraryInstance.PLAYNEXTDETAILS(), containerWidth - imageWidth + padding );
	upNextText.y = padding;

	rootNode.addChild(upNextText)

	var mediaObj = MediaObj;

	var itemImg = MediaObj.getThumbnail_OneSheet185x277();

	var oneSheet = ImageManagerInstance.requestImage( itemImg );
	rootNode.addChild(oneSheet)

	var codeDrawn = false
	var finishedCallback;

	var activationText = engine.createTextBlock();

	function pollActivation() {
	    var done = false;
	    pollTimer = setInterval(function () {
	        CrackleApi.User.sso(function (ssoResponse) {
	            //console.log("GOT something in poll " + JSON.stringify(ssoResponse))
	            if (ssoResponse.code) {
	                if (ssoResponse.code != authCode) {
	                	authCode = ssoResponse.code
	                    activationText.text = ssoResponse.code
	                }
	            }
	            else if (ssoResponse.CrackleUserId) {
	               	clearInterval(pollTimer);
	                if (!done) {
	                    finishedCallback && finishedCallback(ssoResponse);
	                    done = true;
	                }
	            }
	            else if (ssoResponse.error) {
	                if (ssoResponse.error != 'authing') {
	                    clearInterval(pollTimer);
	                    if (!done) {
	                        drawErrorScreen(ssoResponse.error)
	                        done = true;
	                    }
	                }
	            }
	        });
	    }, 3000);
	}

	self.startAuth = function(cb){

		finishedCallback = cb

		CrackleApi.User.sso(function(data){
			 if (data.code && !codeDrawn) {
                codeDrawn = true;
                activationText.text = data.code;
                pollActivation();
            }
            else if (data.error && !codeDrawn) {
                codeDrawn = true;
                cb(usr.error)
            }
            else if (data.CrackleUserId) {
                if (pin.deactivate(usr.CrackleUserId) === true) {
                    whatDoIDoNow();
                }
                else {
                    cb(data)
                    //crackle.activate(usr)
                }
            }
		})

	}



	return self



}())