import React, { useState } from 'react'
import './Login.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
    email: "",
    password: "",

  });
  console.log(userData);

    const handleLogin = () => {
        if (userData.email === 'staff@clinic.com' && userData.password === '123456') {
            navigate('/calender');
            console.log("login success");
            
        } else {
           alert('Invalid email or password');
           
        }
    };

    return (
        <>
            <Header />
            <div className='d-flex justify-content-center align-items-center  ' id='login' style={{ height: '100vh' }}>
                {/* login form */}
                <div className="mb-3  email d-flex justify-content-center align-items-center flex-column  p-4  ">
                    {/* form for email */}
                    <label for="exampleFormControlInput1" className="form-label w-100 text-start"  >Email address</label>
                    <input type="email" className="form-control form" id="exampleFormControlInput1" placeholder="name@example.com"  onChange={(e) =>setUserData({ ...userData, email: e.target.value })} />

                    {/* form for password */}
                    <label for="exampleFormControlInput2" className="form-label w-100 text-start mt-3">Password</label>
                    <input type="text" className="form-control form" id="exampleFormControlInput2" placeholder="password" onChange={(e) =>setUserData({ ...userData, password: e.target.value }) } />

                    {/* button */}
                    <button type='button' className='btn btn-primary mt-3 w-75' onClick={handleLogin}>Login</button>
                </div>

            </div>
        </>
    )
}

export default Login