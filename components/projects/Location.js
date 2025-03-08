import { getFileIcon } from "@/lib/getFileIcon";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Location({ project, gozars, setGozars }) {
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const { data: session } = useSession();
  const [dgozars, setDgozars] = useState([]);
  const [gozar, setGozar] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState(null);
  

  useEffect(() => {

    getProvinces();
  }, [session]);
  useEffect(() => {
    if (province) {
      getDistricts();
    }
  }, [province]);
  useEffect(() => {
    if (district) {
      getGozars();
    }
  }, [district]);

  const getProvinces = async () => {
    const res = await fetch(`${baseUrl}/api/provinces/select2`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      }
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
  }

  const getDistricts = async () => {
    const res = await fetch(`${baseUrl}/api/districts/select2/${province.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      }
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
      setDistricts(tmp);
      setDistrict(null);
      setGozar(null);
    }
  }

  const getGozars = async () => {
    const res = await fetch(`${baseUrl}/api/gozars/select2/${district.value}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      }
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
          setDgozars(tmp);
          setGozar(null);
        }
  }
  const handleFileUpload = async (e) => {
    
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/project/add/gozar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: project.id,
          gozar_id: gozar.value,
        }),
      });
      const result = await response.json();
      if (response.ok) {
         setGozars((prv) => [result, ...prv]);
        setDistrict(null);
        setProvince(null);
        setGozar(null);
      } else {
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the document.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const deleteDocument = async (did) => {
    try {
      const res = await fetch(`${baseUrl}/api/project/remove/gozar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: project.id,
          staff_id: did,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the document.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: result.message,
        icon: "success",
      });
       const tmp = gozars.filter((item) => item.id !== did);
       setGozars(tmp);
   
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 mx-auto gap-4">
      <div className="border bg-blue-500 p-4">
        <form onSubmit={handleFileUpload} className="p-4">
        
                <div className="xl:col-span-4 col-span-12 z-50 mb-4">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Province :
                  </label>
                  <Select
                    name="provinces_id"
                    required
                    onChange={(e) =>
                      setProvince(e)
                    }
                    isClearable={true}
                    options={provinces}
                    value={
                      province
                    }
                    className="js-example-placeholder-multiple w-full js-states z-50"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-4 col-span-12 z-50 mb-4">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> District :
                  </label>
                  <Select
                    name="district_id"
                    required
                    onChange={(e) =>
                      setDistrict(e)
                    }
                    isClearable={true}
                    options={districts}
                    value={
                      district
                    }
                    isDisabled={!province}
                    className="js-example-placeholder-multiple w-full js-states z-30"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>
                <div className="xl:col-span-4 col-span-12 z-50 mb-4">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Gozar :
                  </label>
                  <Select
                    name="gozar_id"
                    required
                    onChange={(e) =>
                      setGozar(e)
                    }
                    isClearable={true}
                    isDisabled={!district}
                    options={dgozars}
                    value={
                      gozar
                    }
                    className="js-example-placeholder-multiple w-full js-states z-10"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="select..."
                  />
                </div>

          <button className="ti-btn ti-btn-primary-full" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className=" p-4">
        <ul className="list-group">
          {gozars?.map((row, index) => (
            <li key={index} className="list-group-item">
              <div className="flex items-center">
                <div className="me-2">
                  {row?.district?.province?.name} <i class="ri-arrow-right-line"></i>

                </div>
                <div className="me-2">
                  {row?.district?.name} <i class="ri-arrow-right-line"></i>

                </div>
                <div className="flex-grow">
                  <Link href="#!" scroll={false}>
                    <span className="block font-semibold w-48 text-truncate">
                      {row.name}
                    </span>
                  </Link>
               
                </div>
                <div className="inline-flex">
                 
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: "Are you sure?",
                        text: "by confirming this the member will be removed from this project!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, remove it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteDocument(row.id);
                        }
                      })
                    }
                    aria-label="button"
                    type="button"
                    className="ti-btn ti-btn-sm ti-btn-danger"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Location;
