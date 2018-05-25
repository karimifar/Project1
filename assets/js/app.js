var number = 30;
var intervalId;   
var index1;
var index2;

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

function appendRest(id,rest){
    $("#"+id).empty()
    $("#"+id).append("<img src='"+rest.Img+ "'>")
    $("#"+id).append("<h1 class='rest-name'>"+rest.Name+ "</h1>")
    $("#"+id).append("<p class='rest-location'>"+"<span class='title'>Address: </span>"+rest.Location+ "</p>")
    $("#"+id).append("<p class='rest-cousines'>"+"<span class='title'>Cousines: </span>"+rest.Cousines+ "</p>")
    $("#"+id).append("<p class='rest-cost'>"+"<span class='title'>Average cost for two: </span>"+rest.Cost+ "</p>")
    $("#"+id).append("<p class='rest-rating'>"+"<span class='title'>Rating: </span>"+rest.Rating+ "</p>")
    $("#"+id).attr("data-restID", rest.RestID)
    // picked_rest.push(rest.RestID);
}

function createRestObject(rest_obj){
    var result = {
        Name: rest_obj.name,
        Img: rest_obj.featured_image,
        Location: rest_obj.location.address,
        Cost : rest_obj.average_cost_for_two,
        Cousines : rest_obj.cuisines,
        Rating : rest_obj.user_rating.aggregate_rating,
        RestID : rest_obj.R.res_id,
    }
    return result;
}

function writeRest(){
    // Need to handle the situation if no restaurant is found or less than one    
    do{
        index1 = Math.floor(Math.random()* restArray.length)
        index2 = Math.floor(Math.random()* restArray.length)
    }while(restArray.length > 1 && index1 === index2)

    var index1_rest = restArray[index1].restaurant;
    var index2_rest = restArray[index2].restaurant;

    console.log(index1_rest.name,index2_rest.name)

    appendRest("rest1",createRestObject(index1_rest));
    appendRest("rest2",createRestObject(index2_rest));
}

function printNewRestaurant(divID,restID,index){
    // remove html and restaurant from restArray
    $("#"+divID).empty();
    restArray.splice(index,1);

    var stop = true;
    do{
        index = Math.floor(Math.random()* restArray.length);
        // var index_rest = restArray[index2].restaurant;
        var restObject = createRestObject(restArray[index].restaurant);
        if(restObject.RestID != restID){ //if we find a restaurant different from the one we pick, print it
            appendRest(divID,restObject);
            stop = false;
        }
        console.log(restID+" is picked")
        console.log("restArray.length="+restArray.length);
        console.log("restObject.RestID="+restObject.RestID);
        console.log("restID="+restID);
        console.log("----------------");

    }while(stop)
    return index;
} 

function saveVote(restID){
    database.ref(restID).once("value",function(snapshot){
        if(snapshot.val() === null){  // if this restaurant hasn't been saved in database, set it
            database.ref(restID).set({
                                        RestaurantID: restID,
                                        Upvotes: 1
                                    });
        }else{ // else, just update the Upvotes value by one
            console.log("snapshot.val().Upvotes="+snapshot.val().Upvotes)
            var v = snapshot.val().Upvotes + 1;
            database.ref(restID).update({Upvotes: v});
        }
    })
}

$("#submit-btn").on("click", function(){
    event.preventDefault();
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
            console.log(restArray)
            writeRest();
        
        });
    });
    run();
});

    
//Tyler's upvote function
var picked_rest = {}

$("body").on("click", ".rest-card", function() {
    event.preventDefault();
    var restID = $(this).attr("data-restID"); // the id of restaurant that has been clicked

    // if restID hasn't been saved into picked_rest, save and set to 1
    // else increase the number of picked by one
    picked_rest[restID] = !picked_rest[restID] ? 1 : picked_rest[restID]+1;
    console.log("picked_rest[restID]="+picked_rest[restID])
    console.log(picked_rest)

    // save vote
    saveVote(restID);

    // print new restaurant 
    if (restArray.length > 2){
        var divId= $(this).attr('id');  // the div tag id of restaurant that has been clicked
        console.log(divId)

        if (divId==="rest1"){ // if rest1 is picked
            index2 = printNewRestaurant("rest2",restID,index2)    
        }else{  // else rest2 is picked
            index1 = printNewRestaurant("rest1",restID,index1)
        }
    }else{
        alert("out of options");
        $(".rest-card").empty();
    }
    
});

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

function submitAnimation(){
    var tl = new TimelineMax();
    tl.to("#search-div", 0.4, {scale:1.05, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.2, {scale:0, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.1, {height:0, transformOrigin: "50% 100%"})
    tl.to("#logo", 0.3, {scale: 0.6, transformOrigin: "50% 0%", ease:Power4.easeOut })
}

function logoAnimation(){
    var tl = new TimelineMax();
    tl.fromTo("#logo", 0.3, {y:100, scale: 0.1  ,opacity:0, transformOrigin: "50% 50%", ease:Power4.easeOut},{y:100, scale: 1.3 , opacity:1, transformOrigin: "50% 50%", ease:Power4.easeOut})
    // tl.fromTo("#icon", 0.5, {scale: 0.8  ,transformOrigin: "50% 50%", ease:Elastic.easeOut},{scale: 1  ,transformOrigin: "50% 50%", ease:Elastic.easeOut})
    tl.staggerFrom(".ceiling", 1, {scale: 0 ,transformOrigin: "50% 50%", ease:Elastic.easeOut}, 0.08)
    tl.to("#logo", 0.5, {y:0, scale: 1  ,opacity:1, transformOrigin: "50% 50%", ease:Power4.easeOut}, "=-0.5")
    tl.staggerFrom(".form-el", 1, {opacity:0 , transformOrigin: "50% 50%", ease:Power1.easeIn}, 0.3, "=-0.5")

}

//     var name = "testName";
//     var restID = "testRestID";
//     var upvotes = "1";

logoAnimation();
