const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"], // fix typo: require → required
      trim: true,
      unique: [true, "Product name must be unique!"], // fix typo: unquie → unique
    },
    qty: {
      type: Number,
      required: true, // fix typo: require → required
    },
    image: {
      type: String,
    },
  },
  { timestamps: true } // fix typo: timestamp → timestamps
);


module.exports = mongoose.model("Product", productSchema);
