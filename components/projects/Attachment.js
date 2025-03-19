import { getFileIcon } from "@/lib/getFileIcon";
import { useSession } from "next-auth/react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function Attachment({ documents, setDocuments, type, id }) {
  let reverseDocuments = [...documents].reverse();
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [imgId, setImgId] = useState("");

  useEffect(() => {
    // Register the plugin with FilePond
    registerPlugin(FilePondPluginFileValidateSize);
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          imgId,
          type,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments((prv) => [...prv, result]);
        setFiles([]);
        setTitle("");

        console.log("File uploaded successfully:", result);
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
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
  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-2 mx-auto gap-4">
      <div className="border bg-blue-500 p-4">
        <form onSubmit={handleFileUpload} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="form-text"
              className="form-label !text-[.875rem] text-black"
            >
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="form-text"
              placeholder=""
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              maxFileSize="3MB"
              name="file" // The name attribute for the input field (adjust according to your API)
              acceptedFileTypes={["image/*", "application/pdf"]}
              server={{
                process: {
                  url: `${baseUrl}/api/document/upload`, // Laravel API endpoint for file upload
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json",
                  },
                  onload: (response) => {
                    console.log(response);
                    setImgId(response);
                    // The response from the server will be the file ID
                    return response; // Ensure this matches the response from the Laravel backend
                  },
                  onerror: (response) => {
                    return response; // Handle error if upload fails
                  },
                },
                revert: {
                  url: `${baseUrl}/api/document/remove/${imgId}`, // Endpoint to remove file by ID
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json",
                  },
                },
                restore: {
                  url: `${baseUrl}/api/document/restore/${imgId}`, // Endpoint to restore the file by ID
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json",
                  },
                },
                load: {
                  url: `${baseUrl}/api/document/load/${imgId}`, // Endpoint to load the file by ID
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json",
                  },
                },
                remove: {
                  url: `${baseUrl}/api/document/remove/${imgId}`, // Endpoint to permanently remove the file
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    Accept: "application/json",
                  },
                },
              }}
            />
          </div>

          <button className="ti-btn ti-btn-primary-full" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className=" p-4">
        <ul className="list-group">
          {reverseDocuments?.map((row, index) => (
            <li key={index} className="list-group-item">
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
                    {row.size > 1 ? `${row.size}MB` : `${row.size * 1000}KB`}
                  </span>
                </div>
                <div className="inline-flex">
                  <a
                    href={`${baseUrl}/api/document/download/${row.id}`}
                    download
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
  );
}

export default Attachment;
