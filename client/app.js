function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
          return parseInt(uiBathrooms[i].value);
      }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
          return parseInt(uiBHK[i].value);
      }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  console.log("Selected values:", {
      sqft: sqft.value,
      bhk: bhk,
      bathrooms: bathrooms,
      location: location.value
  });

  // Input validation
  if (sqft.value.trim() === "" || isNaN(parseFloat(sqft.value))) {
      alert("Please enter a valid Square Feet value");
      return;
  }
  
  if (location.value === "") {
      alert("Please select a location");
      return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price";
  console.log("Sending POST request to:", url);

  $.ajax({
      url: url,
      type: "POST",
      data: {
          total_sqft: parseFloat(sqft.value),
          bhk: bhk,
          bath: bathrooms,
          location: location.value
      },
      dataType: "json",
      crossDomain: true,
      success: function(data, status) {
          console.log("API Response:", data);
          console.log("Status:", status);
          if (data && data.estimated_price !== undefined) {
              estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
          } else {
              console.error("Invalid response format:", data);
              estPrice.innerHTML = "<h2>Error: Could not get estimate</h2>";
          }
      },
      error: function(xhr, status, error) {
          console.error("Error in API call:", error);
          console.error("Status:", status);
          console.error("Response:", xhr.responseText);
          alert("Failed to get estimated price. Please check console for details.");
      }
  });
}

function loadLocations() {
  console.log("Loading locations...");
  var url = "http://127.0.0.1:5000/get_location_names";
  console.log("Sending GET request to:", url);
  
  // For testing, add a timestamp to prevent caching
  var nocacheUrl = url + "?nocache=" + new Date().getTime();
  
  $.ajax({
      url: nocacheUrl,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      success: function(data, status) {
          console.log("Location API Response:", data);
          console.log("Status:", status);
          
          if (data && data.locations) {
              var locations = data.locations;
              var uiLocations = document.getElementById("uiLocations");
              $('#uiLocations').empty();
              
              // Add the default option back
              $('#uiLocations').append('<option value="" disabled selected>Choose a Location</option>');
              
              // Add all locations from the API
              for (var i = 0; i < locations.length; i++) {
                  var opt = new Option(locations[i], locations[i]);
                  $('#uiLocations').append(opt);
              }
              console.log("Loaded " + locations.length + " locations");
          } else {
              console.error("No locations data received or invalid format:", data);
              $('#uiLocations').empty();
              $('#uiLocations').append('<option value="" disabled selected>Error loading locations</option>');
          }
      },
      error: function(xhr, status, error) {
          console.error("Error loading locations:", error);
          console.error("Status:", status);
          console.error("Response:", xhr.responseText);
          $('#uiLocations').empty();
          $('#uiLocations').append('<option value="" disabled selected>Error loading locations</option>');
          alert("Failed to load locations. Please check console for details.");
      }
  });
}

// Prevent form submission
function setupFormHandling() {
  document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();
      return false;
  });
}

function onPageLoad() {
  console.log("document loaded");
  setupFormHandling();
  loadLocations(); // Load locations immediately
}

window.onload = onPageLoad;