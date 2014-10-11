var NextVideoWidget = function(MediaObj){
	var rootNode = engine.createContainer();
	var containerWidth = 300
	var containerHeight = 200
	padding = 10
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

	return rootNode;

}