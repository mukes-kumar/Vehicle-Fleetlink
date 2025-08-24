import React from 'react'
import { assets } from '../assets/assets'

function Footer() {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>

      <div className='flex flex-wrap justify-between  items-start gap-8 pb-6 border-borderColor'>
        <div>
          <img src={assets.logo2} alt="logo" className='h-18 md:h-14' />
          <p className='max-w-80 mt-3'>
            Premium Gocar rental service with a wide selection of luxury and everyday vehicles for all your driving needs .
          </p>
          <div className='flex items-center gap-3 mt-6'>
            {/* Instagram */}
            <a href='#'><img src={assets.instagram_logo} alt='instagram_logo' className='w-5 h-5' /></a>
            {/* Facebook */}
            <a href='#'><img src={assets.facebook_logo} alt='facebook_logo' className='w-5 h-5' /></a>

            {/* Twitter */}
            <a href='#'><img src={assets.gmail_logo} alt='twitter_logo' className='w-5 h-5' /></a>

            {/* LinkedIn */}
            {/* <a href='#'><img src={assets.} alt=''/></a> */}

          </div>
        </div>

        <div>
          <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
          <ul className='mt-3 flex flex-col gap-1.5'>
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse Cars</a></li>
            <li><a href="#">List Your Car</a></li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>

        <div>
          <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
          <ul className='mt-3 flex flex-col gap-1.5'>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Terms of Service </a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Insurance</a></li>
          </ul>
        </div>

        <div>
          <h2 className='text-base font-medium text-gray-800 uppercase'>Contaact</h2>
          <ul className='mt-3 flex flex-col gap-1.5'>
            <li>Luxury Drive </li>
            <li>Grater Noida , Uttar Pradesh (India) </li>
            <li>+91 7480082596</li>
            <li>mukesh.vin99@gmail.com</li>
          </ul>
        </div>

      </div>
      <hr className='border-gray-300 mt-8' />
      <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
        <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
        <ul className='flex items-center gap-4'>
          <li><a href="#">Privacy</a> <span> | </span></li>
          <li><a href="#">Terms</a>  <span> | </span></li>
          <li><a href="#">Sitemap</a></li>
        </ul>
      </div>
    </div>)
}

export default Footer