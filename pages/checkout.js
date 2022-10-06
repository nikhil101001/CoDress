import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cart, addToCart, removeFromCart, subTotal, clearCart }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [user, setUser] = useState({ value: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("myuser"));

    if (user.token) {
      setUser(user);
      setEmail(user.email);
    }
  }, []);

  const handelChange = async (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "address") {
      setAddress(e.target.value);
    } else if (e.target.name === "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length === 6) {
        let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
        let pinJson = await pins.json();
        // e.target.value = pincode -- here
        if (Object.keys(pinJson).includes(e.target.value)) {
          setCity(pinJson[e.target.value][0]);
          setState(pinJson[e.target.value][1]);
        } else {
          setState("");
          setCity("");
        }
      } else {
        setState("");
        setCity("");
      }
    }
    if (
      name.length >= 2 &&
      phone.length >= 10 &&
      address.length >= 5 &&
      pincode.length >= 4
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const initiatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());

    // get a transaction token
    const data = { cart, subTotal, oid, email, name, address, pincode, phone };

    // using fetch api
    let trans = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    let txnRes = await trans.json();

    if (txnRes.success) {
      let txnToken = txnRes.txnToken;

      var config = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: oid /* update order id */,
          token: txnToken /* update token value */,
          tokenType: "TXN_TOKEN",
          amount: subTotal /* update amount */,
        },
        handler: {
          notifyMerchant: function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
        },
      };

      window.Paytm.CheckoutJS.init(config)
        .then(function onSuccess() {
          // after successfully updating configuration, invoke JS Checkout
          window.Paytm.CheckoutJS.invoke();
        })
        .catch(function onError(error) {
          console.log("error => ", error);
        });
    } else {
      clearCart();
      toast.error(txnRes.error, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script
        type="application/javascript"
        src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
        crossorigin="anonymous"
      />

      <div className="container m-auto min-h-screen">
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-12 mx-auto">
            <div className="flex flex-col text-center w-full mb-12">
              <h2 className="text-2xl font-medium title-font mb-4 text-gray-900">
                Checkout
              </h2>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base font-semibold">
                Submit the Delivey details for proceed
              </p>
            </div>
            <div className="lg:w-1/2 md:w-2/3 mx-auto">
              <div className="flex flex-wrap -m-2 justify-center">
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={handelChange}
                      value={name}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Enter your Full Name"
                    />
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Email
                    </label>
                    {user && user.email ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="Enter your Email Id"
                        readOnly={true}
                      />
                    ) : (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={handelChange}
                        value={email}
                        className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="Enter your Email Id"
                      />
                    )}
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label
                      htmlFor="address"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      onChange={handelChange}
                      value={address}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="leading-7 text-sm text-gray-600"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={handelChange}
                      value={phone}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Enter your 10 Digit Phone Number"
                    />
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="pincode"
                      className="leading-7 text-sm text-gray-600"
                    >
                      PinCode (Shipping only to India)
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      onChange={handelChange}
                      value={pincode}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Enter your PinCode to verify"
                    />
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="state"
                      className="leading-7 text-sm text-gray-600"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      onChange={handelChange}
                      value={state}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
                <div className="p-2 w-full md:w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="city"
                      className="leading-7 text-sm text-gray-600"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      onChange={handelChange}
                      value={city}
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-black focus:bg-white focus:ring-2 focus:ring-slate-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Review cart item */}

            <div className="flex flex-col w-full my-12">
              <h2 className="text-xl font-medium title-font text-gray-900 text-center">
                Review Cart Item & Pay
              </h2>
              <div className=" p-6 my-4 md:p-8 shadow-xl bg-slate-200">
                <ol className="mb-2 list-decimal font-semibold">
                  {Object.keys(cart).length === 0 && (
                    <div className="text-center">No item in Your cart</div>
                  )}
                  {/* k is item code */}
                  {Object.keys(cart).map((k) => {
                    return (
                      <li key={k}>
                        <div className="py-2 item flex justify-between text-gray-900 flex-wrap border-b-2 border-black">
                          <div className="flex w-full md:w-1/3 font-semibold justify-center">
                            {cart[k].name} ({cart[k].size}/{cart[k].variant})
                          </div>
                          <div className="flex items-center justify-center w-1/3">
                            <AiFillMinusCircle
                              onClick={() => {
                                removeFromCart(
                                  k,
                                  1,
                                  cart[k].price,
                                  cart[k].name,
                                  cart[k].size,
                                  cart[k].variant
                                );
                              }}
                              className="cursor-pointer"
                            />
                            <div className="font-semibold mx-3">
                              {cart[k].qty}
                            </div>
                            <AiFillPlusCircle
                              onClick={() => {
                                addToCart(
                                  k,
                                  1,
                                  cart[k].price,
                                  cart[k].name,
                                  cart[k].size,
                                  cart[k].variant
                                );
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="flex items-center">
                            <div className="mx-3 font-bold">
                              ₹{cart[k].price * cart[k].qty}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="mr-3 font-bold text-black flex justify-end">
                  Subtotal : ₹{subTotal}
                </div>
              </div>
            </div>

            {/* pay button */}
            <div className="p-2 w-full">
              <Link href="/checkout">
                <button
                  disabled={disabled}
                  onClick={initiatePayment}
                  className="disabled:bg-slate-500 flex mx-auto text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-slate-800 rounded text-lg"
                >
                  Pay ₹{subTotal}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Checkout;
