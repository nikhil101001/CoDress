import React from "react";
import Link from "next/link";
import Product from "../models/Product";
import mongoose from "mongoose";

const Hoodies = ({ products }) => {
  return (
    <>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-4 mx-auto">
          <div className="flex flex-wrap m-4 justify-center">
            {Object.keys(products).length === 0 && (
              <p>
                Sorry all the Hoodies are currently out of stock. New stock
                coming soon. Stay Tuned!
              </p>
            )}
            {Object.keys(products).map((item) => {
              return (
                <Link
                  passHref={true}
                  key={products[item]._id}
                  href={`/product/${products[item].slug}`}
                >
                  <div className="flex flex-col lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-5">
                    <img
                      alt="ecommerce"
                      className="block m-auto"
                      src={products[item].img}
                    />
                    <div className="mt-4 text-center md:text-start">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1 font-semibold">
                        Hoodies
                      </h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {products[item].title}
                      </h2>
                      <p className="mt-1 font-bold">₹{products[item].price}</p>
                      <div className="mt-1 font-semibold">
                        {products[item].size.includes("S") && (
                          <span className="mx-1 px-1 rounded shadow-gray-300 shadow-inner">
                            S
                          </span>
                        )}
                        {products[item].size.includes("M") && (
                          <span className="mx-1 px-1 rounded shadow-gray-300 shadow-inner">
                            M
                          </span>
                        )}
                        {products[item].size.includes("L") && (
                          <span className="mx-1 px-1 rounded shadow-gray-300 shadow-inner">
                            L
                          </span>
                        )}
                        {products[item].size.includes("XL") && (
                          <span className="mx-1 px-1 rounded shadow-gray-300 shadow-inner">
                            XL
                          </span>
                        )}
                        {products[item].size.includes("XXL") && (
                          <span className="mx-1 px-1 rounded shadow-gray-300 shadow-inner">
                            XXL
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-semibold">
                        {products[item].color.includes("black") && (
                          <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("red") && (
                          <button className="border-2 border-gray-300 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("blue") && (
                          <button className="border-2 border-gray-300 ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("yellow") && (
                          <button className="border-2 border-gray-300 ml-1 bg-yellow-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("green") && (
                          <button className="border-2 border-gray-300 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("white") && (
                          <button className="border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                        {products[item].color.includes("pink") && (
                          <button className="border-2 border-gray-300 ml-1 bg-pink-700 rounded-full w-6 h-6 focus:outline-none"></button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
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
  let products = await Product.find({ category: "hoodies" });

  let hoodies = {};
  for (let item of products) {
    if (item.title in hoodies) {
      if (
        !hoodies[item.title].color.includes(item.color) &&
        item.avilableQty > 0
      ) {
        hoodies[item.title].color.push(item.color);
      }
      if (
        !hoodies[item.title].size.includes(item.size) &&
        item.avilableQty > 0
      ) {
        hoodies[item.title].size.push(item.size);
      }
    } else {
      hoodies[item.title] = JSON.parse(JSON.stringify(item));
      if (item.avilableQty > 0) {
        hoodies[item.title].color = [item.color];
        hoodies[item.title].size = [item.size];
      }
    }
  }

  return {
    props: { products: JSON.parse(JSON.stringify(hoodies)) }, // will be passed to the page component as props
  };
}

export default Hoodies;
