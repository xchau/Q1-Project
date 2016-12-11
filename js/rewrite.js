(function() {
  'use strict';

  // MATERIALIZE INIT //
  $(document).ready(() => {
    $('.parallax').parallax();
  });

  $(document).ready(() => {
    $('.collapsible').collapsible();
  });

  $(document).ready(() => {
    $('.modal').modal();
  });

  $(document).ready(() => {
    $('.tooltipped').tooltip({ delay: 50 });
  });

  // INITIAL HELP TOAST BASED ON LOCALSTORAGE VALUE //
  const notVisited = JSON.parse(localStorage.getItem('notVisited')) || true;

  localStorage.removeItem('notVisited');
  localStorage.setItem('notVisited', JSON.stringify(true));

  if (notVisited) {
    localStorage.setItem('notVisited', JSON.stringify(false));
  }
  else {
    const helpMessage = 'Check out the map below to see the deals near you!';

    Materialize.toast(helpMessage, 6000);
  }

  // DEFINE DATA STRUCTURES //
  const userCoordinates = {};
  let keywordQuery;
  let locationQuery;
  let merchants = [];

  // DEFINE AJAX CALL FUNCTION //
  const ajaxCall = function(url, geoPos, keyword, location) {
    const $xhr = $.ajax({
      method: 'GET',
      url: url,
      dataType: 'json'
    });

    $xhr.done((data) => {
      // userCoordinates.lat = geoPos.coords.latitude;
      // userCoordinates.lng = geoPos.coords.longitude;

      console.log(keyword, location, geoPos);

      for (const object of data.deals) {
        merchants.push(object.deal);
      }
      console.log(merchants);
    });
  }

  // GET USER GEOLOCATION //
  const geoFailure = function(err) {
    console.warn(`ERROR (${err.code}): ` + err.message);
  }

  const wrapGeo = function(callback) {
    navigator.geolocation.getCurrentPosition((pos) => {
      callback(pos);
    }, geoFailure);
  }

  $('#submitButton').on('click', (event) => {
    event.preventDefault();

    keywordQuery = $('#keyword').val();
    locationQuery = $('#location').val();

    console.log(keywordQuery, locationQuery);
  });

  ajaxCall(`https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=20&location=98198`, 'abc');
})();
