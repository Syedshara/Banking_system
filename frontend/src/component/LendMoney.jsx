import React, { useState, useEffect, useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import 'react-toastify/dist/ReactToastify.css';

const LendMoney = () => {
    const [boxes, setBoxes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newBox, setNewBox] = useState({ amount: '', duration: '', min_interest: '', max_interest: '' });
    const [showMenu, setShowMenu] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const menuRef = useRef(null);

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchBoxes();
    }, []);

    const fetchBoxes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/lend/user/${userId}`);
            const data = await response.json();
            setBoxes(data);
        } catch (error) {
            console.error('Error fetching boxes:', error);
        }
    };

    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBox({ ...newBox, [name]: value });
        setErrorMessage('');
    };

    const validateInputs = () => {
        const { amount, duration, min_interest, max_interest } = newBox;
        const minInt = Number(min_interest);
        const maxInt = Number(max_interest);

        if (!amount || !duration || !min_interest || !max_interest) {
            return "Please fill in all fields.";
        }
        if (amount <= 0 || isNaN(amount)) {
            return "Amount should be a positive number.";
        }
        if (duration <= 0 || isNaN(duration)) {
            return "Duration should be greater than 0 months.";
        }
        if (minInt < 0 || isNaN(minInt)) {
            return "Minimum interest should not be negative.";
        }
        if (maxInt <= 0 || isNaN(maxInt)) {
            return "Maximum interest should be a positive number.";
        }
        if (minInt >= maxInt) {
            return "Minimum interest should be less than maximum interest.";
        }
        return "";
    };

    const resetForm = () => {
        setNewBox({ amount: '', duration: '', min_interest: '', max_interest: '' });
        setErrorMessage('');
    };

    const handleBack = () => {
        resetForm();
        setShowForm(false);
        setEditIndex(null);
    };

    const handleNext = async () => {
        const error = validateInputs();
        if (error) {
            setErrorMessage(error);
            return;
        }

        const boxData = { ...newBox, user_id: userId };

        try {
            if (editIndex !== null) {
                const updatedResponse = await fetch(`http://localhost:3000/lend/update/${boxes[editIndex]._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(boxData),
                });

                if (updatedResponse.ok) {
                    const updatedBoxes = boxes.map((box, index) =>
                        index === editIndex ? { ...box, ...newBox } : box
                    );
                    setBoxes(updatedBoxes);
                    alert('Lending box updated successfully!');
                } else {
                    throw new Error('Failed to update box');
                }
            } else {
                const response = await fetch('http://localhost:3000/lend/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(boxData),
                });

                if (response.ok) {
                    fetchBoxes();
                    alert('Lending box added successfully!');
                } else {
                    throw new Error('Failed to add box');
                }
            }

            resetForm();
            setShowForm(false);
            setEditIndex(null);
        } catch (error) {
            console.error('Error adding or updating box:', error);
            alert('Failed to add or update box. Please try again.');
        }
    };

    const handleAddNewBox = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (index) => {
        setNewBox(boxes[index]);
        setEditIndex(index);
        setShowForm(true);
        setShowMenu(null);
    };

    const handleDelete = async (index) => {
        const boxId = boxes[index]._id;
        try {
            const response = await fetch(`http://localhost:3000/lend/delete/${boxId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedBoxes = boxes.filter((_, i) => i !== index);
                setBoxes(updatedBoxes);
                alert('Lending box deleted successfully!');
            } else {
                throw new Error('Failed to delete box');
            }
        } catch (error) {
            console.error('Error deleting box:', error);
            alert('Insufficient Balance! Enter a valid amount.');
        }
    };

    return (
        <div className='p-5 w-full mx-auto mt-5 mb-5 max-w-7xl'>
            <div className="relative flex-grow w- p-6 flex flex-col">

                {showForm ? (
                    <div className="flex flex-col justify-center items-center bg-white shadow-lg p-6 rounded-lg" style={{ width: '400px', margin: 'auto' }}>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={newBox.amount}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Duration (months)</label>
                            <input
                                type="number"
                                name="duration"
                                value={newBox.duration}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Minimum Interest</label>
                            <input
                                type="number"
                                name="min_interest"
                                value={newBox.min_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Maximum Interest</label>
                            <input
                                type="number"
                                name="max_interest"
                                value={newBox.max_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline"
                            />
                        </div>

                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                        <div className="flex justify-between w-full">
                            <button
                                onClick={handleBack}
                                className=" py-2 px-4 rounded color-light"
                            >
                                Back
                            </button>
                            <Button
                                onClick={handleNext}
                                gradientDuoTone="greenToBlue"
                                className="py-1 px-4 rounded "
                            >
                                {editIndex !== null ? 'Update' : 'Next'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <h1 className="text-xl font-bold mb-6">Lending Boxes</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {boxes.length === 0 ? (
                                    <div className="col-span-1 sm:col-span-2 md:col-span-3 flex items-center justify-center">
                                        <h2 className='text-xl'>No records found</h2>
                                    </div>
                                ) : (
                                    boxes.map((box, index) => (
                                        <div key={index} className="bg-white shadow-md rounded-lg p-4 relative">
                                            <h2 className="text-lg font-semibold">{`Amount: ₹${box.amount}`}</h2>
                                            <p>{`Duration: ${box.duration} months`}</p>
                                            <p>{`Min Interest: ${box.min_interest}%`}</p>
                                            <p>{`Max Interest: ${box.max_interest}%`}</p>
                                            <button
                                                onClick={() => toggleMenu(index)}
                                                className="absolute top-2 right-2 text-gray-500 focus:outline-none">
                                                <HiDotsVertical />
                                            </button>
                                            {showMenu === index && (
                                                <div className="absolute right-4 top-6   ">
                                                    <Button onClick={() => handleEdit(index)} size='xs' color='gray' className=" text-left px-4 py-2 w-16 hover:bg-gray-100 mb-1">
                                                        Edit
                                                    </Button>
                                                    <Button onClick={() => handleDelete(index)} color='gray' size='xs' className=" text-left px-4 py-2 w-16 hover:bg-gray-100">
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button gradientDuoTone="greenToBlue" onClick={handleAddNewBox} size='lg' className="mt-6 mx-auto w-44">
                                Add New Lending
                            </Button>
                        </div></>
                )}
            </div>
        </div>
    );
};

export default LendMoney;
