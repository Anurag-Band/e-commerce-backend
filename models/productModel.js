const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a product name"],
      trim: true,
      maxlength: [120, "product name should not be more than 120 charecters"],
    },
    price: {
      type: Number,
      required: [true, "please provide a product price"],
      maxlength: [6, "product price should not be more than 6 digits"],
    },
    description: {
      type: String,
      required: [true, "please provide product description"],
    },
    photos: [
      {
        public_id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [
        true,
        "please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies",
      ],
      enum: {
        values: ["shortsleeves", "longsleeves", "sweatshirts", "hoodies"],
        message:
          "please select category ONLY from- short-sleeves, long-sleeves, sweat-shirts and hoodies",
      },
    },
    brand: {
      type: String,
      required: [true, "please provide a brand for clothing"],
    },
    stock: {
      type: Number,
      required: [true, "please add a number in stock"],
    },
    // above fields are required ⤴️⤴️
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// name
// price
// description
// photos []
// category
// brand
// stock
// ratings
// numOfReviews
// reviews [user, name, comment, rating]
// user (to know who created this product)
// createdAt

module.exports = mongoose.model("Product", productSchema);
