"use client";
import Create from "@/components/attachments/Create";
import { getFileIcon } from "@/lib/getFileIcon";
import stringToDate from "@/lib/stringToData";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Programoverview = ({ params }) => {
  const { data: session } = useSession();
  const { id } = params;
  const [program, setProgram] = useState({});
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  useEffect(() => {
    if (session?.access_token) {
      getProgram();
    }
  }, [session, id]);
  const getProgram = async () => {
    const res = await fetch(`${apiUrl}/api/program/${id}/edit`, {
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
      const res = await fetch(`${apiUrl}/api/document/${did}`, {
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
      const response = await fetch(`${apiUrl}/api/program/${id}`, {
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
                    <span className="badge bg-primary/10 text-primary">
                      {program?.status?.title}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">History Log</div>
            </div>
            <div className="box-body">
              <ul className="list-unstyled profile-timeline">
                {program?.logs?.map((row, index) => (
                  <li key={index}>
                    <div>
                      <span className="avatar avatar-sm  profile-timeline-avatar">
                        <img
                          src="../../../assets/images/faces/11.jpg"
                          alt=""
                          className="!rounded-full"
                        />
                      </span>
                      <p className="text-[#8c9097] dark:text-white/50 mb-2">
                        <span className="text-default">{row.description}</span>.
                        <span className="float-end text-[0.6875rem] text-[#8c9097] dark:text-white/50">
                          {stringToDate(row.created_at)}
                        </span>
                      </p>
                      {/* <p className="text-[#8c9097] dark:text-white/50 mb-0">
               
                      </p> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Program Projects</div>
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
                    {projects?.map((row, index) => (
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

          <div className="box custom-box overflow-hidden">
            <div className="box-header justify-between">
              <div className="box-title">Program Documents</div>
              <button
                onClick={() => setCreateOpen(true)}
                className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-light btn-wave"
              >
                <i className="ri-add-line align-middle me-1 font-semibold"></i>
                Add file
              </button>
            </div>
            <div className="box-body !p-0">
              <ul className="list-group list-group-flush">
                {documents?.map((row, index) => (
                  <li key={index} className="list-group-item !border-t-0">
                    <div className="flex items-center">
                      <div className="me-2">
                        <span className="avatar !rounded-full p-2">
                          <i
                            className={`${getFileIcon(row.path)}`}
                            style={{ fontSize: "30px" }}
                          ></i>
                          {/* <img
                            src="../../../assets/images/media/file-manager/1.png"
                            alt=""
                          /> */}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <Link href="#!" scroll={false}>
                          <span className="block font-semibold w-48 text-truncate">
                            {row.title}
                          </span>
                        </Link>
                        <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem] font-normal">
                          {row.size > 1
                            ? `${row.size}MB`
                            : `${row.size * 1000}KB`}
                        </span>
                      </div>
                      <div className="inline-flex">
                        <a
                          href={row.path}
                          download={row.path}
                          className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                        >
                          <i className="ri-download-line"></i>
                        </a>
                        {/* <button
                          aria-label="button"
                          type="button"
                          className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                        >
                          <i className="ri-edit-line"></i>
                        </button> */}
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

          {createOpen && (
            <Create
              type="Program"
              id={id}
              createOpen={createOpen}
              setCreateOpen={setCreateOpen}
              setDocuments={setDocuments}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Programoverview;
