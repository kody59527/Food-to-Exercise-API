'use strict';

/* Clears results */

function clearResults() {
  $('.results-list').empty();
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

    $('.results-list').append(`
    <section class='foodEntry'>
    <section class='foodResults'>
      <div class='foodTitle'>
        (<span class='servingNum'>${response.foods[i].serving_qty}</span>) ${foodName}
      </div>
      <div class='foodCalorie'>
        <span class='calNum'>${foodCalories}</span> kcal
      </div>
    </section>
    <section class='exerEntry'>
      <img class='exerPic' src="https://i.imgur.com/EKlFbhO.png" alt="A person doing yoga">
      <p class='exerTitle'>Yoga</p><p><span class='exerMin'>${yogaMinutes}</span> min</p>
    </section>
    <section class='exerEntry'> 
      <img class='exerPic' src="https://i.imgur.com/1oV52Id.png" alt="A person walking">
      <p class='exerTitle'>Walk</p><p><span class='exerMin'>${walkingMinutes}</span> min</p>
    </section>
    <section class='exerEntry'>
      <img class='exerPic' src="https://i.imgur.com/5bEKQlU.png" alt="A person biking">
      <p class='exerTitle'>Bike</p><p><span class='exerMin'>${bikingMinutes}</span> min</p>
    </section>
    <section class='exerEntry'>
      <img class='exerPic' src="https://i.imgur.com/WtzLbvd.png" alt="A person running">
      <p class='exerTitle'>Run</p><p><span class='exerMin'>${runningMinutes}</span> min</p>
    </section>
    </section>`);
  }    
  displayTotalCalories(totalCalories);
}

/* Displays total calories and minute count */

function displayTotalCalories(totalCalories) {
  let totalWalkingMinutes = Math.round((totalCalories / 7.6));
  let totalBikingMinutes = Math.round((totalCalories / 8.2));
  let totalRunningMinutes = Math.round((totalCalories / 13.2));
  let totalYogaMinutes = Math.round((totalCalories / 3));
  $('.results-list').append(`
  <section class='foodEntry'>
  <section class='foodResults'>
    <div class='foodTitle'>
      Total
    </div>
    <div class='foodCalorie'>
      <span class='calNum'>${totalCalories}</span> kcal
    </div>
  </section>
  <section class='exerEntry'>
    <img class='exerPic' src="https://i.imgur.com/EKlFbhO.png" alt="A person doing yoga">
    <p class='exerTitle'>Yoga</p><p><span class='exerMin'>${totalYogaMinutes}</span> min</p>
  </section>
  <section class='exerEntry'> 
    <img class='exerPic' src="https://i.imgur.com/1oV52Id.png" alt="A person walking">
    <p class='exerTitle'>Walk</p><p><span class='exerMin'>${totalWalkingMinutes}</span> min</p>
  </section>
  <section class='exerEntry'>
    <img class='exerPic' src="https://i.imgur.com/5bEKQlU.png" alt="A person biking">
    <p class='exerTitle'>Bike</p><p><span class='exerMin'>${totalBikingMinutes}</span> min</p>
  </section>
  <section class='exerEntry'>
    <img class='exerPic' src="https://i.imgur.com/WtzLbvd.png" alt="A person running">
    <p class='exerTitle'>Run</p><p><span class='exerMin'>${totalRunningMinutes}</span> min</p>
  </section>
  </section>`);
  $('.results-list').removeClass('hidden');
  $('.footer').removeClass('hidden');
}

/* Listens for submit */

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    sendRequest(searchBar);
  });
  scrollToResults();
}

$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

/* POST REQUEST */

function sendRequest(searchBar) {
  let finalInput = `{\n    \"query\": \"${searchBar.value}\"\n}`
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
    $('.results-list').removeClass('hidden');
});
}

function scrollToResults() {
      $('html, body').animate({
          scrollTop: $("#results-list").offset().top
      }, 1000);
  };