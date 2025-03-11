"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import {
  getDonorsSelect2,
  getProgramsSelect2,
  getProjectStatuses,
  getStaffSelect2,
} from "@/shared/redux/features/apiSlice";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Createproject = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    projectStatuses: statuses,
    projectStatusesDefault: defaultStatus,
    programs,
    donors,
    staff: managers,
    isLoading,
    error,
  } = useSelector((state) => state.api || {});

  const input = {
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    code: "",
    estimated_budget: "",
    spent_budget: "",
    logo: null,
    project_status_id: "",
    program_id: "",
    donor_id: "",
    manager_id: "",
    kobo_project_id: "",
  };
  const [formData, setFormData] = useState(input);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (session?.access_token) {
      dispatch(getProjectStatuses(session.access_token));
      dispatch(getProgramsSelect2(session.access_token));
      dispatch(getDonorsSelect2(session.access_token));
      dispatch(getStaffSelect2({ token: session.access_token, id: null }));
    }
  }, [session]);
  useEffect(() => {
    handleChange("project_status_id", defaultStatus.value);
  }, [defaultStatus]);

  // Handle change for text fields
  const handleChange = (name, value) => {
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
    form.append("code", formData.code);
    form.append("program_id", formData.program_id);
    form.append("estimated_budget", formData.estimated_budget);
    form.append("spent", formData.spent);
    form.append("donor_id", formData.donor_id);
    form.append("project_status_id", formData.project_status_id);
    form.append("kobo_project_id", formData.kobo_project_id);
    form.append("manager_id", formData.manager_id);
    form.append("start_date", formData.start_date.toISOString().split("T")[0]);
    form.append("end_date", formData.end_date.toISOString().split("T")[0]);
    console.log("formdata", formData);
    console.log(form);

    setLoading(true);
    const res = await fetch(`${apiUrl}/api/project`, {
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
      <Seo title={"Create Project"} />
      <Pageheader
        currentpage="Create Project"
        activepage="Projects"
        mainpage="Create Project"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Project /
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              {isLoading && (
                <div className="flex justify-center items-center space-x-2">
                  <i className="ri-loader-4-line animate-spin text-blue-500 text-3xl"></i>

                  <span className="text-lg text-blue-500">Loading...</span>
                </div>
              )}
              {error && (
                <div class="flex justify-center items-center space-x-2 bg-red-100 border border-red-500 text-red-700 p-4 rounded-md">
                  <i class="ri-error-warning-line text-3xl"></i>
                  <span class="text-lg">{error} || Something went wrong!</span>
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                id="createProject"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Project Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Project Title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Project Code :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Project code"
                    name="code"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12 z-50">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Status :
                  </label>
                  <Select
                    name="project_status_id"
                    required
                    onChange={(e) =>
                      handleChange(
                        "project_status_id",
                        e.value ? e.value : null
                      )
                    }
                    isClearable={true}
                    options={statuses}
                    value={defaultStatus}
                    className="js-example-placeholder-multiple w-full js-states z-50"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Program :
                  </label>
                  <Select
                    name="program_id"
                    required
                    onChange={(e) =>
                      handleChange("program_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={programs}
                    value={
                      formData.program_id
                        ? programs.find(
                            (row) => row.value === formData.program_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-40"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-4 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Donor :
                  </label>
                  <Select
                    name="donor_id"
                    required
                    onChange={(e) =>
                      handleChange("donor_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={donors}
                    value={
                      formData.donor_id
                        ? donors.find((row) => row.value === formData.donor_id)
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-30"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    <span className="text-red-500 mr-2">*</span> Manager :
                  </label>
                  <Select
                    name="manager_id"
                    onChange={(e) =>
                      handleChange("manager_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={managers}
                    value={
                      formData.manager_id
                        ? managers.find(
                            (row) => row.value === formData.manager_id
                          )
                        : null
                    }
                    required
                    className="js-example-placeholder-multiple w-full js-states z-10"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Estimated
                    Budget :
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    className="form-control"
                    id="input-label"
                    placeholder="Enter in USD"
                    name="estimated_budget"
                    required
                    value={formData.estimated_budget}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Spent Budget :
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    className="form-control"
                    id="input-label"
                    placeholder="Enter in USD"
                    name="spent_budget"
                    value={formData.spent_budget}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Kobo project ID :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Kobo project ID"
                    name="kobo_project_id"
                    value={formData.kobo_project_id}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Project Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor
                      height="130px"
                      getSunEditorInstance={getSunEditorInstance}
                    />
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span>Start Date :
                  </label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted !border-e-0">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={formData.start_date}
                        onChange={(date) => handleChange("start_date", date)}
                        dateFormat="Pp"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span>End Date :
                  </label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted !border-e-0">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={formData.end_date}
                        onChange={(date) => handleChange("end_date", date)}
                        dateFormat="Pp"
                        required
                      />
                    </div>
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
                form="createProject"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Createproject;
