var Controller = function(){};
Controller.unique_id_counter = 0;

Controller.reserveUniqueID = function(){
	Controller.unique_id_counter++;
	return Controller.unique_id_counter;
};

Controller.PREPARATION_STATUS = {
		STATUS_READY: 1,
		STATUS_ERROR: -1
};