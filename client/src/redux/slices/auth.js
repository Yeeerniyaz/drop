import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

import { notifications } from '@mantine/notifications';

export const fetchRegister = createAsyncThunk('auth/register', async (params) => {
	const { data } = await axios.post('/auth/register', params).catch((err) => {
		notifications.show({
			title: 'Error',
			message: err.response.data.message || 'Server error, please try again later',
			color: 'red',
		});
	});
	return data;
});

export const fetchLogin = createAsyncThunk('auth/login', async (params) => {
	const { data } = await axios.post('/auth/login', params).catch((err) => {
		notifications.show({
			title: 'Error',
			message: err.response.data.message || 'Server error, please try again later',
			color: 'red',
		});
	});
	return data;
});

export const fetchGetMe = createAsyncThunk('auth/getme', async () => {
	const { data } = await axios.get('/auth/getme');
	return data;
});

const initialState = {
	user: null,
	status: 'null',
	error: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.user = null;
			state.status = 'null';
			state.error = null;
			localStorage.removeItem('token');
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRegister.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRegister.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = 'loaded';
				state.error = null;
				localStorage.setItem('token', action.payload.token);
			})
			.addCase(fetchRegister.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
				localStorage.removeItem('token');
				notifications.show({
					title: 'Error',
					message: action.error.message,
					color: 'red',
				});
			})
			.addCase(fetchLogin.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchLogin.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.status = 'loaded';
				state.error = null;
				localStorage.setItem('token', action.payload.token);
			})
			.addCase(fetchLogin.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
				localStorage.removeItem('token');
				notifications.show({
					title: 'Error',
					message: action.error.message,
					color: 'red',
				});
			})
			.addCase(fetchGetMe.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchGetMe.fulfilled, (state, action) => {
				state.user = action.payload;
				state.status = 'loaded';
				state.error = null;
			})
			.addCase(fetchGetMe.rejected, () => {
				localStorage.removeItem('token');
			});
	},
});

export const AuthReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
export const isAuth = (state) => Boolean(state.auth.user);
