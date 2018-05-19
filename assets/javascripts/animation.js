$(document).ready(function(){
    // define elements variable 
    var header = "#header";
    var form = "form";

    // define TimelineMax objects
    var header_t = new TimelineMax({repeat:-1, repeatDelay:1});
    var form_t = new TimelineMax({repeat:0, repeatDelay:1});

    // modify TimelineMax objects
    header_t.to( header, 1, {color: "white"})
            .to( header, 1, {color: "teal"});
    
    form_t.to( form, 1, {opacity: 0.3})
          .to( form, 1, {opacity: 0.6})
          .to( form, 1, {opacity: 1.0});

    // play TimelineMax objects
    header_t.play();
    form_t.play();
  
})
