const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creates the schema, which defines,
// what the documents (objects) in a mongodb collection (trails)
// will all look like

// Embed the Reviews in the trails
// One to many relationship
// One Trail has many Reviews, Review belongs to a Trail
const reviewSchema = new Schema(
    {
    content: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}, //< - we want to make sure a review is always tied to a user
    userName: String,
},
    {
    timestamps: true,
    }
);

const trailSchema = new Schema({
    name: {
    type: String,
    required: true,
    },
    location: String,
    length: { type: Number, min: 0},
    difficulty: {
    type: String,
    enum: ['Easy','Moderate','Hard'],
    default:'Easy'
    },
    routeType: {
    type: String,
    enum: ['Loop','Out & back','Point to point'],
    default:'Loop'
    },
    // One to Many relationshipt (many reviews)
    reviews: [reviewSchema],
});

// Create our model, which will create the collection,
// and return to us and object that can perform CRUD
// operations on that collection (typically you'll use the model in controller files)
module.exports = mongoose.model("Trail", trailSchema);