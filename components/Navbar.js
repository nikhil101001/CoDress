import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AiOutlineShoppingCart,
  AiFillCloseCircle,
  AiFillPlusCircle,
  AiFillMinusCircle,
} from "react-icons/ai";
import { BsBagCheckFill, BsTrashFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";

const Navbar = ({
  logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  subTotal,
  clearCart,
}) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleCart = () => {
    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.remove("hidden");
      ref.current.classList.add("translatex-0");
    } else if (!ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
      ref.current.classList.add("hidden");
    }
  };

  const ref = useRef();

  return (
    <>
      <div className="flex items-center justify-center box-border py-3 px-4 flex-col md:flex-row md:justify-start shadow-md sticky top-0 bg-white z-[1]">
        <div className="logo mr-auto md:m-0">
          <Link href="/">
            <a className="mr-4">
              <Image
                src="/cdstroke.png"
                alt="Codress"
                width={512 / 8}
                height={316 / 8}
              />
            </a>
          </Link>
        </div>
        <div className="nav flex">
          <ul className="flex items-center px-2 space-x-3 font-bold">
            <Link href="/tshirts">
              <a>
                <li className="hover:text-gray-600">Tshirts</li>
              </a>
            </Link>
            <Link href="/hoodies">
              <a>
                <li className="hover:text-gray-600">Hoodies</li>
              </a>
            </Link>
            <Link href="/stickers">
              <a>
                <li className="hover:text-gray-600">Stickers</li>
              </a>
            </Link>
            <Link href="/mugs">
              <a>
                <li className="hover:text-gray-600">Mugs</li>
              </a>
            </Link>
          </ul>
        </div>
        <div className="cart absolute right-0 top-1 m-4 cursor-pointer flex space-x-4 items-center">
          <span
            onMouseOver={() => {
              setDropdown(true);
            }}
            onMouseLeave={() => {
              setDropdown(false);
            }}
          >
            {dropdown && (
              <div
                onMouseOver={() => {
                  setDropdown(true);
                }}
                onMouseLeave={() => {
                  setDropdown(false);
                }}
                className="dropdown bg-black p-2 px-6 text-white rounded-lg absolute top-[85%] right-1/2 my-1 drop-shadow-xl w-max font-semibold"
              >
                <ul>
                  <Link href="./myaccount">
                    <li className="border-black border-b-2 p-1 hover:border-white">
                      My Account
                    </li>
                  </Link>
                  <Link href="./orders">
                    <li className="border-black border-b-2 p-1 hover:border-white">
                      Orders
                    </li>
                  </Link>

                  <li
                    onClick={logout}
                    className="border-black border-b-2 p-1 hover:border-white"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}

            {user.value && <MdAccountCircle className="text-3xl" />}
          </span>

          {!user.value && (
            <Link href="/login">
              <a>
                <button className="px-4 border-black border-2 hover:bg-black hover:text-white transition-all rounded">
                  Login
                </button>
              </a>
            </Link>
          )}
          <AiOutlineShoppingCart onClick={toggleCart} className="text-3xl" />
        </div>

        {/* cart Sidebar */}
        <div
          ref={ref}
          className={` w-full md:w-[50%] h-[100vh] cartSidebar overflow-y-scroll fixed right-0 top-0 bg-slate-200 p-10 transform transition-transform shadow-2xl ${
            Object.keys(cart).length !== 0
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <h2 className="text-xl font-bold border-b-2 border-black py-2">
            Shopping cart
          </h2>
          <span
            onClick={toggleCart}
            className="absolute top-5 right-4 text-3xl cursor-pointer"
          >
            <AiFillCloseCircle />
          </span>

          <ol className="list-decimal font-semibold ">
            {Object.keys(cart).length === 0 && (
              <div className="text-center my-4">No item in Your cart</div>
            )}
            {/* k is item code */}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-6 justify-between">
                    <div className="flex font-semibold w-2/3 mx-2 ">
                      {cart[k].name} ({cart[k].size}/{cart[k].variant})
                    </div>
                    <div className="text-xl flex items-center">
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
                      <div className="font-semibold mx-3">{cart[k].qty}</div>
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
                    <div className="hidden md:block text-xl items-center">
                      <div className="font-semibold mx-3">
                        ₹{cart[k].price * cart[k].qty}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="font-bold mt-12">
            <span className="bg-slate-300 py-3 px-5">
              Subtotal : ₹{subTotal}
            </span>
          </div>

          <div className="flex mt-6  justify-center items-center flex-wrap">
            <Link href="/checkout">
              <a>
                <button
                  className="flex items-center text-white bg-black border-0 py-2
           px-4 focus:outline-none hover:bg-slate-800 rounded text-lg m-2"
                >
                  <BsBagCheckFill className="mr-2" />
                  Checkout
                </button>
              </a>
            </Link>
            <button
              onClick={clearCart}
              className="flex items-center text-white bg-black border-0 py-2
           px-4 focus:outline-none hover:bg-slate-800 rounded text-lg m-2"
            >
              <BsTrashFill className="mr-2" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
