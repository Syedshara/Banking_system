import React, { useState, useEffect, useRef } from 'react';
import { HiDotsVertical } from 'react-icons/hi'; // For the three dots icon
import { Button } from 'flowbite-react'; // Import Flowbite Button

const LendMoney = () => {
    const [boxes, setBoxes] = useState([]); // List of boxes
    const [showForm, setShowForm] = useState(false); // Toggle between form and grid
    const [newBox, setNewBox] = useState({ amount: '', duration: '', minInterest: '', maxInterest: '' }); // New box values
    const [showMenu, setShowMenu] = useState(null); // Track which box menu is open
    const [editIndex, setEditIndex] = useState(null); // Track which box is being edited
    const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
    const menuRef = useRef(null); // Ref for the dropdown menu

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

    // Function to validate input fields
    const validateInputs = () => {
        const { amount, duration, minInterest, maxInterest } = newBox;
        const errors = [];

        if (!amount || !duration || !minInterest || !maxInterest) {
            errors.push("Please fill in all fields.");
        }
        if (amount <= 0 || isNaN(amount)) {
            errors.push("Amount should be a positive number.");
        }
        if (duration <= 0 || isNaN(duration)) {
            errors.push("Duration should be greater than 0 months.");
        }
        if (minInterest < 0 || isNaN(minInterest)) {
            errors.push("Minimum interest should not be negative.");
        }
        if (maxInterest <= 0 || isNaN(maxInterest)) {
            errors.push("Maximum interest should be a positive number.");
        }
        if (minInterest >= maxInterest) {
            errors.push("Minimum interest should be less than maximum interest.");
        }

        return errors.length > 0 ? errors.join(' ') : ""; // Return error messages
    };

    // Function to go back to the grid without adding a box
    const handleBack = () => {
        setShowForm(false);
        setEditIndex(null); // Reset edit index when going back
    };

    // Function to add a new box with user input or update an existing box
    const handleNext = () => {
        const error = validateInputs();
        if (error) {
            setErrorMessage(error); // Display error message if validation fails
            return;
        }

        if (editIndex !== null) {
            // Update existing box
            const updatedBoxes = boxes.map((box, index) =>
                index === editIndex ? newBox : box
            );
            setBoxes(updatedBoxes);
        } else {
            // Add new box
            setBoxes([...boxes, newBox]);
        }
        setNewBox({ amount: '', duration: '', minInterest: '', maxInterest: '' }); // Reset form fields
        setShowForm(false); // Go back to grid view
        setEditIndex(null); // Reset edit index
    };

    // Function to initiate edit mode
    const handleEdit = (index) => {
        setNewBox(boxes[index]); // Populate form with existing values
        setEditIndex(index); // Set the current index for editing
        setShowForm(true); // Show the form
        setShowMenu(null); // Close the dropdown menu
    };

    return (
        <div className="relative flex-grow p-6 flex flex-col">
            {/* Form to input new box details */}
            {showForm ? (
                <div className="flex flex-col justify-center items-center bg-white shadow-lg p-6 rounded-lg" style={{ width: '400px', margin: 'auto' }}>
                    {/* Form fields */}
                    <div className="w-full mb-4">
                        <label className="block text-blue-600">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={newBox.amount}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block text-blue-600">Duration (months)</label>
                        <input
                            type="number"
                            name="duration"
                            value={newBox.duration}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block text-blue-600">Minimum Interest (%)</label>
                        <input
                            type="number"
                            name="minInterest"
                            value={newBox.minInterest}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block text-blue-600">Maximum Interest (%)</label>
                        <input
                            type="number"
                            name="maxInterest"
                            value={newBox.maxInterest}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>

                    {/* Error message for the entire form */}
                    {errorMessage && (
                        <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
                    )}

                    <div className="flex justify-between w-full mt-4">
                        <Button onClick={handleBack} color="gray">Back</Button>
                        <Button onClick={handleNext}>Next</Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Scrollable container with grid layout for boxes */}
                    <div className="grid grid-cols-3 gap-6 overflow-y-auto" style={{ width: 'calc(100% - 20px)' }}>
                        {boxes.map((box, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-lg p-4 relative flex flex-col justify-center items-center"
                                style={{
                                    height: '200px',
                                    width: '100%',
                                }}
                            >
                                {/* Three dots for menu options */}
                                <button
                                    onClick={() => toggleMenu(index)}
                                    className="absolute top-3 right-3 text-gray-600 focus:outline-none"
                                >
                                    <HiDotsVertical className="w-6 h-6" />
                                </button>

                                {/* Dropdown Menu */}
                                {showMenu === index && (
                                    <div ref={menuRef} className="absolute top-10 right-3 bg-white shadow-lg rounded-md border border-gray-200">
                                        <ul className="text-left">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleEdit(index)}>Edit</li>
                                            <li
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => setBoxes(boxes.filter((_, i) => i !== index))}
                                            >
                                                Delete
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Display user input values */}
                                <div className="flex flex-col justify-center items-center space-y-2 text-center">
                                    <p className="text-md font-medium text-blue-600">
                                        Amount: <span className="font-semibold text-black">${box.amount}</span>
                                    </p>
                                    <p className="text-md font-medium text-blue-600">
                                        Duration: <span className="font-semibold text-black">{box.duration} months</span>
                                    </p>
                                    <p className="text-md font-medium text-blue-600">
                                        Min Interest: <span className="font-semibold text-black">{box.minInterest}%</span>
                                    </p>
                                    <p className="text-md font-medium text-blue-600">
                                        Max Interest: <span className="font-semibold text-black">{box.maxInterest}%</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button to add new box */}
                    <div className="mt-4">
                        <Button onClick={() => setShowForm(true)}>Add New Box</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LendMoney;
