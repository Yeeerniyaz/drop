import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCreateDir } from '../../redux/slices/disk';

import './style.css';

export default function CreateDir({ isActive, setIsActive, history }) {
	const dispatch = useDispatch();

	const [newDir, setNewDir] = useState({
		name: '',
	});


	const lastId = history.length > 0 ? history[history.length - 1]._id : null;
	const handleSave = () => {
		if (newDir.name.trim() === '') {
			return;
		}
		dispatch(
			fetchCreateDir({
				name: newDir.name,
				parent: lastId,
			}),
		);
		setIsActive(false);
		setNewDir({ ...newDir, name: '' });
	};

	const handleClose = () => {
		setIsActive(false);
	};

	return (
		<div className={`modal__createDir ${isActive ? 'active' : ''}`} onClick={handleClose}>
			<div className="modal__createDir__container" onClick={(e) => e.stopPropagation()}>
				<h2>Create Folder</h2>
				<input
					type="text"
					id="folderName"
					placeholder="Folder name"
					value={newDir.name}
					onChange={(e) => setNewDir({ ...newDir, name: e.target.value })}
				/>
				<button onClick={handleSave}>Save</button>
			</div>
		</div>
	);
}
