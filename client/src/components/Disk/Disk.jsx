import React from 'react';
import { SlFolder } from 'react-icons/sl';
import { FiFile } from 'react-icons/fi';
import './Disk.css';
import { useDispatch } from 'react-redux';
import { fetchGetDisk } from '../../redux/slices/disk';

const Disk = ({ item, history, setHistory, isActiveFile, setIsActiveFile }) => {
	const dispatch = useDispatch();

	const size = (size) => {
		if (size < 1024) {
			return size + ' B';
		} else if (size < 1048576) {
			return (size / 1024).toFixed(2) + ' KB';
		} else if (size < 1073741824) {
			return (size / 1048576).toFixed(2) + ' MB';
		} else {
			return (size / 1073741824).toFixed(2) + ' GB';
		}
	};

	async function setActiveFileAndSetDir(file) {
		if (isActiveFile._id === file._id) {
			if (file.type === 'dir') {
				dispatch(fetchGetDisk(file._id));
				setHistory([...history, { _id: file._id }]);
			}
		} else {
			setIsActiveFile({
				type: file.type,
				_id: file._id,
				name: file.name,
			});
		}
	}

	console.log(isActiveFile);
	return (
		<div className="file__a">
			{item.map((item) => (
				<button
					key={item._id}
					className={`disk__item ${item.type === 'dir' ? 'directory' : 'file'} ${
						isActiveFile._id === item._id ? 'activeFile' : ''
					} `}
					onClick={(e) => {
						e.preventDefault();
						setActiveFileAndSetDir(item);
					}}
					title={
						item.type === 'dir' ? `${item.name}` : `Name: ${item.name} \nType: ${item.type}\nSize: ${size(item.size)}`
					}>
					{item.type === 'dir' ? <SlFolder style={{ fontSize: '30px' }} /> : <FiFile style={{ fontSize: '30px' }} />}
					{item.name}
				</button>
			))}
		</div>
	);
};

export default Disk;
