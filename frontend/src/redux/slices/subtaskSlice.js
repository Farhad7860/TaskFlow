import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/* =========================
   FETCH SUBTASKS
========================= */
export const fetchSubtasks = createAsyncThunk(
  "subtask/fetchSubtasks",
  async (taskId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${thunkAPI.getState().project.projectDetails._id}/tasks/${taskId}/subtasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch subtasks");
      }

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   CREATE SUBTASK
========================= */
export const createSubtask = createAsyncThunk(
  "subtask/createSubtask",
  async ({ projectId, taskId, title, description, status = "todo" }, thunkAPI) => {
    try {
      if (!title.trim()) {
        throw new Error("Subtask title is required");
      }

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${projectId}/tasks/${taskId}/subtasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
        }
      );

      if (!res.ok) {
        throw new Error("Subtask creation failed");
      }

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const subtaskSlice = createSlice({
  name: "subtask",
  initialState: {
    subtasks: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubtasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubtasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subtasks = action.payload;
      })
      .addCase(fetchSubtasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createSubtask.fulfilled, (state, action) => {
        state.subtasks.push(action.payload);
      });
  },
});

export default subtaskSlice.reducer;
