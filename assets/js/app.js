$(document).ready(function(){


         var number = 30;
         var intervalId;   
       
       $("#submit-btn").on("click", function(){
       

        var restArray = [];
        event.preventDefault();
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
              
   
                    var index1 = Math.floor(Math.random()* restArray.length)
                    var index2 = Math.floor(Math.random()* restArray.length)
                    
                    do{
                        index2 = Math.floor(Math.random()* restArray.length)
                    }while (index1==index2)

                    console.log(restArray[index1].restaurant.name,restArray[index2].restaurant.name)

                    var restaurants={
                        rest1:{
                            Name: restArray[index1].restaurant.name,
                            Img: restArray[index1].restaurant.featured_image,
                            Location: restArray[index1].restaurant.location.address,
                            Cost : restArray[index1].restaurant.average_cost_for_two,
                            Cousines : restArray[index1].restaurant.cuisines,
                            Rating : restArray[index1].restaurant.user_rating.aggregate_rating
                        },
                        rest2:{
                            Name: restArray[index2].restaurant.name,
                            Img: restArray[index2].restaurant.featured_image,
                            Location: restArray[index2].restaurant.location.address,
                            Cost : restArray[index2].restaurant.average_cost_for_two,
                            Cousines : restArray[index2].restaurant.cuisines,
                            Rating : restArray[index2].restaurant.user_rating.aggregate_rating
                        },
                        
                    }

            
 
              



              function appendRest1(){
                $("#rest1").empty()
                $("#rest1").append("<img src='"+restaurants.rest1.Img+ "'>")
                $("#rest1").append("<h1 class='rest-name'>"+restaurants.rest1.Name+ "</h1>")
                $("#rest1").append("<p class='rest-location'>"+restaurants.rest1.Location+ "</p>")
                $("#rest1").append("<p class='rest-cousines'>"+restaurants.rest1.Cousines+ "</p>")
                $("#rest1").append("<p class='rest-cost'>"+restaurants.rest1.Cost+ "</p>")
                $("#rest1").append("<p class='rest-rating'>"+restaurants.rest1.Rating+ "</p>")
              }
              
              function appendRest2(){
                $("#rest2").empty()
                $("#rest2").append("<img src='"+restaurants.rest2.Img+ "'>")
                $("#rest2").append("<h1 class='rest-name'>"+restaurants.rest2.Name+ "</h1>")
                $("#rest2").append("<p class='rest-location'>"+restaurants.rest2.Location+ "</p>")
                $("#rest2").append("<p class='rest-cousines'>"+restaurants.rest2.Cousines+ "</p>")
                $("#rest2").append("<p class='rest-cost'>"+restaurants.rest2.Cost+ "</p>")
                $("#rest2").append("<p class='rest-rating'>"+restaurants.rest2.Rating+ "</p>")
              }


              appendRest1();
              appendRest2();
              
            });

         


            
            

            //   console.log(index1)
              
            //   restArray.splice(index1, 1);
            //   console.log(restArray)
   
              // var index2 = Math.floor(Math.random()* restArray.length)
              
              // for(var i=0; i<restArray.length; i++ ){

              // }
              
    
            // console.log(response)
        });

        //calls the run function on the click of the submit button
        run();
      });
      //timer run function
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
        alert("Time Up!");
          stop();
          
        }
      };
      //function to stop the timer
      function stop() {
        clearInterval(intervalId);
      };
    });