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
  // const userCoordinates = {};
  const allMerchants = [];
  let keywordQuery;
  let locationQuery;
  let currentMerchants;

  // UTILITY FUNCTIONS //
  const limitResults = function() {
    currentMerchants = [];

    for (let i = 0; i < 12; i++) {
      currentMerchants.push(allMerchants.shift());
    }
  };

  const renderCard = function(deal) {
    const $colDiv = $('<div>').addClass('col s6 l3');
    const $cardDiv = $('<div>').addClass('card dealcard');

    const $cardImgDiv = $('<div>').addClass('card-image waves-effect waves-block waves-light dealimage');

    let $cardImg;

    if (!deal.image_url) {
      $cardImg = $('<img>').addClass('activator').prop('src', 'assets/404.jpg');
    }
    else {
      $cardImg = $('<img>').addClass('activator').prop('src', deal.image_url);
    }

    $cardImg.prop('onerror', 'this.src ="assets/404.jpg"');
    $cardImg.appendTo($cardImgDiv);

    const $cardContentDiv = $('<div>').addClass('card-content dealcontent lowPad row');
    const $cardSpanOne = $('<span>').addClass('card-title activator grey-text text-darken-4 cardTitle');
    $cardSpanOne.text(deal.short_title.toUpperCase());
    const $vertIcon = $('<i>').addClass('material-icons activator hoverFinger right red-text text-lighten-2');
    const $spacerOne = $('<div>').addClass('col s10 tbMargin');
    const $spacerTwo = $('<div>').addClass('col s1 offset-s1 smallHide');

    $vertIcon.text('more_vert');
    $vertIcon.appendTo($spacerTwo);
    $cardSpanOne.appendTo($spacerOne);
    $spacerOne.appendTo($cardContentDiv);
    $spacerTwo.appendTo($cardContentDiv);

    const $pOne = $('<p>').addClass('col s12');
    const $cardLink = $('<a>').prop('href', deal.untracked_url);

    $cardLink.addClass('cardText').prop('target', '_blank');
    $cardLink.text(`Offered by ${deal.provider_name}`);
    $cardLink.appendTo($pOne);
    $pOne.appendTo($cardContentDiv);

    const $cardRevealDiv = $('<div>').addClass('card-reveal');
    const $cardSpanTwo = $('<span>').addClass('card-title grey-text text-darken-4');

    $cardSpanTwo.text(deal.short_title);
    $cardSpanTwo.appendTo($cardRevealDiv);

    const $pTwo = $('<p>').addClass('cardDescription');

    $pTwo.html(deal.description); // uses innerHTML!!
    $pTwo.appendTo($cardRevealDiv);

    $cardImgDiv.appendTo($cardDiv);
    $cardContentDiv.appendTo($cardDiv);
    $cardRevealDiv.appendTo($cardDiv);
    $cardDiv.appendTo($colDiv);
    $('#deals').append($colDiv);
  };

  // DEFINE AJAX CALL FUNCTION //
  const ajaxCall = function(keyword, location) {
    let url;

    if (!keyword && !location) {
      url = 'https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=50&radius=20&location=seattle'
    }

    const $xhr = $.ajax({
      method: 'GET',
      url: url,
      dataType: 'json'
    });

    $xhr.done((data) => {
      // userCoordinates.lat = geoPos.coords.latitude;
      // userCoordinates.lng = geoPos.coords.longitude;

      for (const object of data.deals) {
        allMerchants.push(object.deal);
      }

      limitResults();

      for (const merchant of currentMerchants) {
        renderCard(merchant);
      }
      console.log(keyword, location);
      console.log(keyword == false);
      console.log(!location && !keyword);
    });
  };

  // GET USER GEOLOCATION //
  // const geoFailure = function(err) {
  //   console.warn(`ERROR (${err.code}): ` + err.message);
  // }
  //
  // const wrapGeo = function(callback) {
  //   navigator.geolocation.getCurrentPosition((pos) => {
  //     callback(pos);
  //   }, geoFailure);
  // }

  $('#submitButton').on('click', (event) => {
    event.preventDefault();

    keywordQuery = $('#keyword').val();
    locationQuery = $('#location').val();

    console.log(keywordQuery, locationQuery);
    ajaxCall(keywordQuery, locationQuery);
  });

  // ajaxCall(keywordQuery, locationQuery);
})();
