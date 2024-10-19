import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'flowbite-react';
import bcryptjs from 'bcryptjs';
import { io } from 'socket.io-client';

const Repay = () => {

  useEffect(() => {
    const socket = io.connect('http://localhost:3000'); // Adjust the URL as needed

    socket.on('connect', () => {
      console.log('Socket connected'); // Log when connected
    });

    // Listen for notifications
    socket.on('history', (history) => {
      console.log('New history received:', history); // Log incoming notifications
      fetchRepayDetails();
    });

    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, []);


  const [repayments, setRepayments] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValues, setPinValues] = useState(Array(6).fill(''));
  const [selectedRepayment, setSelectedRepayment] = useState(null);
  const [userData, setUserData] = useState({ name: "", upi_id: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setUserData({ name: data.name, upi_id: data.bank_details.pin });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, []);
  const fetchRepayDetails = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      // Fetch data from your backend API
      const response = await fetch(`http://localhost:3000/users/getRepay/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const calculatedRepayments = data.map((repayment) => {
        const { principalAmount, duration, interestRate, currentDate, dueDate } = repayment;
        const interestAmount = (principalAmount * (duration / 12) * interestRate) / 100;
        const totalRepayAmount = principalAmount + interestAmount;
        const remainingDays = Math.ceil((new Date(dueDate) - new Date(currentDate)) / (1000 * 60 * 60 * 24));
        return { ...repayment, interestAmount, totalRepayAmount, remainingDays };
      });

      setRepayments(calculatedRepayments);
    } catch (error) {
      console.error('Error fetching repayment details:', error);
    }
  };

  useEffect(() => {


    fetchRepayDetails();

  }, []);
  console.log(repayments);

  const handlePinChange = (index, value) => {
    const newPinValues = [...pinValues];
    newPinValues[index] = value;
    setPinValues(newPinValues);
    if (value && index < 5) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && !pinValues[index]) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const handlePayNow = (repayment) => {
    setSelectedRepayment(repayment);
    setShowPinModal(true);
  };

  const validatePinAndProcess = async () => {
    const rpin = pinValues.join('');
    const isMatch = bcryptjs.compareSync(rpin, userData.upi_id);

    if (!isMatch) {
      alert('Invalid PIN');
      return;
    }

    console.log(selectedRepayment);
    const payload = {
      id: selectedRepayment.id,
      amount: selectedRepayment.totalRepayAmount,
    };

    try {
      const response = await fetch('http://localhost:3000/users/updatePay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`Repayment processed for ${selectedRepayment.lenderName}`);
        setRepayments(repayments.filter((r) => r.id !== selectedRepayment.id));
      } else {
        alert('Failed to process the repayment. Please try again.');
      }
    } catch (error) {
      console.error('Error processing repayment:', error);
      alert('Error processing repayment. Please try again.');
    }

    setShowPinModal(false);
    setPinValues(Array(6).fill(''));
  };

  return (
    <div className="p-5 w-full mx-auto mt-5 mb-5 px-10 max-w-xl">
      <h2 className="text-2xl font-bold mb-5">Repayment Details</h2>

      {repayments.length > 0 ? (
        <div className="h-[700px] px-10 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {repayments.map((repayment) => (
              <Card key={repayment.id} className="mb-4">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h5 className="text-xl font-bold">Lender: {repayment.lenderName}</h5>
                    <p className="mt-2 text-gray-700">Principal Amount: ₹{repayment.principalAmount}</p>
                    <p className="text-gray-700">Interest Rate: {repayment.interestRate}%</p>
                    <p className="text-gray-700">Duration: {repayment.duration} months</p>

                    <p className="mt-2 text-gray-700">Due Date: {new Date(repayment.dueDate).toLocaleDateString()}</p>
                    <p className="mt-2 text-gray-700">Remaining Days: {repayment.remainingDays} days</p>
                    <p className="mt-2 text-gray-900 font-semibold">Total Repay Amount: ₹{repayment.totalRepayAmount.toFixed(2)}</p>
                  </div>
                  <Button className="mt-4" gradientDuoTone='greenToBlue' onClick={() => handlePayNow(repayment)}>
                    Pay Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <p className="text-xl font-semibold text-gray-700">No repayment details found.</p>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Enter Your PIN</h3>
            <div className="flex space-x-2">
              {Array(6).fill().map((_, i) => (
                <input
                  key={i}
                  type="password"
                  id={`pin-${i}`}
                  className="w-10 p-2 border rounded-lg ml-7 text-center"
                  maxLength={1}
                  value={pinValues[i]}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                />
              ))}
            </div>
            <Button onClick={validatePinAndProcess} className="mt-4 w-full" gradientDuoTone='greenToBlue'>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repay;