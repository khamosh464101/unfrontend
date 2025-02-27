import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { useSelector } from "react-redux";

function Create({ type, id, createOpen, setCreateOpen, setDocuments }) {
  const { data: session } = useSession();
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
          description,
          type,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDocuments((prv) => [...prv, result]);
        setCreateOpen(false);
        console.log("File uploaded successfully:", result);
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div
      id="hs-overlay-right"
      className={`hs-overlay ti-offcanvas ti-offcanvas-right`}
      tabIndex={-1}
    >
      <div className="ti-offcanvas-header">
        <h5 className="ti-offcanvas-title">Add document</h5>
        <button
          type="button"
          className="ti-btn flex-shrink-0 p-0 transition-none text-gray-500 hover:text-gray-700 focus:ring-gray-400 focus:ring-offset-white dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white/80 dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
          onClick={() => setCreateOpen(false)}
        >
          <span className="sr-only">Close modal</span>
          <svg
            className="w-3.5 h-3.5"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
      <div className="ti-offcanvas-body !h-[90%] !p-0">
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
          <div className="mb-4">
            <label
              htmlFor="form-text"
              className="form-label !text-[.875rem] text-black"
            >
              Description
            </label>
            <textarea
              className="form-control"
              id="form-text"
              placeholder=""
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button className="ti-btn ti-btn-primary-full" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
