
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Login from './pages/Login'
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Calender from './pages/Calender';

function App() {

  return (
    <>
      <Routes>
       
        <Route path='/' element={<Login/>}/>
        <Route path='/calender' element={<Calender/>}/>

      </Routes>
    </>
  )
}

export default App
