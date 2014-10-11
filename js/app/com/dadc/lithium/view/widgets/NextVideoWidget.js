
var NextVideoWidget = function(MediaObj){
	var rootNode = engine.createContainer();
	var containerWidth = 700
	var containerHeight = 200
	var padding = 10
	var imageWidth = 100
	var pfnText = Dictionary.getText( Dictionary.TEXT.PRESSFORNEXT );
	var self = this

	var background = engine.createSlate()
		background.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getLIGHTGRAY(.5) );//ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( .5 ) );
		background.height = containerHeight
		background.width = containerWidth
	var pressForNextSlate = engine.createSlate();
		pressForNextSlate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.5) );
		pressForNextSlate.height = 60
		pressForNextSlate.width = containerWidth
		pressForNextSlate.y = 200


	rootNode.addChild(background)
	rootNode.addChild(pressForNextSlate)

	var pressForNextText = engine.createTextBlock( pfnText, FontLibraryInstance.PLAYNEXTDETAILS(), containerWidth );
    	pressForNextText.x = pressForNextSlate.x
        pressForNextText.y = pressForNextSlate.y;
    
    rootNode.addChild( pressForNextText );
	
	var upNext = "Up Next: " + MediaObj.data.Title;
	var upNextText = engine.createTextBlock( upNext, FontLibraryInstance.PLAYNEXTDETAILS(), containerWidth - imageWidth + padding );
	upNextText.y = padding;

	rootNode.addChild(upNextText)

	var mediaObj = MediaObj;
	//100x150 Onesheet
	var itemImgURL = MediaObj.data.Thumbnail_OneSheet100x150;
	var oneSheet = engine.loadImage(itemImgURL, function(img){
		rootNode.addChild(img);
	}, null)

	return rootNode;

}