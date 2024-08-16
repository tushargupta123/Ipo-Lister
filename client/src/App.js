import './App.css';
import Protect from './components/Protect';
import Ipo from './pages/ipo';
import Login from './pages/login';
import Signup from './pages/signup';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
        <Router>
            <Routes>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/' element={<Protect><Ipo/></Protect>}/>
            </Routes>
        </Router>
  )
}

export default App