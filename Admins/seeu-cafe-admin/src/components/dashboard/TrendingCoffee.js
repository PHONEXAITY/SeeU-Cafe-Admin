// components/dashboard/TrendingCoffee.js
import React from 'react';
import Image from 'next/image';

const coffeeData = [
  { name: 'Cappuccino', price: '$55.00', orders: 240 },
  { name: 'Latte', price: '$70.50', orders: 220 },
  { name: 'Frappuccino', price: '$85.50', orders: 200 },
  { name: 'Mocha', price: '$60.50', orders: 100 },
  { name: 'Mocha', price: '$50.50', orders: 100 },
];

const TrendingCoffee = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trending Coffee</h2>
        <a href="#" className="text-brown-500 text-sm">See all</a>
      </div>
      <div className="space-y-4">
        {coffeeData.map((coffee, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Image src={`/coffee-${index + 1}.jpg`} alt={coffee.name} width={40} height={40} className="rounded-full" />
            <div className="flex-1">
              <h3 className="font-medium">{coffee.name}</h3>
              <p className="text-sm text-gray-500">{coffee.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{coffee.orders}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoffee;