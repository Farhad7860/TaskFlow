import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * NEXT.JS ENV
 * .env.local:
 * NEXT_PUBLIC_BASE_URL=http://localhost:5000
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/* =========================
   CREATE PROJECT
========================= */
export const createProject = createAsyncThunk(
  "project/createProject",
  async ({ name, description }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   FETCH PROJECT DETAILS
========================= */
export const fetchProjectDetails = createAsyncThunk(
  "project/fetchProjectDetails",
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch project details");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   FETCH PROJECT MEMBERS
========================= */
export const fetchProjectMembers = createAsyncThunk(
  "project/fetchProjectMembers",
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/members`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch project members");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   FETCH USER PROJECTS
========================= */
export const fetchUserProjects = createAsyncThunk(
  "project/fetchUserProjects",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user projects");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ projectId, updates }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      return projectId;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   REMOVE PROJECT MEMBER ✅ FIX
========================= */
export const removeProjectMember = createAsyncThunk(
  "project/removeProjectMember",
  async ({ projectId, userId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue({ message: "Not authenticated" });
      }

      const response = await fetch(
        `${BASE_URL}/api/projects/${projectId}/member/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to remove project member"
        );
      }

      return { userId };
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
  }
);

/* =========================
   SLICE
========================= */
const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    projectDetails: null,
    members: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetProjectState: (state) => {
      state.projects = [];
      state.projectDetails = null;
      state.members = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchProjectDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectDetails = action.payload;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

      .addCase(fetchProjectMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      .addCase(removeProjectMember.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.members = state.members.filter(
          (member) => member._id !== userId
        );
      });
  },
});

export const { resetProjectState } = projectSlice.actions;
export default projectSlice.reducer;
