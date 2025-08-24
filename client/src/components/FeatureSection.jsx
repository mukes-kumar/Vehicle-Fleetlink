import React from 'react';
import Title from './Title';
import { assets, dummyCarData } from '../assets/assets';
import CarCard from './CarCard';
import { easeIn, easeOut, motion, scale } from 'motion/react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAppContext } from '../context/AppContext';

function FeatureSection() {


  const { cars } = useAppContext();


  const navigate = useNavigate()



  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, easeIn }}

      className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Title
          title={'Feature Vehicles'}
          subTitle={'Explore our selection of premium vehicles available for your next adventure.'}
          align={''}
        />
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full mt-12">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation
          pagination={{
            clickable: true,
            renderCustom: (swiper, current, total) => {
              return `<span class="text-blue-500 mt-20 font-medium">${current} of ${total}</span>`;
            }
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {cars?.slice(0, 6).map((car) => (
            <SwiperSlide
              key={car._id}>
                <motion.div
                 initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 , easeOut}}
                >
              <CarCard car={car} />
                </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}

        onClick={() => {
          navigate('/cars'); scrollTo(0, 0)
        }} className='flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer'>Explore all cars <img src={assets.arrow_icon} alt='arrow' /></motion.button>

    </motion.div>
  );
}

export default FeatureSection;
