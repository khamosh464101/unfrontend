import { getFileIcon } from "@/lib/getFileIcon";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Member({ project, staff, setStaff }) {
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const { data: session } = useSession();
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(null);
  

  useEffect(() => {
    getMembers();
  }, [session]);

  const getMembers = async () => {
    const res = await fetch(`${baseUrl}/api/staffs/select2`, {
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
          setMembers(tmp);
        }
  }
  const handleAddMember = async (e) => {
    
    e.preventDefault();
    console.log(member);
    try {
      const response = await fetch(`${baseUrl}/api/project/add/member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          id: project.id,
          staff_id: member.value,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        
        setStaff((prv) => [result, ...prv]);

        setMember(null);

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
      const res = await fetch(`${baseUrl}/api/project/remove/member/`, {
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
       const tmp = staff.filter((item) => item.id !== did);
      setStaff(tmp);
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
        <form onSubmit={handleAddMember} className="p-4">
        <div className="xl:col-span-4 col-span-12 z-50 mb-4">
                  <label className="form-label">
                    {" "}
                    <span className="text-red-500 mr-2">*</span> Staff :
                  </label>
                  <Select
                    name="staff_id"
                    required
                    onChange={(e) =>
                      setMember(e)
                    }
                    isClearable={true}
                    options={members}
                    value={
                      member
                    }
                    className="js-example-placeholder-multiple w-full js-states z-50"
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
          {staff?.map((row, index) => (
            <li key={index} className="list-group-item">
              <div className="flex items-center">
                <div className="me-2">
                  <span className="avatar !rounded-full p-2">
                    
                    <img
                            src={row.photo}
                            alt=""
                          />
                  </span>
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

export default Member;
