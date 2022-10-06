import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/router";

const Forgot = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="/cdstroke.png"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Or{" "}
              <Link href="/login">
                <a className="font-medium text-black hover:text-slate-800">
                  Login
                </a>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <AiOutlineArrowRight />
                </span>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forgot;
