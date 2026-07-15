import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/orders', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ orderId, reason }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/orders/${orderId}/cancel`, { reason });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createRazorpayOrder = createAsyncThunk('orders/createRazorpay', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/payment/create-order', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const verifyPayment = createAsyncThunk('orders/verifyPayment', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/payment/verify', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const confirmUpiPayment = createAsyncThunk('orders/confirmUpi', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/payment/confirm-upi', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    loading: false,
    paymentLoading: false,
    error: null
  },
  reducers: {
    clearOrder(state) { state.order = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || 'Order creation failed');
      })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchMyOrders.rejected, (state) => { state.loading = false; })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(fetchOrder.rejected, (state) => { state.loading = false; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        const idx = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (idx > -1) state.orders[idx] = action.payload.order;
        toast.success('Order cancelled successfully');
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        toast.error(action.payload || 'Cancellation failed');
      })
      .addCase(createRazorpayOrder.pending, (state) => { state.paymentLoading = true; })
      .addCase(createRazorpayOrder.fulfilled, (state) => { state.paymentLoading = false; })
      .addCase(createRazorpayOrder.rejected, (state) => { state.paymentLoading = false; })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.order = action.payload.order;
        toast.success('Payment successful! 🎉');
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        toast.error(action.payload || 'Payment verification failed');
      })
      .addCase(confirmUpiPayment.pending, (state) => { state.paymentLoading = true; })
      .addCase(confirmUpiPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.order = action.payload.order;
      })
      .addCase(confirmUpiPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        toast.error(action.payload || 'Payment confirmation failed');
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
