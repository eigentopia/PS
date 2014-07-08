function assertEquals(expected, actual)
{	
  if(!(expected == actual)){
     console.log("Test failed: " + " " + expected + " " + "not equal to " + actual );
     return false;
 }
 else {
     console.log("Test Passed: " + " " + expected + " " + " equal to " + actual );         
     return true;}
}

function assertNotNull( object ){
    if ( !object ){
        console.log( 'Assert failed. Object is null' );
        engine.shutdown();
        return false;
    }
    
    return true;
}