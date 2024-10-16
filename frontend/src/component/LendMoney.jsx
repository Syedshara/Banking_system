import React, { useState, useEffect, useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi'; // For the three dots icon
import { Button } from 'flowbite-react'; // Import Flowbite Button
import 'react-toastify/dist/ReactToastify.css'; // Remove this import since we're not using toast anymore

const LendMoney = () => {
    const [boxes, setBoxes] = useState([]); // List of lending boxes
    const [showForm, setShowForm] = useState(false); // Toggle form visibility
    const [newBox, setNewBox] = useState({ amount: '', duration: '', min_interest: '', max_interest: '' }); // New box values
    const [showMenu, setShowMenu] = useState(null); // Track which box menu is open
    const [editIndex, setEditIndex] = useState(null); // Track which box is being edited
    const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
    const menuRef = useRef(null); // Ref for the dropdown menu

    const userId = localStorage.getItem("user_id");

    // Close dropdown when clicking outside
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

    // Fetch existing boxes from the backend when component mounts
    useEffect(() => {
        fetchBoxes();
    }, []);

    const fetchBoxes = async () => {
        try {
            const response = await fetch(`http://10.16.58.118:3000/lend/user/${userId}`);
            const data = await response.json();
            setBoxes(data);
        } catch (error) {
            console.error('Error fetching boxes:', error);
        }
    };

    // Function to toggle dropdown for a specific box
    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    // Function to handle user input for new box fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBox({ ...newBox, [name]: value });
        setErrorMessage(''); // Reset error message on input change
    };

    // Function to validate input fields with priority error handling
    const validateInputs = () => {
        const { amount, duration, min_interest, max_interest } = newBox;

        // Convert inputs to numbers to avoid string comparison issues
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
        return ""; // No error
    };

    // Function to reset form fields
    const resetForm = () => {
        setNewBox({ amount: '', duration: '', min_interest: '', max_interest: '' }); // Reset form fields
        setErrorMessage(''); // Clear any previous error messages
    };

    // Function to go back to the grid without adding a box
    const handleBack = () => {
        resetForm(); // Reset the form fields when going back
        setShowForm(false);
        setEditIndex(null); // Reset edit index when going back
    };

    // Function to add a new box with user input or update an existing box
    const handleNext = async () => {
        const error = validateInputs();
        if (error) {
            setErrorMessage(error); // Display only one error message
            return;
        }

        const boxData = { ...newBox, user_id: userId }; // Add user_id to box data

        try {
            // If editing, update existing box
            if (editIndex !== null) {
                const updatedResponse = await fetch(`http://10.16.58.118:3000/lend/update/${boxes[editIndex]._id}`, {
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
                // Add new box
                const response = await fetch('http://10.16.58.118:3000/lend/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(boxData),
                });

                if (response.ok) {
                    fetchBoxes(); // Fetch the updated list of boxes
                    alert('Lending box added successfully!');
                } else {
                    throw new Error('Failed to add box');
                }
            }

            resetForm(); // Reset form after submission
            setShowForm(false); // Go back to grid view
            setEditIndex(null); // Reset edit index
        } catch (error) {
            console.error('Error adding or updating box:', error);
            alert('Failed to add or update box. Please try again.');
        }
    };

    // Function to open the form for a new box and ensure the form is cleared
    const handleAddNewBox = () => {
        resetForm(); // Clear any previously entered values
        setShowForm(true); // Show the form for adding a new box
    };

    // Function to initiate edit mode
    const handleEdit = (index) => {
        setNewBox(boxes[index]); // Populate form with existing values
        setEditIndex(index); // Set the current index for editing
        setShowForm(true); // Show the form
        setShowMenu(null); // Close the dropdown menu
    };

    // Function to delete a lending box
    const handleDelete = async (index) => {
        const boxId = boxes[index]._id; // Get the ID of the box to delete
        try {
            const response = await fetch(`http://10.16.58.118:3000/lend/delete/${boxId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedBoxes = boxes.filter((_, i) => i !== index); // Remove the deleted box from state
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
                {/* Form to input new box details */}
                {showForm ? (
                    <div className="flex flex-col justify-center items-center bg-white shadow-lg p-6 rounded-lg" style={{ width: '400px', margin: 'auto' }}>
                        {/* Form fields */}
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={newBox.amount}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Duration (months)</label>
                            <input
                                type="number"
                                name="duration"
                                value={newBox.duration}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Minimum Interest (%)</label>
                            <input
                                type="number"
                                name="min_interest"
                                value={newBox.min_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Maximum Interest (%)</label>
                            <input
                                type="number"
                                name="max_interest"
                                value={newBox.max_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-between w-full ml-5 mr-5">
                            <Button onClick={handleBack} color='gray' className='w-32'>
                                Back
                            </Button>
                            <Button onClick={handleNext} className='w-32' outline gradientDuoTone="greenToBlue">
                                {editIndex !== null ? 'Update' : 'Next'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Render the grid of lending boxes
                    <>
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
                    </>
                )}
            </div>
        </div>

    );
};

export default LendMoney;