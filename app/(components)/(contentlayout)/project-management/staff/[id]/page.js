"use client";
import Create from "@/components/attachments/Create";
import Attachment from "@/components/projects/Attachment";
import Log from "@/components/staff/Log";
import { getFileIcon } from "@/lib/getFileIcon";
import {
  Followersdata,
  Friendsdata,
  LightboxGallery,
  Personalinfodata,
  RecentPostsdata,
  Skillsdata,
  Suggestionsdata,
} from "@/shared/data/pages/profiledata";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Staffview = ({ params }) => {
  const { id } = params;
  const [member, setMember] = useState({});
  const { data: session, status, update } = useSession();
  const baseUrl = useSelector((state) => state.general.baseUrl);
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (session?.access_token) {
      getStaff();
    }
  }, [session]);
  const getStaff = async () => {
    const res = await fetch(`${baseUrl}/api/staff/${id}/edit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    const result = await res.json();

    if (result.id) {
      setMember(result);
      setDocuments(result.documents);
    }
  };

  const deleteStaff = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/staff/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // optional, depending on your authentication
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // If response is not OK, show the error message
        Swal.fire({
          title: "Error",
          text:
            result.message ||
            "An error occurred while deleting the team member.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: "Team member deleted successfully.",
        icon: "success",
      });
      router.push("/project-management/staff");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
      });
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
    <Fragment>
      <Seo title={"Team member"} />
      <Pageheader
        currentpage="Staff"
        activepage="Pages"
        activeurl="/project-management/staff"
        mainpage="Team member"
      />
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-4 xl:col-span-12 col-span-12">
          <div className="box overflow-hidden">
            <div className="box-body !p-0">
              <div className="sm:flex items-start p-6      main-profile-cover">
                <div>
                  <span className="avatar avatar-xxl avatar-rounded online me-4">
                    <img src={member.photo} alt={member.name} />
                  </span>
                </div>
                <div className="flex-grow main-profile-info">
                  <div className="flex items-center !justify-between">
                    <h6 className="font-semibold mb-1 text-white text-[1rem]">
                      {member.name}
                    </h6>
                    <button
                      type="button"
                      className="ti-btn ti-btn-light !font-medium !gap-0"
                    >
                      <i className="ri-add-line me-1 align-middle inline-block"></i>
                      Follow
                    </button>
                  </div>
                  <p className="mb-1 !text-white  opacity-[0.7]">
                    {member.position_title}
                  </p>
                  <p className="text-[0.75rem] text-white mb-6 opacity-[0.5]">
                    <span className="me-4 inline-flex">
                      <i className="ri-building-line me-1 align-middle"></i>
                      {member.duty_station}
                    </span>
                  </p>
                  <div className="flex mb-0">
                    <div className="me-6">
                      <p className="font-bold text-[1.25rem] text-white text-shadow mb-0">
                        113
                      </p>
                      <p className="mb-0 text-[.6875rem] opacity-[0.5] text-white">
                        Projects
                      </p>
                    </div>
                    <div className="me-6">
                      <p className="font-bold text-[1.25rem] text-white text-shadow mb-0">
                        12.2k
                      </p>
                      <p className="mb-0 text-[.6875rem] opacity-[0.5] text-white">
                        Followers
                      </p>
                    </div>
                    <div className="me-6">
                      <p className="font-bold text-[1.25rem] text-white text-shadow mb-0">
                        128
                      </p>
                      <p className="mb-0 text-[.6875rem] opacity-[0.5] text-white">
                        Following
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                <div className="mb-6">
                  <p className="text-[.9375rem] mb-2 font-semibold">About :</p>
                  <p
                    className="text-[0.75rem] text-[#8c9097] dark:text-white/50 opacity-[0.7] mb-0"
                    dangerouslySetInnerHTML={{ __html: member.about }}
                  ></p>
                </div>
              </div>
              <div className="p-6 border-b border-dashed dark:border-defaultborder/10">
                <p className="text-[.9375rem] mb-2 me-6 font-semibold">
                  Contact Information :
                </p>
                <div className="text-[#8c9097] dark:text-white/50">
                  <p className="mb-2">
                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                      <i className="ri-mail-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                    </span>
                    {member.official_email}
                    {member.personal_email && (
                      <span>/ {member.personal_email}</span>
                    )}
                  </p>

                  <p className="mb-2">
                    <span className="avatar avatar-sm avatar-rounded me-2 bg-light text-[#8c9097] dark:text-white/50">
                      <i className="ri-phone-line align-middle text-[.875rem] text-[#8c9097] dark:text-white/50"></i>
                    </span>
                    {member.phone1}{" "}
                    {member.phone2 && <span>/ {member.phone2}</span>}
                  </p>
                </div>
              </div>
              <div className="p-6 border-b dark:border-defaultborder/10 border-dashed sm:flex items-center">
                <p className="text-[.9375rem] mb-2 me-6 font-semibold">
                  Actions :
                </p>
                <div className="btn-list">
                  <div className="btn-list">
                    <Link
                      href={`/project-management/staff/${member.id}`}
                      className="ti-btn ti-btn-sm ti-btn-secondary !me-[0.375rem]"
                    >
                      <i className="ri-eye-line font-bold"></i>
                    </Link>

                    <Link
                      href={`/project-management/staff/edit/${member.id}`}
                      className="ti-btn ti-btn-sm ti-btn-success me-[0.375rem]"
                    >
                      <i className="ri-edit-line font-bold"></i>
                    </Link>
                    <button
                      type="button"
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
                            deleteStaff(member.id);
                          }
                        })
                      }
                      aria-label="button"
                      className="ti-btn ti-btn-sm ti-btn-danger"
                    >
                      <i className="ri-delete-bin-6-line font-bold"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-8 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="box">
                <div className="box-body !p-0">
                  <div className="!p-4 border-b dark:border-defaultborder/10 border-dashed md:flex items-center justify-between">
                    <nav
                      className="-mb-0.5 sm:flex md:space-x-4 rtl:space-x-reverse pb-2"
                      role="tablist"
                    >
                      <Link
                        className="w-full sm:w-auto flex active hs-tab-active:font-semibold  hs-tab-active:text-white hs-tab-active:bg-primary rounded-md py-2 px-4 text-primary text-sm"
                        href="#!"
                        scroll={false}
                        id="activity-tab"
                        data-hs-tab="#activity-tab-pane"
                        aria-controls="activity-tab-pane"
                      >
                        <i className="ri-gift-line  align-middle inline-block me-1"></i>
                        Activity
                      </Link>
                      <Link
                        className="w-full sm:w-auto flex hs-tab-active:font-semibold  hs-tab-active:text-white hs-tab-active:bg-primary rounded-md  py-2 px-4 text-primary text-sm"
                        href="#!"
                        scroll={false}
                        id="posts-tab"
                        data-hs-tab="#posts-tab-pane"
                        aria-controls="posts-tab-pane"
                      >
                        <i className="ri-bill-line me-1 align-middle inline-block"></i>
                        Posts
                      </Link>

                      <Link
                        className="w-full sm:w-auto flex hs-tab-active:font-semibold  hs-tab-active:text-white hs-tab-active:bg-primary rounded-md  py-2 px-4 text-primary text-sm"
                        href="#!"
                        scroll={false}
                        id="gallery-tab"
                        data-hs-tab="#gallery-tab-pane"
                        aria-controls="gallery-tab-pane"
                      >
                        <i className="ri-attachment-line me-1 align-middle inline-block"></i>
                        Attachements
                      </Link>
                      <Link
                        className="w-full sm:w-auto flex hs-tab-active:font-semibold  hs-tab-active:text-white hs-tab-active:bg-primary rounded-md  py-2 px-4 text-primary text-sm"
                        href="#!"
                        scroll={false}
                        id="followers-tab"
                        data-hs-tab="#followers-tab-pane"
                        aria-controls="followers-tab-pane"
                      >
                        <i className="ri-chat-history-line me-1 align-middle inline-block"></i>
                        Log History
                      </Link>
                    </nav>
                    <div>
                      <p className="font-semibold mb-2">
                        Profile 60% completed -{" "}
                        <Link
                          href="#!"
                          scroll={false}
                          className="text-primary text-[0.75rem]"
                        >
                          Finish now
                        </Link>
                      </p>
                      <div className="progress progress-xs progress-animate">
                        <div
                          className="progress-bar bg-primary w-[60%]"
                          role="progressbar"
                          aria-valuenow={60}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="!p-4">
                    <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane show active fade !p-0 !border-0"
                        id="activity-tab-pane"
                        role="tabpanel"
                        aria-labelledby="activity-tab"
                      >
                        <ul className="list-none profile-timeline">
                          <li>
                            <div>
                              <span className="avatar avatar-sm bg-primary/10  !text-primary avatar-rounded profile-timeline-avatar">
                                E
                              </span>
                              <p className="mb-2">
                                <b>You</b> Commented on <b>alexander taylor</b>{" "}
                                post{" "}
                                <Link
                                  className="text-secondary"
                                  href="#!"
                                  scroll={false}
                                >
                                  <u>#beautiful day</u>
                                </Link>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  24,Dec 2022 - 14:34
                                </span>
                              </p>
                              <p className="profile-activity-media mb-0 flex w-full mt-2 sm:mt-0">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-17.jpg"
                                    alt=""
                                  />
                                </Link>
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-18.jpg"
                                    alt=""
                                  />
                                </Link>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span className="avatar avatar-sm avatar-rounded profile-timeline-avatar">
                                <img
                                  src="../../assets/images/faces/11.jpg"
                                  alt=""
                                />
                              </span>
                              <p className="text-[#8c9097] dark:text-white/50 mb-2">
                                <span className="text-default">
                                  <b>Json Smith</b> reacted to the post 👍
                                </span>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  18,Dec 2022 - 12:16
                                </span>
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50 mb-0">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Repudiandae, repellendus rem
                                rerum excepturi aperiam ipsam temporibus
                                inventore ullam tempora eligendi libero sequi
                                dignissimos cumque, et a sint tenetur
                                consequatur omnis!
                              </p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span className="avatar avatar-sm avatar-rounded profile-timeline-avatar">
                                <img
                                  src="../../assets/images/faces/4.jpg"
                                  alt=""
                                />
                              </span>
                              <p className="text-[#8c9097] dark:text-white/50 mb-2">
                                <span className="text-default">
                                  <b>Alicia Keys</b> shared a document with{" "}
                                  <b>you</b>
                                </span>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  21,Dec 2022 - 15:32
                                </span>
                              </p>
                              <p className="profile-activity-media mb-0 flex w-full mt-2 sm:mt-0 items-center">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/file-manager/3.png"
                                    alt=""
                                  />
                                </Link>
                                <span className="text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  432.87KB
                                </span>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span className="avatar avatar-sm bg-success/10 !text-success avatar-rounded profile-timeline-avatar">
                                P
                              </span>
                              <p className="text-[#8c9097] dark:text-white/50 mb-4">
                                <span className="text-default">
                                  <b>You</b> shared a post with 4 people{" "}
                                  <b>Simon,Sasha, Anagha,Hishen</b>
                                </span>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  28,Dec 2022 - 18:46
                                </span>
                              </p>
                              <p className="profile-activity-media mb-4">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-75.jpg"
                                    alt=""
                                  />
                                </Link>
                              </p>
                              <div>
                                <div className="avatar-list-stacked">
                                  <span className="avatar avatar-sm avatar-rounded">
                                    <img
                                      src="../../assets/images/faces/2.jpg"
                                      alt="img"
                                    />
                                  </span>
                                  <span className="avatar avatar-sm avatar-rounded">
                                    <img
                                      src="../../assets/images/faces/8.jpg"
                                      alt="img"
                                    />
                                  </span>
                                  <span className="avatar avatar-sm avatar-rounded">
                                    <img
                                      src="../../assets/images/faces/2.jpg"
                                      alt="img"
                                    />
                                  </span>
                                  <span className="avatar avatar-sm avatar-rounded">
                                    <img
                                      src="../../assets/images/faces/10.jpg"
                                      alt="img"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span className="avatar avatar-sm avatar-rounded profile-timeline-avatar">
                                <img
                                  src="../../assets/images/faces/5.jpg"
                                  alt=""
                                />
                              </span>
                              <p className="text-[#8c9097] dark:text-white/50 mb-1">
                                <span className="text-default">
                                  <b>Melissa Blue</b> liked your post{" "}
                                  <b>travel excites</b>
                                </span>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  11,Dec 2022 - 11:18
                                </span>
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50">
                                you are already feeling the tense atmosphere of
                                the video playing in the background
                              </p>
                              <p className="profile-activity-media sm:flex mb-0">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-59.jpg"
                                    className="m-1"
                                    alt=""
                                  />
                                </Link>
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-60.jpg"
                                    className="m-1"
                                    alt=""
                                  />
                                </Link>
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-61.jpg"
                                    className="m-1"
                                    alt=""
                                  />
                                </Link>
                              </p>
                            </div>
                          </li>
                          <li>
                            <div>
                              <span className="avatar avatar-sm avatar-rounded profile-timeline-avatar">
                                <img
                                  src="../../assets/images/media/media-39.jpg"
                                  alt=""
                                />
                              </span>
                              <p className="mb-1">
                                <b>You</b> Commented on <b>Peter Engola</b> post{" "}
                                <Link
                                  className="text-secondary"
                                  href="#!"
                                  scroll={false}
                                >
                                  <u>#Mother Nature</u>
                                </Link>
                                .
                                <span className="ltr:float-right rtl:float-left text-[.6875rem] text-[#8c9097] dark:text-white/50">
                                  24,Dec 2022 - 14:34
                                </span>
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50">
                                Technology id developing rapidly kepp uo your
                                work 👌
                              </p>
                              <p className="profile-activity-media mb-0 flex w-full mt-2 sm:mt-0">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-26.jpg"
                                    alt=""
                                  />
                                </Link>
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                >
                                  <img
                                    src="../../assets/images/media/media-29.jpg"
                                    alt=""
                                  />
                                </Link>
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="tab-pane fade !p-0 !border-0 hidden !rounded-md"
                        id="posts-tab-pane"
                        role="tabpanel"
                        aria-labelledby="posts-tab"
                      >
                        <ul className="list-group !rounded-md">
                          <li className="list-group-item">
                            <div className="sm:flex items-center leading-none">
                              <div className="me-4">
                                <span className="avatar avatar-md avatar-rounded">
                                  <img
                                    src="../../assets/images/faces/9.jpg"
                                    alt=""
                                  />
                                </span>
                              </div>
                              <div className="flex-grow">
                                <div className="flex">
                                  <input
                                    type="text"
                                    className="form-control !rounded-e-none !w-full"
                                    placeholder="Recipient's username"
                                    aria-label="Recipient's username with two button addons"
                                  />
                                  <button
                                    aria-label="button"
                                    className="ti-btn ti-btn-light !rounded-none !mb-0"
                                    type="button"
                                  >
                                    <i className="bi bi-emoji-smile"></i>
                                  </button>
                                  <button
                                    aria-label="button"
                                    className="ti-btn ti-btn-light !rounded-none !mb-0"
                                    type="button"
                                  >
                                    <i className="bi bi-paperclip"></i>
                                  </button>
                                  <button
                                    aria-label="button"
                                    className="ti-btn ti-btn-light !rounded-none !mb-0"
                                    type="button"
                                  >
                                    <i className="bi bi-camera"></i>
                                  </button>
                                  <button
                                    className="ti-btn bg-primary !mb-0 !rounded-s-none text-white"
                                    type="button"
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li
                            className="list-group-item"
                            id="profile-posts-scroll"
                          >
                            <PerfectScrollbar>
                              <div className="grid grid-cols-12 gap-4">
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          24, Dec - 04:32PM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-0">
                                          Lorem ipsum dolor sit amet consectetur
                                          adipisicing elit.
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-4">
                                          As opposed to using 'Content here 👌
                                        </p>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div>
                                          <span className="badge bg-primary/10 text-primary me-2">
                                            Fashion
                                          </span>
                                        </div>
                                        <div>
                                          <div className="hs-dropdown ti-dropdown">
                                            <button
                                              aria-label="button"
                                              type="button"
                                              className="ti-btn ti-btn-sm ti-btn-light"
                                              aria-expanded="false"
                                            >
                                              <i className="ti ti-dots-vertical"></i>
                                            </button>
                                            <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Delete
                                                </Link>
                                              </li>
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Hide
                                                </Link>
                                              </li>
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Edit
                                                </Link>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          26, Dec - 12:45PM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-1">
                                          Shared pictures with 4 of friends{" "}
                                          <span>Hiren,Sasha,Biden,Thara</span>.
                                        </p>
                                        <div className="flex leading-none justify-between mb-4">
                                          <div>
                                            <Link
                                              aria-label="anchor"
                                              href="#!"
                                              scroll={false}
                                            >
                                              <span className="avatar avatar-md me-1">
                                                <img
                                                  src="../../assets/images/media/media-52.jpg"
                                                  alt=""
                                                />
                                              </span>
                                            </Link>
                                            <Link
                                              aria-label="anchor"
                                              href="#!"
                                              scroll={false}
                                            >
                                              <span className="avatar avatar-md me-1">
                                                <img
                                                  src="../../assets/images/media/media-56.jpg"
                                                  alt=""
                                                />
                                              </span>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex items-start">
                                          <div>
                                            <span className="badge bg-success/10 text-secondary me-2">
                                              Nature
                                            </span>
                                          </div>
                                          <div>
                                            <div className="hs-dropdown ti-dropdown">
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-light"
                                                aria-expanded="false"
                                              >
                                                <i className="ti ti-dots-vertical"></i>
                                              </button>
                                              <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                                <li>
                                                  <Link
                                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                    href="#!"
                                                    scroll={false}
                                                  >
                                                    Delete
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                    href="#!"
                                                    scroll={false}
                                                  >
                                                    Hide
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                    href="#!"
                                                    scroll={false}
                                                  >
                                                    Edit
                                                  </Link>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="avatar-list-stacked block mt-4 text-end">
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/2.jpg"
                                              alt="img"
                                            />
                                          </span>
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/8.jpg"
                                              alt="img"
                                            />
                                          </span>
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/2.jpg"
                                              alt="img"
                                            />
                                          </span>
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/10.jpg"
                                              alt="img"
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          29, Dec - 09:53AM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-1">
                                          Sharing an article that excites me
                                          about nature more than what i thought.
                                        </p>
                                        <p className="mb-4 profile-post-link">
                                          <Link
                                            href="#!"
                                            scroll={false}
                                            className="text-[0.75rem] text-primary"
                                          >
                                            <u>
                                              https://www.discovery.com/
                                              nature/caring-for-coral
                                            </u>
                                          </Link>
                                        </p>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div>
                                          <span className="badge bg-secondary/10 text-secondary me-2">
                                            Travel
                                          </span>
                                        </div>
                                        <div className="hs-dropdown ti-dropdown">
                                          <button
                                            aria-label="button"
                                            type="button"
                                            className="ti-btn ti-btn-sm ti-btn-light"
                                            aria-expanded="false"
                                          >
                                            <i className="ti ti-dots-vertical"></i>
                                          </button>
                                          <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Delete
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Hide
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Edit
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          22, Dec - 11:22PM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-1">
                                          Shared pictures with 3 of your friends{" "}
                                          <span>Maya,Jacob,Amanda</span>.
                                        </p>
                                        <div className="flex leading-none justify-between mb-4">
                                          <div>
                                            <Link
                                              aria-label="anchor"
                                              href="#!"
                                              scroll={false}
                                            >
                                              <span className="avatar avatar-md me-1">
                                                <img
                                                  src="../../assets/images/media/media-40.jpg"
                                                  alt=""
                                                  className="rounded-md"
                                                />
                                              </span>
                                            </Link>
                                            <Link
                                              aria-label="anchor"
                                              href="#!"
                                              scroll={false}
                                            >
                                              <span className="avatar avatar-md me-1">
                                                <img
                                                  src="../../assets/images/media/media-45.jpg"
                                                  alt=""
                                                  className="rounded-md"
                                                />
                                              </span>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex items-start">
                                          <div>
                                            <span className="badge bg-success/10 text-secondary me-2">
                                              Nature
                                            </span>
                                          </div>
                                          <div className="hs-dropdown ti-dropdown">
                                            <button
                                              aria-label="button"
                                              type="button"
                                              className="ti-btn ti-btn-sm ti-btn-light"
                                              aria-expanded="false"
                                            >
                                              <i className="ti ti-dots-vertical"></i>
                                            </button>
                                            <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Delete
                                                </Link>
                                              </li>
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Hide
                                                </Link>
                                              </li>
                                              <li>
                                                <Link
                                                  className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                  href="#!"
                                                  scroll={false}
                                                >
                                                  Edit
                                                </Link>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="avatar-list-stacked block mt-4 text-end">
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/1.jpg"
                                              alt="img"
                                            />
                                          </span>
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/5.jpg"
                                              alt="img"
                                            />
                                          </span>
                                          <span className="avatar avatar-xs avatar-rounded">
                                            <img
                                              src="../../assets/images/faces/16.jpg"
                                              alt="img"
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          18, Dec - 12:28PM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-1">
                                          Followed this author for top class
                                          themes with best code you can get in
                                          the market.
                                        </p>
                                        <p className="mb-4 profile-post-link">
                                          <Link
                                            href="https://themeforest.net/user/spruko/portfolio"
                                            target="_blank"
                                            scroll={false}
                                            className="text-[0.75rem] text-primary"
                                          >
                                            <u>
                                              https://themeforest.net/user/
                                              spruko/portfolio
                                            </u>
                                          </Link>
                                        </p>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div>
                                          <span className="badge bg-secondary/10 text-secondary me-2">
                                            Travel
                                          </span>
                                        </div>
                                        <div className="hs-dropdown ti-dropdown">
                                          <button
                                            aria-label="button"
                                            type="button"
                                            className="ti-btn ti-btn-sm ti-btn-light"
                                            aria-expanded="false"
                                          >
                                            <i className="ti ti-dots-vertical"></i>
                                          </button>
                                          <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Delete
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Hide
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Edit
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 md:col-span-12 col-span-12">
                                  <div className="rounded border dark:border-defaultborder/10">
                                    <div className="p-4 flex items-start flex-wrap">
                                      <div className="me-2">
                                        <span className="avatar avatar-sm avatar-rounded">
                                          <img
                                            src="../../assets/images/faces/9.jpg"
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="flex-grow">
                                        <p className="mb-1 font-semibold leading-none">
                                          You
                                        </p>
                                        <p className="text-[.6875rem] mb-2 text-[#8c9097] dark:text-white/50">
                                          02, Dec - 06:32AM
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-0">
                                          Lorem ipsum dolor sit amet consectetur
                                          adipisicing elit.
                                        </p>
                                        <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-4">
                                          There are many variations of passages
                                          👏😍
                                        </p>
                                        <div className="flex items-center justify-between md:mb-0 mb-2">
                                          <div>
                                            <div className="btn-list">
                                              <button
                                                type="button"
                                                className="ti-btn ti-btn-primary !me-[.375rem] !py-1 !px-2 !text-[0.75rem] !font-medium btn-wave"
                                              >
                                                Comment
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn !me-[.375rem] ti-btn-sm ti-btn-success"
                                              >
                                                <i className="ri-thumb-up-line"></i>
                                              </button>
                                              <button
                                                aria-label="button"
                                                type="button"
                                                className="ti-btn ti-btn-sm ti-btn-danger"
                                              >
                                                <i className="ri-share-line"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start">
                                        <div>
                                          <span className="badge bg-primary/10 text-primary me-2">
                                            Fashion
                                          </span>
                                        </div>
                                        <div className="hs-dropdown ti-dropdown">
                                          <button
                                            aria-label="button"
                                            type="button"
                                            className="ti-btn ti-btn-sm ti-btn-light"
                                            aria-expanded="false"
                                          >
                                            <i className="ti ti-dots-vertical"></i>
                                          </button>
                                          <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Delete
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Hide
                                              </Link>
                                            </li>
                                            <li>
                                              <Link
                                                className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                                href="#!"
                                                scroll={false}
                                              >
                                                Edit
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PerfectScrollbar>
                          </li>
                          <li className="list-group-item">
                            <div className="text-center">
                              <button
                                type="button"
                                className="ti-btn ti-btn-primary !font-medium"
                              >
                                Show All
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="tab-pane fade !p-0 !border-0 hidden"
                        id="followers-tab-pane"
                        role="tabpanel"
                        aria-labelledby="followers-tab"
                      >
                        <Log member={member} />
                      </div>
                      <div
                        className="tab-pane fade !p-0 !border-0 hidden"
                        id="gallery-tab-pane"
                        role="tabpanel"
                        aria-labelledby="gallery-tab"
                      >
                        <Attachment
                          type={"Staff"}
                          id={member.id}
                          documents={documents}
                          setDocuments={setDocuments}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-4 col-span-12">
              <div className="box">
                <div className="box-header">
                  <div className="box-title">Personal Info</div>
                </div>
                <div className="box-body">
                  <ul className="list-group">
                    {Personalinfodata.map((idx) => (
                      <li className="list-group-item" key={Math.random()}>
                        <div className="flex flex-wrap items-center">
                          <div className="me-2 font-semibold">{idx.text1}</div>
                          <span className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {idx.text2}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="xl:col-span-4 col-span-12">
              <div className="box">
                <div className="box-header flex justify-between">
                  <div className="box-title">Recent Posts</div>
                  <div>
                    <span className="badge bg-primary/10 text-primary">
                      Today
                    </span>
                  </div>
                </div>
                <div className="box-body">
                  <ul className="list-group">
                    {RecentPostsdata.map((idx) => (
                      <li className="list-group-item" key={Math.random()}>
                        <Link href="#!" scroll={false}>
                          <div className="flex flex-wrap items-center">
                            <span className="avatar avatar-md me-4 !mb-0">
                              <img
                                src={idx.src}
                                className="img-fluid !rounded-md"
                                alt="..."
                              />
                            </span>
                            <div className="flex-grow">
                              <p className="font-semibold mb-0">{idx.name}</p>
                              <p className="mb-0 text-[0.75rem] profile-recent-posts text-truncate text-[#8c9097] dark:text-white/50">
                                {idx.text}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="xl:col-span-4 col-span-12">
              <div className="box">
                <div className="box-header flex justify-between">
                  <div className="box-title">Suggestions</div>
                  <div>
                    <button
                      type="button"
                      className="ti-btn !py-1 !px-2 !text-[0.75rem] !font-medium ti-btn-success"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="box-body">
                  <ul className="list-group">
                    {Suggestionsdata.map((idx) => (
                      <li className="list-group-item" key={Math.random()}>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold flex items-center">
                            <span className="avatar avatar-xs me-2">
                              <img src={idx.src} alt="" />
                            </span>
                            {idx.name}
                          </div>
                          <div>
                            <button
                              aria-label="button"
                              type="button"
                              className="ti-btn ti-btn-sm ti-btn-primary !mb-0"
                            >
                              <i className="ri-add-line"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Staffview;
