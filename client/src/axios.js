import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://dropitserver.yerniyaz.work.gd',
});

instance.interceptors.request.use((config) => {
	config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
	return config;
});

export default instance;
