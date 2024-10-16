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
            alert('Failed to delete box. Please try again.');
        }
    };

    return (
        <div className='p-5 w-full mx-auto mt-5 mb-5 max-w-7xl'>
            <div className="relative flex-grow w- p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-4">YOUR LENDINGS</h2> {/* Added Title */}
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
                            <label className="block text-sm font-medium text-gray-700">Minimum Interest</label>
                            <input
                                type="number"
                                name="min_interest"
                                value={newBox.min_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700">Maximum Interest</label>
                            <input
                                type="number"
                                name="max_interest"
                                value={newBox.max_interest}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>

                        {/* Error Message */}
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                        {/* Buttons for navigation */}
                        <div className="flex justify-between w-full">
                            <button
                                onClick={handleBack}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-gray-300"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                {editIndex !== null ? 'Update' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        {boxes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <h3 className="text-xl font-semibold mb-4">No records available</h3>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                    onClick={handleAddNewBox}
                                >
                                    Add New Box
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {boxes.map((box, index) => (
                                    <div key={index} className="border border-gray-300 shadow-lg p-4 rounded-lg relative">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">Amount: ${box.amount}</h3>
                                                <p>Duration: {box.duration} months</p>
                                                <p>Interest Range: {box.min_interest}% - {box.max_interest}%</p>
                                            </div>

                                            <button onClick={() => toggleMenu(index)}>
                                                <HiDotsVertical size={24} />
                                            </button>
                                            {showMenu === index && (
                                                <ul ref={menuRef} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                                                    <li
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleEdit(index)}
                                                    >
                                                        Edit
                                                    </li>
                                                    <li
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        Delete
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-col items-center justify-center mt-4">
                                    <button
                                        onClick={handleAddNewBox}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300"
                                    >
                                        Add New Box
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LendMoney;
