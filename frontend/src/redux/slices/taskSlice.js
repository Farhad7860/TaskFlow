import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/* =========================
   CREATE TASK
========================= */
export const createTask = createAsyncThunk(
  "task/createTask",
  async ({ projectId, title, description, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${projectId}/tasks/create`,
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
        const err = await res.json();
        throw new Error(err.message || "Failed to create task");
      }

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   FETCH TASKS (KANBAN)
========================= */
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (projectId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${projectId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch tasks");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   FETCH TASK DETAILS ✅ FIX
========================= */
export const fetchTaskDetails = createAsyncThunk(
  "task/fetchTaskDetails",
  async ({ projectId, taskId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${projectId}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch task details");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   UPDATE TASK STATUS (DnD)
========================= */
export const updateTaskStatus = createAsyncThunk(
  "task/updateTaskStatus",
  async ({ projectId, taskId, status }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/projects/${projectId}/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Failed to update task status");
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */
const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    selectedTask: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE TASK */
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?._id) {
          state.tasks.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* FETCH TASKS */
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })

      /* FETCH TASK DETAILS ✅ FIX */
      .addCase(fetchTaskDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* UPDATE TASK STATUS (DnD) */
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
