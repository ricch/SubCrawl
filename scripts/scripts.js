var subcrawlApp = {};
subcrawlApp.allStops = []; // <-- Empty array that will catch all of our promised API data in ORDER

$("#go").click(function (e) {
    goToByScroll("results");
    e.preventDefault();
});


function goToByScroll(id) {
                var toMe = $("." + id)
                $("html,body").delay(600).animate({ scrollTop: toMe.offset().top }, 1100);
                toMe.addClass("hightlightResult");
                setTimeout(function () {
                    toMe.removeClass("hightlightResult", 1500);
                }, 500);
            }


subcrawlApp.getYelpData = function(lat,long) { // <-- pushing in two parameters to determine a dynamic ajax call for yelp requests
      
    return $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method:'GET',
        data: {
          reqUrl: 'https://api.yelp.com/v3/businesses/search',
          params: {
            latitude: lat,
            longitude: long,
            categories: "pubs,irish_pubs,sportsbars,beerbar,champagne_bars,cocktailbars,divebars,gaybars,tikibars,whiskeybars,wine_bars",
            // categories: "bars",
            limit: 5,
            // price: "1, 2, 3",
            // open_now: true,
            sort_by: "distance"
          },
          proxyHeaders: {
            'Authorization': 'Bearer 2RoNajVyMrnBdyp0T0vF-4XyY90Hi5doFqOEtbQTVozqLNycMqy86UvL2LzOoFZvo_JZTzxFoKZs8zwdHkbquI3hEaIGyfqxAFo4chUDINpk5gEEdPysjZ1tVHycWXYx'
          },
          xmlToJSON: false
        }
    })
} // <-- END getYelpData (but really get api information)

// TO DO NOTES FOR FURTHER STUDY/REVIEW : Learn to declare a function and give parameters .. call a function passing arguments .. review scope


//////////////////////////////////////////////////////////////////

subcrawlApp.displayRestaurants = function(restaurantData, stationName) { // <-- START DISPLAY RESTAURANTS
  console.log(restaurantData);

  var stationContainer = $('<div>').addClass(`station ${stationName}`);
  $(stationContainer).append(`
    <div class="ttcLogo"><img src="images/logoTTC.png" alt="Toronto Transit Commission"></div>
    <h1>Bars near ${stationName} Station</h1>
    `); 
  for (i = 0; i <= 2; i++) { // <-- Showing only 3 results
    var busName = restaurantData[i].name;
    var busAddress = restaurantData[i].location.address1;
    var busDistance = restaurantData[i].distance;
    var busPhone = restaurantData[i].display_phone;
    var busRating = restaurantData[i].rating;
    var busNumReviews = restaurantData[i].review_count;
    var busPrice = restaurantData[i].price;
    var busImg = restaurantData[i].image_url;
    var busUrl = restaurantData[i].url;

    if (busRating === 1){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i>';
    } else if (busRating === 2){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
    } else if (busRating === 3){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
    } else if (busRating === 4){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
    } else if (busRating === 5){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>';
    } else if (busRating === 1.5){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-half-o" aria-hidden="true"></i>';
    } else if (busRating === 2.5){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-half-o" aria-hidden="true"></i>';
    } else if (busRating === 3.5){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-half-o" aria-hidden="true"></i>';
    } else if (busRating === 4.5){
      busRating = '<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-half-o" aria-hidden="true"></i>';
    } 

    // console.log(busName);
    // $('.image').append(
    //   `<img src="${busImg}" alt="${busName}">`
    //   );
    $(stationContainer).append(`
      <div class="result wow flipInX">
      <a href="${busUrl}" target=_blank><div class="restaurantImage" style="background-image: url(${busImg});"></div></a>
      <div class="restaurantContent">
      <h2><a href="${busUrl}" target=_blank>${busName}</a></h2>
      <p class="reviews">${busRating} (${busNumReviews} reviews) - <span class="price">${busPrice}</span></p>
      <p class="restaurantInfo">
        <i class="fa fa-map-marker" aria-hidden="true"></i>${busAddress}<br>
        <i class="fa fa-phone" aria-hidden="true"></i>${busPhone}<br>
        <i class="fa fa-location-arrow" aria-hidden="true"></i>${busDistance.toFixed(1)} m away<br>
        <i class="fa fa-globe" aria-hidden="true"></i><a href="${busUrl}" target=_blank>View on yelp</a><br>
      </p>
      </div>
      <a href="tel:${busPhone}" class="mobileShow"><div class="phoneButton">Call Us</div></a>
      </div>
      `);



    // $('.result').css("background-image", `url(${busImg})`);  
  }
  $('.content').append(stationContainer);
}; // <-- END DISPLAY RESTURANTS

