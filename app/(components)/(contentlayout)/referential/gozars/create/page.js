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
const CreateGozar = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const [districts, setDistricts] = useState([]);
  const [disctrictAll, setDistrictAll] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState(null);

  const input = {
    name: "",
    name_fa: "",
    name_pa: "",
    longitude: "",
    latitude: "",
    district_id: "",
  };
  const [formData, setFormData] = useState(input);

  useEffect(() => {
    if (session?.access_token) {
      getDistricts();
      getProvince();
    }
  }, [session]);
  const getProvince = async () => {
    const res = await fetch(`${baseUrl}/api/provinces/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      Swal.fire({
        title: "warning",
        text: "Something went wrong.",
        icon: "warning",
      });
    } else {
      const result = await res.json();
      const tmp = result.map((row) => {
        return { label: row.name, value: row.id };
      });
      setProvinces(tmp);
    }
  };
  const getDistricts = async () => {
    const res = await fetch(`${baseUrl}/api/districts/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      Swal.fire({
        title: "warning",
        text: "Something went wrong.",
        icon: "warning",
      });
    } else {
      const result = await res.json();
      const tmp = result.map((row) => {
        return { label: row.name, value: row.id, province_id: row.province_id };
      });
      setDistricts(tmp);
      setDistrictAll(tmp);
    }
  };

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
    const res = await fetch(`${baseUrl}/api/gozar`, {
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

  const onProvinceChange = (selectedProvince) => {
    setProvince(selectedProvince);
    console.log("this is selected", selectedProvince);
    const selected = disctrictAll.filter(
      (row) => row.province_id === selectedProvince?.value
    );

    setDistricts(selected);
    setFormData((prevData) => ({
      ...prevData,
      district_id: null,
    }));
  };

  return (
    <Fragment>
      <Seo title={"Create Gozar"} />
      <Pageheader
        currentpage="Create Gozar"
        activepage="Gozars"
        activeurl="/referential/gozars"
        mainpage="Create Gozar"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Gozar /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form
                onSubmit={handleSubmit}
                id="createGozar"
                className="grid grid-cols-12 gap-4"
              >
                <div className="xl:col-span-6 col-span-12 z-50">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Province:
                  </label>
                  <Select
                    name="province"
                    required
                    options={provinces}
                    value={province}
                    onChange={onProvinceChange}
                    className="js-example-placeholder-multiple w-full js-states"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select..."
                  />
                </div>
                <div className="xl:col-span-6 col-span-12 z-50">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> District:
                  </label>
                  <Select
                    name="district_id"
                    required
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        district_id: e ? e.value : null,
                      }))
                    }
                    isClearable={true}
                    options={districts}
                    value={
                      formData.district_id
                        ? districts.find(
                            (row) => row.value === formData.district_id
                          )
                        : null
                    }
                    isDisabled={!province}
                    className="js-example-placeholder-multiple w-full js-states"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter district name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name Farsi :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter district name farsi"
                    name="name_fa"
                    required
                    value={formData.name_fa}
                    onChange={handleChange}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    <span className="text-red-500 mr-2">*</span> Name Pashto :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter district name pashto"
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
                    placeholder="Enter district latitude"
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
                    placeholder="Enter district longitude"
                    name="longitude"
                    required
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createGozar"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Gozar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateGozar;
