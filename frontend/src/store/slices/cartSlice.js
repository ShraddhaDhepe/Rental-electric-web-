import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart/add', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/cart/update/${itemId}`, { quantity });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/remove/${itemId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    const res = await api.delete('/cart/clear');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null
  },
  reducers: {
    resetCart(state) {
      state.cart = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(fetchCart.rejected, (state) => { state.loading = false; })
      .addCase(addToCart.pending, (state) => { state.loading = true; })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        toast.success('Added to cart! 🛒');
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload || 'Failed to add to cart');
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        toast.success('Removed from cart');
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = { items: [] };
        toast.success('Cart cleared');
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
