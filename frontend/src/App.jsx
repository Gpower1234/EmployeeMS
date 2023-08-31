import { useState } from 'react'
import Login from './assets/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './assets/Dashboard';
import Employee from './assets/Employee';
import Profile from './assets/Profile';
import Home from './assets/Home';
import AddEmployee from './assets/AddEmployee';
import EditEmployee from './assets/EditEmployee';
import Start from './assets/Start';
import EmployeeDetail from './assets/EmployeeDetail';
import EmployeLogin from './assets/EmployeLogin';

function App() {
  //const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route path='/employee' element={<Employee />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/home' element={<Home />}></Route>
        </Route>
        <Route path='/create' element={<AddEmployee />}></Route>
        <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/start' element={<Start />}></Route>
        <Route path='/employeeLogin' element={<EmployeLogin />}></Route>
        <Route path='/employeedetail/:id' element={<EmployeeDetail />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
