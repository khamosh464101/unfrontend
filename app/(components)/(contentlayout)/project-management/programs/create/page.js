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
const Createprogram = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const input = {
    title: "",
    logo: null,
    program_status_id: "",
  };
  const [formData, setFormData] = useState(input);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (session?.access_token) {
      getStatus();
    }
  }, [session]);
  const getStatus = async () => {
    const res = await fetch(`${apiUrl}/api/programs-statuses/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      let tmp = result.map((item) => {
        if (item.is_default) {
          setFormData({ ...formData, program_status_id: item.id });
        }
        return { value: item.id, label: item.title };
      });
      setStatuses(tmp);
    }
    console.log(result);
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
    form.append("title", formData.title);
    form.append("logo", formData.logo[0].file, formData.logo[0].file.name);
    form.append("description", editor.current.getContents());
    form.append("program_status_id", formData.program_status_id);
    console.log(form);

    setLoading(true);
    const res = await fetch(`${apiUrl}/api/program`, {
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
      <Seo title={"Create Program"} />
      <Pageheader
        currentpage="Create Program"
        activepage="Programs"
        mainpage="Create Program"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Program /
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createProgram"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Program Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Program Title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-50">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Status :
                  </label>
                  <Select
                    name="program_status_id"
                    required
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        program_status_id: e ? e.value : null,
                      }))
                    }
                    isClearable={true}
                    options={statuses}
                    value={
                      formData.program_status_id
                        ? statuses.find(
                            (row) => row.value === formData.program_status_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Program Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor getSunEditorInstance={getSunEditorInstance} />
                  </div>
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Logo
                  </label>
                  <FilePond
                    files={formData.logo}
                    onupdatefiles={(fileItem) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        logo: fileItem,
                      }))
                    }
                    allowMultiple={false}
                    acceptedFileTypes={["image/*"]}
                    maxFiles={1}
                    name="files"
                    labelIdle="Drag & Drop your file here or click "
                  />
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createProgram"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Program
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Createprogram;
