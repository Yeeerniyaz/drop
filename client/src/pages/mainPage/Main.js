import React from 'react';
import { Progress } from '@mantine/core';
import { SiWolframlanguage } from 'react-icons/si';
import { SlLayers, SlShare, SlDocs, SlMusicToneAlt, SlPicture, SlFilm } from 'react-icons/sl';
import { Text, Flex, RingProgress } from '@mantine/core';

import './maineStyle.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { isAuth as SelectUser, logout } from '../../redux/slices/auth';
import axios from '../../axios';
import Load from '../loadPage/Load';
import { Faq } from '../../components/Faq/Faq';
import { useDispatch } from 'react-redux';

export default function Main() {
	const [progress, setProgress] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	const user = useSelector((state) => state.auth.user);
	const favorites = useSelector((state) => state.disk.favorites);
	const isLoading = useSelector((state) => state.auth.status);
	const isAuth = useSelector(SelectUser);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!window.localStorage.getItem('token') && !isAuth) {
			navigate('/auth');
		}
	}, [isAuth, navigate]);

	function clickLogout() {
		dispatch(logout());
		navigate('/');
	}

	const order = [user?.firstName, 'Home', 'Public', 'Documents', 'Music', 'Pictures', 'Video'];
	const sortedData = [...favorites].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

	const diskSpace = user?.dickSpace;
	const usedSpace = user?.usedSpace;

	const computeUsedSpacePrecent = (usedSpace) => {
		return Math.round((usedSpace / diskSpace) * 100);
	};

	const computeSize = (size) => {
		if (size < 1024) {
			return size + 'б';
		} else if (size < 1024 * 1024) {
			return (size / 1024).toFixed(1) + 'b';
		} else if (size < 1024 * 1024 * 1024) {
			return (size / 1024 / 1024).toFixed(1) + 'Mb';
		} else {
			return (size / 1024 / 1024 / 1024).toFixed(1) + 'Gb';
		}
	};

	const usedSpacePrecent = computeUsedSpacePrecent(usedSpace);
	const usedSpaceSize = computeSize(usedSpace);
	const diskSpaceSize = computeSize(diskSpace);

	const computeFileSizePrecent = (fileSize) => {
		return Math.round((fileSize / diskSpace) * 100);
	};

	React.useEffect(() => {
		if (isLoading === 'loaded') {
			axios.get('/main').then(({ data }) => {
				setProgress(data.fileSizes);
				setLoading(false);
			});
		}
	}, [isLoading, user]);

	const progressItems = [
		{
			type: 'Images',
			value: computeFileSizePrecent(progress.image),
			size: progress.image,
		},
		{
			type: 'Video',
			value: computeFileSizePrecent(progress.video),
			size: progress.video,
		},
		{
			type: 'Documents',
			value: computeFileSizePrecent(progress.document),
			size: progress.document,
		},
		{
			type: 'Archives',
			value: computeFileSizePrecent(progress.archive),
			size: progress.archive,
		},
		{
			type: 'Music',
			value: computeFileSizePrecent(progress.audio),
			size: progress.audio,
		},
		{
			type: 'Other',
			value: computeFileSizePrecent(progress.other),
			size: progress.other,
		},
	];

	const loaded = isLoading === 'loaded';
	if (!loaded) {
		return <Load />;
	}

	return (
		<div className="container">
			<div className="user_main">
				<div className="main_section">
					<div className="user_menu">
						<div className="user_profile">
							<img src={user?.avatarUrl} alt="" className="user_avatar" />
							<div className="user_name">
								<h1 className="user_fullName">
									{user?.fristName} {user?.lastName}
								</h1>
								<h2 className="user_email">{user?.email}</h2>
							</div>
						</div>
						<Link to={'/disk'} className="btnGetdisk">
							Open File Explorer
						</Link>
						<button className="btnLogOut" onClick={() => clickLogout()}>
							Log out of your account
						</button>
					</div>

					<div className="user_fav">
						{sortedData.map((favorite) => (
							<Link
								to={'/disk'}
								key={favorite._id}
								className="favorites__dir user_dir"
								title={favorite.name}
								onClick={() => ''}>
								{(() => {
									switch (favorite.name) {
										case 'Home':
											return <SlLayers />;
										case 'Public':
											return <SlShare />;
										case 'Documents':
											return <SlDocs />;
										case 'Music':
											return <SlMusicToneAlt />;
										case 'Pictures':
											return <SlPicture />;
										case 'Video':
											return <SlFilm />;
										default:
											return <SiWolframlanguage />;
									}
								})()}
								<span>{favorite.name}</span>
							</Link>
						))}
					</div>
				</div>
				<div className="main_section">
					<div className="main_progress">
						<Text fz="xs" tt="uppercase" fw={700} c="white">
							Used space
						</Text>

						<Text fz="lg" fw={500}>
							Used {usedSpaceSize} from {diskSpaceSize}
						</Text>
						<Progress value={usedSpacePrecent} size="lg" radius="xl" color="orange" />
					</div>

					<div className="main_r_progress">
						<Text fz="xs" tt="uppercase" fw={700} c="white">
							files
						</Text>

						{!loading && (
							<RingProgress
								size={190}
								thickness={13}
								roundCaps
								sections={progressItems.map((item) => ({
									value: item.value,
									color:
										item.type === 'Images'
											? 'blue'
											: item.type === 'Video'
											? 'red'
											: item.type === 'Documents'
											? 'green'
											: item.type === 'Archives'
											? 'yellow'
											: item.type === 'Music'
											? 'purple'
											: item.type === 'Other'
											? 'orange'
											: 'gray',
								}))}
							/>
						)}

						{progressItems.map((item) => (
							<Flex key={item.type} align="center" justify="space-between" mt="md">
								<Text size="sm" weight={500} c="white">
									{item.type}
								</Text>
								<Text size="sm" weight={500} c="white">
									{computeSize(item.size)}
								</Text>
							</Flex>
						))}
					</div>
				</div>
				<div className="main_section">
					<div className="contacts">
						<Text fz="lg" fw={700} className="title" c="#fff">
							Contact information
						</Text>

						<Faq />

						<p
							style={{
								marginTop: '20px',
							}}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
							ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
							fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
