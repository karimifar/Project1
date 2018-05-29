var number = 30;
var intervalId;   
var index1;
var index2;
var allRest = [];



var config = {
    apiKey: "AIzaSyCx0d_tuVtN1E_BIl2tnZpJdP7Kve7bqLs",
    authDomain: "restaurantpicker-eb33d.firebaseapp.com",
    databaseURL: "https://restaurantpicker-eb33d.firebaseio.com",
    projectId: "restaurantpicker-eb33d",
    storageBucket: "restaurantpicker-eb33d.appspot.com",
    messagingSenderId: "639194920272"
 };

firebase.initializeApp(config);
var database = firebase.database();

var restArray = [];

// print restaurant's info
function appendRest(id,rest){
    $("#"+id).empty()
    $("#"+id).append("<img src='"+rest.Img+ "'>")
    $("#"+id).append("<h1 class='rest-name'>"+rest.Name+ "</h1>")
    $("#"+id).append("<p class='rest-location'>"+"<span class='title'>Address: </span>"+rest.Location+ "</p>")
    $("#"+id).append("<p class='rest-cousines'>"+"<span class='title'>Cousines: </span>"+rest.Cousines+ "</p>")
    $("#"+id).append("<p class='rest-cost'>"+"<span class='title'>Average cost for two: </span>"+rest.Cost+ "</p>")
    $("#"+id).append("<p class='rest-rating'>"+"<span class='title'>Rating: </span>"+rest.Rating+ "</p>")
    $("#"+id).attr("data-restID", rest.RestID)
}

// create our own restaurant object from API returned data
function createRestObject(rest_obj){
    var result = {
        Name: rest_obj.name,
        Img: rest_obj.featured_image,
        Location: rest_obj.location.address,
        Cost : rest_obj.average_cost_for_two,
        Cousines : rest_obj.cuisines,
        Rating : rest_obj.user_rating.aggregate_rating,
        RestID : rest_obj.R.res_id,
        latitude: rest_obj.location.latitude,
        longitude: rest_obj.location.longitude
    }
    return result;
}

// print two restaurants with random indexes
function writeRest(){
    // Need to handle the situation if no restaurant is found or less than two    
    do{
        index1 = Math.floor(Math.random()* restArray.length)
        index2 = Math.floor(Math.random()* restArray.length)
    }while(restArray.length > 1 && index1 === index2)

    appendRest("rest1",allRest[index1]);
    appendRest("rest2",allRest[index2]);
    if(index1>index2){
        restArray.splice(index1,1)
        restArray.splice(index2,1)
    }else{
        index2--;
        restArray.splice(index1,1);
        restArray.splice(index2,1);
    }
}

// print restaurant with random index
function printNewRestaurant(divID,restID,index){
    // remove restaurant from restArray
    // restArray.splice(index,1);

    var random_index;
    var stop = true;
    do{
        var random_index = Math.floor(Math.random()* restArray.length);
        var random_rest_id = restArray[random_index].restaurant.R.res_id;
        if(random_rest_id != restID){ //if we find a restaurant different from the one we pick, print it and stop the while loop
            var restObject = createRestObject(restArray[random_index].restaurant);
            appendRest(divID,restObject);
            restArray.splice(random_index,1);
            stop = false;

            console.log(restID+" is picked")
            console.log("restArray.length="+restArray.length);
            console.log("restObject.RestID="+restObject.RestID);
            console.log("restID="+restID);
            console.log("----------------");
        }

    }while(stop && restArray.length > 1)
    return random_index;
} 

// Save/update restaurant's Upvotes property
function saveVote(restID){
    database.ref(restID).once("value",function(snapshot){
        if(snapshot.val() === null){  // if this restaurant hasn't been saved in database, set it
            database.ref(restID).set({RestaurantID: restID,Upvotes: 1});
        }else{ // else, just update the Upvotes value by one
            var v = snapshot.val().Upvotes + 1;
            database.ref(restID).update({Upvotes: v});
            console.log(restID+"="+v)
        }
    })
}

// create our own restaurant objects from resturned API data and save all to allRest
function saveRestObj(restArray){
    for(var i=0; i<restArray.length; i++){
        var restInfo =  createRestObject(restArray[i].restaurant);
        allRest.push(restInfo);
    }
}

