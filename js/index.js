(function() {
  'use strict';

  // MATERIALIZE INIT //
  $(document).ready(() => {
    $('.parallax').parallax();
  });

  $(document).ready(() => {
    $('.collapsible').collapsible();
  });

  $(document).ready(function() {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 50});
  });

  const notVisited = JSON.parse(localStorage.getItem('notVisited')) || true;
  localStorage.removeItem('notVisited');
  // localStorage.setItem('notVisited', JSON.stringify(true));

  if (notVisited) {
    localStorage.setItem('notVisited', JSON.stringify(false));
  }
  else {
    return;
  }


  // MAKE INITIAL AJAX CALL //
  let currentDeals = [];
  const userPosition = {};

  const makeInitialCall = function(posInfo) {
    userPosition.lat = posInfo.coords.latitude;
    userPosition.lng = posInfo.coords.longitude;

    const $xhr = $.ajax({
      method: 'GET',
      url: `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=10&location=${userPosition.lat},${userPosition.lng}`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      if ($xhr.status !== 200) {
        return;
      }

      const locationCoordinates = [];

      for (const location of data.deals) {
        currentDeals.push(location.deal);
        locationNames.push(location.deal.merchant.name);

        const coord = {
          lat: location.deal.merchant.latitude,
          lng: location.deal.merchant.longitude
        };

        locationCoordinates.push(coord);
        createCard(location.deal);
      }
      generateMap(currentDeals, locationCoordinates);
    });

    $xhr.fail((err) => {
      console.error(err);
    });
  }

  // BROWSER GEOLOCATION //
  const geoFailure = function(err) {
    console.warn(`ERROR (${err.code}): ` + err.message);
  }

  const wrapLocation = function(cb) {
    navigator.geolocation.getCurrentPosition((pos) => {
      cb(pos);
    }, geoFailure);
  };

  wrapLocation(makeInitialCall)

  // CREATE DEAL CARD FUNCTION //
  const createCard = function(deal) {
    const $colDiv = $('<div>').addClass('col s6 l3');
    const $cardDiv = $('<div>').addClass('card dealcard');

    const $cardImgDiv = $('<div>').addClass('card-image waves-effect waves-block waves-light dealimage');
    const $cardImg = $('<img>').addClass('activator').prop('src', deal.image_url);

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

    $cardLink.addClass('cardText');
    $cardLink.text(`Offered by ${deal.provider_name}`);
    $cardLink.appendTo($pOne);
    $pOne.appendTo($cardContentDiv);

    const $cardRevealDiv = $('<div>').addClass('card-reveal');
    const $cardSpanTwo = $('<span>').addClass('card-title grey-text text-darken-4');

    $cardSpanTwo.text(deal.short_title);
    $cardSpanTwo.appendTo($cardRevealDiv);

    const $pTwo = $('<p>').addClass('cardDescription');

    $pTwo.html(deal.description);
    $pTwo.appendTo($cardRevealDiv);

    $cardImgDiv.appendTo($cardDiv);
    $cardContentDiv.appendTo($cardDiv);
    $cardRevealDiv.appendTo($cardDiv);
    $cardDiv.appendTo($colDiv);
    $('#deals').append($colDiv);
  };

  // MARKER & INFOWINDOW COMPONENTS //
  const mapLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let locationNames = [];
  let labelIndex;
  let namesIndex;

  // POPULATE GOOGLE MAP //
  const generateMap = function(arrayOfDeals, arrayOfCoordinates) {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: userPosition
    });

    labelIndex = 0;
    namesIndex = 0;

    for (let i = 0; i < arrayOfDeals.length; i++) {
      const contentString = '<div class="infoContainer">' + '<div><h2 class="infoTitle">' + arrayOfDeals[i].short_title + '</h2></div><div"><a href="' + arrayOfDeals[i].untracked_url + '" class="infoLink" target="_blank">Offered by ' + arrayOfDeals[i].provider_name + '<span><i class="material-icons infoIcon">add_shopping_cart</i></span></a>' + '<span>|</span><a href="' + arrayOfDeals[i].merchant.url + '">' + arrayOfDeals[i].merchant.name + '<span><i class="material-icons infoIcon">domain</i></span></a></div><div class="infoDescription">' + arrayOfDeals[i].description + '</div></div>';

      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      const marker = new google.maps.Marker({
        position: arrayOfCoordinates[i],
        label: mapLabels[labelIndex++ % mapLabels.length],
        title: locationNames[namesIndex++ % locationNames.length],
        map: map
      });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    }

    const user = new google.maps.Marker({
      position: userPosition,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6
      },
      draggable: false,
      map: map
    });
  };

  // SEARCH BAR REQUEST //
  const $search = $('#submitButton');

  $search.on('click', (event) => {
    event.preventDefault();

    const $userQuery = $('#userQuery').val();

    const $xhrSearch = $.ajax({
      method: 'GET',
      url: `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=10&location=${userPosition.lat},${userPosition.lng}&query=${$userQuery}`,
      dataType: 'json'
    });

    $xhrSearch.done((data) => {
      if ($xhrSearch.status !== 200) {
        return;
      }

      currentDeals = [];
      locationNames = [];

      const userLocationCoordinates = [];

      $('#deals').empty();

      for (const location of data.deals) {
        currentDeals.push(location.deal);
        locationNames.push(location.deal.merchant.name);

        const userCoord = {
          lat: location.deal.merchant.latitude,
          lng: location.deal.merchant.longitude
        };

        userLocationCoordinates.push(userCoord);
        createCard(location.deal);
      }
      generateMap(currentDeals, userLocationCoordinates);
    });

    $xhrSearch.fail((err) => {
      console.error(err);
    });
  });

  // PAGINATION REQUESTS //
  const pageAjax = function(userQuery, page) {
    let ajaxURL;

    if (userQuery) {
      ajaxURL = `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&page=${page}&radius=10&location=${userPosition.lat},${userPosition.lng}&query=${userQuery}`;
    }
    else {
      ajaxURL = `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&page=${page}&radius=10&location=${userPosition.lat},${userPosition.lng}`;
    }

    const $xhrPage = $.ajax({
      method: 'GET',
      url: ajaxURL,
      dataType: 'json'
    });

    $xhrPage.done((data) => {
      if ($xhrPage.status !== 200) {
        return;
      }

      const userLocationCoordinates = [];

      currentDeals = [];
      locationNames = [];

      $('#deals').empty();
      for (const location of data.deals) {
        currentDeals.push(location.deal);
        locationNames.push(location.deal.merchant.name);
        const userCoord = {
          lat: location.deal.merchant.latitude,
          lng: location.deal.merchant.longitude
        };

        userLocationCoordinates.push(userCoord);
        createCard(location.deal);
      }
      generateMap(currentDeals, userLocationCoordinates);
    });
  };

  let currentPageID = 'page1';

  $('.page').on('click', (event) => {
    const $target = $(event.target);
    const $userQuery = $('#userQuery').val();
    const pageNumber = $target.text();

    $(`#${currentPageID}`).parent().removeClass('active');

    $target.parent().addClass('active');
    currentPageID = $target.prop('id');

    pageAjax($userQuery, pageNumber);
  });
})();
