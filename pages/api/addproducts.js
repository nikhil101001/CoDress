import Product from "../../models/Product";
import connectDB from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    for (let i = 0; i < req.body.length; i++) {
      let p = new Product({
        title: req.body[i].title,
        slug: req.body[i].slug,
        desc: req.body[i].desc,
        img: req.body[i].img,
        category: req.body[i].category,
        size: req.body[i].size,
        color: req.body[i].color,
        price: req.body[i].price,
        avilableQty: req.body[i].avilableQty,
      });
      await p.save();
    }
    res.status(200).json({ success: "The product is added" });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDB(handler);
