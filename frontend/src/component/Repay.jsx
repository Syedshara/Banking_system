import React, { useState, useEffect } from 'react';
import { Card, Button } from 'flowbite-react';

const Repay = () => {
  const [repayments, setRepayments] = useState([]);

  useEffect(() => {
    const fetchRepayDetails = async () => {
      try {
        // Sample data for UI testing (replace this with actual API response)
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
    <div className="p-5 w-full mx-auto mt-5 mb-5 max-w-6xl">
      <h2 className="text-2xl font-bold mb-5">Repayment Details</h2>

      {repayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Adjusted grid for three columns */}
          {repayments.map((repayment) => (
            <Card
              key={repayment.id}
              className="mb-4"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h5 className="text-xl font-bold">Lender: {repayment.lenderName}</h5>
                  <p className="mt-1 text-gray-700">Principal Amount: ₹{repayment.principalAmount}</p>
                  <p className="text-gray-700">Interest Rate: {repayment.interestRate}%</p>
                  <p className="text-gray-700">Duration: {repayment.duration} months</p> {/* Moved below */}
                  <p className="mt-2 text-gray-900 font-semibold">Total Repay Amount: ₹{repayment.totalRepayAmount}</p>
                </div>
                <Button className="mt-4" gradientDuoTone='greenToBlue'>
                  Pay Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48"> {/* Center the message */}
          <p className="text-xl font-semibold text-gray-700">No repayment details found.</p>
        </div>
      )}
    </div>
  );
};

export default Repay;
