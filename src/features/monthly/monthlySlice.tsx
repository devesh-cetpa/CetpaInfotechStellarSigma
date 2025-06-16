import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { environment } from '../../config';
import axiosInstance from '@/services/axiosInstance';


export const fetchMontlyReport = createAsyncThunk(
  'monthReport/fetchMontlyReport',
  async () => {
    const response = await axiosInstance.get(`${environment.apiUrl}api/SocietyMonthly`); 
    return response.data.data; 
  }
);

const monthSlice = createSlice({
  name: 'report',
  initialState: {
    events: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMontlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMontlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload; 
      })
      .addCase(fetchMontlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default monthSlice.reducer;