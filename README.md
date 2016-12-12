## What's the name of your project?

This web app is named Miser, because its main purpose is to save the user money.


## What problem does it solve? Who has this problem? How does your project solve this problem?

Demo video: https://youtu.be/orATF3f6CZQ

The intended primary user (PU) is a person who is in an unfamiliar setting, on a business trip or otherwise. This PU wants to explore the city in which he/she is in but he/she would rather not ask around. Perhaps PU is constrained by time or he/she is shy. In any case, PU wants to save as much money as possible in experiencing what the city has to offer.

Miser provides local deals on dining and entertainment in two simple layouts: map view & info card view. The idea is that PU can quickly pull up this website, easily see what they need with minimal mouse clicks, buy the deal from the vendor and be on their way. If PU has an idea of what they want they can enter a keyword ("pizza", "movie") into the search fields (one or the other), and results should populate in each respective view layout. If PU does not have an idea of what they are looking for, they can search with broader terms in the search fields.


## What web APIs did it use?

1. Sqoot: an API that that stores information on 250,000 different merchants. I used Sqoot to obtain "deals" and "coupon" information about merchants within the US via an AJAX call that queried a search radius, the number of results per page, the category of the service or deal, an optional user location query, and an optional user keyword query.

2. Google Maps API: a map API from Google that allowed me to: 1) generate a map object onto the screen, centered on the user location, 2) plot markers at merchant locations, 2a) create custom labels for each marker to display the merchant name, 2b) create custom info window for each marker similar to deal card, 3) display the user location, 4) re-populate map contents with whatever's on the deals page.


## What technologies did it use?

1. jQuery
2. JavaScript + AJAX
3. Materialize
4. HTML5
5. CSS3


## What was the most valuable piece of Customer feedback you received?

* Will: For users who are not familiar with the app already, provide them information via a description page. Also add a short description to the hero banner alongside the tagline.

* Dan: Have the map display immediately upon page load. Since the main idea is to see deals quick and easy, this was a great suggestion.

* Roommate: Tell the user how many (if any) results have been found.


## What was the biggest challenge you had to overcome?

Initially I wanted results to be based on current user location. Learning how to use a higher-order function to pass the location coordinates to the AJAX call function was very difficult, even with Scott's help. In addition, making a simple pagination effect was extremely challenging. I did not (and still do not) know the proper way to code out an AJAX call for each click of a page number and have the screen reflect that specific page. Finally, it was hard to resist making small stylistic changes to my project in HTML/CSS while trying to focus on bigger issues.


## Future Improvements

1. Allow the user to save favorite deals
2. Add proper pagination
3. Make the design mobile-responsive
4. Re-position content that is unintuitive
5. Allow user to 'ping' themselves and place a user location marker onto the map
