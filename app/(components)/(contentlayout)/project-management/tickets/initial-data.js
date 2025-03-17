const initialData = [
  {
    id: 1,
    name: "Open",
    created_at: "2024-03-17T10:00:00.000000Z",
    updated_at: "2024-03-17T10:00:00.000000Z",
    tickets: [
      {
        id: 101,
        title: "Issue with login",
        description: "User cannot log in",
        ticket_status_id: 1,
        created_at: "2024-03-17T10:05:00.000000Z",
        updated_at: "2024-03-17T10:05:00.000000Z",
      },
      {
        id: 102,
        title: "Page not loading",
        description: "Dashboard page is slow",
        ticket_status_id: 1,
        created_at: "2024-03-17T10:10:00.000000Z",
        updated_at: "2024-03-17T10:10:00.000000Z",
      },
    ],
  },
  {
    id: 2,
    name: "In Progress",
    created_at: "2024-03-17T11:00:00.000000Z",
    updated_at: "2024-03-17T11:00:00.000000Z",
    tickets: [
      {
        id: 201,
        title: "Bug in checkout",
        description: "Payment gateway error",
        ticket_status_id: 2,
        created_at: "2024-03-17T11:15:00.000000Z",
        updated_at: "2024-03-17T11:15:00.000000Z",
      },
    ],
  },
];

export default initialData;
