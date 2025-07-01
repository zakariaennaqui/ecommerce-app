import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register',{name, email, password})
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      } else {

        const response = await axios.post(backendUrl + '/api/user/login', {email, password})
        if (response.data.success){
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)

        }
      }

      
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
  }
  },[token])
  return (
    <form onSubmit={onSubmitHandler} className='w-full max-w-md mx-auto mt-16 p-6 bg-white shadow-md rounded-lg'>
      <div className='text-2xl font-bold text-center mb-6'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='w-16 mx-auto mt-2 border-t-2 border-gray-300' />
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Name' className='border border-gray-300 rounded py-2 px-4 w-full mb-4' required/>}
      <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email' className='border border-gray-300 rounded py-2 px-4 w-full mb-4' required/>
      <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='border border-gray-300 rounded py-2 px-4 w-full mb-4' required/>
      <div className='flex items-center justify-between mb-4'>
        <p className='cursor-pointer'>Forgot Password?</p>
        {
          currentState === 'Login' ? 
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-blue-500'>Create an Account</p> : 
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-blue-500'>Already have an account?</p>
        }
      </div>
      <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
