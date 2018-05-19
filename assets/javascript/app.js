$(document).ready(function(){


var number = 30;
var intervalId;

$("#submit-btn").on("click", function(){
    var restArray = [];
    event.preventDefault();
    var userZip = $("#zipCode").val()
    
    var foodType= $("#foodType").val()

    function run() {
        clearInterval(intervalId);
        intervalId = setInterval(timer, 1000);
    }

    $.ajax({
    url: "http://maps.googleapis.com/maps/api/geocode/json?address="+userZip,
    method: "GET"
    }).then(function(response){
        console.log(response)
      
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        console.log(lat,lng);
        
        var zomatoApi= "33175bea606c24db1122bc43c4dada6c"
        var queryURL = "https://developers.zomato.com/api/v2.1/search?&lat="+ lat + "&lon=" + lng + "&count=10&sort=rating&q=" + foodType + "&apikey=" + zomatoApi
        $.ajax({
        url: queryURL,
        method: "GET",
        }).then(function(response) {
          console.log(response.restaurants)
          restArray= response.restaurants;
          return restArray;
        });
        var index1 = Math.floor(Math.random()* restArray.length)
          var randomRest = restArray[index1];
          console.log(randomRest)

          console.log(index1)

       


        


        

       
          

        

          // var index2 = Math.floor(Math.random()* restArray.length)
          
          // for(var i=0; i<restArray.length; i++ ){

          // }
          

        // console.log(response)
    });
    function timer(){
        number--;
        $("#timer").html("<h2>" + number + "</h2>");

        if ( number === 0 )
        stop();
        alert("PICK ONE!!!!!");

    }



  });
});
