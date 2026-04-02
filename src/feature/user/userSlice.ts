import { createSlice } from "@reduxjs/toolkit";
import { fetchUser, loginUser, logoutUser, registerUser } from "./userService";


// ✅ USER TYPE (VERY IMPORTANT)
export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
};


// ✅ LOADING TYPE
type LoadingState = {
  login: boolean;
  register: boolean;
  profile: boolean;
  logout: boolean;
};


// ✅ STATE TYPE
type UserState = {
  user: User | null;
  loading: LoadingState;
};


// ✅ INITIAL STATE
const initialState: UserState = {
  user: null,
  loading: {
    login: false,
    register: false,
    profile: false,
    logout: false,
  },
};


// ✅ SLICE
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔥 FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.user = action.payload?.data ?? null;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading.profile = false;
        state.user = null;
      })


      // 🔥 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload?.data ?? null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading.register = false;
        state.user = null;
      })


      // 🔥 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload?.data ?? null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading.login = false;
        state.user = null;
      })


      // 🔥 LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null; // ✅ logout pe user null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading.logout = false;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;