import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Start() {
  const navigate = useNavigate();
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='p-3 rounded w-25 border loginform text-center'>
            <h2>Login As</h2>
            <div className='d-flex justify-content-around mt-3'>
                <button className='btn btn-primary btn-lg' onClick={e => navigate('/employeeLogin')}>Employee</button>
                <button className='btn btn-success btn-lg' onClick={e => navigate('/login')}>Admin</button>
            </div>
        </div>
    </div>
  )
}
