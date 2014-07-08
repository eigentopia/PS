/**
 * Represent a menu item
 * 
 * @param text The text to be displayed
 * @param icon Optional icon image
 * @param callback_func Call back function
 * @param callback_args Call back function arguments
 */
var MenuItem = function( text, icon, callback_func, callback_args ){
    var m_text = text;
    var m_icon = icon;
    var m_callback_func = callback_func;
    var m_callback_args = callback_args;
    
    this.getText = function(){ return m_text; };
    this.getIcon = function(){ return m_icon; };
    this.getCallbackFunc = function(){ return m_callback_func; };
    this.getCallbackArgs = function(){ return m_callback_args; };
    
}