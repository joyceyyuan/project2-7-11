//import the model

const Trail = require("../models/trail");

module.exports = {
    create,
    delete: deleteReview,
    edit,
    // update
};

function create(req, res) {
    console.log(req.user, " <- this is req.user from review controller create")
    console.log(req.params.id, " <- params trail id");
    console.log(req.body, " <- the contents of the form aka the review");
    // First we have to find the trail
    Trail.findById(req.params.id, function (err, trailDocument) {
    // then we need to add the review (aka req.body) to that trails reviews array
    console.log(trailDocument, " <- trailDocument");
    // user centric CRUD!
    // req.user comes from passport! and it is the userDocument of the logged client
    req.body.userId = req.user._id;
    req.body.userName =req.user.name;
    req.body.email = req.user.email;
    console.log(req.body, " <- updated contents of the form aka the review");
    trailDocument.reviews.push(req.body); // <- mutating (changing) the document
    // that we found from the database,
    // so when we do that, we need to tell the database we changed something,
    // so we have to save the document
    trailDocument.save(function(err) {
        // console.log(trailDocument,'<-this is trail document in save function');
        console.log(trailDocument.reviews,'this is the reviews of trailDocument')
        res.redirect(`/trails/${req.params.id}`);
        });
    });
}



function deleteReview(req, res) {
    // Note the cool "dot" syntax to query on the property of a subdoc
    Trail.findOne({'reviews._id': req.params.id}, function(err, trail) {
      // Find the review subdoc using the id method on Mongoose arrays
      // https://mongoosejs.com/docs/subdocs.html
        const reviewSubdoc = trail.reviews.id(req.params.id);
      // Ensure that the review was created by the logged in user
        if (!reviewSubdoc.userId.equals(req.user._id)) return res.redirect(`/trails/${trail._id}`);
      // Remove the review using the remove method of the subdoc
        reviewSubdoc.remove();
      // Save the updated trail
        trail.save(function(err) {
        // Redirect back to the trail's show view
        res.redirect(`/trails/${trail._id}`);
        });
    });
}

function edit(req, res) {
    res.render ('trails/reviews',);
}

// function update(req, res) {
//     // Note the cool "dot" syntax to query on the property of a subdoc
//     Trail.findOne({'reviews._id': req.params.id}, function(err, trail) {
//       // Find the review subdoc using the id method on Mongoose arrays
//       // https://mongoosejs.com/docs/subdocs.html
//         const reviewSubdoc = trail.reviews.id(req.params.id);
//       // Ensure that the review was created by the logged in user
//         if (!reviewSubdoc.userId.equals(req.user._id)) return res.redirect(`/trails/${trail._id}`);
//       // Update the content of the review
//         reviewSubdoc.content = req.body.content;
//       // Save the updated trail
//         trail.save(function(err) {
//         // Redirect back to the trail's show view
//         res.redirect(`/trails/${trail._id}`);
//         });
//     });
// }
