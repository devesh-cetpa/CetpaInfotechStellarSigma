import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { environment } from '../../config';
import axiosInstance from '@/services/axiosInstance';


export interface Event {
  id: number;
  title: string;
  theme: string;
  section?: string;
  image?: string;
  imagePath: string;
  description: string;
  date: string;
  isActive: boolean;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

// Thunk to fetch events
export const fetchEvents = createAsyncThunk<Event[]>(
  'event/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${environment.apiUrl}api/Event`);
      
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data as Event[];
      } else {
        console.error('Unexpected API response format:', response.data);
        return rejectWithValue('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue('Failed to fetch events');
    }
  }
);

// Event slice
const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      });
  },
});

export default eventSlice.reducer;
