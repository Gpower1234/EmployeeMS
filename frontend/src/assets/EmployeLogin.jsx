import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EmployeLogin() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    axios.defaults.withCredentials = true
    const navigate = useNavigate('/employeeDetail')

    axios.defaults.withCredentials = true;

    const [error, setError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:5000/employeeLogin', values)
        .then(res => {
            if(res.data.status === 'success'){
                const id = res.data.id;
                navigate('/employeedetail/'+id);
            } else {
               setError(res.data.Error);
            }
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='p-3 rounded w-25 border loginform'>
            <div className='text-danger'>
                {error && error}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                    <input type="email" id="form2Example1" onChange={e => setValues({...values, email: e.target.value})} className="form-control rounded-0" />
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-4">
                    <input type="password" id="form2Example2" onChange={e => setValues({...values, password: e.target.value})} className="form-control rounded-0" />
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                </div>

                {/* 2 column grid layout for inline styling */}
                <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                    {/* Checkbox */}
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="form2Example31" defaultChecked />
                        <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                    </div>
                    </div>

                    <div className="col">
                    {/* Simple link */}
                    <a href="#!">Forgot password?</a>Name
                    </div>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary btn-block mb-4">Sign in</button>

                {/* Register buttons */}
                <div className="text-center">
                    <p>Not a member? <a href="#!">Register</a></p>
                    <p>or sign up with:</p>
                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-facebook-f"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-google"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-twitter"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                    <i className="fab fa-github"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
