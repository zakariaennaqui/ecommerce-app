import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method , setMethod ] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name
    const value = event.target.value
    setFormData(data => ({...data, [name]:value}))
  }

  const initPay = (order) => {
    const options ={
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: order.currency,
      name: 'order payment',
      description: 'order payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const {data} = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {headers:{token}})
          if (data.success) {
            setCartItems({})
            navigate('/orders')
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      let orderItems = []

      for(const items in cartItems){
        for(const item in cartItems[items]){
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product=>product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
              
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch(method){

        // API Calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers:{token}})
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
          break;

          case 'stripe':
            const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers:{token}})
            if (responseStripe.data.success) {
              const {session_url} = responseStripe.data
              window.location.replace(session_url)
              }else{
                toast.error(responseStripe.data.message)
              }
          break;

          case 'razorpay':

          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }

          break;

          default:
            break;
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={"DELIVERY"} text2={"INFO"}/>
        </div>
        <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='Email Address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zip Code' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
            <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
      </div>

      {/* Right side */}

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"}/>
          {/* payment method selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
              <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' :''}`}></p>
                <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
              </div>
              <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' :''}`}></p>
                <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
              </div>
              <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' :''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
              </div>
          </div>
           <div className='w-full text-end mt-8'>
              <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
           </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder