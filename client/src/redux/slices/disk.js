import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

import { notifications } from '@mantine/notifications';
import { nprogress } from '@mantine/nprogress';

export const fetchGetDisk = createAsyncThunk('fetch/getDisk', async (id) => {
	if (!id) {
		const { data } = await axios.get(`/disk`);
		return data;
	} else {
		const { data } = await axios.get(`/disk?parent=${id}`);
		return data;
	}
});

export const fetchCreateDir = createAsyncThunk('fetch/createDir', async (params) => {
	const { data } = await axios.post(`/disk`, params).catch((err) => {
		notifications.show({
			title: 'Error',
			message: err.response.data.message || 'Server error, try again later',
			color: 'red',
		});
	});
	return data;
});

export const fetchGetFavorites = createAsyncThunk('fetch/getFavorites', async () => {
	const { data } = await axios.get(`/disk/favorites`);
	return data;
});

export const fetchUploadFile = createAsyncThunk('fetch/uploadFile', async ({ file, parent }) => {
	const formData = new FormData();
	formData.append('file', file);
	if (parent) {
		formData.append('parent', parent);
	}
	const { data } = await axios
		.post('/disk/upload', formData, {
			onUploadProgress: (progressEvent) => {
				const { loaded, total } = progressEvent;
				let percent = Math.floor((loaded * 100) / total);
				nprogress.set(percent);
				if (percent === 100) {
					nprogress.stop();
					notifications.show({
						title: 'File downloaded',
						message: 'Please wait while the file is processed',
						color: 'orange',
					});
				}
			},
		})
		.catch((err) => {
			notifications.show({
				title: 'Ошибка',
				message: err.response.data.message || 'Server error, try again later',
				color: 'red',
			});
		});
	return data;
});

export const fetchDeleteFile = createAsyncThunk('fetch/deleteFile', async (id) => {
	try {
		const { data } = await axios.delete(`/disk/${id}`);
		return data;
	} catch (err) {
		notifications.show({
			title: 'Error',
			message: err.response.data.message || 'Server error, try again later',
			color: 'red',
		});
	}
});

const initialState = {
	files: [],
	favorites: [],
	statusFiles: 'null',
	statusFavorites: 'null',
	error: null,
};

const diskSlice = createSlice({
	name: 'disk',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchGetDisk.pending, (state) => {
				state.statusFiles = 'loading';
			})
			.addCase(fetchGetDisk.fulfilled, (state, action) => {
				state.files = action.payload;
				state.statusFiles = 'loaded';
				state.error = null;
			})
			.addCase(fetchGetDisk.rejected, (state, action) => {
				state.files = [];
				state.statusFiles = 'error';
				state.error = action.error.message;
			})
			.addCase(fetchGetFavorites.pending, (state) => {
				state.statusFavorites = 'loading';
			})
			.addCase(fetchGetFavorites.fulfilled, (state, action) => {
				state.favorites = action.payload;
				state.statusFavorites = 'loaded';
				state.error = null;
			})
			.addCase(fetchGetFavorites.rejected, (state, action) => {
				state.statusFavorites = 'error';
				state.error = action.error.message;
			})
			.addCase(fetchCreateDir.pending, (state) => {
				notifications.show({
					title: 'Creating folder',
					message: 'Folder is being created...',
					color: 'orange',
				});
			})
			.addCase(fetchCreateDir.fulfilled, (state, action) => {
				state.files.push(action.payload);
				state.statusFiles = 'loaded';
				state.error = null;
				notifications.show({
					title: 'Creating folder',
					message: 'Folder created successfully',
					color: 'orange',
				});
			})
			.addCase(fetchCreateDir.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(fetchUploadFile.fulfilled, (state, action) => {
				state.files.push(action.payload);
				state.statusFiles = 'loaded';
				state.error = null;
				notifications.show({
					title: 'File upload',
					message: 'File uploaded successfully',
					color: 'orange',
				});
			})
			.addCase(fetchUploadFile.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(fetchDeleteFile.pending, () => {
				notifications.show({
					title: 'Deleting file',
					message: 'File is being deleted...',
					color: 'orange',
				});
			})
			.addCase(fetchDeleteFile.fulfilled, (state, action) => {
				if (action.payload) {
					state.files = state.files.filter((file) => file._id !== action.meta.arg);
					state.status = 'loaded';
					state.error = null;
					notifications.show({
						title: 'Deleting file',
						message: 'File deleted successfully',
						color: 'orange',
					});
				}
			});
	},
});

export const diskReducer = diskSlice.reducer;