// print restaurant with Upvotes
function printRestList(restaurant_obj){
    // var resultlink = $("<a href='#'></a>");
    var resultCard = $("<div class='result-card'>");
    resultCard.append("<div class='image-div-result'><img class='result-element result-img' src='"+restaurant_obj.Img+"'></div>");
    resultCard.append("<h2 class='result-element result-vote'>"+restaurant_obj.Upvotes+"</h2>")
    resultCard.append("<h2 class='result-element result-name'>"+restaurant_obj.Name+"</h2>")
    // resultlink.append(resultCard)
    $("#all-restaurants").append(resultCard)
    

    if(picked_rest[restaurant_obj.RestID]){
        resultCard.attr("class", "result-card picked");
        resultCard.attr("data-toggle", "tooltip" )
        resultCard.attr("data-placement", "left" )
        resultCard.attr("title", "You preferred this restaurant " + picked_rest[restaurant_obj.RestID] + " times" )
    }
}

function highlightPicked(){
    picked_rest
}

function printRestInDecreasing(upvotes_array,allRest){
    var sorted_rests = []
    // upvotes_array has been sorted in increasing order
    for(var i = upvotes_array.length-1 ; i > -1 ; i--){
        for(var j = 0; j < allRest.length ; j++){
            if(allRest[j].Upvotes === upvotes_array[i]){
                sorted_rests.push(allRest[j])
                printRestList(allRest[j]);
            }
        }
    }
    console.log(sorted_rests);
}

// print final result 
function printVotes(){
    database.ref().once("value",function(snapshot){
        var upvotes_array = [];
        var data = snapshot.val();

        // save Upvotes to each restaurant object and print a list of restaurants order by their Upvotes
        if (data !== null){
            for(var i=0; i<allRest.length; i++){
                var restaurantId = allRest[i].RestID; 

                // If restaurant has Upvotes property, save to restaurant object, if not, save and set it to 0
                allRest[i]["Upvotes"] = data[restaurantId]? parseInt(data[restaurantId].Upvotes) : 0;

                if(upvotes_array.indexOf(allRest[i]["Upvotes"]) == -1){
                    upvotes_array.push(parseInt(allRest[i]["Upvotes"]));
                }                 
            }

            // sort upvotes_array by increasing order
            upvotes_array = upvotes_array.sort(function(a, b){return a - b});
            
            // print restaurants (Upvotes decreasing order)
            printRestInDecreasing(upvotes_array,allRest)
        }
          
    });
}

function run() {
    clearInterval(intervalId);
    intervalId = setInterval(decrement, 1000);

};

//function to countdown the timer
function decrement() {
    number--;
    var num = $("<div>")
    num.addClass("page-link")
    num.html("<h2>" + number + "</h2>")
    $("#timer").html(num);
    if (number === 0) {
        stop();
        
    }
};

//function to stop the timer
function stop() {
    clearInterval(intervalId);
};

$("body").on("click", "#retry-btn", function(){
    location.reload();
});

