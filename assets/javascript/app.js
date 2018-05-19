$(document).ready(function(){
    
 
    


    $("#userSubmit").on("click", function(){
        
        event.preventDefault();

        var userZip = $("#zipCode").val();

        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json?address="+userZip,
            method: "GET"
            }).then(function(response){
                console.log(response)
              
                var lat = response.results[0].geometry.location.lat;
                var lng = response.results[0].geometry.location.lng;
                console.log(lat,lng);
          
            });
        
    
});

});
