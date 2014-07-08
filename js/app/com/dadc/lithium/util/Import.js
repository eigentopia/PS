var Import = function() {

    this.model = function( model_name ){
        include( "js/app/com/dadc/lithium/mlb/model/" + model_name + ".js" );
    }

    this.widget = function( widget_name ){
        include( "js/app/com/dadc/lithium/mlb/view/widgets/" + widget_name + ".js" );
    }

    this.test = function( test_name ){
        include( "js/app/com/dadc/lithium/tests/" + test_name + ".js" );
    }

}

var Import = new Import();
