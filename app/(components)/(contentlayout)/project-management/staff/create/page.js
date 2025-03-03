"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import Swal from "sweetalert2";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Createstaff = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);

  const input = {
    name: "",
    position_title: "",
    personal_email: "",
    official_email: "",
    phone1: "",
    phone2: "",
    photo: "",
    duty_station: "",
    date_of_joining: new Date(),
    staff_status_id: "",
  };
  const [formData, setFormData] = useState(input);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (session?.access_token) {
      getStatus();
    }
  }, [session]);
  const getStatus = async () => {
    const res = await fetch(`${apiUrl}/api/staffs-statuses/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    if (result.length > 0) {
      let tmp = result.map((item) => {
        if (item.is_default) {
          setFormData({ ...formData, staff_status_id: item.id });
        }
        return { value: item.id, label: item.title };
      });
      setStatuses(tmp);
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
    form.append("name", formData.name);
    form.append("position_title", formData.position_title);
    form.append("personal_email", formData.personal_email);
    form.append("official_email", formData.official_email);
    form.append("phone1", formData.phone1);
    form.append("phone2", formData.phone2);
    form.append("photo", formData.photo[0].file, formData.photo[0].file.name);
    form.append("duty_station", formData.duty_station);
    form.append(
      "date_of_joining",
      formData.date_of_joining.toISOString().split("T")[0]
    );
    form.append("about", editor.current.getContents());
    form.append("staff_status_id", formData.staff_status_id);
    console.log("formdata", formData);
    console.log(form);

    setLoading(true);
    const res = await fetch(`${apiUrl}/api/staff`, {
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
      <Seo title={"Create Staff"} />
      <Pageheader
        currentpage="Create Staff"
        activepage="Staffs"
        mainpage="Create Staff"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Staff /
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createStaff"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter name"
                    name="name"
                    required
                    value={formData.name}
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
                    name="staff_status_id"
                    required
                    onChange={(e) =>
                      handleChange("staff_status_id", e.value ? e.value : null)
                    }
                    isClearable={true}
                    options={statuses}
                    value={
                      formData.staff_status_id
                        ? statuses.find(
                            (row) => row.value === formData.staff_status_id
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
                    <span className="text-red-500 mr-2">*</span> Position Title
                    :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter position title"
                    name="position_title"
                    required
                    value={formData.position_title}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="hs-leading-icon" className="form-label">
                    Personal email address:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-leading-icon"
                      name="personal_email"
                      className="form-control"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="you@gmail.com"
                      value={formData.personal_email}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <i className="ri-mail-line text-neutral-400 text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="hs-leading-icon" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Official email
                    address:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-leading-icon"
                      name="official_email"
                      className="form-control"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="you@site.com"
                      required
                      value={formData.official_email}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <i className="ri-mail-line text-neutral-400 text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="hs-leading-icon" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Phone 1:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-leading-icon"
                      name="phone1"
                      className="form-control"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="+93XXXXXXXXX"
                      required
                      value={formData.phone1}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <i className="ri-phone-line text-neutral-400 text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="hs-leading-icon" className="form-label">
                    Phone 2:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="hs-leading-icon"
                      name="phone2"
                      className="form-control"
                      style={{ paddingLeft: "3rem" }}
                      placeholder="+93XXXXXXXXX"
                      value={formData.phone2}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                      <i className="ri-phone-line text-neutral-400 text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Duty station :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter duty station"
                    name="duty_station"
                    value={formData.duty_station}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    required
                  />
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label"> Date of Joining :</label>
                  <div className="form-group ">
                    <div className="input-group z-50">
                      <div className="input-group-text text-muted !border-e-0 ">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10 z-50"
                        selected={formData.date_of_joining}
                        onChange={(date) =>
                          handleChange("date_of_joining", date)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Staff Description :
                  </label>
                  <div id="project-descriptioin-editor">
                    <SunEditor getSunEditorInstance={getSunEditorInstance} />
                  </div>
                </div>

                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Photo
                  </label>
                  <FilePond
                    files={formData.photo}
                    onupdatefiles={(fileItem) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        photo: fileItem,
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
                form="createStaff"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Createstaff;
