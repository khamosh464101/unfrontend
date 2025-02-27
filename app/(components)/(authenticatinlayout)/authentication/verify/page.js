"use client";
import Seo from "@/shared/layout-components/seo/seo";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Twobasic = () => {
  const { data: session, status, update } = useSession();
  console.log(session);
  const router = useRouter();
  const [inputValues, setInputValues] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (currentId, nextId, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [currentId]: value,
    }));

    const nextInput = document.getElementById(nextId);

    if (nextInput) {
      nextInput.focus();
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    const valuesArray = Object.values(inputValues); // Extract values into an array
    const newCombinedString = valuesArray.join("");
    console.log(newCombinedString);
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ two_factor_code: newCombinedString }),
    });
    setLoading(false);
    const result = await res.json();
    console.log(res.status);
    if (res.status === 201) {
      await update({ twofa: false });
      console.log(session);
      router.push("/dashboards/projects");
    }

    if (res.status === 401) {
      Swal.fire({
        title: "warning",
        text: result.message,
        icon: "warning",
      });
    }

    if (res.status === 410) {
      let path = "/";
      router.push(path);
    }
    console.log(result);
  };

  const resend = async () => {
    // setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/api/verify/resend", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    // setLoading(false);
    if (res.status == 201) {
      alert("successfully send the twofa code");
    }
  };

  const sendToPhone = async () => {
    Swal.fire({
      title: "Success",
      text: "The code has been send to this phone number 0747566686!",
      icon: "success",
    });
  };

  return (
    <Fragment>
      <Seo title={"Twostepverification-basic"} />
      <div className="container">
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="grid grid-cols-12">
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12 flex flex-col">
              <div className="my-[3rem] flex justify-center">
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
                <div className="box-body sm:!p-[3rem]">
                  <p className="font-semibold mb-2 text-center text-xl">
                    Verify Your Account
                  </p>
                  <p className="mb-4 text-[#8c9097] dark:text-white/50 opacity-[0.7] font-normal text-center">
                    Enter the 6 digit code sent to the registered email Id.
                  </p>
                  {error && <span>{error}</span>}
                  <div className="grid grid-cols-12 gap-y-4">
                    <div className="xl:col-span-12 col-span-12 mb-1">
                      <form
                        id="verifyForm"
                        className="grid grid-cols-12 gap-4"
                        onSubmit={verify}
                      >
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="one"
                            value={inputValues.one}
                            onChange={(e) =>
                              handleChange("one", "two", e.target.value)
                            }
                            required={true}
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="two"
                            value={inputValues.two}
                            onChange={(e) =>
                              handleChange("two", "three", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="three"
                            value={inputValues.three}
                            onChange={(e) =>
                              handleChange("three", "four", e.target.value)
                            }
                            requried
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="four"
                            value={inputValues.four}
                            onChange={(e) =>
                              handleChange("four", "five", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="five"
                            value={inputValues.five}
                            onChange={(e) =>
                              handleChange("five", "six", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            maxLength={1}
                            className="!px-0 form-control w-full !rounded-md form-control-lg text-center !text-[1rem]"
                            id="six"
                            value={inputValues.six}
                            onChange={(e) =>
                              handleChange("six", null, e.target.value)
                            }
                            required
                          />
                        </div>
                      </form>

                      <div className="form-check mt-2 mb-0 !ps-0">
                        {/* <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="defaultCheck1"
                        /> */}
                        <label
                          className="form-check-label"
                          htmlFor="defaultCheck1"
                        >
                          {session?.twofa && (
                            <>
                              Did not recieve a code ?
                              <button
                                onClick={resend}
                                className="text-primary ms-2 inline-block"
                              >
                                Resend
                              </button>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="xl:col-span-12 col-span-12 grid mt-2">
                      <button
                        type="submit"
                        form="verifyForm"
                        className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                      >
                        {loading && (
                          <i class="las la-circle-notch animate-spin text-md"></i>
                        )}
                        Verify
                      </button>
                      <button
                        onClick={sendToPhone}
                        className="ti-btn ti-btn-lg bg-secondary text-white !font-medium dark:border-defaultborder/10"
                      >
                        Rceieve as SMS
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mt-4 text-danger">
                      <sup>
                        <i className="ri-asterisk"></i>
                      </sup>
                      Don't share the verification code with anyone !
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Twobasic;
