(function() {
  'use strict';

  // MATERIALIZE PARALLAX
  $(document).ready(() => {
    $('.parallax').parallax();
  });

  const createHotCard = function(deals) {
    // card element
    const $colDiv = $('<div>').addClass('col s3');
    const $cardDiv = $('<div>').addClass('card dealcard');

    // card image
    const $cardImgDiv = $('<div>').addClass('card-image waves-effect waves-block waves-light dealimage');
    const $cardImg = $('<img>').addClass('activator').prop('src', deals.image_url);

    $cardImg.prop('onerror', 'this.src ="assets/404.jpg"');
    $cardImg.appendTo($cardImgDiv);

    // card content
    const $cardContentDiv = $('<div>').addClass('card-content dealcontent lowPad row');
    const $cardSpanOne = $('<span>').addClass('card-title activator grey-text text-darken-4 cardTitle');
    $cardSpanOne.text(deals.short_title.toUpperCase());
    const $vertIcon = $('<i>').addClass('material-icons activator hoverFinger right');
    const $spacerOne = $('<div>').addClass('col s10 tbMargin');
    const $spacerTwo = $('<div>').addClass('col s1 offset-s1');

    $vertIcon.text('more_vert');
    $vertIcon.appendTo($spacerTwo);
    $cardSpanOne.appendTo($spacerOne);
    $spacerOne.appendTo($cardContentDiv);
    $spacerTwo.appendTo($cardContentDiv);

    const $pOne = $('<p>').addClass('col s12');
    const $cardLink = $('<a>').prop('href', deals.untracked_url);

    $cardLink.addClass('cardText');
    $cardLink.text(`Offered by ${deals.provider_name}`);
    $cardLink.appendTo($pOne);
    $pOne.appendTo($cardContentDiv);

    // card reveal
    const $cardRevealDiv = $('<div>').addClass('card-reveal');
    const $cardSpanTwo = $('<span>').addClass('card-title grey-text text-darken-4');

    $cardSpanTwo.text(deals.short_title);
    $cardSpanTwo.appendTo($cardRevealDiv);

    const $pTwo = $('<p>');

    $pTwo.html(deals.description);
    $pTwo.appendTo($cardRevealDiv);

    // append to card element
    $cardImgDiv.appendTo($cardDiv);
    $cardContentDiv.appendTo($cardDiv);
    $cardRevealDiv.appendTo($cardDiv);
    $cardDiv.appendTo($colDiv);
    $('#hotrow').append($colDiv);
  };

  // FILL contentStrings ARRAY FOR INFO WINDOW
  const contentStrings = [];
  let stringIndex = 0;

  const pushContentStrings = function(arrayOfDeals) {
    console.log(arrayOfDeals.length);
    for (const location of arrayOfDeals) {
      contentStrings.push('<div id="content">' + '<div class="infoHeader">' + `<h1 class="infoH1">${location.deal.short_title}</h1>` + '</div>' +
      '<div class="infoBody">' + `<a href="${location.deal.untracked_url}" class="infoLink">Check it out!</a>` + '</div>' + '</div>'
      );
    }
    console.log(contentStrings);
  };

  // GENERATE GOOGLE map
  const mapLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let labelIndex = 0;

  const locationNames = [];
  let namesIndex = 0;

  const initMap = function(arrayOfCoordinates, arrayOfDeals) {
    const current = {
      lat: 47.598962,
      lng: -122.333799
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: current
    });

    pushContentStrings(arrayOfDeals);

    for (const contentString of contentStrings) {
      const infowindow = new google.maps.InfoWindow({
        content: contentString
      });
    }

    // create markers for each location
    for (const coord of arrayOfCoordinates) {
      const marker = new google.maps.Marker({
        position: coord,
        label: mapLabels[labelIndex++ % mapLabels.length],
        title: locationNames[namesIndex++ % locationNames.length],
        map: map
      });

      marker.addEventListener('click', () => {
        infowindow.open(map, marker);
      });
    }
  };

  // POPULATE CONTENT DIV WITH LOCAL DEALS
  const $xhr = $.ajax({
    method: 'GET',
    url: 'https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=10&location=47.598962,-122.333799',
    dataType: 'json'
  });

  $xhr.done((data) => {
    if ($xhr.status !== 200) {
      return;
    }

    const locationCoordinates = [];

    for (const location of data.deals) {
      createHotCard(location.deal);

      const coord = {
        lat: location.deal.merchant.latitude,
        lng: location.deal.merchant.longitude
      };

      locationCoordinates.push(coord);
      locationNames.push(location.deal.merchant.name);
    }

    // CLICK EVENT ON TAB2
    $('#tab2').on('click', () => {
      initMap(locationCoordinates, data.deals);
    });
  });

  $xhr.fail((err) => {
    console.error(err);
  });

  // SEARCH BAR REQUEST
  const $search = $('#submitButton');

  $search.on('click', (event) => {
    event.preventDefault();

    const $userQuery = $('#userQuery').val();
    const $xhrSearch = $.ajax({
      method: 'GET',
      url: `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=10&location=47.598962,-122.333799&query=${$userQuery}`,
      dataType: 'json'
    });

    $xhrSearch.done((data) => {
      if ($xhrSearch.status !== 200) {
        return;
      }

      $('#hotrow').empty();
      for (const location of data.deals) {
        createHotCard(location.deal);
      }
    });

    $xhrSearch.fail((err) => {
      console.error(err);
    });
  });
})();
