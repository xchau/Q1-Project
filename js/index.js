// (function() {
//   'use strict';

  // const $xhr = $.ajax({
  //   method: 'GET',
  //   url: 'https://cors-anywhere.herokuapp.com/http://demographicmarketing.net/api/demographics/demographicData?customerKey=1c6f90d4&zipcode=98101',
  //   dataType: 'json'
  // });
  //
  // $xhr.done((data) => {
  //   if ($xhr.status !== 200) {
  //     return;
  //   }
  //
  //   console.log(data);
  //
  //
  //
  // });

  // $geoCode = $.ajax({
  //   method: 'GET',
  //   url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDe3s-A5dg6QWWI16Sd11C3_JtuoYavrys&'
  // })

  let geocoder;
  let map;

  $('#button').on('click', () => {
    $zip = $('#zip').val();
    console.log($zip);

    const $xhr = $.ajax({
      method: 'GET',
      url: `https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=restaurants&radius=10&location=47.598962,-122.333799`,
      dataType: 'json'
    });

    $xhr.done((data) => {
      console.log(data.deals);
      for (const location of data.deals) {
        if (location.deal.price < 100) {
          console.log(location.deal);
        }
      }
      // console.log(data.deals);
    })

    // geocoder = new google.maps.Geocoder();
    // var latlng = new google.maps.LatLng(-34.397, 150.644);
    // var mapOptions = {
    //   zoom: 18,
    //   center: {lat: 47.596594, lng: -122.323547}
    // }
    // map = new google.maps.Map(document.getElementById('map'), mapOptions);
  });

  // function codeAddress() {
  //   var address = document.getElementById('address').value;
  //   geocoder.geocode( { 'address': address}, function(results, status) {
  //     if (status == 'OK') {
  //       map.setCenter(results[0].geometry.location);
  //       var marker = new google.maps.Marker({
  //           map: map,
  //           position: results[0].geometry.location
  //       });
  //       console.log(results);
  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }







// })();
