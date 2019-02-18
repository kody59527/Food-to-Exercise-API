'use strict';

/* Clears results */

function clearResults() {
  $('.results-list').empty();
  $('.results-title').removeClass('hidden');
  $('.errorMessage').addClass('hidden');
}

/* Appends results and calculates minutes from calories*/

function displayResults(response) {
  let totalCalories = 0;
  for (let i = 0; i < response.foods.length; i++) {

    let foodCalories = Math.round(response.foods[i].nf_calories);
    totalCalories = totalCalories + foodCalories;

    let yogaMinutes = Math.round((foodCalories / 3))
    let walkingMinutes = Math.round((foodCalories / 7.6));
    let bikingMinutes = Math.round((foodCalories / 8.2));
    let runningMinutes = Math.round((foodCalories / 13.2));
    let foodName = response.foods[i].food_name.charAt(0).toUpperCase() + response.foods[i].food_name.slice(1);
    console.log(`${i} out of ${response.foods.length}`);

    $('.results-list').append(`<h3>(${response.foods[i].serving_qty}) ${foodName}: ${foodCalories} kcal</h3>
    <p>Hatha Yoga: ${yogaMinutes} min</p> 
    <p>Walking: ${walkingMinutes} min</p>
    <p>Biking: ${bikingMinutes} min</p>
    <p>Running: ${runningMinutes} min</p>`);
  }    
  displayTotalCalories(totalCalories);
}

/* Displays total calories and minute count */

function displayTotalCalories(totalCalories) {
  let totalWalkingMinutes = Math.round((totalCalories / 7.6));
  let totalBikingMinutes = Math.round((totalCalories / 8.2));
  let totalRunningMinutes = Math.round((totalCalories / 13.2));
  let totalYogaMinutes = Math.round((totalCalories / 3));
  $('.results-list').append(`<h3>Total: ${totalCalories} kcal</h3>
  <p>Hatha Yoga: ${totalYogaMinutes} min</p> 
  <p>Walking: ${totalWalkingMinutes} min</p>
  <p>Biking: ${totalBikingMinutes} min</p>
  <p>Running: ${totalRunningMinutes} min</p>`);
  $('.results').removeClass('hidden');
  scrollToResults();
}

/* Listens for submit */

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    sendRequest(foodInput);
  });
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

/* POST REQUEST */

function sendRequest(foodInput) {
  let finalInput = `{\n    \"query\": \"${foodInput.value}\"\n}`
  clearResults();

  let settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://trackapi.nutritionix.com/v2/natural/nutrients",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "x-app-id": "b55b7c9e",
      "x-app-key": "bb03ea62701acc02eb82854413de171d",
      "cache-control": "no-cache",
      "Postman-Token": "8ee0afb1-0b68-405d-a30c-819a625d6964"
    },
    "processData": false,
    "data": "{}"
  }

  settings.data = finalInput;
  console.log(settings);

  $.ajax(settings).done(function (response) {
    console.log(response);
    displayResults(response);
  });

  $.ajax(settings).fail(function (err) {
    console.log(err)
    $('.results-list').empty();
    $('.errorMessage').replaceWith(`<p class='errorMessage'>${err.status} ${err.responseJSON.message}</p>`);
    $('.results-title').addClass('hidden');
    $('.results').removeClass('hidden');
});
}

function scrollToResults() {
      $('html, body').animate({
          scrollTop: $("#results-list").offset().top
      }, 1000);
  };