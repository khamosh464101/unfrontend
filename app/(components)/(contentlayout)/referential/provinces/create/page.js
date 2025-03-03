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
const CreateProvince = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const baseUrl = useSelector((state) => state.general.baseUrl);

  const input = {
    name: "",
    name_fa: "",
    name_pa: "",
    longitude: "",
    latitude: "",
    code: "",
  };
  const [formData, setFormData] = useState(input);

  // Handle change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({
      ...prevData,
    [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);
    const res = await fetch(`${baseUrl}/api/province`, {
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
      <Seo title={"Create Province"} />
      <Pageheader
        currentpage="Create Province"
        activepage="Provinces"
        mainpage="Create Province"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Province /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createProvince"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name Farsi :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province name farsi"
                    name="name_fa"
                    required
                    value={formData.name_fa}
                    onChange={handleChange}
                  />
                  
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name Pashto :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province name pashto"
                    name="name_pa"
                    required
                    value={formData.name_pa}
                    onChange={handleChange}
                  />
                  
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Latitude :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province latitude"
                    name="latitude"
                    required
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                  
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Longitude :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province longitude"
                    name="longitude"
                    required
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                  
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Code :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter province code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                  />
                  
                </div>
         
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createProvince"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Province
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProvince;
