import React, { useState, useEffect } from 'react'
import { strings } from '../res/strings'
import { useUser } from '../providers/UserProvider'
import {service} from '../services/service'

const Login = () => {
	const {token, setToken} = useUser();
	const {loggedIn, setLoggedIn} = useUser();
	const {purchases, setPurchases} = useUser();
	const {types, setTypes} = useUser();
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
				});
			service.getTypes(tempToken)
				.then(types => {
					setTypes(types.data.types);
					setLoggedIn(true);
				});
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
		// get purchases
		const allPurchases = await service.getPurchases(data.data.token);
		setPurchases(allPurchases.data);
		// get types
		const types = await service.getTypes(data.data.token);
		setTypes(types.data.types);
		resetFields();
		setLoggedIn(true);
	}

	return (
		<div className="window">
			<div className="login-box">
				<h2 className="plain-text">{strings.LOGIN}</h2>
					<input placeholder={strings.USERNAME} className="login-input nopad" onChange={e => usernameChanger(e) } value={username}></input>
					<input placeholder={strings.PASSWORD} className="login-input nopad" onChange={e => passwordChanger(e) } value={password} type="password"></input>
				<button className="login-btn nopad" onClick={loginClicker}>{strings.LOGIN}</button>
			</div>
		</div>
	)
}

export default Login