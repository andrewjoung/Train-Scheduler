// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyCNHMrPxO4jsPeXxlYLfZwbnPUI2IgL-8w",
authDomain: "train-scheduler-e24ec.firebaseapp.com",
databaseURL: "https://train-scheduler-e24ec.firebaseio.com",
projectId: "train-scheduler-e24ec",
storageBucket: "",
messagingSenderId: "410243896804",
appId: "1:410243896804:web:453be14489758a93"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//this is the call back method that fires 1) when the page is loaded and 2) whenever a new child is add 
// 1) when the page is loaded, it will go through every child element in the database and perform the tasks we specify in the function
// 2) OR when a child is added, it will perform the tasks specified in the function 
database.ref().on("child_added", function(snapshot){
    
    
    var trainDiv = $("<div>").addClass("row"); //we create a new div element and give it a class of row so that it will behave as a bootsrap row
    
    //create divs for all the information we have to display in the HTML and then add class col so it is styled by bootstraip
    var trainNameDiv = $("<div>").addClass("col-2");
    var destinationDiv = $("<div>").addClass("col-2");
    var timeDiv = $("<div>").addClass("col-2");
    var frequencyDiv = $("<div>").addClass("col-2");
    var nextArrivalDiv = $("<div>").addClass("col-2");
    var minutesAwayDiv = $("<div>").addClass("col-2");

    // 1) on load, this will be each child user element
    // 2) the new child that was added 
    var user = snapshot.val();

    //we set the text of the name, role, start date, and rate div to the respective key/value pairs we can find in our database 
    trainNameDiv.text(user.train);
    destinationDiv.text(user.destination);
    timeDiv.text(user.time);
    frequencyDiv.text(user.frequency);

    var frequencyNum = user.frequency;

    var firstTime = user.time;
    //console.log(firstTime);
    //console.log(typeof(firstTime));

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    //console.log(firstTimeConverted);
    
    var currentTime = moment();

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("difference in time " + diffTime);

    var tRemainder = diffTime % frequencyNum;
    //console.log(tRemainder);

    var minutesTillTrain = frequencyNum - tRemainder;
    //console.log(minutesTillTrain);
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    //var nextTrainString = moment(nextTrain).format("hh:MM");
    //console.log(nextTrain);
    nextArrivalDiv.text(moment(nextTrain).format("hh:mm"));
    minutesAwayDiv.text(minutesTillTrain);

    //append the row to the table
    trainDiv.append(trainNameDiv).append(destinationDiv).append(timeDiv).append(frequencyDiv).append(nextArrivalDiv).append(minutesAwayDiv);
    $("#trainTable").append(trainDiv);
});


//jQuery select the submit button with id #submitButton from html
//add a click handler that fires a function whenver the submit button is pressed
//the main function we want is to upload data onto firebase
$("#submitButton").on("click", function(event){
    
    //prevents the page from refreshing
    event.preventDefault();

    //we grab all the values from the input fields using the jQuery selctors
    var trainInput = $("#trainName").val().trim(); //grab value from name input field 
    var destinationInput = $("#destination").val().trim(); //grab value from the role input field
    var timeInput = $("#firstTime").val().trim(); //grab the date
    var frequencyInput = $("#frequency").val().trim(); // grabe the monthly rate

    console.log(timeInput);

    //formatNumber(rateInput);

    //this if statement ensures that all fields have been filled out, otherwise it will alert the user they have not filled out all fields
    if(trainInput === "" || destinationInput === "" || timeInput === "" || frequencyInput === "") {
        alert("Please fill in all of the information");
    } else {

        //we grab the database we intantiated above (var database = firebase.database)
        //this is the database we are working with
        //.ref() gives us a refrence to the root directory of the database 
        //.push() will "push" or add a new Object into the root directory, this is basically like appending 
        //the stuff on the left side are all keys (name, role, date, rate) and we set them equal to the values we grabbed from the input field above 
        database.ref().push({
            train: trainInput,
            destination: destinationInput,
            time: timeInput,
            frequency: frequencyInput
        });

        //this just clears the values the user input into the input fields 
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTime").val("");
        $("#frequency").val("");

    }

}); 