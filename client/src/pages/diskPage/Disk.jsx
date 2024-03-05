import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCirclePlus, CiCircleRemove, CiTrash, CiCircleChevLeft } from 'react-icons/ci';
import { SiWolframlanguage } from 'react-icons/si';
import {
	SlLayers,
	SlShare,
	SlDocs,
	SlMusicToneAlt,
	SlPicture,
	SlFilm,
	SlCloudDownload,
	SlCloudUpload,
} from 'react-icons/sl';

import Files from '../../components/Disk/Disk';
import './diskStyle.css';
import { useSelector } from 'react-redux';
import CreateDir from '../../components/CreateDir/CreateDir';
import { useDispatch } from 'react-redux';
import { fetchGetDisk, fetchUploadFile } from '../../redux/slices/disk';
import { isAuth as isAcc } from '../../redux/slices/auth';
import { notifications } from '@mantine/notifications';
import axios from '../../axios';
import RemoveFile from '../../components/RemoveFile/RemoveFile';


export default function Disk() {
	const [history, setHistory] = useState([]);
	const [isActiveModal, setIsActiveModal] = useState(false);
	const [isActiveRemove, setIsActiveRemove] = useState(false);
	const [isActiveFile, setIsActiveFile] = useState({
		_id: null,
		type: null,
		name: null,
	});
	const fileRef = useRef();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isAuth = useSelector(isAcc);
	const user = useSelector((state) => state.auth.user);
	const favorites = useSelector((state) => state.disk.favorites);
	const files = useSelector((state) => state.disk.files);

	const isLoad = useSelector((state) => state.disk.statusFiles);

	const order = [user?.firstName, 'Home', 'Public', 'Documents', 'Music', 'Pictures', 'Video'];
	const sortedData = [...favorites].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

	React.useEffect(() => {
		if (!window.localStorage.getItem("token") && !isAuth) {
		  navigate("/auth");
		}
	  }, [isAuth, navigate]);

	function FileDownload() {
		if (isActiveFile !== 'dir') {
			axios({
				url: `/disk/download/${isActiveFile._id}`,
				method: 'GET',
				responseType: 'blob',
			})
				.then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', isActiveFile.name);
					document.body.appendChild(link);
					link.click();
					notifications.show({
						title: 'Success',
						message: 'File downloaded successfully',
						color: 'orange',
					});
				})
				.catch((error) => {
					notifications.show({
						title: 'Error',
						message: error.response.data.message || 'Error downloading file',
						color: 'red',
					});
				});
		}
	}

	function handleFileUpload(e) {
		const file = e.target.files[0];
		dispatch(
			fetchUploadFile({
				file,
				parent: history.length > 0 ? history[history.length - 1]._id : undefined,
			}),
		);
	}

	function setDir(id) {
		dispatch(fetchGetDisk(id));
		setHistory([
			{
				_id: id,
			},
		]);
		setIsActiveFile({
			name: null,
			_id: null,
			type: null,
		});
	}

	function goToBack() {
		if (history.length > 1) {
			const updatedHistory = [...history];
			updatedHistory.pop();
			const backFolder = updatedHistory[updatedHistory.length - 1]._id;
			dispatch(fetchGetDisk(backFolder));
			setHistory(updatedHistory);
			setIsActiveFile({
				name: null,
				_id: null,
				type: null,
			});
		} else {
			dispatch(fetchGetDisk());
			setHistory([]);
		}
	}

	function activeModal() {
		setIsActiveModal(!isActiveModal);
	}

	return (
		<div className="container">
			<div className="disk">
				<div className="disk__conroller">
					<button
						onClick={() => {
							dispatch(fetchGetDisk());
							setHistory([]);
						}}>
						{user?.email}
					</button>
					<div className="disk__panel">
						<button className="disk__panel__btn" onClick={() => goToBack()}>
							<CiCircleChevLeft />
							<div className="tooltiptext">Back</div>
						</button>

						<button className="disk__panel__btn" onClick={() => activeModal()}>
							<CiCirclePlus />
							<div className="tooltiptext">Create folder</div>
						</button>
						<CreateDir isActive={isActiveModal} setIsActive={setIsActiveModal} history={history} />

						<button
							className="disk__panel__btn"
							onClick={() => {
								fileRef.current?.click();
							}}>
							<SlCloudUpload />
							<div className="tooltiptext">Upload file</div>
						</button>
						<input type="file" ref={fileRef} onChange={handleFileUpload} hidden />

						<button
							className="disk__panel__btn"
							onClick={() => {
								FileDownload();
							}}>
							<SlCloudDownload color={isActiveFile.type !== 'dir' && isActiveFile.type !== null ? '#ff5f0fc9' : ''} />
							<div className="tooltiptext">Download file</div>
						</button>

						<button
							className="disk__panel__btn"
							onClick={() => {
								if (isActiveFile._id !== null) {
									setIsActiveRemove(true);
								}
							}}>
							<CiTrash color={isActiveFile.type !== null ? '#ff5f0fc9' : ''} />
							<div className="tooltiptext">Delete file</div>
						</button>
						<RemoveFile isActive={isActiveRemove} setIsActive={setIsActiveRemove} file={isActiveFile} />

						<button
							className="disk__panel__btn"
							onClick={() => {
								navigate('/main');
							}}>
							<CiCircleRemove />
							<div className="tooltiptext">Close application</div>
						</button>
					</div>
				</div>
				<div className="disk__content">
					<div className="disk__menu">
						<div className="search"></div>
						<div className="favorites">
							{sortedData.map((favorite) => (
								<button
									key={favorite._id}
									className="favorites__dir"
									title={favorite.name}
									onClick={() => setDir(favorite._id)}>
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
								</button>
							))}
						</div>
					</div>
					<div className="disk__files">
						{isLoad === 'loaded' ? (
							<div className="files">
								<Files
									item={files}
									history={history}
									setHistory={setHistory}
									isActiveFile={isActiveFile}
									setIsActiveFile={setIsActiveFile}
								/>
							</div>
						) : (
							<div className="loader_container">
								<div className="loader"></div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
