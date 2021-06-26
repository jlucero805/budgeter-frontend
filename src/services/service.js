import axios from 'axios';

const baseUrl = process.env.REACT_APP_URL;

const createAccount = body => {
	return axios.post(`${baseUrl}/auth/user`, body);
}

const login = body => {
	return axios.post(`${baseUrl}/auth/login`, body);
}

const getPurchases = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	}
	return axios.get(`${baseUrl}/purchase`, config);
}

console.log(baseUrl);

export const service = {
	login,
	createAccount,
	getPurchases
}