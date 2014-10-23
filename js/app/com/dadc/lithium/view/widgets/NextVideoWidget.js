
var NextVideoWidget = function(MediaObj){
	var rootNode = engine.createContainer();
	var containerWidth = 730
	var containerHeight = 120
	var padding = 10
	var imageWidth = 100
	var pfnText = Dictionary.getText( Dictionary.TEXT.PRESSFORNEXT );
	var self = this

	function getFullTitle(data){
		var title = data.Title;

		if(data.Season && data.Season != ""){
			title = data.ParentChannelName +", S"+data.Season;
			if(data.Episode && data.Episode != ""){ //because yes- we get an empty string sometimes.
				title+="E"+data.Episode
			}
			title +=": "+ data.Title
		}
		return title
	}

	var background = engine.createSlate()
		background.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getLIGHTGRAY(.9) );//ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/buttons/button_small_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( .5 ) );
		background.height = containerHeight
		background.width = containerWidth
	var pressForNextSlate = engine.createSlate();
		pressForNextSlate.shader = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.9) );
		pressForNextSlate.height = 55
		pressForNextSlate.width = containerWidth
		pressForNextSlate.y = 120


	rootNode.addChild(background)
	rootNode.addChild(pressForNextSlate)

	var pressForNextText = engine.createTextBlock( pfnText, FontLibraryInstance.PLAYNEXTDETAILS, containerWidth -( imageWidth + padding));
    	pressForNextText.x = (containerWidth/2 - pressForNextText.naturalWidth/2) + imageWidth/2 
        pressForNextText.y = pressForNextSlate.y + padding;
    
    rootNode.addChild( pressForNextText );
	
	var upNext = "Up Next: " + getFullTitle(MediaObj.data);
	var upNextText = engine.createTextBlock( upNext, FontLibraryInstance.PLAYNEXTDETAILS, containerWidth - (imageWidth + padding*2 ));
	upNextText.y =  (containerHeight/2 - upNextText.naturalHeight/2) 
	upNextText.x =  ((containerWidth+imageWidth)/2 - upNextText.naturalWidth/2)// + imageWidth

	rootNode.addChild(upNextText)

	var mediaObj = MediaObj;
	//100x150 Onesheet
	var itemImgURL = (MediaObj.data.Thumbnail_OneSheet100x150)?MediaObj.data.Thumbnail_OneSheet100x150:MediaObj.data.OneSheetImage100x150;
	var oneSheet = engine.loadImage(itemImgURL, function(img){
		img.x = 10
		img.y= 10
		rootNode.addChild(img);
	}, null)

	return rootNode;

}