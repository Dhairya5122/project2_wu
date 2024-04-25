const mongoose = require("mongoose");

const { Schema } = mongoose;
const ProductSchema = new Schema({
  product: {
    type: String,
  },
  pimage: {
    type: String,
  },
  price: {
    type: String,
  },
  qty: {
    type: String,
  },
  desc: {
    type: String,
  },
  price: {
    type: String,
  },
  instock: {
    type: String,
  },

  // register: { type: Schema.Types.ObjectId, ref: "registers" },
});

module.exports = mongoose.model("product", ProductSchema);
