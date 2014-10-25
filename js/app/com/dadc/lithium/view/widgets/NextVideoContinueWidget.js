
var ContinueWidget = function( ) {
    this.rootNode = engine.createContainer();
    var message = Dictionary.getText( Dictionary.TEXT.WANTTOCONTINE );
    var spacing = 40
    this.yesButton;
    this.noButton;

    var bg_slate = getBackgroundSlate();

    var tblock = engine.createTextBlock( message, FontLibraryInstance.PLAYNEXTDETAILS, 700 );

    yesButton = Button(Dictionary.getText( Dictionary.TEXT.YES), true);
    noButton = Button(Dictionary.getText( Dictionary.TEXT.NO), false);
    
    tblock.x = ( bg_slate.width / 2 ) - ( tblock.naturalWidth / 2 );
    tblock.y = 20;

    yesButton.rootNode.x =( 610 - (yesButton.rootNode.getChildAt(0).width + spacing)*2)/2
    noButton.rootNode.x = yesButton.rootNode.x + yesButton.rootNode.getChildAt(0).width + spacing
    yesButton.rootNode.y = noButton.rootNode.y = tblock.y + 50

    this.rootNode.addChild( bg_slate );
    this.rootNode.addChild( tblock );
    this.rootNode.addChild( yesButton.rootNode );
    this.rootNode.addChild( noButton.rootNode );
    
    function getBackgroundSlate(){
        var tmp_slate = engine.createSlate();
        
        tmp_slate.shader            = ShaderCreatorInstance.createSolidColorShader( RGBLibraryInstance.getDARKGRAY(.9) );
        tmp_slate.width             = 610
        tmp_slate.height            = 140

        return tmp_slate;
    }
    
    function Button(text, state){

        var rootNode = engine.createContainer();
        var selected = state

        var selectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_orange.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );
        var notSelectedSlate = ShaderCreatorInstance.create9SliceShader( AssetLoaderInstance.getImage( "Artwork/subnav_button_gray.png" ), 14, 14, RGBLibraryInstance.getWHITE( 1 ) );  
   
        selectedSlate.width = notSelectedSlate.width = 100
        selectedSlate.height = notSelectedSlate.height = 50

        if(state == true ){
            rootNode.addChild( selectedSlate );
        }
        else{   
            rootNode.addChild( notSelectedSlate );
        }
        
        
        var tblock = engine.createTextBlock( text, FontLibraryInstance.PLAYNEXTDETAILSBUTTON, 200 );
        tblock.x = selectedSlate.width/2 - tblock.naturalWidth/2;
        tblock.y = selectedSlate.height/2 - tblock.naturalHeight/2;
        rootNode.addChild( tblock );
        
        return {
            rootNode:rootNode,
            selected:function (){return selected},
            select: function(state){
                selected = state;
                rootNode.removeChildAt[0]
                var slate;
                if(state == true){
                    slate = selectedSlate
                }
                else{
                    slate = notSelectedSlate; 
                }
                
                rootNode.addChildAt(slate, 1)
            }
        };
    }

    this.navLeft = function(){
        if(noButton.selected){
            yesButton.select(true);
            noButton.select(false);
        }
    }
    this.navRight = function(){
        if(yesButton.selected){
            yesButton.select(false);
            noButton.select(true);            
        }
    }
};
