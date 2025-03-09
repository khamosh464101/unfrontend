"use client";

import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const CreateRole = () => {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const [permissions, setPermissions] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (session?.access_token) {
      getPermissions();
    }
  }, [session]);
  const getPermissions = async () => {
    const res = await fetch(`${baseUrl}/api/permissions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();
    if (!res.ok) {
      Swal.fire({
        title: "error",
        text: result.message,
        icon: "error",
      });
      return;
    }
    setPermissions(result);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const res = await fetch(`${baseUrl}/api/role/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        assignedPermissions,
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
      router.push("/admin/roles");
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

  const updateAssignedPermission = (id) => {
    const list = [...assignedPermissions];
    let index = list.indexOf(id);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    setAssignedPermissions(list);
  };

  return (
    <Fragment>
      <Seo title={"Create Role"} />
      <Pageheader
        currentpage="Create Role"
        activepage="Roles"
        mainpage="Create Role"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">
                Create Role /{" "}
                <span className="text-red-500 font-light">
                  {" "}
                  * shows required
                </span>
              </div>
            </div>
            <div className="box-body">
              <form onSubmit={handleSubmit} id="createRole">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-6 col-span-12">
                    <label htmlFor="input-label" className="form-label">
                      <span className="text-red-500 mr-2">*</span> Name :
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input-label"
                      placeholder="Enter role name"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <hr className="my-4" />

                <div className="grid grid-cols-12 gap-4">
                  {permissions &&
                    permissions.map((row, index) => (
                      <div
                        key={index}
                        className="xl:col-span-4 md:col-span-6 col-span-12 flex justify-between border p-3 rounded-md "
                      >
                        <label htmlFor="checkbox3">{row.name}</label>
                        <input
                          onChange={(e) => updateAssignedPermission(row.id)}
                          type="checkbox"
                          id={row.id}
                          name={row.id}
                        />
                      </div>
                    ))}
                </div>
              </form>
            </div>
            <div className="box-footer">
              <button
                type="submit"
                form="createRole"
                className="ti-btn ti-btn-primary btn-wave ms-auto float-right"
              >
                {loading && (
                  <i class="las la-circle-notch animate-spin text-md"></i>
                )}
                Create Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateRole;
