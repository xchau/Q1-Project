(function() {
  // 'use strict';

  // MATERIALIZE PARALLAX
  $(document).ready(() => {
    'use strict';

    $('.parallax').parallax();
  });

  function createHotCard(deals) {
    console.log(deals);
    // card element
    const $colDiv = $('<div>').addClass('col s3');
    const $cardDiv = $('<div>').addClass('card dealcard');

    // card image
    const $cardImgDiv = $('<div>').addClass('card-image waves-effect waves-block waves-light dealimage');
    const $cardImg = $('<img>').addClass('activator').prop('src', deals.image_url);

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
  }

  // POPULATE CONTENT DIV WITH LOCAL DEALS
//   const $xhr = $.ajax({
//     method: 'GET',
//     url: 'https://api.sqoot.com/v2/deals?api_key=s3btbi&category_slugs=dining-nightlife,activities-events,retail-services&per_page=8&radius=10&location=47.598962,-122.333799',
//     dataType: 'json'
//   });
//
//   $xhr.done((data) => {
//     if ($xhr.status !== 200) {
//       return;
//     }
//     for (const location of data.deals) {
//       // console.log(location.deal);
//       createHotCard(location.deal);
//     }
//   });
//
//   $xhr.fail((err) => {
//     console.error(err);
//   });
//
})();
