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
const EditStaffStatus = ({ params }) => {
  const { id } = params;
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const input = {
    title: "",
    color: "#136ad0",
    is_default: false,
  };
  const [formData, setFormData] = useState(input);

  useEffect(() => {
    if (session?.access_token) {
      getStatus();
    }
  }, [session, id]);
  const getStatus = async () => {
    const res = await fetch(`${apiUrl}/api/staffs-status/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "applicaton/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setFormData({ ...result });
    }
  };

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
    const res = await fetch(`${apiUrl}/api/staffs-status/${id}`, {
      method: "PUT",
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
      <Seo title={"Edit Staff Status"} />
      <Pageheader
        currentpage="Edit Staff Status"
        activepage="Staff Statuses"
        mainpage="Edit Staff Status"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Edit Staff Status /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createStaffStatus"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Status Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Staff Status Title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Status Color :
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
                    Default status
                  </label>
                  <p>
                    If checked, this status will be automatically afffected to
                    new staffs
                  </p>
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createStaffStatus"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Update Staff Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditStaffStatus;
