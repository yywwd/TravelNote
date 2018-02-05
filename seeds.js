var mongoose = require("mongoose"),
    Travelnote  = require("./models/travelnote"),
    Comment     = require("./models/comment");

var data = [
    {
        name: "Cloud",
        image: "https://farm7.staticflickr.com/6084/6027569462_66f0abd31d.jpg",
        description: "daslfhldshflidas"
    },
    {
        name: "Sunset",
        image: "https://farm8.staticflickr.com/7619/16210674244_9cb0b4a62b.jpg",
        description: "dfbfbfgbfgbfg"
    },
    {
        name: "Sunrise",
        image: "https://farm7.staticflickr.com/6211/7036451063_171fabe8d7.jpg",
        description: "dsgfhghhythnghn"
    }
    ]

function seedDB(){
    // Remove all travelnotes
    Travelnote.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed travelnotes!");
        // add a few travelnotes
        data.forEach(function(seed){
          Travelnote.create(seed, function(err, travelnote){
              if(err){
                  console.log(err);
              } else{
                  console.log("added a travelnote");
                  //create a comment
                  Comment.create(
                      {
                          text: "This place is great, but I wish there was internet",
                          author: "First"
                      }, function(err, comment){
                          if(err){
                              console.log(err);
                          } else{
                              travelnote.comments.push(comment);
                              travelnote.save();
                              console.log("Create a new comment");
                          }
                      });
              }
          });
        });
    });
    
    // add a few comment
}

module.exports = seedDB;
