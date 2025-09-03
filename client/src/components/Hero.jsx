import React from 'react';
import heroCar from '../assets/hero.jpg'; // Make sure this path is correct

export default function Hero() {
  return (
    <div className="text-center pt-10 pb-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
        Find your perfect Vehicle, <br />
        <span className="text-orange-500">efficient</span> or{' '}
        <span className="text-orange-500">powerful</span>
      </h1>
      <div className="mt-2">
        <img 
          src={heroCar} 
          alt="Luxury Vehicle" 
          className="max-w-ms sm:max-w-lg mx-auto" 
        />
      </div>
    </div>
  );
}