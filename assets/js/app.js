$(document).ready(function(){

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
        // Name: "Kerlin BBQ",
        // Img: "../images/Kerlin.jpg",
        // Location: "1700 E Cesar Chavez Street, Austin 78702",
        // Cost : "30",
        // Cousines : "BBQ",
        // Rating : "3.4",
        // RestID : 2,
    }
    return result;
}

function writeRest(){
    // Need to handle the situation if no restaurant is found or less than one
    console.log("restArray.length="+restArray.length)  
      
    index1 = Math.floor(Math.random()* restArray.length)
    index2 = Math.floor(Math.random()* restArray.length)
    
    while(restArray.length > 1 && index1 === index2){
        index2 = Math.floor(Math.random()* restArray.length)
    }

    var index1_rest = restArray[index1].restaurant;
    var index2_rest = restArray[index2].restaurant;

    console.log(index1_rest.name,index2_rest.name)

    var restaurants={
        rest1: createRestObject(index1_rest),
        rest2: createRestObject(index2_rest)
    }

    appendRest("rest1",restaurants.rest1);
    appendRest("rest2",restaurants.rest2);
}

        
$("#submit-btn").on("click", function(){
    event.preventDefault();
    submitAnimation();
    var userZip = $("#zipCode").val()
    
    var foodType= $("#foodType").val()
    $.ajax({
        url: "http://maps.googleapis.com/maps/api/geocode/json?address="+userZip,
        method: "GET"
    }).then(function(response){
        console.log(response)
    
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        console.log(lat,lng);
        
        var zomatoApi= "33175bea606c24db1122bc43c4dada6c"
        var queryURL = "https://developers.zomato.com/api/v2.1/search?&lat="+ lat + "&lon=" + lng + "&count=20&sort=rating&q=" + foodType + "&apikey=" + zomatoApi
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
    var upVotes = 1;
    $("body").on("click", ".rest-card", function() {
        if (restArray.length > 2){
            // alert("out of options")
        

            var divId= $(this).attr('id');
            console.log(divId)
            if(!picked_rest[$(this).attr("data-restID")]){
                picked_rest[$(this).attr("data-restID")] = 1;
            }else{
                picked_rest[$(this).attr("data-restID")]++;
            }
            
            console.log(picked_rest[$(this).attr("data-restID")]);
            console.log(picked_rest)
            if (divId==="rest1"){
                var re_rest_id = $("#rest1").attr("data-restID");
                $("#rest2").empty();
                restArray.splice(index2,1);
                var restObject;
                // var stop = true;
                do{
                    index2 = Math.floor(Math.random()* restArray.length);
                    var index2_rest = restArray[index2].restaurant;
                    restObject = createRestObject(index2_rest);
                    if(restObject.RestID != re_rest_id){
                    appendRest("rest2",restObject);
                    }
                    console.log(restArray.length);
                    console.log(restObject.RestID, re_rest_id);

                    }while(restObject.RestID == re_rest_id)
                

            }else{
                var re_rest_id = $("#rest2").attr("data-restID");
                $("#rest1").empty();
                restArray.splice(index1,1);
                var restObject;
                // var stop = true;
                do{
                    index1 = Math.floor(Math.random()* restArray.length);
                    var index1_rest = restArray[index1].restaurant;
                    restObject = createRestObject(index1_rest);
                    if(restObject.RestID != re_rest_id){
                    appendRest("rest1",restObject);
                    }
                    console.log(restArray.length);
                    console.log(restObject.RestID, re_rest_id);

                    }while(restObject.RestID == re_rest_id)
            }
        }else{
            alert("out of options");
            $(".rest-card").empty();
        }

        event.preventDefault();
        console.log(this);
     
        var restID = $(this).attr("data-restID");
        console.log("Restaurant ID: " + restID);
       
        var databaseRef = firebase.database().ref(restID).child("Upvotes");
        

        var newRest = {
            RestaurantID: restID,
            Upvotes: upVotes
        };



        database.ref(restID).once("value",function(snapshot){
            if(snapshot.val() === null){
                database.ref(restID).set(newRest);
            }else{
                console.log("snapshot.val().Upvotes="+snapshot.val().Upvotes)
                var v = snapshot.val().Upvotes + 1;
                database.ref(restID).update({Upvotes: v});
            }
        })

        console.log(newRest);
     
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
    });

function submitAnimation(){
    var tl = new TimelineMax();
    tl.to("#search-div", 0.1, {scale:1.03, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.2, {scale:0, transformOrigin: "50% 50%"})
    tl.to("#search-div", 0.1, {height:0, transformOrigin: "50% 0%"})
    tl.to("#logo", 0.3, {scale: 0.8, transformOrigin: "50% 0%", ease:Power4.easeOut })
}