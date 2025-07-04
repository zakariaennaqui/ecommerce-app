import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {setShowSearch, getCartCount, navigate, token, setToken, setCartTtems} = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartTtems({})
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium relative'>

      {/* Logo */}
      <Link to='/'><img src={assets.logo} className='w-36' alt="logo" /></Link>

      {/* Menu desktop */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        {['/', '/collection', '/about', '/contact'].map((path, idx) => (
          <NavLink key={idx} to={path} className='flex flex-col items-center gap-1'>
            <p>{path === '/' ? 'HOME' : path.replace('/', '').toUpperCase()}</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
        ))}
      </ul>

      {/* Icons */}
      <div className='flex items-center gap-6'>
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="search" />

        {/* Profile Dropdown */}
        <div className='group relative'>
         
         <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
         {/* Dropdown Menu */}
          {token && 
          <div className='group-hover:block hidden absolute right-0 pt-4 z-10'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow'>
              {/* <p className='cursor-pointer hover:text-black'>My Profile</p> */}
              {/* <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>My Profile</p> */}
              <Link to='/profile' className='hover:text-black'>My Profile</Link>
              <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
              <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>}
        </div>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        {/* Menu Icon (Mobile) */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="menu" />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`fixed top-0 right-0 h-full bg-white z-50 transition-all duration-300 ease-in-out ${visible ? 'w-3/4 px-4 py-6' : 'w-0 overflow-hidden'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="back" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
