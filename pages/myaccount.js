import React, { useEffect } from "react";
import { useRouter } from "next/router";

const MyAccount = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router.query]);

  return <div className="min-h-screen">MyAccount</div>;
};

export default MyAccount;
