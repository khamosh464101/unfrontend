"use client";
import Create from "@/components/attachments/Create";
import Attachment from "@/components/projects/Attachment";
import Log from "@/components/programs/Log";
import { getFileIcon } from "@/lib/getFileIcon";
import stringToDate from "@/lib/stringToData";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Project from "@/components/programs/Project";

const Programoverview = ({ params }) => {
  const { data: session } = useSession();
  const { id } = params;
  const [program, setProgram] = useState({});
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const router = useRouter();
   const menus = [
      { name: "Log History", icon: "ri-chat-history-line" },
      { name: "Projects", icon: "ri-archive-stack-line" },
      // { name: "Members", icon: "ri-group-line" },
      { name: "Attachements", icon: "ri-attachment-line" },
    ]
    const [menu, setMenu] = useState(menus[0]);
  useEffect(() => {
    if (session?.access_token) {
      getProgram();
    }
  }, [session, id]);
  const getProgram = async () => {
    const res = await fetch(`${baseUrl}/api/program/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setDocuments(result.documents);
      setProjects(result.projects);
      setProgram(result);
    }
  };

  const deleteDocument = async (did) => {
    try {
      const res = await fetch(`${baseUrl}/api/document/${did}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
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
        text: "Document deleted successfully.",
        icon: "success",
      });
      const tmp = documents.filter((item) => item.id !== did);
      setDocuments(tmp);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  const deleteProgram = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/program/${id}`, {
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
            result.message || "An error occurred while deleting the program.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Program deleted successfully.",
        icon: "success",
      });
      router.push("/project-management/programs");
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
      <Seo title={"Program Overview"} />
      <Pageheader
        currentpage="Program Overview"
        activepage="Programs"
        mainpage="Program Overview"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-9 col-span-12">
          <div className="box custom-box">
            <div className="box-header justify-between flex">
              <div className="box-title">Program Details</div>
              <div className="flex gap-2">
                <Link
                  href="/project-management/programs/create"
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                >
                  <i className="ri-add-line align-middle me-1 font-semibold"></i>
                  Create Program
                </Link>
                <Link
                  href={`/project-management/programs/edit/${id}`}
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-primary-full btn-wave"
                >
                  <i className="ri-edit-line align-middle me-1 font-semibold"></i>
                  Edit Program
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
                        deleteProgram();
                      }
                    })
                  }
                  className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-danger-full btn-wave"
                >
                  <i className="ri-delete-bin-line align-middle me-1 font-semibold"></i>
                  Delete Program
                </button>
              </div>
            </div>
            <div className="box-body">
              <h5 className="font-semibold mb-4 task-title">{program.title}</h5>
              <div className="text-[.9375rem] font-semibold mb-2">
                Program Description :
              </div>
              <p
                className="text-[#8c9097] dark:text-white/50 task-description my-6"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
            </div>
            <div className="box-footer">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Created At
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {program.created_at}
                  </span>
                </div>
                <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Updated At
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    {program.updated_at}
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
                          program?.status?.color.slice(1, 3),
                          16
                        )}, ${parseInt(
                          program?.status?.color.slice(3, 5),
                          16
                        )}, ${parseInt(
                          program?.status?.color.slice(5, 7),
                          16
                        )}, 0.1)`,
                        color: program?.status?.color,
                      }}
                    >
                      {program?.status?.title}
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
              {menu.name == "Log History" && <Log program={program} />}
              {menu.name == "Projects" && <Project projects={projects} />}
              {/* {menu.name == "Members" && <Member project={project} setStaff={setStaff} staff={staff} />}  */}
              {menu.name == "Attachements" && (
                <Attachment
                  type={"Program"}
                  id={program.id}
                  documents={documents}
                  setDocuments={setDocuments}
                />
              )}
            </div>
          </div>
        </div>
    
      </div>
    </Fragment>
  );
};

export default Programoverview;
