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

    // Function to validate input fields with priority error handling
    const validateInputs = () => {
        const { amount, duration, minInterest, maxInterest } = newBox;

        // Convert inputs to numbers to avoid string comparison issues
        const minInt = Number(minInterest);
        const maxInt = Number(maxInterest);

        if (!amount || !duration || !minInterest || !maxInterest) {
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
        setNewBox({ amount: '', duration: '', minInterest: '', maxInterest: '' }); // Reset form fields
        setErrorMessage(''); // Clear any previous error messages
    };

    // Function to go back to the grid without adding a box
    const handleBack = () => {
        resetForm(); // Reset the form fields when going back
        setShowForm(false);
        setEditIndex(null); // Reset edit index when going back
    };

    // Function to add a new box with user input or update an existing box
    const handleNext = () => {
        const error = validateInputs();
        if (error) {
            setErrorMessage(error); // Display only one error message
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
        resetForm(); // Reset form after submission
        setShowForm(false); // Go back to grid view
        setEditIndex(null); // Reset edit index
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

    return (
        <div className="relative flex-grow p-6 flex flex-col">
            {/* Form to input new box details */}
            {showForm ? (
                <div className="flex flex-col justify-center items-center bg-white shadow-lg p-6 rounded-lg" style={{ width: '400px', margin: 'auto' }}>
                    {/* Form fields */}
                    <div className="w-full mb-4">
                        <label className="block">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={newBox.amount}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block">Duration (months)</label>
                        <input
                            type="number"
                            name="duration"
                            value={newBox.duration}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block">Minimum Interest (%)</label>
                        <input
                            type="number"
                            name="minInterest"
                            value={newBox.minInterest}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="w-full mb-4">
                        <label className="block">Maximum Interest (%)</label>
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
                        <Button onClick={handleNext} gradientDuoTone='greenToBlue'>Next</Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Scrollable container with grid layout for boxes */}
                    <div className="grid grid-cols-3 gap-6 overflow-y-auto" style={{ width: 'calc(100% - 20px)', marginLeft: '5%' }}>
                        {boxes.map((box, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-lg rounded-lg p-4 relative flex flex-col justify-center items-center"
                                style={{
                                    height: '200px',
                                    width: '80%',
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

                                {/* Box content */}
                                <div className="space-y-2">
                                    <div className="flex">
                                        <p className="font-semibold text-black w-[120px]">Amount</p>
                                        <p className="font-semibold text-black w-[10px]">:</p>
                                        <p className="font-normal">{box.amount}</p>
                                    </div>
                                    <div className="flex">
                                        <p className="font-semibold text-black w-[120px]">Duration</p>
                                        <p className="font-semibold text-black w-[10px]">:</p>
                                        <p className="font-normal">{box.duration} months</p>
                                    </div>
                                    <div className="flex">
                                        <p className="font-semibold text-black w-[120px]">Max Interest</p>
                                        <p className="font-semibold text-black w-[10px]">:</p>
                                        <p className="font-normal">{box.minInterest}%</p>
                                    </div>
                                    <div className="flex">
                                        <p className="font-semibold text-black w-[120px]">Min Interest</p>
                                        <p className="font-semibold text-black w-[10px]">:</p>
                                        <p className="font-normal">{box.maxInterest}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add new box button */}
                    <div className="mt-6 flex justify-center">
                        <Button onClick={handleAddNewBox} gradientDuoTone='greenToBlue'>Add</Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LendMoney;
