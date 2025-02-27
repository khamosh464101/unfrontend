"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { Fragment, useEffect, useRef, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Edit = ({ params }) => {
  const input = {
    name: "",
  };
  const { id } = params;
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [formData, setFormData] = useState({ input });
  const [logo, setLogo] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (session?.access_token) {
      getDonor();
    }
  }, [session, id]);
  const getDonor = async () => {
    const res = await fetch(`${apiUrl}/api/donor/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "applicaton/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setLogo(result.logo);
      setFormData({ ...result, logo: null });
    }
  };

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
    form.append("_method", "PUT");
    console.log(form);

    setLoading(true);
    console.log(form);
    const res = await fetch(`${apiUrl}/api/donor/${id}`, {
      method: "POST",
      body: form,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
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
      setLogo(result?.data.logo);
      setFormData({ ...result.data, logo: null });
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
      <Seo title={"Edit Donor"} />
      <Pageheader
        currentpage="Edit Donor"
        activepage="Donors"
        mainpage="Edit Donor"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex justify-between">
              <div className="box-title ">
                Edit Donor /
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
                    <SunEditor
                      setContents={formData.description}
                      getSunEditorInstance={getSunEditorInstance}
                    />
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
                Update Donor
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Edit;
