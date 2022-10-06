import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingBar from "react-top-loading-bar";

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });

    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });

    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }

    const myuser = JSON.parse(localStorage.getItem("myuser"));

    if (myuser) {
      setUser({ value: myuser.token, email: myuser.email });
    }

    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("myuser");
    setUser({ value: null });
    setKey(Math.random());
    router.push("/");
  };

  // myCart = cart (state)
  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));

    let subt = 0;
    let keys = Object.keys(myCart);

    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }

    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let myCart = cart;

    if (itemCode in cart) {
      myCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      myCart[itemCode] = { qty: 1, price, name, size, variant };
    }

    setCart(myCart);
    saveCart(myCart);
  };

  const buyNow = (itemCode, qty, price, name, size, variant) => {
    let myCart = {};
    myCart[itemCode] = { qty: 1, price, name, size, variant };

    setCart(myCart);
    saveCart(myCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCart({});

    console.log("cart has been cleared");
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    let myCart = JSON.parse(JSON.stringify(cart));

    if (itemCode in cart) {
      myCart[itemCode].qty = cart[itemCode].qty - qty;
    }

    if (myCart[itemCode].qty <= 0) {
      delete myCart[itemCode];
    }

    setCart(myCart);
    saveCart(myCart);
  };

  return (
    <>
      <LoadingBar
        color="black"
        height={3}
        shadow={true}
        waitingTime={400}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {key && (
        <Navbar
          logout={logout}
          user={user}
          key={key}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
        />
      )}
      <Component
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        buyNow={buyNow}
        {...pageProps}
      />
      <Footer />
    </>
  );
}

export default MyApp;
