// features/api/apiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define a generic fetch function to avoid redundancy
const fetchData = async (url, token) => {
  const res = await fetch(`${baseUrl}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return res.json();
};

// Create an async thunk for your API request
export const getProjectStatuses = createAsyncThunk(
  "api/getProjectStatuses",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/projects-statuses/select2", token);
    return result;
  }
);

export const getProgramsSelect2 = createAsyncThunk(
  "api/getProgramsSelect2",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/programs/select2", token);
    return result;
  }
);

export const getDonorsSelect2 = createAsyncThunk(
  "api/getDonorsSelect2",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/donors/select2", token);
    return result;
  }
);

export const getStaffSelect2 = createAsyncThunk(
  "api/getStaffSelect2",
  async ({ token, id }) => {
    // Fetch the data using the fetchData function
    console.log(id);
    const url = id ? `/api/staffs/select2/${id}` : `/api/staffs/select2`;
    const result = await fetchData(url, token);
    return result;
  }
);

export const getActivityStatuses = createAsyncThunk(
  "api/getActivityStatuses",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/activity-statuses/select2", token);
    return result;
  }
);

export const getActivityTypes = createAsyncThunk(
  "api/getActivityTypes",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/activity-types/select2", token);
    return result;
  }
);

export const getActivitiesSelect2 = createAsyncThunk(
  "api/getActivitiesSelect2",
  async ({ token, id }) => {
    const url = id
      ? `/api/activities/select2/${id}`
      : `/api/activities/select2`;
    const result = await fetchData(url, token);
    return result;
  }
);

export const getProjectsSelect2 = createAsyncThunk(
  "api/getProjectsSelect2",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/projects/select2", token);
    return result;
  }
);

export const getTicketStatuses = createAsyncThunk(
  "api/getTicketStatuses",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/ticket-statuses/select2", token);
    return result;
  }
);

export const getTicketTypes = createAsyncThunk(
  "api/getTicketTypes",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/ticket-types/select2", token);
    return result;
  }
);

export const getTicketPriorities = createAsyncThunk(
  "api/getTicketPriorities",
  async (token) => {
    // Fetch the data using the fetchData function
    const result = await fetchData("/api/ticket-priorities/select2", token);
    return result;
  }
);

export const getTicketsSelect2 = createAsyncThunk(
  "api/getTicketsSelect2",
  async ({ token, id }) => {
    const url = id
      ? `/api/tickets/select2/${id}`
      : `/api/tickets/select2`;
    const result = await fetchData(url, token);
    return result;
  }
);

// Create a slice to handle loading, success, and error states
const apiSlice = createSlice({
  name: "api",
  initialState: {
    projectStatuses: [],
    projectStatusesDefault: {},
    programs: [],
    donors: [],
    projects: [],
    staff: [],
    activityStatuses: [],
    activityStatusesDefault: {},
    activityTypes: [],
    activityTypesDefault: [],
    activities: [],
    ticketStatuses: [],
    ticketStatusDefault: {},
    ticketTypes: [],
    ticketTypeDefault: {},
    ticketPriorities: [],
    ticketPriorityDefault: {},
    tickets: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjectStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.projectStatusesDefault = { label: row.title, value: row.id };
          }
          return { label: row.title, value: row.id };
        });
        state.projectStatuses = tmp;
      })
      .addCase(getProjectStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(getProgramsSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProgramsSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.title, value: row.id };
        });
        state.programs = tmp;
      })
      .addCase(getProgramsSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getDonorsSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDonorsSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.name, value: row.id };
        });
        state.donors = tmp;
      })
      .addCase(getDonorsSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getStaffSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStaffSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.name, value: row.id };
        });
        state.staff = tmp;
      })
      .addCase(getStaffSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getProjectsSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjectsSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.title, value: row.id };
        });
        state.projects = tmp;
      })
      .addCase(getProjectsSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getActivityStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivityStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.activityStatusesDefault = { label: row.title, value: row.id };
          }
          return { label: row.title, value: row.id };
        });
        state.activityStatuses = tmp;
      })
      .addCase(getActivityStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getActivityTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivityTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.activityTypesDefault = { label: row.title, value: row.id };
          }

          return { label: row.title, value: row.id };
        });
        state.activityTypes = tmp;
      })
      .addCase(getActivityTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getActivitiesSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActivitiesSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.title, value: row.id };
        });
        state.activities = tmp;
      })
      .addCase(getActivitiesSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getTicketStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTicketStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.ticketStatusDefault = { label: row.title, value: row.id };
          }
          return { label: row.title, value: row.id };
        });
        state.ticketStatuses = tmp;
      })
      .addCase(getTicketStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getTicketTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTicketTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.ticketTypeDefault = { label: row.title, value: row.id };
          }

          return { label: row.title, value: row.id };
        });
        state.ticketTypes = tmp;
      })
      .addCase(getTicketTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getTicketPriorities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTicketPriorities.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          if (row.is_default) {
            state.ticketPriorityDefault = { label: row.title, value: row.id };
          }

          return { label: row.title, value: row.id };
        });
        state.ticketPriorities = tmp;
      })
      .addCase(getTicketPriorities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getTicketsSelect2.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTicketsSelect2.fulfilled, (state, action) => {
        state.isLoading = false;
        let tmp = action.payload.map((row, index) => {
          return { label: row.title, value: row.id };
        });
        state.tickets = tmp;
      })
      .addCase(getTicketsSelect2.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default apiSlice.reducer;
