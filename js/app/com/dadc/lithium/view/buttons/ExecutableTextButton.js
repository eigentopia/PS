

/**
 * @var button_label_text - the label of the button
 * @var FontLibrary_FONTDEF - a font definition found in the FontLibrary object, or a custom font definition of the same format
 * @var on_push_callback_function - the function to call when the button's onPush action is made
 * @var on_push_callback_json_object - the object (internal values known by the callback function) to be passed as the callback functions 
 *      customizable arguments map. ie: it's a js object, but can basically be key value pairs so that any callback function can have specific 
 *      values passed to it (this is a solution to work around the fact that we have no great reflection capabilities in js)
 *      ie: an object -> { }
 */
var ExecutableTextButton = function( button_label_text, FontLibrary_FONTDEF, on_push_callback_function, on_push_callback_json_object ){
    
    var DEFAULT_WRAP_WIDTH = 1920;
    
    var m_text = button_label_text;
    var m_callback = on_push_callback_function;
    var m_callback_args = on_push_callback_json_object;
    var m_font_def = FontLibrary_FONTDEF;
    
    var m_root_node = engine.createContainer();
    var m_text_block = engine.createTextBlock( m_text, m_font_def, DEFAULT_WRAP_WIDTH );
        m_root_node.addChild( m_text_block );
        // do we need to set the width of the container here?
        m_root_node.width=400;
        m_root_node.height=50;
        m_root_node.x = 500;
        m_root_node.y = 500;
    
    this.getDisplayNode = function( ){ return m_root_node; }
    
    this.onPush = function( ){ m_callback( m_callback_args ); }
    
    this.logFont = function( ) { Logger.logObj( m_text_block ); }
    
    this.getWidth = function( ){ return m_text_block.width; }
    
    this.setX = function( x ){ m_text_block.x = x; }
    
    this.getX = function( ){ return m_text_block.x; }
    
//    this.updateFontDef = function( ){
//        m_text_block.
//    }
    
    
    
}