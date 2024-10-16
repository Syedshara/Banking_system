import React, { useState, useEffect } from 'react';
import { Card, Button } from 'flowbite-react';

const Repay = () => {
  const [repayments, setRepayments] = useState([]);

  useEffect(() => {
    const fetchRepayDetails = async () => {
      try {
        const data = [
          { id: 1, lenderName: 'John Doe', principalAmount: 10000, duration: 12, interestRate: 5 },
          { id: 2, lenderName: 'Jane Smith', principalAmount: 5000, duration: 6, interestRate: 4 },
        ];

        const calculatedRepayments = data.map((repayment) => {
          const { principalAmount, duration, interestRate } = repayment;
          const interestAmount = (principalAmount * duration * interestRate) / 100;
          const totalRepayAmount = principalAmount + interestAmount;
          return { ...repayment, interestAmount, totalRepayAmount };
        });

        setRepayments(calculatedRepayments);
      } catch (error) {
        console.error('Error fetching repayment details:', error);
      }
    };

    fetchRepayDetails();
  }, []);

  return (
    <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-4xl">
      <h2 className="text-2xl font-bold mb-5">Repayment Details</h2>

      {repayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          {repayments.map((repayment) => (
            <Card
              key={repayment.id}
              className="mb-4"
              style={{ width: '400px', height: '250px' }} 
            >
              <div className="flex justify-between items-center">
                <h5 className="text-xl font-bold">Lender: {repayment.lenderName}</h5>
                <span className="text-gray-500">Duration: {repayment.duration} months</span>
              </div>
              <div className="mt-1">
                <p className="text-gray-700">Principal Amount: ₹{repayment.principalAmount}</p>
                <p className="text-gray-700">Interest Rate: {repayment.interestRate}%</p>
                <p className="text-gray-700">Interest Amount: ₹{repayment.interestAmount}</p>
                <p className="text-gray-900 font-semibold mt-2">Total Repay Amount: ₹{repayment.totalRepayAmount}</p>
              </div>
              <Button className="mt-4" gradientDuoTone='greenToBlue'>
                Pay Now
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p>No repayment details found.</p>
      )}
    </div>
  );
};

export default Repay;