//////////////////////////////////////////////////////////////////



subcrawlApp.events = function() { // <-- a function that handles all events (ie click, submit, etc)
  
  $('.subway-form').on('submit', function(e) { // <-- when the 'submit' button is clicked ... do these steps
    e.preventDefault(); // <-- resets the forms
    goToByScroll("results");


    $('.content').empty();
    var selectedStartStn = $('.starting').val();
    var selectedEndStn = $('.ending').val();


    var startIndex = ttcStations.filter(function(station){ // <-- The filter function creates a new ARRAY based on a condition 
      return selectedStartStn === station.stationName // <-- in this case, we will return when name of selected item's value === name of array's station name
    });

    var endIndex = ttcStations.filter(function(station){
      return selectedEndStn === station.stationName
    });

    var indexOfStart = startIndex[0].order; // <-- by default, theres only one match .. grabbing the order value (aka array value) of the property 
    var indexOfEnd = endIndex[0].order + 1; // <-- slice does NOT include the END, hence adding one to the value

    // NOTE: will have to accommodate if start <= or >= end

    if (indexOfStart < indexOfEnd){
      var sliced = ttcStations.slice(indexOfStart, indexOfEnd); // <-- sliced array and ALL the data
      console.log(sliced);
    } else if (indexOfStart > indexOfEnd){
      indexOfStart = indexOfStart + 1;
      indexOfEnd = indexOfEnd - 1;
      var sliced = ttcStations.slice(indexOfEnd, indexOfStart);
      console.log(sliced);
      // var reversed = sliced.reverse(); <-- trying to reverse the array, but not working
      // console.log(reversed);
    }

    var subcrawlLength = sliced.length; // <-- determines the # of stops between start and end. will use to determine how many ajax requests are required

    for(var i = 0; i < subcrawlLength; i++) {
        subcrawlApp.allStops.push(subcrawlApp.getYelpData(sliced[i].latitude, sliced[i].longitude)); // <-- targeting our empty array '.allStops' and pushing IN ORDER our API data with parameters of sliced lat/long
    } 

    $.when(...subcrawlApp.allStops) // <-- spread operator - taking our ARRAY OF PROMISED DATA and passing to the WHEN function
      .then(function(...res){ // <-- rest operator - gather all arguments passed to THEN into an ARRAY

        res = res.map(data => data[0]); // <-- MAP function maps over and overwrites an existing ARRAY.

        console.log(res);
        res.forEach((restaurant, i) => { // second value of forEACH is always index
          var stationName = sliced[i].stationName; // <-- this represents the station that corresponds to the restaurant we're currently on inside of the loop
          subcrawlApp.displayRestaurants(restaurant.businesses, stationName); // <-- setting the function to call the data in yelp (passing the baton)
        })
      });  
    console.log(`You are going through ${subcrawlLength} subway stops`)
  });

  $('.checkboxSwitch').change(function(){ // <-- toggle TTC Station switch lines
    console.log ('switched')
    $('.bloorDanforthS').toggleClass("visibilityHidden");
    $('.bloorDanforthE').toggleClass("visibilityHidden");
    $('.bloorDanforthS').toggleClass("starting");
    $('.bloorDanforthE').toggleClass("ending");
    $('.yongeUniversityS').toggleClass("visibilityHidden");
    $('.yongeUniversityE').toggleClass("visibilityHidden");
    $('.yongeUniversityS').toggleClass("starting");
    $('.yongeUniversityE').toggleClass("ending");
  });// <-- End TTC Station switch lines

}; // <-- END EVENTS FUNCTIONS


//////////////////////////////////////////////////////////////////

subcrawlApp.init = function (){ // <----- INITIALIZE
  subcrawlApp.events();
}; // <-- END INITIALIZE

$(function(){ // <----- DOCUMENT READY
  subcrawlApp.init();
}); // <-- END DOCUMENT READY

