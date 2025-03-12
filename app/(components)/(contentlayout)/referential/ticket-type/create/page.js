"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useRef, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const CreateTicketType = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const baseUrl = useSelector((state) => state.general.baseUrl);

  const input = {
    title: "",
    color: "#136ad0",
    is_default: false,
  };
  const [formData, setFormData] = useState(input);

  // Handle change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: name !== "is_default" ? value : e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    const res = await fetch(`${baseUrl}/api/ticket-type`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...formData,
      }),
    });
    setLoading(false);
    const result = await res.json();
    console.log(result);
    if (res.status === 201) {
      Swal.fire({
        title: "success",
        text: result.message,
        icon: "success",
      });
      setFormData(input);
    }

    if (res.status === 403) {
      let path = "/authentication/verify";
      router.push(path);
    }

    if (res.status === 410) {
      let path = "/";
      router.push(path);
    }
    console.log(result);
  };

  return (
    <Fragment>
      <Seo title={"Create  Ticket Type"} />
      <Pageheader
        currentpage="Create  Ticket Type"
        activepage=" Ticket Types"
        activeurl="/referential/ticket-type"
        mainpage="Create  Ticket Type"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Ticket Type /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createTicketType"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Type Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter  Ticket Type Title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Type Color :
                  </label>

                  <div className="border rounded-md p-1">
                    <input
                      type="color"
                      className="form-control form-control-color border-0"
                      id="exampleColorInput"
                      defaultValue="#136ad0"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      title="Choose your color"
                    ></input>
                  </div>
                </div>
                <div className="xl:col-span-4 col-span-12 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_default"
                    defaultValue=""
                    id="flexCheckDefault"
                    checked={formData.is_default}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Default type
                  </label>
                  <p>
                    If checked, this type will be automatically afffected to new
                    ticket
                  </p>
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createTicketType"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Ticket Type
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateTicketType;