//Search form out on submit click
function submitAnimation(){
    var tl = new TimelineMax();
    tl.to("#search-div", 0.4, {scale:1.05, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.2, {scale:0, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.1, {height:0, transformOrigin: "50% 100%"})
    tl.to("#logo", 0.3, {scale: 0.6, transformOrigin: "50% 0%", ease:Power4.easeOut })
}

//opening logo animation
function logoAnimation(){
    var tl = new TimelineMax();
    tl.fromTo("#logo", 0.3, {y:100, scale: 0.1  ,opacity:0, transformOrigin: "50% 50%", ease:Power4.easeOut},{y:100, scale: 1.3 , opacity:1, transformOrigin: "50% 50%", ease:Power4.easeOut})
    // tl.fromTo("#icon", 0.5, {scale: 0.8  ,transformOrigin: "50% 50%", ease:Elastic.easeOut},{scale: 1  ,transformOrigin: "50% 50%", ease:Elastic.easeOut})
    tl.staggerFrom(".ceiling", 1, {scale: 0 ,transformOrigin: "50% 50%", ease:Elastic.easeOut}, 0.08)
    tl.to("#logo", 0.5, {y:0, scale: 1  ,opacity:1, transformOrigin: "50% 50%", ease:Power4.easeOut}, "=-0.5")
    tl.staggerFrom(".form-el", 1, {opacity:0 , transformOrigin: "50% 50%", ease:Power1.easeIn}, 0.3, "=-0.5")

}

//The flip animation when you click on each restaurant
function transitionOut(divid){
    var tl = new TimelineMax();
    tl.to("#"+divid, 0.3, {rotationY:180, transformOrigin: "50% 50%", opacity:0, scale:0.5, ease:Power4.easeOut})
    .to("#"+divid, 0.3, {rotationY:0, transformOrigin: "50% 50%", opacity:1, scale:1, ease:Power4.easeOut}, "=+0.1")
}

//print featured restaurant
function printSelected(restID){
    console.log("winningRestID="+restID);
    for (var i = 0; i < allRest.length; i++) {
        if (restID == allRest[i].RestID) {
            console.log(allRest[i].Name);
            appendRest("featured-restaurant", allRest[i]);
            var chosenHeaderDiv = $("<div>");
            chosenHeaderDiv.append("<h2> You chose: </h2>");
            chosenHeaderDiv.addClass("chosenHeaderDiv");
            $("#featured-restaurant").prepend(chosenHeaderDiv);
        } else {}
    }
 }


logoAnimation();

$("#submit-btn").on("click", function(){
    event.preventDefault();
    $("#restaurants-div").attr("class", "row")
    submitAnimation();
    var userZip = $("#zipCode").val()
    
    var foodType= $("#foodType").val()
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address="+userZip,
        method: "GET"
    }).then(function(response){
        console.log(response)
    
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        console.log(lat,lng);
        
        var zomatoApi= "33175bea606c24db1122bc43c4dada6c"
        var queryURL = "https://developers.zomato.com/api/v2.1/search?&lat="+ lat + "&lon=" + lng + "&count=6&sort=rating&q=" + foodType + "&apikey=" + zomatoApi
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function(response) {
            restArray= response.restaurants;
            saveRestObj(restArray);
            console.log(restArray)
            writeRest();
        
        });
    });
    run();
});

    
//Tyler's upvote function
var picked_rest = {}

$("body").on("click", ".rest-card div", function() {
    event.preventDefault();
    var restID = $(this).attr("data-restID"); // the id of restaurant that has been clicked
    console.log("restID="+restID);
    // if restID hasn't been saved into picked_rest, save and set to 1
    // else increase the number of picked by one
    picked_rest[restID] = !picked_rest[restID] ? 1 : picked_rest[restID]+1;
    console.log(picked_rest)

    // save vote
    saveVote(restID);

    // print new restaurant 
    if (restArray.length > 0){
        var divId= $(this).attr('id');  // the div tag id of restaurant that has been clicked
        console.log(divId)

        if (divId==="rest1"){ // if rest1 is picked
            transitionOut("rest2");
            index2 = printNewRestaurant("rest2",restID,index2)    
        }else{  // else rest2 is picked
            transitionOut("rest1");
            index1 = printNewRestaurant("rest1",restID,index1)
        }
    }else{
        $(".rest-card").empty();
        $("#restaurants-div").attr("class", "row noDisplay")
        $("#retry").attr("class", "col-md-2")
        printSelected(restID);
        printVotes();
        printMap(restID);
    }
    
});

//retrieve the votes from firebase and store them in an object (restID: upvote) object contains the initial n restaurants
//on the result page we display the n restaurants with their firebase votes
//feature the winner restaurant
//+ highlight the restaurants the user clicked on 
//retry button

// map function

function printMap(restID){
    for (var i = 0; i < allRest.length; i++) {
        if (restID == allRest[i].RestID) {
            console.log(allRest[i].Name);
            var mymap = L.map('mapid').setView([allRest[i].latitude, allRest[i].longitude], 12);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiZ3VndWNvZGUiLCJhIjoiY2pocjU1Z3R2MWMwcjM3cHZnZDhqa3NyYyJ9.6qeZqaN1FcIHVZqSut1hgw'
            }).addTo(mymap);
            break;
        } 
    }

    var redIcon = L.icon({
        iconUrl: 'assets/images/redicon.png',
    
        iconSize: [30, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
    });

    allRest.forEach(function(restaurant) {
        var lat = restaurant.latitude;
        var long = restaurant.longitude;
        console.log(restaurant.RestID)
        if(restID == restaurant.RestID){
            console.log("print target")
            var marker = L.marker([lat, long],  {icon: L.AwesomeMarkers.icon({icon: 'star', markerColor: 'transparent', prefix: 'fa', iconColor: 'black'}) }).addTo(mymap).bindPopup(restaurant.Name);
        }else{
            var marker = L.marker([lat, long]).addTo(mymap).bindPopup(restaurant.Name);
        }
    });
    
}
