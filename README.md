# Miser

Miser is a web app designed to save its users money. Whether you're in an unfamiliar area or sitting in your living room wondering if you can grab a delicious burger or join a city tour on the cheap, Miser has you covered.

*Demo video: https://youtu.be/orATF3f6CZQ*
![DEMO VIDEO](https://youtu.be/orATF3f6CZQ)


## Primary Use Case

The intended primary user (PU) is a person who is in an unfamiliar setting, on a business trip or otherwise. This PU wants to explore the city in which he/she is in but he/she would rather not ask around. Perhaps PU is constrained by time or he/she is shy. In any case, PU wants to save as much money as possible in experiencing what the city has to offer.

Miser provides local deals on dining and entertainment in two simple layouts: map view & info card view. The idea is that PU can quickly pull up this website, easily see what they need with minimal mouse clicks, buy the deal from the vendor and be on their way. If PU has an idea of what they want they can enter a keyword ("pizza", "movie") into the search fields (one or the other), and results should populate in each respective view layout. If PU does not have an idea of what they are looking for, they can search with broader terms in the search fields.


## Special thanks to:

1. Sqoot: free API that that stores information on 250,000 different merchants. Used to obtain "deals" and "coupon" information about merchants within the US via an AJAX call that queried a search radius, the number of results per page, the category of the service or deal, an optional user location query, and an optional user keyword query.

2. Google Maps API: a powerful map API by Google that allowed: 1) a Google Map rendered onto the screen, centered on the user location, 2) plot markers to be placed at merchant locations, 2a) creation of custom labels for each marker to display the merchant name, 2b) creation of custom info window for each marker similar to deal card, and 3) display of user location.


## Technologies

1. HTML
2. CSS (Materialize)
3. jQuery
4. JavaScript + AJAX
5. Surge (deployment)

## Challenges

Initially I wanted results to be based on current user location. Learning how to use a higher-order function to pass the location coordinates to the AJAX call function was very difficult, even with Scott's help. In addition, making a simple pagination effect was extremely challenging. I did not (and still do not) know the proper way to code out an AJAX call for each click of a page number and have the screen reflect that specific page. Finally, it was hard to resist making small stylistic changes to my project in HTML/CSS while trying to focus on bigger issues.


## Future Goals

1. Allow the user to save favorite deals
2. Add proper pagination
3. Make the design mobile-responsive
4. Re-position content that is unintuitive
5. Allow user to 'ping' themselves and place a user location marker onto the map
