import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchLogin, fetchRegister } from '../../redux/slices/auth';
import './authStyle.css';
import { isAuth as foundMe } from '../../redux/slices/auth';

export default function AuthPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isAuth = useSelector(foundMe);

	const [isAcc, setIsAcc] = useState(false);
	const [user, setUser] = useState({
		email: 'test@test.kz',
		password: '0101',
		fristName: 'Charlie',
		lastName: 'Puth',
	});

	useEffect(() => {
		if (isAuth) {
			navigate('/main');
		}
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser((prevUser) => ({ ...prevUser, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isAcc) {
			const response = await dispatch(fetchRegister(user));
			response.payload && navigate('/main');
		} else {
			const response = await dispatch(fetchLogin(user));
			response.payload && navigate('/main');
		}
	};

	return (
		<div className="auth">
			<div className="auth__center">
				<form onSubmit={handleSubmit} className="form_main">
					<p className="heading">{isAcc ? 'Register' : 'Login'}</p>

					{isAcc && (
						<>
							<div className="inputContainer">
								<input
									type="text"
									name="fristName"
									value={user.fristName}
									onChange={handleInputChange}
									className="inputField"
									placeholder="fristName"
								/>
							</div>

							<div className="inputContainer">
								<input
									type="text"
									name="lastName"
									value={user.lastName}
									onChange={handleInputChange}
									className="inputField"
									placeholder="Last Name"
								/>
							</div>
						</>
					)}

					<div className="inputContainer">
						<input
							type="email"
							name="email"
							value={user.email}
							onChange={handleInputChange}
							className="inputField"
							placeholder="Email"
						/>
					</div>

					<div className="inputContainer">
						<input
							type="password"
							name="password"
							value={user.password}
							onChange={handleInputChange}
							className="inputField"
							placeholder="Password"
						/>
					</div>

					<button type="submit" id="button">
						{isAcc ? 'Create an account' : 'login to account'}
					</button>

					<button
						onClick={(e) => {
							e.preventDefault();
							setIsAcc(!isAcc);
						}}
						className="auth__isAcc">
						{isAcc ? 'I have an account, login account' : "I don't have an account, create an account"}
					</button>
				</form>
			</div>
		</div>
	);
}
