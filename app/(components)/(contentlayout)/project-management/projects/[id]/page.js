"use client";

import Attachment from "@/components/projects/Attachment";
import Location from "@/components/projects/Location";
import Log from "@/components/projects/Log";
import Member from "@/components/projects/Member";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Projectoverview = ({ params }) => {
  const { data: session } = useSession();
  const { id } = params;
  const [project, setProject] = useState({});
  const [activities, setActivities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [gozars, setGozars] = useState([]);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const menus = [
    { name: "Log", icon: "ri-chat-history-line" },
    { name: "Location", icon: "ri-map-pin-2-line" },
    { name: "Members", icon: "ri-group-line" },
    { name: "Attachements", icon: "ri-attachment-line" },
  ]
  const [menu, setMenu] = useState(menus[0]);

  const router = useRouter();
  useEffect(() => {
    if (session?.access_token) {
      getProject();
    }
  }, [session, id]);
  const getProject = async () => {
    const res = await fetch(`${baseUrl}/api/project/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setDocuments(result.documents);
      setActivities(result.activities);
      setStaff(result.staff);
      setGozars(result.gozars);
      setProject(result);
    }
  };


  const deleteProject = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/project/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // optional, depending on your authentication
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message || "An error occurred while deleting the project.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Project deleted successfully.",
        icon: "success",
      });
      router.push("/project-management/projects");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <Fragment>
      <Seo title={"Project Overview"} />
      <Pageheader
        currentpage="Project Overview"
        activepage="Projects"
        mainpage="Project Overview"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-9 col-span-12">
          <div className="box custom-box">
            <div className="box-header justify-between flex">
              <div className="box-title">Project Details</div>
              <div className="flex gap-2">
                <Link
                  href="/project-management/projects/create"
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                >
                  <i className="ri-add-line align-middle me-1 font-semibold"></i>
                  Create Project
                </Link>
                <Link
                  href={`/project-management/projects/edit/${id}`}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary-full btn-wave"
                >
                  <i className="ri-edit-line align-middle me-1 font-semibold"></i>
                  Edit Project
                </Link>
                <button
                  onClick={() =>
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteProject();
                      }
                    })
                  }
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave"
                >
                  <i className="ri-delete-bin-line align-middle me-1 font-semibold"></i>
                  Delete Project
                </button>
              </div>
            </div>
            <div className="box-body">
              <h5 className="font-semibold mb-4 task-title">{project.title}</h5>
              <div className="text-[.9375rem] font-semibold mb-2">
                Project Description :
              </div>
              <p
                className="text-[#8c9097] dark:text-white/50 task-description my-6"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>
            <div className="box-footer">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Assigned Date
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {project.start_date}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Due Date
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {project.end_date}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Status
                  </span>
                  <span className="block">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `rgba(${parseInt(
                          project?.status?.color.slice(1, 3),
                          16
                        )}, ${parseInt(
                          project?.status?.color.slice(3, 5),
                          16
                        )}, ${parseInt(
                          project?.status?.color.slice(5, 7),
                          16
                        )}, 0.1)`,
                        color: project?.status?.color,
                      }}
                    >
                      {project?.status?.title}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="box custom-box">
            <div className="box-header flex flex-row justify-between">
              {menus.map((row, index) => (
                <button
                  onClick={() => setMenu(menus[index])}
                  className={`${
                    row.name == menu.name
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "hover:border-b-2 hover:border-blue-500 hover:text-blue-500"
                  } px-4 py-2`}
                >
                  <i className={`${row.icon} mr-2`}></i>
                  {row.name}
                </button>
              ))}
            </div>
            <div className="box-body">
              {menu.name == "Log" && <Log project={project} />}
              {menu.name == "Location" && <Location project={project} gozars={gozars} setGozars={setGozars} />}
              {menu.name == "Members" && <Member project={project} setStaff={setStaff} staff={staff} />}
              {menu.name == "Attachements" && (
                <Attachment
                  type={"Project"}
                  id={project.id}
                  documents={documents}
                  setDocuments={setDocuments}
                />
              )}
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Project Projects</div>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr>
                      <th scope="row" className="text-start">
                        Title
                      </th>

                      <th scope="row" className="text-start">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities?.map((row, index) => (
                      <tr className="border border-defaultborder">
                        <td>
                          <div className="flex items-center">
                            <div className="me-2 leading-none">
                              <span className="avatar avatar-sm !rounded-full">
                                <img src={row.logo} alt={row.title} />
                              </span>
                            </div>
                            <div className="font-semibold w-48 text-truncate">
                              {row.title}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="inline-flex">
                            <Link
                              href={`/project-management/projects/${row.id}`}
                              className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                            >
                              <i className="ri-eye-line"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Fragment>
  );
};

export default Projectoverview;
