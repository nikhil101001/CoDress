import Order from "../../models/Order";
import connectDB from "../../middleware/mongoose";
import Product from "../../models/Product";

// postTransaction is just sending the body
const handler = async (req, res) => {
  let order;
  // validate paytm checksum --[pending]

  // update status into Orders tabel after checeking the transaction status
  // If payment Success
  if (req.body.STATUS === "TXN_SUCCESS") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      { status: "Paid", paymentInfo: JSON.stringify(req.body) }
    );

    let products = order.products;

    for (let slug in products) {
      await Product.findOneAndUpdate(
        { slug },
        { $inc: { avilableQty: -products[slug].qty } }
      );
    }

    res.redirect("/order?clearCart=1&id=" + order._id, 200);
  }

  // if Payment penfing
  else if (req.body.STATUS === "PENDING") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      { status: "Pending", paymentInfo: JSON.stringify(req.body) }
    );
  }

  // IF payment Failure
  else if (req.body.STATUS === "TXN_FAILURE") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      { status: "Failure", paymentInfo: JSON.stringify(req.body) }
    );

    res.redirect("/checkout", 200);
  }
  // initaiate shipping

  // redirect user to the order confirmation

  // res.status(200).json({ body: req.body });
};

export default connectDB(handler);
