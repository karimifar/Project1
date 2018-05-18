
    
    var userZip = $("#zipCode").val().trim();
    var queryURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + userZip,;
    


    $("#userSubmit").on("click", function(){
        var userZip = $("#zipCode").val().trim();

       
        console.log(userZip);
        console.log(food);


    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response)

      
        var lat = response.results[0].geometry.location.lat;
        var lng = response.results[0].geometry.location.lng;
        console.log(lat,lng);
  
    });

});
