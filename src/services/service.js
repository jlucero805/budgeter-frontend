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

const addPurchase = (token, body) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	}
	return axios.post(`${baseUrl}/purchase`, body, config);
}

const deletePurchase = (token, id) => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	}
	return axios.delete(`${baseUrl}/purchase/${id}`, config);
}

const getTypes = token => {
	const config = {
		headers: {
			authorization: `Bearer ${token}`
		}
	}
	return axios.get(`${baseUrl}/user/types`, config);
}

export const service = {
	login,
	createAccount,
	getPurchases,
	addPurchase,
	deletePurchase,
	getTypes
}