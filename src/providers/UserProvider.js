import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

export const useUser = () => {
	return useContext(UserContext);
}

export const UserProvider = ({children}) => {
	const [token, setToken] = useState('');
	const [purchases, setPurchases] = useState([]);
	const [page, setPage] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<UserContext.Provider value={{
			token, setToken,
			purchases, setPurchases,
			loggedIn, setLoggedIn
		}}>
			{children}
		</UserContext.Provider>
	)
}