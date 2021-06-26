import './App.css';
import { } from './services/service'
import Login from './components/Login';
import Content from './components/Content';
import { UserProvider, useUser } from './providers/UserProvider';

function App() {
	const {page, setPage} = useUser();
	const {loggedIn, setLoggedIn} = useUser();

	return (
		<div>
			{loggedIn ? <Content/> : <Login/>}
		</div>
	);
}

export default App;