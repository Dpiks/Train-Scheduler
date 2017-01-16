var config = {
      apiKey: "AIzaSyCCA7_luuerDwFjfwKX6olLbemExWL5rhM",
    authDomain: "train-scheduler-aa32c.firebaseapp.com",
    databaseURL: "https://train-scheduler-aa32c.firebaseio.com",
    storageBucket: "train-scheduler-aa32c.appspot.com",
    messagingSenderId: "984681818802"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

var connectionsRef = database.ref("/trains");

$("#add-train-btn").on("click", function (){
	var name = $("#train-name-input").val().trim();
	var destination= $("#destination-input").val().trim();
	var firstTime = $("#first-time-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

	// First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.-->frequency
    // Assume the current time is 3:16 AM....--->currentTime
    //diffTime=currentTime-firstTrainTime-->16min
    //minutes since last train 
    // What time would the next train be...? (Use your brain first)--->train1:3:07;train2:3:14;train3:3:21 
    // It would be 3:21 -- 5 minutes away-->minutesAway=nextArrival-currentTime
	

	firstTrainTime=moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(firstTrainTime);
	//difference between first time and current time 
	var diffTime=moment().diff(moment(firstTrainTime),"minutes");
	//minutes since last train left diffTime%frequency
	var timeApart=diffTime%frequency;
	
	var minutesAway=frequency-timeApart;
	var nextArrival=moment().add(minutesAway,"minutes") ;

	connectionsRef.push({
		name:name,
		destination:destination,
		firstTime:firstTime,
		frequency:frequency,
		nextArrival:nextArrival,
		minutesAway:minutesAway

	});

	return false;
});

connectionsRef.on("child_added", function(childSnapshot) {
	console.log(childSnapshot)
	var trainName = childSnapshot.val().name;
	var trainDestination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().firstTime;
	var trainFrequency = childSnapshot.val().frequency;
	var nextArrival=childSnapshot.val().nextArrival;
	var minutesAway=childSnapshot.val().minutesAway;
	
	

	$("tbody").append("<tr>" + 
		"<td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency +
		"</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

});