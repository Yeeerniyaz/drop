import { configureStore } from '@reduxjs/toolkit';
import { AuthReducer } from './slices/auth';
import { diskReducer } from './slices/disk';

const store = configureStore({
	reducer: {
		auth: AuthReducer,
		disk: diskReducer,
	},
});

export default store;
