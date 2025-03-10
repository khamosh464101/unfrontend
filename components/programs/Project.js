import stringToDate from "@/lib/stringToData";
import React from "react";
import Link from "next/link";

function Project({ projects }) {
  return (
    <>
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
                                <div className="font-semibold w-72 text-truncate">
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
    </>
  );
}

export default Project;
