"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useRef, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Createdonor = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const input = {
    name: "",
  };
  const [formData, setFormData] = useState(input);

  // Handle change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editor = useRef("");
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", editor.current.getContents());

    console.log(form);

    setLoading(true);
    const res = await fetch(`${apiUrl}/api/donor`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: form,
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
      editor.current.setContents("");
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
      <Seo title={"Create Donor"} />
      <Pageheader
        currentpage="Create Donor"
        activepage="Donors"
        mainpage="Create Donor"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Donor /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createDonor"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Donor Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Donor Title"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Donor Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor  height="130px" getSunEditorInstance={getSunEditorInstance} />
                  </div>
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createDonor"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Donor
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Createdonor;
