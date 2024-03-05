import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NavigationProgress } from '@mantine/nprogress';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { fetchGetMe, isAuth as isAcc } from './redux/slices/auth';
import { fetchGetDisk, fetchGetFavorites } from './redux/slices/disk';

import HomePage from './pages/homePage/Home';
import AuthPage from './pages/authPage/Auth';
import Disk from './pages/diskPage/Disk';

import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import './style/main.css';

import { useSelector } from 'react-redux';
import Load from './pages/loadPage/Load';
import Main from './pages/mainPage/Main';
import { ErrPage } from './pages/errPage/ErrPage';

function App() {
	const dispatch = useDispatch();
	const isLoadAuth = useSelector((state) => state.auth.status);
	const isLoadFavo = useSelector((state) => state.disk.statusFavorites);
	const isAuth = useSelector(isAcc);

	useEffect(() => {
		if (localStorage.getItem('token')) {
			localStorage.getItem('token');
			dispatch(fetchGetMe());
			dispatch(fetchGetDisk());
			dispatch(fetchGetFavorites());
		}
	}, [dispatch, isAuth]);

	if (isLoadAuth === 'loading' || isLoadFavo === 'loading') {
		return <Load />;
	} else {
		return (
			<MantineProvider>
				<NavigationProgress color="orange" />
				<Notifications />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/disk" element={<Disk />} />
						<Route path="/main" element={<Main />} />
						<Route path="*" element={<ErrPage />} />
					</Routes>
				</BrowserRouter>
			</MantineProvider>
		);
	}
}

export default App;