//////////////////////////////////////////////////////////////////

// DONE - user selects their start station and their end station (downsview - spadina)
// DONE splice the start to the end 
// make splice.length ajax calls , each call will return the first result 
// and then gets stored in some sort of array like this [{restaurant1},{restaurant2}, {restaurant3}]
// display the three options on the page

var ttcStations = [
  {stationName: 'Downsview', order: 0, latitude: '43.750053813', longitude: '-79.462342744'},
  {stationName: 'Wilson', order: 1, latitude: '43.73458062', longitude: '-79.449928713'},
  {stationName: 'Yorkdale', order: 2, latitude: '43.72481302', longitude: '-79.447509462'},
  {stationName: 'LawrenceW', order: 3, latitude: '43.716381433', longitude: '-79.444029153'},
  {stationName: 'Glencairn', order: 4, latitude: '43.709819963', longitude: '-79.441528421'},
  {stationName: 'EglintonW', order: 5, latitude: '43.698996649', longitude: '-79.435989533'},
  {stationName: 'StClairW', order: 6, latitude: '43.684352034', longitude: '-79.414535879'},
  {stationName: 'Dupont', order: 7, latitude: '43.674909875', longitude: '-79.407256672'},
  {stationName: 'Spadina', order: 8, latitude: '43.667714585', longitude: '-79.403751969'}, // <------- Duplicate
  {stationName: 'StGeorge', order: 9, latitude: '43.668318768', longitude: '-79.398672286'}, // <------- Duplicate
  {stationName: 'Museum', order: 10, latitude: '43.667177071', longitude: '-79.39350223'},
  {stationName: 'QueensPark', order: 11, latitude: '43.659704948', longitude: '-79.39034904'},
  {stationName: 'StPatrick', order: 12, latitude: '43.654611638', longitude: '-79.388295977'},
  {stationName: 'Osgoode', order: 13, latitude: '43.650874106', longitude: '-79.386617316'},
  {stationName: 'StAndrew', order: 14, latitude: '43.647645649', longitude: '-79.385130483'},
  {stationName: 'Union', order: 15, latitude: '43.645722666', longitude: '-79.380462258'},
  {stationName: 'King', order: 16, latitude: '43.649120879', longitude: '-79.378045133'},
  {stationName: 'Queen', order: 17, latitude: '43.652346514', longitude: '-79.379326503'},
  {stationName: 'Dundas', order: 18, latitude: '43.656136534', longitude: '-79.380729654'},
  {stationName: 'College', order: 19, latitude: '43.661229971', longitude: '-79.382782166'},
  {stationName: 'Wellesley', order: 20, latitude: '43.665182941', longitude: '-79.383770788'},
  {stationName: 'Bloor', order: 21, latitude: '43.670671998', longitude: '-79.385950091'}, // <------- Duplicate
  {stationName: 'Rosedale', order: 22, latitude: '43.676900952', longitude: '-79.388725888'},
  {stationName: 'Summerhill', order: 23, latitude: '43.682449998', longitude: '-79.391178237'},
  {stationName: 'StClair', order: 24, latitude: '43.688162978', longitude: '-79.393284347'},
  {stationName: 'Davisville', order: 25, latitude: '43.698123394', longitude: '-79.397331412'},
  {stationName: 'Eglinton', order: 26, latitude: '43.706645843', longitude: '-79.399158462'},
  {stationName: 'Lawrence', order: 27, latitude: '43.725421915', longitude: '-79.401877582'},
  {stationName: 'YorkMills', order: 28, latitude: '43.744995922', longitude: '-79.405330677'},
  {stationName: 'Sheppard', order: 29, latitude: '43.761674341', longitude: '-79.410987148'}, // <------- Duplicate
  {stationName: 'NorthYorkCentre', order: 30, latitude: '43.769241254', longitude: '-79.412911598'},
  {stationName: 'Finch', order: 31, latitude: '43.781490124', longitude: '-79.415672606'},

  {stationName: 'Kipling', order: 32, latitude: '43.638020312', longitude: '-79.536388119'},
  {stationName: 'Islington', order: 33, latitude: '43.645950081', longitude: '-79.523947976'},
  {stationName: 'RoyalYork', order: 34, latitude: '43.648804442', longitude: '-79.511540512'},
  {stationName: 'OldMill', order: 35, latitude: '43.650576487', longitude: '-79.495224994'},
  {stationName: 'Jane', order: 36, latitude: '43.650291274', longitude: '-79.484771783'},
  {stationName: 'Runnymede', order: 37, latitude: '43.652166954', longitude: '-79.47649916'},
  {stationName: 'HighPark', order: 38, latitude: '43.654594232', longitude: '-79.465529622'},
  {stationName: 'Keele', order: 39, latitude: '43.655700785', longitude: '-79.460315483'},
  {stationName: 'DundasWest', order: 40, latitude: '43.657142061', longitude: '-79.452678426'},
  {stationName: 'Lansdowne', order: 41, latitude: '43.659142924', longitude: '-79.442969912'},
  {stationName: 'Dufferin', order: 42, latitude: '43.660665098', longitude: '-79.435955802'},
  {stationName: 'Ossington', order: 43, latitude: '43.662663329', longitude: '-79.426156823'},
  {stationName: 'Christie', order: 44, latitude: '43.664251781', longitude: '-79.418693027'},
  {stationName: 'Bathurst', order: 45, latitude: '43.665991758', longitude: '-79.411582548'},
  {stationName: 'Spadina', order: 46, latitude: '43.667647755', longitude: '-79.403758401'}, // <------- Duplicate
  {stationName: 'StGeorge', order: 47, latitude: '43.668311635', longitude: '-79.398643233'}, // <------- Duplicate
  {stationName: 'Bay', order: 48, latitude: '43.670400288', longitude: '-79.390270289'},
  {stationName: 'Yonge', order: 49, latitude: '43.670706062', longitude: '-79.385879814'}, // <------- Duplicate
  {stationName: 'Sherbourne', order: 50, latitude: '43.672345084', longitude: '-79.376981614'},
  {stationName: 'CastleFrank', order: 51, latitude: '43.674140625', longitude: '-79.368794155'},
  {stationName: 'Broadview', order: 52, latitude: '43.676861715', longitude: '-79.358523845'},
  {stationName: 'Chester', order: 53, latitude: '43.678377345', longitude: '-79.351416279'},
  {stationName: 'Pape', order: 54, latitude: '43.67968493', longitude: '-79.345208527'},
  {stationName: 'Donlands', order: 55, latitude: '43.681050077', longitude: '-79.337925572'},
  {stationName: 'Greenwood', order: 56, latitude: '43.682703613', longitude: '-79.330276435'},
  {stationName: 'Coxwell', order: 57, latitude: '43.68414917', longitude: '-79.323527235'},
  {stationName: 'Woodbine', order: 58, latitude: '43.686352895', longitude: '-79.313357113'},
  {stationName: 'MainStreet',  order: 59,latitude: '43.688916606', longitude: '-79.302728755'},
  {stationName: 'VictoriaPark', order: 60, latitude: '43.694320822', longitude: '-79.290318935'},
  {stationName: 'Warden', order: 61, latitude: '43.712242009', longitude: '-79.278980371'},
  {stationName: 'Kennedy', order: 62, latitude: '43.732118151', longitude: '-79.265698446'}

  // {stationName: 'Sheppard-Yonge', latitude: '43.761618114', longitude: '-79.410988637'}, // <------- Duplicate
  // {stationName: 'Bayview', latitude: '43.767252223', longitude: '-79.387398646'},
  // {stationName: 'Bessarion', latitude: '43.769126785', longitude: '-79.376724185'},
  // {stationName: 'Leslie', latitude: '43.771132451', longitude: '-79.367416349'},
  // {stationName: 'Don Mills', latitude: '43.775564642', longitude: '-79.34693642'},

  // {stationName: 'Kennedy', latitude: '43.732191651', longitude: '-79.265696324'},
  // {stationName: 'Lawrence East', latitude: '43.750214795', longitude: '-79.270907211'},
  // {stationName: 'Ellesmere', latitude: '43.767226149', longitude: '-79.277314667'},
  // {stationName: 'Midland', latitude: '43.770168391', longitude: '-79.272482318'},
  // {stationName: 'Scarborough Centre', latitude: '43.773844112', longitude: '-79.257863157'},
  // {stationName: 'McCowan', latitude: '43.775512554', longitude: '-79.25154339'}
];
