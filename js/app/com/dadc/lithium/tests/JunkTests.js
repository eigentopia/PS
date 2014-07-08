include( "js/app/com/dadc/lithium/model/UnitTests.js" );



var JunkTests = function() {
    var m_unitTests;
    // TEST - QUERY THE MODEL, AND DRAW A WIDGET TO THE SCREEN
    this.runTests = function(){
        m_unitTests = new UnitTests();
        m_unitTests.runTests();
    }
}