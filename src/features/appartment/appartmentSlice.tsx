import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { environment } from '../../config';
import axiosInstance from '@/services/axiosInstance';

// Interface for individual flat/villa
export interface Apartment {
  id: number;
  flatNumber: string;
}

// Interface for the Redux state
interface ApartmentsState {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ApartmentsState = {
  apartments: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all apartments
export const fetchAllApartments = createAsyncThunk<Apartment[]>(
  'apartments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
            
             const response = await axiosInstance.get<{ data: Apartment[] }>(
        `${environment.apiUrl}api/FlatsAndVillas/GetAllApartments`
      );
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data as Apartment[];
      } else {
        console.error('Unexpected API response format:', response.data);
        return rejectWithValue('Unexpected API response format');
      }

    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch apartments');
    }
  }
);

// Create the slice
const apartmentsSlice = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
       clearApartments: (state) => {
      state.apartments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
            .addCase(fetchAllApartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful fetch
      .addCase(fetchAllApartments.fulfilled, (state, action: PayloadAction<Apartment[]>) => {
        state.loading = false;
        state.apartments = action.payload;
      })
      // Handle failed fetch
      .addCase(fetchAllApartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch apartments';
      });
  },
});

// Export actions
export const { clearApartments } = apartmentsSlice.actions;

// Export the reducer
export default apartmentsSlice.reducer;