"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import {
  getActivityStatuses,
  getActivityTypes,
  getProjectsSelect2,
  getStaffSelect2,
} from "@/shared/redux/features/apiSlice";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Editactivity = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const {
    activityStatuses: statuses,
    activityStatusesDefault: status,
    activityTypes: types,
    activityTypesDefault: type,
    projects,
    staff: managers,
    error,
    isLoading,
  } = useSelector((state) => state.api);
  const input = {
    title: "",
    starts_at: new Date(),
    ends_at: "",
    activity_status_id: "",
    activity_type_id: "",
    project_id: "",
    description: "",
    responsible_id: "",
  };

  const [formData, setFormData] = useState(input);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  useEffect(() => {
    handleChange("activity_status_id", status.value);
  }, [status]);
  useEffect(() => {
    handleChange("activity_type_id", type.value);
  }, [type]);

  useEffect(() => {
    if (session?.access_token) {
      dispatch(getActivityStatuses(session?.access_token));
      dispatch(getProjectsSelect2(session?.access_token));
      dispatch(getActivityTypes(session?.access_token));
      getActivity();
    }
  }, [session]);
  useEffect(() => {
    if (project) {
      dispatch(
        getStaffSelect2({ token: session?.access_token, id: project.value })
      );
    }
  }, [project]);

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

  const getActivity = async () => {
    const res = await fetch(`${baseUrl}/api/activity/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "appliation/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setProject({ label: result.project.title, value: result.project.id });
      delete result.project;
      delete result.status;
      delete result.tickets;
      delete result.types;
      delete result.logs;
      delete result.documents;
      delete result.responsible;
      delete result.gozars;
      delete result.created_at;
      delete result.updated_at;
      delete result.id;
      setFormData({
        ...result,
        starts_at: new Date(result.starts_at),
        ends_at: new Date(result.ends_at),
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    setLoading(true);
    const res = await fetch(`${baseUrl}/api/activity/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...formData,
        description: editor.current.getContents(),
        starts_at: formData.starts_at.toISOString().split("T")[0],
        ends_at: formData.ends_at?.toISOString().split("T")[0],
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
      <Seo title={"Edit Activity"} />
      <Pageheader
        currentpage="Edit Activity"
        activepage="Activties"
        activeurl="/project-management/activities"
        mainpage="Edit Activity"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex justify-between">
              <div className="box-title">
                Edit Activity /
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/project-management/activities/${id}`}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                >
                  <i className="ri-eye-line align-middle me-1 font-semibold"></i>
                  View Activity
                </Link>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createActivity"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Activity Title
                    :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Activity Title"
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
                    name="activity_status_id"
                    required
                    onChange={(e) =>
                      handleChange(
                        "activity_status_id",
                        e.value ? e.value : null
                      )
                    }
                    isClearable={true}
                    options={statuses}
                    value={
                      formData.activity_status_id
                        ? statuses.find(
                            (row) => row.value === formData.activity_status_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-50"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Project :
                  </label>
                  <Select
                    name="project_id"
                    required
                    onChange={(e) => {
                      handleChange("project_id", e.value ? e.value : null);
                      setProject(e);
                    }}
                    isClearable={true}
                    options={projects}
                    value={
                      formData.project_id
                        ? projects.find(
                            (row) => row.value === formData.project_id
                          )
                        : null
                    }
                    className="js-example-placeholder-multiple w-full js-states z-40"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Assigned to :
                  </label>
                  <Select
                    name="responsible_id"
                    required
                    onChange={(e) =>
                      handleChange("responsible_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={managers}
                    value={
                      formData.responsible_id
                        ? managers.find(
                            (row) => row.value === formData.responsible_id
                          )
                        : null
                    }
                    isDisabled={!project}
                    className="js-example-placeholder-multiple w-full js-states z-30"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    <span className="text-red-500 mr-2">*</span> Activity Type :
                  </label>
                  <Select
                    name="activity_type_id"
                    onChange={(e) =>
                      handleChange("activity_type_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={types}
                    value={
                      formData.activity_type_id
                        ? types.find(
                            (row) => row.value === formData.activity_type_id
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
                    Activity Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor
                      height="130px"
                      style={{ zIndex: "10 !important" }}
                      setContents={formData.description}
                      getSunEditorInstance={getSunEditorInstance}
                    />
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span>Starts At :
                  </label>
                  <div
                    className="form-group "
                    style={{ position: "relative", zIndex: 50 }}
                  >
                    <div className="input-group">
                      <div className="input-group-text text-muted !border-e-0">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-40"
                        selected={formData.starts_at}
                        onChange={(date) => handleChange("starts_at", date)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span>Ends At :
                  </label>
                  <div
                    className="form-group"
                    style={{ position: "relative", zIndex: 50 }}
                  >
                    <div className="input-group">
                      <div className="input-group-text text-muted !border-e-0">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-40"
                        selected={formData.ends_at}
                        onChange={(date) => handleChange("ends_at", date)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createActivity"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Update Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Editactivity;
