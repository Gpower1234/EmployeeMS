import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditEmployee() {

    const [data, setData] = useState({
        name: '',
        email: '',
        salary: '',
        address: '',
      })
    
      const navigate = useNavigate();
      
      const {id} = useParams();

      useEffect(() => {
        
        axios.get('http://localhost:5000/get/'+id)
        .then(res => {
            setData(
                {...data, name: res.data.Result[0].name,
                email: res.data.Result[0].email,
                salary: res.data.Result[0].salary,
                address: res.data.Result[0].address},
            )
        })
        .catch(err => console.log(err))
      }, [])
    
      const handleSubmit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append('name', data.name);
        formdata.append('email', data.email);
        formdata.append('salary', data.salary);
        formdata.append('address', data.address);
        axios.put('http://localhost:5000/update/'+id, data)
        .then(res => {
          navigate('/employee')
        })
        .catch(err => console.log(err))
      }
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Update Employee</h2>
      <form className='row g-3 w-50' onSubmit={handleSubmit}>
        <div className='col-12'>
          <label htmlFor='inputName' className='form-label'>Name</label>
          <input type='text' className='form-control' id='inputName' placeholder='Enter Name'
           onChange={e => setData({...data, name: e.target.value})} value={data.name}/>
        </div>
        <div className='col-12'>
          <label htmlFor='inputEmail4' className='form-label'>Email</label>
          <input type='email' className='form-control' id='inputEmail4' placeholder='Enter Email'
           onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
        </div>
        <div className='col-12'>
          <label htmlFor='inputSalary' className='form-label'>Salary</label>
          <input type='number' className='form-control' id='inputSalary' placeholder='Enters Salary'
           onChange={e => setData({...data, salary: e.target.value })} value={data.salary}/>
        </div>
        <div className='col-12'>
          <label htmlFor='inputAddress' className='form-label'>Address</label>
          <input type='text' className='form-control' id='inputAddress' placeholder='1234 Main St'
           onChange={e => setData({...data, address: e.target.value })} value={data.address}/>
        </div>
        <div className='col-12'>
          <button type='submit' className='btn btn-primary'>Update</button>
        </div>
      </form>
    </div>
  )
}
