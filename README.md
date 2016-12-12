## What's the name of your project?

This web app is named Miser because...


## What problem does it solve? Who has this problem? How does your project solve this problem?

My primary user (PU) is a person who is in an unfamiliar setting, on a business trip or otherwise. This PU wants to explore their surrounding but he/she'd rather not ask around -- that takes too much time and effort (and maybe PU is shy). Also PU may be limited by a budget or PU just likes saving money.

Miser provides local deals on dining entertainment and retail-services in two simple layouts: map & info card. The idea is that they can quickly pull up this website, easily see what they need with minimal interaction with the site, buy the deal from the vendor and be on their way. If PU has an idea of what they want they can plug in a keyword ("pizza", "movie") into the search field & results should populate on submission. If PU does not have an idea, they can search with broader terms in the search


## What web APIs did it use?

1. Sqoot: an API that that stores information on 250,000 different merchants. In particular I used Sqoot to get "deals" and "coupon" information about local merchants via an AJAX call that queried user location, a search radius, results per page, category of service/deal and a potential user keyword query.

2. Google Maps API: a map API from Google that allowed me to: 1) generate a map object onto the screen, centered on the user location, 2) plot markers at merchant locations, 2a) create custom labels for each marker to display the merchant name, 2b) create custom info window for each marker similar to deal card, 3) display the user location, 4) re-populate map contents with whatever's on the deals page.


## What technologies did it use?

1. jQuery
2. AJAX
3. Materialize
4. HTML/CSS/JavaScript


## What was the most valuable piece of Customer feedback you received?
- Will
- Dan
- Roommate

## What was the biggest challenge you had to overcome?


- save favorites
- correct pagination fx
