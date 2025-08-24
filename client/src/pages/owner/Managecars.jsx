import React, { useEffect, useState } from 'react'
import { assets, dummyCarData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

function Managecars() {


  const {currency , axios , isOwner} = useAppContext();


  const [cars, setCars] = useState([])

  const fetchOwnerCar = async () => {
    // setCars(dummyCarData)
    try {
      const {data} = await axios.get('/api/owner/cars');

      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.mesaage);
    }
  }


  const toggleAvailability = async (carId) => {
    console.log('carId', carId);
    try {
      const {data} = await axios.post('/api/owner/toggle-car', {carId });
      if(data.success){
        toast.success(data.message);
        fetchOwnerCar();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this car?')
      if(!confirm) return null

      const {data} = await axios.post('/api/owner/delete-car', {carId });
      if(data.success){
        toast.success(data.message );
        fetchOwnerCar();
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }



  useEffect(() => {
    isOwner && fetchOwnerCar();
  }, [isOwner])


  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title={'Manage Car'} subTitle={'View all listed cars, update their details, or remove them from the booking plateform.'} />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={index} className='border-t border-borderColor'>

                <td className='p-3 flex items-center gap-3'>
                  <img src={car.image} alt='image' className='h-12 w-12 aspect-square rounded-r-md object-contain' />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{car.brand} {car.model}</p>
                    <p className='font-medium'>{car.seating_capacity} {car.transmission}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{car.category}</td>
                <td className='p-3 '>{currency} {car.pricePerDay}/day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={`p-3 py-1 rounded-full text-sx ${car.isAvailable ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>
                    {car.isAvaliable ? "Avaliable" : "Unavailable"}
                  </span>
                </td>
                <td className='flex items-center'>

                  <img onClick={()=> toggleAvailability(car?._id)} src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt='icon' className='cursor-pointer' />

                  <img onClick={()=> deleteCar(car?._id)} src={assets.delete_icon} alt='icon_delete' className='cursor-pointer' />

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Managecars