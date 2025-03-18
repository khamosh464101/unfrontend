import React from "react";

const DashboardIcon = <i className="bx bx-home side-menu__icon"></i>;

const PagesIcon = <i className="bx bx-file-blank side-menu__icon"></i>;

const TaskIcon = <i className="bx bx-task side-menu__icon"></i>;

const AuthenticationIcon = (
  <i className="bx bx-fingerprint side-menu__icon"></i>
);

const ErrorIcon = <i className="bx bx-error side-menu__icon"></i>;

const UiElementsIcon = <i className="bx bx-box side-menu__icon"></i>;

const Utilities = <i className="bx bx-medal side-menu__icon"></i>;

const FormsIcon = <i className="bx bx-file  side-menu__icon"></i>;

const AdvancedUiIcon = <i className="bx bx-party side-menu__icon"></i>;

const WidgetsIcon = <i className="bx bx-gift side-menu__icon"></i>;

const AppsIcon = <i className="bx bx-grid-alt side-menu__icon"></i>;

const NestedmenuIcon = <i className="bx bx-briefcase side-menu__icon"></i>;

const TablesIcon = <i className="bx bx-table side-menu__icon"></i>;

const ChartsIcon = <i className="bx bx-bar-chart-square side-menu__icon"></i>;

const MapsIcon = <i className="bx bx-map side-menu__icon"></i>;

const Icons = <i className="bx bx-store-alt side-menu__icon"></i>;

const Admin = <i className="bx bx-user side-menu__icon"></i>;

const Referential = <i className="bx bx-library side-menu__icon"></i>;

const badge = (
  <span className="badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-1">
    1
  </span>
);
const badge1 = (
  <span className="text-secondary text-[0.75em] rounded-sm !py-[0.25rem] !px-[0.45rem] badge !bg-secondary/10 ms-1">
    New
  </span>
);
const badge2 = (
  <span className="text-danger text-[0.75em] rounded-sm badge !py-[0.25rem] !px-[0.45rem] !bg-danger/10 ms-1">
    Hot
  </span>
);
const badge4 = (
  <span className="text-success text-[0.75em] badge !py-[0.25rem] !px-[0.45rem] rounded-sm bg-success/10 ms-1">
    3
  </span>
);

export const MenuItems = [
  {
    menutitle: "MAIN",
  },
  {
    icon: DashboardIcon,
    badgetxt: badge,
    title: "Dashboards",
    type: "sub",
    active: false,
    selected: false,
    children: [
      {
        path: "/dashboards/projects",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Projects",
      },
    ],
  },
  {
    menutitle: "WEB APPS",
  },
  {
    icon: NestedmenuIcon,
    title: "Project Management",
    selected: false,
    active: false,
    type: "sub",
    children: [
      {
        path: "/project-management/programs",
        title: "Programs",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: "/project-management/donors",
        title: "Donors",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: "/project-management/projects",
        title: "Projects",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: "/project-management/staff",
        title: "Staff",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
      {
        path: "/project-management/activities",
        title: "Activities",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },

      {
        title: "Tickets",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: "/project-management/tickets/kanab",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Kanab",
          },
          {
            path: "/project-management/tickets/list",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "list",
          },
        ],
      },
    ],
  },
  {
    icon: Referential,
    title: "Referential",
    type: "sub",
    active: false,
    selected: false,
    children: [
      {
        title: "Locations",
        type: "sub",
        active: false,
        selected: false,
        dirchange: false,
        children: [
          {
            path: "/referential/provinces",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Provinces",
          },
          {
            path: "/referential/districts",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Districts",
          },
          {
            path: "/referential/gozars",
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: "Gozars/Villages",
          },
        ],
      },
      {
        path: "/referential/program-status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Program Status",
      },
      {
        path: "/referential/project-status",
        type: "link",
        ctive: false,
        selected: false,
        dirchange: false,
        title: "Project Status",
      },
      {
        path: "/referential/staff-status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Staff Status",
      },
      {
        path: "/referential/activity-type",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Activity Type",
      },
      {
        path: "/referential/activity-status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Activity Status",
      },
      {
        path: "/referential/ticket-status",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Ticket Status",
      },
      {
        path: "/referential/ticket-type",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Ticket type",
      },
      {
        path: "/referential/ticket-priority",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Ticket Priority",
      },
    ],
  },
  {
    icon: Admin,
    title: "Admin Panel",
    selected: false,
    active: false,
    type: "sub",
    children: [
      {
        path: "/admin/roles",
        title: "Roles",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
      },
    ],
  },
];
