import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
     <div className='text-2xl text-center pt-10 border-t'>
      <Title text1={'ABOUT'} text2={'US'}/>
     </div>

     <div className='my-10 flex flex-col md:flex-row gap-16'>
      <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
      <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Forever was born out of a desire to create a brand that is not only stylish but also sustainable. We believe in the power of fashion to make a positive impact on the world, and we are committed to doing just that.</p>
        <p>Since our inception, we have been dedicated to using eco-friendly materials and ethical production practices. Our team works tirelessly to ensure that every piece we create is not only beautiful but also kind to the planet.</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>Our mission is to provide our customers with high-quality, sustainable fashion that they can feel good about wearing. We want to inspire a movement towards conscious consumerism, where every purchase is a step towards a better future for our planet.</p>
      </div>
     </div>
     {/* why choose us */}
     <div className='text-xl my-4'>
      <Title text1={'WHY'} text2={'CHOOSE US'}/>
     </div>

     <div className='flex flex-col md:flex-row mb-20'>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5'>
        <b>Quality Assurance:</b>
        <p className='text-gray-600'>We meticulously source our materials and partner with skilled artisans to ensure that every piece meets our high standards of quality. Our commitment to excellence means that you can trust the durability and craftsmanship of our products.</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5'>
      <b>Convinience:</b>
      <p className='text-gray-600'>with our user-friendly online shopping experience, you can browse and purchase our products from the comfort of your home. We offer fast and reliable shipping, ensuring that your order arrives promptly and in perfect condition.</p>
      </div>
      <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5'>
      <b>Exceptional Customer Service</b>
      <p className='text-gray-600'>Our team is dedicated to providing you with the best possible shopping experience. Whether you have questions about our products, need assistance with your order, or simply want to share your feedback, we are here to help. Your satisfaction is our top priority.</p>
      </div>
     </div>
     <NewsLetterBox/>
    </div>
  )
}

export default About