"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Editproject = ({ params }) => {
  const { id } = params;
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [donors, setDonors] = useState([]);
  const [managers, setManagers] = useState([]);
  const [logo, setLogo] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const input = {
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    code: "",
    budget: 0.0,
    logo: null,
    project_status_id: "",
    program_id: "",
    donor_id: "",
    manager_id: "",
    kobo_project_id: "",
  };
  const [formData, setFormData] = useState(input);
  useEffect(() => {
    if (session?.access_token) {
      getProject();
      getStatus();
      getPrograms();
      getDonors();
    }
  }, [session]);
  const getProject = async () => {
    const res = await fetch(`${apiUrl}/api/project/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const result = await res.json();

    if (result.id) {
      setLogo(result.logo);
      setFormData({
        ...result,
        logo: null,
        start_date: new Date(result.start_date),
        end_date: new Date(result.end_date),
      });
    }
  };
  const getStatus = async () => {
    const res = await fetch(`${apiUrl}/api/projects-statuses/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      let tmp = result.map((item) => {
        return { value: item.id, label: item.title };
      });
      setStatuses(tmp);
    }
    console.log(result);
  };
  const getPrograms = async () => {
    const res = await fetch(`${apiUrl}/api/programs/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      let tmp = result.map((item) => {
        return { value: item.id, label: item.title };
      });
      setPrograms(tmp);
    }
    console.log(result);
  };
  const getDonors = async () => {
    const res = await fetch(`${apiUrl}/api/donors/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      let tmp = result.map((item) => {
        return { value: item.id, label: item.name };
      });
      setDonors(tmp);
    }
    console.log(result);
  };

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
    if (formData.logo) {
      form.append("logo", formData.logo[0].file, formData.logo[0].file.name);
    }
    form.append("description", editor.current.getContents());
    form.append("code", formData.code);
    form.append("program_id", formData.program_id);
    form.append("budget", formData.budget);
    form.append("donor_id", formData.donor_id);
    form.append("project_status_id", formData.project_status_id);
    form.append("kobo_project_id", formData.kobo_project_id);
    form.append(
      "manager_id",
      Number.isInteger(formData.manager_id) ? formData.manager_id : ""
    );
    form.append("start_date", formData.start_date.toISOString().split("T")[0]);
    form.append("end_date", formData.end_date.toISOString().split("T")[0]);
    form.append("_method", "PUT");
    console.log("formdata", formData);
    console.log(form);

    setLoading(true);
    const res = await fetch(`${apiUrl}/api/project/${id}`, {
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
      <Seo title={"Create Prject"} />
      <Pageheader
        currentpage="Create Prject"
        activepage="Prjects"
        mainpage="Create Prject"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex justify-between">
              <div className="box-title">
                Create Prject /
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/project-management/projects/${id}`}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                >
                  <i className="ri-eye-line align-middle me-1 font-semibold"></i>
                  View Project
                </Link>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createPrject"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Prject Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Prject Title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-50">
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
                    value={
                      formData.project_status_id
                        ? statuses.find(
                            (row) => row.value === formData.project_status_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-50"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Prject Code :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Prject code"
                    name="code"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
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
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Project Budget
                    :
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Prject Budget in USD"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
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
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Manager :</label>
                  <Select
                    name="manager_id"
                    onChange={(e) =>
                      handleChange("manager_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={managers}
                    value={
                      formData.manager_id
                        ? manager.find(
                            (row) => row.value === formData.manager_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-10"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Prject Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor
                      setContents={formData.description}
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
                    Logo
                  </label>
                  <div className="w-full flex justify-center items-center border-2 border-dashed rounded-md p-2 mb-2 ">
                    <img src={logo} className="w-12" />
                  </div>
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
                form="createPrject"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Prject
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Editproject;
