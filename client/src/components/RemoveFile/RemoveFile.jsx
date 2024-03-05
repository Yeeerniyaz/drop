import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchDeleteFile } from '../../redux/slices/disk';

export default function RemoveFile({ isActive, setIsActive, file }) {
	const dispatch = useDispatch();

	const handleRemove = () => {
		dispatch(fetchDeleteFile(file._id));
		setIsActive(false);
	};

	const handleClose = () => {
		setIsActive(false);
	};

	return (
		<div className={`modal__createDir ${isActive ? 'active' : ''}`} onClick={handleClose}>
			<div className="modal__createDir__container" onClick={(e) => e.stopPropagation()}>
				<h2>Are you sure you want to delete</h2>
				<p>{file.name}</p>
				<button
					style={{
						backgroundColor: '#D04848',
						marginTop: '10px',
					}}
					onClick={handleRemove}>
					Delete
				</button>
				<button
					style={{
						marginTop: '10px',
					}}
					onClick={handleClose}>
					cancel
				</button>
			</div>
		</div>
	);
}
