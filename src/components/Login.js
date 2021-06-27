import React, { useState, useEffect } from 'react'
import { strings } from '../res/strings'
import { useUser } from '../providers/UserProvider'
import {service} from '../services/service'

const Login = () => {
	const {token, setToken} = useUser();
	const {loggedIn, setLoggedIn} = useUser();
	const {purchases, setPurchases} = useUser();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	// auto-login if token exists
	useEffect(() => {
		const tempToken = localStorage.getItem('token');
		if (tempToken) {
			setToken(tempToken);
			service.getPurchases(tempToken)
				.then(purchases => {
					setPurchases(purchases.data);
					resetFields();
					setLoggedIn(true);
				})
		}
	}, []);

	const usernameChanger = e => { setUsername(e.target.value); }
	const passwordChanger = e => { setPassword(e.target.value); }

	const resetFields = () => {
		setUsername('');
		setPassword('');
	}

	const loginClicker = async () => { login(); }

	const login = async () => {
		const data = await service.login({username: username, password: password});
		if (data.data.error) {
			console.log("error");
			resetFields();
			return
		}
		setToken(data.data.token);
		localStorage.setItem('token', data.data.token);
		const allPurchases = await service.getPurchases(data.data.token);
		setPurchases(allPurchases.data);
		console.log(allPurchases.data);
		resetFields();
		setLoggedIn(true);
	}

	return (
		<div className="window">
			<div className="login-box">
				<h2>Login</h2>
				<div className="input-field">
					<p>{strings.USERNAME}</p>
					<input className="input-box" onChange={e => usernameChanger(e) } value={username}></input>
				</div>
				<div className="input-field">
					<p>{strings.PASSWORD}</p>
					<input className="input-box" onChange={e => passwordChanger(e) } value={password}></input>
				</div>
				<button onClick={loginClicker}>login</button>
			</div>
		</div>
	)
}

export default Login