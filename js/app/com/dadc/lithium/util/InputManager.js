var InputManager = function(){
    var This = this;
    
    this.currentKey = undefined;
    this.isKeyPressed = false;
    var m_currently_pressed_key = undefined;
    var m_last_pressed_key = undefined;
    
    this.frameStarted = function(){

    }
    
    this.frameEnded = function(){
        currentKey = undefined;
        isKeyPressed=false
    }
    
    this.onAnalogMove = function( id, x, y ){
        
    }
    
    this.onKey = function( keyObj ){
        keyObj.onEnd = This.onKeyEnd;
        Logger.log( "onkey: " + keyObj.name );
        if( keyObj.name == undefined )
            currentKey = undefined;
        else{
            m_currently_pressed_key = keyObj.name;
            This.currentKey = keyObj;
            m_last_pressed_key = keyObj.name;
            isKeyPressed=true
        }
    }
    this.onKeyEnd = function(){
        m_currently_pressed_key = undefined;
        isKeyPressed=false
    }
    this.isKeyCurrentlyPressed = function(){
        return ( m_currently_pressed_key != undefined );
    }
    this.getCurrentlyPressedKey = function(){
        return m_currently_pressed_key;
    }
    this.getLastPressedKey = function(){
        return m_last_pressed_key;
    }
    

    
    
    
    
    
}

var InputManager = new InputManager();