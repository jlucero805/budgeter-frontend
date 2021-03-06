import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

export const useUser = () => {
	return useContext(UserContext);
}

export const UserProvider = ({children}) => {
	const [token, setToken] = useState('');
	const [purchases, setPurchases] = useState([]);
	const [page, setPage] = useState("purchases");
	const [loggedIn, setLoggedIn] = useState(false);
	const [types, setTypes] = useState([]);

	return (
		<UserContext.Provider value={{
			token, setToken,
			purchases, setPurchases,
			loggedIn, setLoggedIn,
			types, setTypes,
			page, setPage
		}}>
			{children}
		</UserContext.Provider>
	)
}