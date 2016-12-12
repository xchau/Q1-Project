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
  const initialToast = function() {
    if (document.cookie.indexOf('visited') >= 0) {
      const howMessage = 'Enter a search term and/or location to get started';
      const xtraMessage = 'Be sure to check out the map and deals tabs to view the deals near you!';

      Materialize.toast(howMessage, 6000);
      setTimeout(Materialize.toast(xtraMessage, 6000), 3000);
    }
    else {
      document.cookie = 'visited';
    }
  };

  initialToast();

  // GET USER GEOLOCATION //
  const userCoordinates = {};

  const geoFailure = function(err) {
    console.warn(`ERROR (${err.code}): ` + err.message);
  };

  const geoSuccess = function(pos) {
    userCoordinates.lat = pos.coords.latitude;
    userCoordinates.lng = pos.coords.longitude;
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);

  // DEFINE DATA STRUCTURES //
  const userCoordinates = {};
  let allMerchants;
  let keywordQuery;
  let locationQuery;
  let currentMerchants;

  // UTILITY FUNCTIONS //
  const limitResults = function() {
    currentMerchants = [];

    for (let i = 0; i < 12; i++) {
      if (allMerchants[i]) {
        currentMerchants.push(allMerchants.shift());
      }
    }
  };

  const reportResults = function() {
    if (allMerchants.length === 0) {
      Materialize.toast('0 results found.', 2000);
    }
    else {
      const resultsTotal = allMerchants.length;
      const resultsMsg = `${resultsTotal} results found.`;

      Materialize.toast(resultsMsg, 2000);
    }
  };

  const mapLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const renderMap = function(arrayOfDeals) {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: currentMerchants[0].coords
    });

    for (let i = 0; i < arrayOfDeals.length; i++) {
      const contentString = '<div class="infoContainer">' + '<div><h2 class="infoTitle">' + arrayOfDeals[i].short_title + '</h2></div><div"><a href="' + arrayOfDeals[i].untracked_url + '" class="infoLink" target="_blank">Offered by ' + arrayOfDeals[i].provider_name + '<span><i class="material-icons infoIcon">add_shopping_cart</i></span></a>' + '<span>|</span><a href="' + arrayOfDeals[i].merchant.url + '" target="_blank">' + arrayOfDeals[i].merchant.name + '<span><i class="material-icons infoIcon">domain</i></span></a></div><div class="infoDescription">' + arrayOfDeals[i].description + '</div></div>';

      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      const marker = new google.maps.Marker({
        position: arrayOfDeals[i].coords,
        label: mapLabels[i],
        title: arrayOfDeals[i].merchant.name,
        map: map
      });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
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
    const $linksDiv = $('<div>');
    const $endLinkOne = $('<a>').addClass('infoLink').prop('target', '_blank');
    const $pipe = $('<span>').text(' | ');
    const $endLinkTwo = $('<a>').prop('target', '_blank');

    $pTwo.html(deal.description); // uses innerHTML!!
    $pTwo.appendTo($cardRevealDiv);

    $endLinkOne.prop('href', deal.untracked_url);
    $endLinkTwo.prop('href', deal.merchant.url);
    $endLinkOne.text('Offered by ' + deal.provider_name).appendTo($linksDiv);
    $pipe.appendTo($linksDiv);
    $endLinkTwo.text(deal.merchant.name).appendTo($linksDiv);
    $linksDiv.appendTo($cardRevealDiv);

    $cardImgDiv.appendTo($cardDiv);
    $cardContentDiv.appendTo($cardDiv);
    $cardRevealDiv.appendTo($cardDiv);
    $cardDiv.appendTo($colDiv);
    $('#deals').append($colDiv);
  };

  // DEFINE AJAX CALL FUNCTION //
  const ajaxCall = function(keyword, location, reportCB) {
    let url;

    if (!keyword && !location) {
      url = 'https://cors-anywhere.herokuapp.com/https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events&per_page=50&radius=20&location=seattle';
    }
    else if (!location) {
      url = `https://cors-anywhere.herokuapp.com/https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events&per_page=50&radius=20&location=seattle&query=${keyword}`;
    }
    else if (!keyword) {
      url = `https://cors-anywhere.herokuapp.com/https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events&per_page=50&radius=20&location=${location}`;
    }
    else {
      url = `https://cors-anywhere.herokuapp.com/https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events&per_page=50&radius=20&location=${location}&query=${keyword}`;
    }

    const $xhr = $.ajax({
      method: 'GET',
      url: url,
      dataType: 'json'
    });

    $xhr.done((data) => {
      allMerchants = [];

      for (const object of data.deals) {
        allMerchants.push(object.deal);
      }

      for (const merch of allMerchants) {
        merch.coords = {
          lat: merch.merchant.latitude,
          lng: merch.merchant.longitude
        };
      }

      if (reportCB) {
        reportCB();
      }

      limitResults();
      renderMap(currentMerchants);

      for (const merchant of currentMerchants) {
        renderCard(merchant);
      }
    });

    $xhr.fail((err) => {
      console.error('Big Problem: ', err);
    });
  };

  $('#submitButton').on('click', (event) => {
    event.preventDefault();

    keywordQuery = $('#keyword').val().replace(/( )/g, '+');
    locationQuery = $('#location').val().replace(/( )/g, '+');

    if (!keywordQuery && !locationQuery) {
      Materialize.toast('Don\'t forget your search parameters!', 3000);

      return;
    }

    $('#deals').empty();
    ajaxCall(keywordQuery, locationQuery, reportResults);
  });

  // ALLOWS USER TO LOAD MORE RESULTS //
  const loadMore = function() {
    $('#deals').empty();
    limitResults();
    renderMap(currentMerchants);

    for (const merchant of currentMerchants) {
      renderCard(merchant);
    }
  };

  $('.moreButton').on('click', () => {
    loadMore();
  });

  ajaxCall(keywordQuery, locationQuery);
})();
