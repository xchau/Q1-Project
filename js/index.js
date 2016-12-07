(function() {
  'use strict';

  // MATERIALIZE INIT //
  $(document).ready(() => {
    $('.parallax').parallax();
  });

  $(document).ready(() => {
    $('.collapsible').collapsible();
  });

  // MARKER & INFOWINDOW COMPONENTS
  const mapLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let labelIndex = 0;

  const locationNames = [];
  let namesIndex = 0;

  // GENERATE GOOGLE MAP //
  const generateMap = function(arrayOfDeals, arrayOfCoordinates) {
    // console.log(arrayOfDeals);
    // console.log(arrayOfCoordinates);
    const current = {
      lat: 47.598962,
      lng: -122.333799
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: current
    });

    for (let i = 0; i < arrayOfDeals.length; i++) {
      const contentString = '<div class="infoContainer">' + '<div><h2 class="infoTitle">' + arrayOfDeals[i].short_title + '</h2></div><div><a href="' + arrayOfDeals[i].untracked_url + '" class="infoLink" target="_blank">Offered by ' + arrayOfDeals[i].provider_name + '<span><i class="material-icons infoIcon">add_shopping_cart</i></span></a>' + '<span>|</span><a href="' + arrayOfDeals[i].merchant.url + '">' + arrayOfDeals[i].merchant.name + '<span><i class="material-icons infoIcon">domain</i></span></a></div><div class="infoDescription">' + arrayOfDeals[i].description + '</div></div>';

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
  };

  // MAKE INITIAL AJAX CALL //
  const currentDeals = [];

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
      currentDeals.push(location.deal);
      locationNames.push(location.deal.merchant.name);

      const coord = {
        lat: location.deal.merchant.latitude,
        lng: location.deal.merchant.longitude
      };

      locationCoordinates.push(coord);
    }
    generateMap(currentDeals, locationCoordinates);
  });

  $xhr.fail((err) => {
    console.error(err);
  });





  // // SEARCH BAR REQUEST
  // const $search = $('#submitButton');
  //
  // $search.on('click', (event) => {
  //   event.preventDefault();
  //
  //   const $userQuery = $('#userQuery').val();
  //   const $xhrSearch = $.ajax({
  //     method: 'GET',
  //     url: `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=12&radius=10&location=47.598962,-122.333799&query=${$userQuery}`,
  //     dataType: 'json'
  //   });
  //
  //   $xhrSearch.done((data) => {
  //     if ($xhrSearch.status !== 200) {
  //       return;
  //     }
  //
  //     $('#hotrow').empty();
  //     for (const location of data.deals) {
  //       createHotCard(location.deal);
  //     }
  //   });
  //
  //   $xhrSearch.fail((err) => {
  //     console.error(err);
  //   });
  // });
})();
