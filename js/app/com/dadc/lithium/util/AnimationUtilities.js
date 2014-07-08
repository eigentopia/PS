var AnimationUtilities = function(){
    
    
    this.getXSinePosition = function( start_x, end_x, time_now, time_duration ){
        var freq = Math.PI / ( 2 * time_duration );
        var t = Math.abs( Math.sin( time_now * freq ) );
        return Math.round( t * ( end_x - start_x ) + start_x );
    }


    this.getXPosition = function( start_x, end_x, time_now, time_duration ){
        var d3 = time_duration * time_duration * time_duration;
        var t3 = time_now * time_now * time_now;
        return Math.round( ( ( end_x - start_x ) * Math.abs( t3 / d3 ) ) + start_x );
    }
    

    
    
    
    this.tweenLinearPosition = function( time, beginning_x, end_x, duration ){
        return end_x*time/duration + beginning_x;
    }

}

var AnimationUtilitiesInstance = new AnimationUtilities();
