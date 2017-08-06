
// Initialize Firebase
var config = {
  	apiKey: "AIzaSyCA5jg1Xl0mLFG1QwJnwXBmLv5pcfoWaPw",
  	authDomain: "trainscheduler-9fde3.firebaseapp.com",
  	databaseURL: "https://trainscheduler-9fde3.firebaseio.com",
	projectId: "trainscheduler-9fde3",
    storageBucket: "",
    messagingSenderId: "599502234352"
};

firebase.initializeApp(config);

//global variables
var database = firebase.database();
var name = "", destination = "", firstTrainTime = "", frequency = "";

//-------------functions--------------------

//get input data and store it in db
function getInputAndStoreInDB() {
	//get input data
	name = $('#train-name').val().trim();
	destination = $('#destination').val().trim();
	firstTrainTime = $('#train-time').val().trim();
	frequency = $('#frequency').val().trim();

	//store in db
	database.ref().push({
		name: name,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency,
		// dateAdded: firebase.database.ServerValue.TIMESTAMP
	});	

	//empty input fields
	$('#train-name, #destination, #train-time, #frequency').val('');
}

//---------------------- execution start ------------------------

$(document).ready(function(){  	

	//click submit event
	$(".btn").on('click', function(event){
		event.preventDefault();
		getInputAndStoreInDB();
	});

	//firebase watcher and initial loader
	database.ref().on("child_added", function(childSnapshot) {
		//calculate next arrival time				
		var firstTime = childSnapshot.val().firstTrainTime;
		var freq = childSnapshot.val().frequency;
		var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "days");
    	console.log(firstTimeConverted);
    	
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    	console.log("DIFFERENCE IN TIME: " + diffTime);
		
	    var tRemainder = diffTime % freq;
	    console.log(tRemainder);

	    // Minute Until Train
	    var minAway = freq - tRemainder;
	    console.log("minAway: " + minAway);

	    // Next Train
	    var nextArrival = moment().add(minAway, "minutes");
	    nextArrival = moment(nextArrival).format("hh:mm");
	    console.log("nextArrival: " + nextArrival);
	    // nextArrival = m

		//display in html
		var createRow = "<tr class='tableRow'><td>" + 
			childSnapshot.val().name + "</td><td>" + 
			childSnapshot.val().destination + "</td><td>" + 
			childSnapshot.val().frequency + "</td><td>" +
			nextArrival + "</td><td>" + 
			minAway + "</td>";

		$('.tableBody').append(createRow);

	}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

})