"use client";
import Seo from "@/shared/layout-components/seo/seo";
import axios from "axios";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Signinbasic = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading" && session?.twofa === false) {
      return router.push("/dashboards/projects");
    }
  }, session);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  const signin = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      username: email,
      password,
      redirect: true,
      callbackUrl: "/authentication/verify",
    });

    setLoading(false);
  };

  const [passwordshow1, setpasswordshow1] = useState(false);

  return (
    <html>
      <body>
        <Seo title={"Signin-basic"} />
        {status !== "loading" && (
          <div className="container">
            <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
              <div className="grid grid-cols-12">
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
                  <div className="my-[2.5rem] flex justify-center">
                    <Link href="/dashboards/crm/">
                      <img
                        src="../../../assets/images/brand-logos/desktop-logo.png"
                        alt="logo"
                        className="desktop-logo"
                      />
                      <img
                        src="../../../assets/images/brand-logos/desktop-dark.png"
                        alt="logo"
                        className="desktop-dark"
                      />
                    </Link>
                  </div>
                  <div className="box">
                    <div className="box-body !p-[3rem]">
                      <p className="h5 font-semibold mb-2 text-center">
                        Sign In
                      </p>
                      <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                        Welcome! please submit your email ID & password to log
                        In.
                      </p>
                      <div className="grid grid-cols-12 gap-y-4">
                        <div className="xl:col-span-12 col-span-12">
                          <label
                            htmlFor="signin-username"
                            className="form-label text-default"
                          >
                            Email
                          </label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="form-control form-control-lg w-full !rounded-md"
                            id="signin-username"
                            placeholder="user name"
                            required={true}
                          />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-2">
                          <label
                            htmlFor="signin-password"
                            className="form-label text-default block"
                          >
                            Password
                            <Link
                              href="/authentication/reset-password/reset-basic/"
                              className="float-right text-danger"
                            >
                              Forget password ?
                            </Link>
                          </label>
                          <div className="input-group">
                            <input
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              type={passwordshow1 ? "text" : "password"}
                              className="form-control form-control-lg !border-s !rounded-s-md"
                              id="signin-password"
                              placeholder="password"
                              required={true}
                            />
                            <button
                              onClick={() => setpasswordshow1(!passwordshow1)}
                              aria-label="button"
                              className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                              type="button"
                              id="button-addon2"
                            >
                              <i
                                className={`${
                                  passwordshow1
                                    ? "ri-eye-line"
                                    : "ri-eye-off-line"
                                } align-middle`}
                              ></i>
                            </button>
                          </div>
                          <div className="mt-2">
                            <div className="form-check !ps-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue=""
                                id="defaultCheck1"
                              />
                              <label
                                className="form-check-label text-[#8c9097] dark:text-white/50 font-normal"
                                htmlFor="defaultCheck1"
                              >
                                Remember password ?
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="xl:col-span-12 col-span-12 grid mt-2">
                          <button
                            onClick={signin}
                            className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                          >
                            {loading && (
                              <i class="las la-circle-notch animate-spin"></i>
                            )}
                            Sign In
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
};

export default Signinbasic;
