


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBWYmbtUNLtCfm811R-oh9brTSGoZMc8aw",
    authDomain: "train-2831.firebaseapp.com",
    databaseURL: "https://train-2831.firebaseio.com",
    projectId: "train-2831",
    storageBucket: "",
    messagingSenderId: "777180672621"
  };

  firebase.initializeApp(config);

  var data = firebase.database().ref().child("trains");
  var dbObject;
  $(data).on("value", function(snap){
    dbObject = snap.val();
    var display = "<table><tr><th>Destination</th><th>Arrival Time</th><th>Frequency</th><th>Minutes Away</th><th>Name</th>";
    //get obj keys, loop obj, 
  });

  $("#submit").on("click", function () {
      var name = $("#trainName").val().trim();
      var dest = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val();
      var frequency = $("#frequency").val();

      var newTrain = {
          destination: dest,
          firstTime: firstTrain,
          frequency: frequency,
          minAway: frequency,
          name: name
      }
      
      var newObject = "train2" // + Object.keys(dbObject).length + 1;

      firebase.database().ref("trains/" + newObject).set(newTrain);


  }); 


  console.log(data);
  
  // Assume the following situations.

  // (TEST 1)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 3 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Use your brain first)
  // It would be 3:18 -- 2 minutes away

  // (TEST 2)
  // First Train of the Day is 3:00 AM
  // Assume Train comes every 7 minutes.
  // Assume the current time is 3:16 AM....
  // What time would the next train be...? (Use your brain first)
  // It would be 3:21 -- 5 minutes away


  // ==========================================================

  // Solved Mathematically
  // Test case 1:
  // 16 - 00 = 16
  // 16 % 3 = 1 (Modulus is the remainder)
  // 3 - 1 = 2 minutes away
  // 2 + 3:16 = 3:18 

  // Solved Mathematically
  // Test case 2:
  // 16 - 00 = 16
  // 16 % 7 = 2 (Modulus is the remainder)
  // 7 - 2 = 5 minutes away
  // 5 + 3:16 = 3:21

  // Assumptions
  var tFrequency = 3;

  // Time is 3:30 AM
  var firstTime = "03:30";

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

