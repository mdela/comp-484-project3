
var map;
var locations = [
    { name: "Bookstein Hall", lat: 34.24194644228398, lng: -118.53080110216756 },
    { name: "Jacaranda Hall", lat: 34.24112498393169, lng: -118.52892553483446 },
    { name: "University Student Union", lat: 34.240229375048614, lng: -118.52708105984112 },
    { name: "Campus Store Complex", lat: 34.23738914646171, lng: -118.52817427972644 },
    { name: "Oviatt Library", lat: 34.24015283546734, lng: -118.52930719156889 }
];

var quizIndex = 0; // Index to track the current quiz question
var promptElement; // Declare promptElement at a higher scope
var score = 0; // Variable to track the score
var circles = []; // Array to store circles

// Function to check if the clicked point is within an acceptable range of the current location
function checkIfCorrect(clickedLatLng) {
    var tolerance = 100; // Adjust as needed

    // Check the current quiz question's location
    var currentLocation = locations[quizIndex];

    // Compute the distance between the clicked point and the location
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        clickedLatLng
    );

    // If the distance is within the tolerance, consider it correct
    return distance < tolerance;
}

// Function to initialize the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 34.2419, lng: -118.5282 }, // CSUN's coordinates
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        gestureHandling: 'none',
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'on' }] },
            { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'on' }] },
            { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'on' }] },
        ],
    });

    promptElement = document.getElementById('prompt'); // Assign the prompt element
}

// Function to start the quiz
function startQuiz() {
    // Reset quizIndex to start from the beginning
    quizIndex = 0;
    score = 0; // Reset the score

    // Hide the "Start Quiz" button
    document.getElementById('startButton').style.display = 'none';

    // Display the first question
    askQuestion();
}

// Function to ask a question
function askQuestion() {
    var currentLocation = locations[quizIndex];

    // Display the question
    promptElement.innerText = "Where is " + currentLocation.name + " located?";

    // Attach a click event listener to the map for answering the question
    google.maps.event.addListenerOnce(map, 'click', function(e) {
        handleAnswer(e.latLng);
    });

    // Check if the quiz is complete to display the "Start Quiz" button
    if (quizIndex >= locations.length) {
        document.getElementById('startButton').style.display = 'block';
    }
}

// Function to handle the user's answer
function handleAnswer(clickedLatLng) {
    playSound('vineSound');

    var currentLocation = locations[quizIndex];
    var isCorrect = checkIfCorrect(clickedLatLng);

    // Display feedback based on the correctness of the answer
    if (isCorrect) {
        promptElement.innerText = "Correct! Click 'Next Question' to continue.";
        score++; // Increment the score for a correct answer
        playSound('goodSound');
    } else {
        promptElement.innerText = "Incorrect. Try again.";
        playSound('badSound');
    }

    // Mark where the user clicked
    addMarker(clickedLatLng);

    // Update the map to highlight the correct or incorrect area
    highlightArea(isCorrect);

    // Move to the next question
    quizIndex++;

    // Check if there are more questions
    if (quizIndex < locations.length) {
        // Ask the next question
        askQuestion();
    } else {
        // Quiz completed
        promptElement.innerText = "Quiz complete. Your score is: " + score + " out of " + locations.length;
    }
}

// Function to highlight the correct or incorrect area on the map
function highlightArea(isCorrect) {
    var currentLocation = locations[quizIndex];

    // Create a circle overlay for the correct or incorrect area
    var circle = new google.maps.Circle({
        center: { lat: currentLocation.lat, lng: currentLocation.lng },
        radius: 100, // Adjust the radius as needed
        map: map,
        fillColor: isCorrect ? 'green' : 'red',
        fillOpacity: 0.5,
        strokeWeight: 0
    });

    // Add the circle to the array
    circles.push(circle);

    // Remove the circle after a short delay
    setTimeout(function () {
        // Remove the circle from the array, but keep it on the map
        var index = circles.indexOf(circle);
        if (index !== -1) {
            circles.splice(index, 1);
        }
    }, 1500); // Adjust the delay as needed
}

// Function to play a sound by its audio ID
function playSound(audioId) {
    var audio = document.getElementById(audioId);
    audio.currentTime = 0;
    audio.play();
}

// Function to add a marker at a specified location on the map
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Clicked Location',
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });
}
