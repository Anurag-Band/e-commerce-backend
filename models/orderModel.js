const mongoose = require("mongoose");

// shippingInfo{} ->> //{  phoneNo,
// user               //  Address,
// paymentInfo{}      //  city,
// taxAmount          //  postalCode,
// ShippingAmount     //  state,
// totalAmount        //  country  }
// orderStatus
// deliveredAt
// createdAt
// -------------------
// orderItems: [ {} ]
// - name
// - quantity
// - image[0]
// - price
// -product

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Address is Required"],
      },
      city: {
        type: String,
        required: [true, "city is Required"],
      },
      postalCode: {
        type: Number,
        required: [true, "postalCode is Required"],
      },
      state: {
        type: String,
        required: [true, "state is Required"],
      },
      phoneNumber: {
        type: Number,
        required: [true, "phoneNumber is Required"],
      },
      country: {
        type: String,
        required: [true, "country is Required"],
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentInfo: {
      id: {
        type: String,
      },
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
