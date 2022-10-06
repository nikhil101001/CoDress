import React, { useEffect } from "react";
import Order from "../models/Order";
import mongoose from "mongoose";
import { useRouter } from "next/router";

const MyOrder = ({ order, clearCart }) => {
  const products = order.products;
  const router = useRouter();

  useEffect(() => {
    if (router.query.clearCart == 1) {
      clearCart();
    }
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-900 tracking-widest">
                CODRESS.COM
              </h2>
              <h1 className="text-gray-900 text-2xl md:text-3xl title-font font-medium mb-4">
                Order ID : #{order.orderId}
              </h1>
              <span className="leading-relaxed mb-4">
                Yayy! Order has been successfully placed!
                <span className="block">
                  Your Payment status is:{" "}
                  <span className="font-semibold">{order.status}</span>
                </span>
              </span>

              <div className="flex font-bold">
                <a className="flex-grow text-gray-900 py-2 px-1 text-lg">
                  Description
                </a>
                <a className="flex-grow border-gray-300 py-2 px-1 text-lg">
                  Quantity
                </a>
                <a className="flex-grow border-gray-300 py-2 px-1 text-lg">
                  Price
                </a>
              </div>

              {Object.keys(products).map((key) => {
                return (
                  <div
                    key={key}
                    className="flex border-t border-b border-gray-200 py-2"
                  >
                    <span className=" text-gray-900">
                      {products[key].name} ({products[key].size}/
                      {products[key].variant})
                    </span>
                    <span className="m-auto text-gray-900 px-2">
                      {products[key].qty}
                    </span>
                    <span className="text-gray-900 m-auto">
                      ₹{products[key].qty * products[key].price}
                    </span>
                  </div>
                );
              })}

              <div className="md:flex my-4 space-y-4 md:space-y-0 text-center md:space-x-4">
                <span className="w-full title-font font-medium text-2xl text-gray-900 px-2">
                  SubTotal : ₹{order.amount}
                </span>
                <br />
                <button className="w-full ml-auto text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-800 rounded">
                  Track Order
                </button>
              </div>
            </div>
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src="/order.jpg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let order = await Order.findById(context.query.id);
  console.log(context);
  return {
    props: { order: JSON.parse(JSON.stringify(order)) }, // will be passed to the page component as props
  };
}

export default MyOrder;
