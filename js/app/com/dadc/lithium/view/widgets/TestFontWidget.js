/**
 * Widget template
 */
var TestFontWidget = function( ) {
    var m_root_node                         = engine.createContainer();

    this.update = function( engine_timer ){};
    
    this.refreshWidget = function( ){};
    this.getDisplayNode = function(){
    	return m_root_node;
    };
    var font = { font: 'bold.sys', size: 100, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true };
    var font2 = { font: 'Fonts/arialbd.ttf', size: 100, color: [255/255, 255/255, 255/255, 1.0], preserveSpaces: true };
    var tblock;
    

    if ( engine.stats.device.platform != 'windows' )
        tblock = engine.createTextBlock('a b c d e f g h i j k l m n o p q r s t u v x w y z A B C D E F G H I J K L M N O P Q R S T U V X W Y Z 0 1 2 3 4 5 6 7 8 9 - * / + = _ ! @ # $ % ^ & * ( ) ; : [ ] { } " ' + "'", font, 1500 );
    else
        tblock = engine.createTextBlock('a b c d e f g h i j k l m n o p q r s t u v x w y z A B C D E F G H I J K L M N O P Q R S T U V X W Y Z 0 1 2 3 4 5 6 7 8 9 - * / + = _ ! @ # $ % ^ & * ( ) ; : [ ] { } " ' + "'", font2, 1500 );
    
    m_root_node.addChild( tblock );
    tblock.x = 400;
    tblock.y = 20;

};