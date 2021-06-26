import './App.css';
import { UserProvider } from './providers/UserProvider';
import {} from './services/service'
import Main from './Main'

function App() {
  return (
    <UserProvider>
      <Main/>
    </UserProvider>
  );
}

export default App;
