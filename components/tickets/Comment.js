import { getFileIcon } from "@/lib/getFileIcon";
import { useSession } from "next-auth/react";
import { FilePond, registerPlugin } from "react-filepond";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Avatar from "react-avatar";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function Comment({ comments, setComments, id }) {
  let reverseComments = [...comments].reverse();
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const { data: session } = useSession();
  const editor = useRef("");
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };
  const [editId, setEditId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = `${baseUrl}/api/ticket-comments`;
    if (editId) {
      url = `${baseUrl}/api/ticket-comments/${editId}`;
    }
    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          ticket_id: id,
          content: editor.current.getContents(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (editId) {
          let tmp = comments.map((item) => {
            if (item.id === editId) {
              return { ...item, content: result.data.content };
            }
            return item;
          });
          setComments(tmp);
        } else {
          setComments((prv) => [...prv, result.data]);
        }
        setEditId(null);
        editor.current.setContents("");

        toast.success(result.message);
      } else {
        toast.error(result.response.get);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error uploading file:", error);
    }
  };

  const handleEdit = (row) => {
    editor.current.setContents(row.content);
    setEditId(row.id);
  };
  const deleteComment = async (did) => {
    try {
      const res = await fetch(`${baseUrl}/api/ticket-comments/${did}`, {
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

      toast.success(result.message);
      const tmp = comments.filter((item) => item.id !== did);
      setComments(tmp);
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
      <div className=" p-4">
        <form onSubmit={handleSubmit} className=" p-0">
          <div id="project-descriptioin-editor">
            <SunEditor
              className="bg-secondary"
              height="100px"
              getSunEditorInstance={getSunEditorInstance}
              required
            />
          </div>

          <button className="ti-btn ti-btn-primary-full" type="submit">
            Add Comment
          </button>
        </form>
      </div>
      <div className=" p-4">
        <ul className="list-group">
          {reverseComments?.map((row, index) => (
            <li key={index}>
              <hr className="mb-4" />
              <div className="flex items-center">
                <div className="me-2">
                  <Avatar
                    name={row?.user?.name}
                    round={true}
                    color={`#8A2BE2`}
                    size="25"
                    textSizeRatio={1}
                    textMarginRatio={0.2}
                  />
                </div>
                <div className="flex-grow">
                  <Link href="#!" scroll={false}>
                    <span className="block font-semibold w-48 text-truncate">
                      {row?.user?.name}
                    </span>
                  </Link>
                  <span className="text-[#8c9097]">{row.created_at}</span>
                </div>
                {session?.user.id === row.user_id && (
                  <div className="inline-flex">
                    <button
                      onClick={() => handleEdit(row)}
                      className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
                    >
                      <i className="ri-edit-line"></i>
                    </button>

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
                            deleteComment(row.id);
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
                )}
              </div>

              <p
                className="text-gray-600 dark:text-white/50 task-description my-4 mx-4"
                dangerouslySetInnerHTML={{ __html: row.content }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Comment;
