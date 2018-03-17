$(document).ready(function () {

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBWYmbtUNLtCfm811R-oh9brTSGoZMc8aw",
  authDomain: "train-2831.firebaseapp.com",
  databaseURL: "https://train-2831.firebaseio.com",
  projectId: "train-2831",
  storageBucket: "train-2831.firebaseio.com",
  messagingSenderId: "777180672621"
};

firebase.initializeApp(config);







var data = firebase.database().ref().child("trains");
var dbObject;


data.on("value", function (snap) {
  dbObject = snap.val();

  var trainKeys = Object.keys(dbObject);

  for (var i = 0; i < trainKeys.length; i++) {
    var trainObj = dbObject[trainKeys[i]];

    console.log("trainObj.firstTime:"+trainObj.firstTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainObj.firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainObj.frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainObj.frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    console.log("2trainObj.firstTime:"+trainObj.firstTime);

    var updateTrain = {
      destination: trainObj.destination,
      firstTime: trainObj.firstTime,
      nextTime: nextTrain.format("hh:mm"),
      frequency: trainObj.frequency,
      minAway: tMinutesTillTrain,
      name: trainObj.name
    }
  
 
  
    firebase.database().ref("trains/" + trainKeys[i]).set(updateTrain);
  

  }

});

data.on("value", function (snap) {
  dbObject = snap.val();
  $("#display").empty();
  var display = "<table><tr><th>Destination</th><th>Frequency</th><th>Minutes Away</th><th>Name</th><th>Arrival Time</th>";
  var trainKeys = Object.keys(dbObject);

  for (var i = 0; i < trainKeys.length; i++) {
    var trainObj = dbObject[trainKeys[i]];
    var trainObjKeys = Object.keys(trainObj);
    display += "<tr>"

    for (var j = 0; j < trainObjKeys.length; j++) {
      if (trainObjKeys[j]!="firstTime") {
        display += "<td>" + trainObj[trainObjKeys[j]] + "</td>";
      }
    }
    display += "</tr>";
  }
  display += "</table>";
  $("#display").append(display);


});






setInterval(function () {

  var trainKeys = Object.keys(dbObject);
  for (var i = 0; i < trainKeys.length; i++) {
    if (dbObject[trainKeys[i]].minAway > 0) {
      firebase.database().ref("trains/" + trainKeys[i] + "/minAway").set(dbObject[trainKeys[i]].minAway - 1);
    } else {
      firebase.database().ref("trains/" + trainKeys[i] + "/minAway").set(dbObject[trainKeys[i]].frequency);
      var arrive = moment(dbObject[trainKeys[i]].firstTime, moment.HTML5_FMT.TIME).add(dbObject[trainKeys[i]].frequency, "minutes").format("hh:mm A");
      console.log("arrive:" + arrive);
      firebase.database().ref("trains/" + trainKeys[i] + "/nextTime").set(arrive);

    }
  }

}, 60000);


$("#submit").on("click", function () {
  var name = $("#trainName").val().trim();
  var dest = $("#destination").val().trim();
  var firstTrain = $("#firstTrain").val();
  var frequency = $("#frequency").val();


  console.log("in on value");

  var newTrain = {
    destination: dest,
    firstTime: firstTrain,
    nextTime: firstTrain,
    frequency: frequency,
    minAway: frequency,
    name: name
  }



  var newObject = "train" + (Object.keys(dbObject).length + 1);

  firebase.database().ref("trains/" + newObject).set(newTrain);


});

function interval(dbObject) {

}

}); //$(document).ready(function ()