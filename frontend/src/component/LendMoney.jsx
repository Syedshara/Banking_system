import React, { useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi'; // For the three dots icon

const LendMoney = () => {
    const [boxes, setBoxes] = useState([]); // List of boxes
    const [showForm, setShowForm] = useState(false); // Toggle between form and grid
    const [newBox, setNewBox] = useState({ amount: '', duration: '', minInterest: '', maxInterest: '' }); // New box values
    const [showMenu, setShowMenu] = useState(null); // Track which box menu is open
    const [editIndex, setEditIndex] = useState(null); // Track which box is being edited

    // Function to toggle dropdown for a specific box
    const toggleMenu = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    // Function to handle user input for new box fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBox({ ...newBox, [name]: value });
    };

    // Function to go back to the grid without adding a box
    const handleBack = () => {
        setShowForm(false);
        setEditIndex(null); // Reset edit index when going back
    };

    // Function to add a new box with user input or update an existing box
    const handleNext = () => {
        if (newBox.amount && newBox.duration && newBox.minInterest && newBox.maxInterest) {
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
        } else {
            alert('Please fill all fields');
        }
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
                <div className="flex flex-col justify-center items-center bg-white shadow-lg p-6 rounded-lg" style={{ height: '300px', width: '400px', margin: 'auto' }}>
                    <div className="flex justify-between w-full mb-4">
                        <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
                        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
                    </div>
                    <input
                        type="text"
                        name="amount"
                        placeholder="Enter Amount"
                        value={newBox.amount}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="duration"
                        placeholder="Enter Duration"
                        value={newBox.duration}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="minInterest"
                        placeholder="Enter Minimum Interest"
                        value={newBox.minInterest}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="maxInterest"
                        placeholder="Enter Maximum Interest"
                        value={newBox.maxInterest}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 mb-2 w-full"
                    />
                </div>
            ) : (
                <>
                    {/* Scrollable container with grid layout for boxes */}
                    <div className="grid gap-6 overflow-y-auto" style={{ gridTemplateColumns: '1fr 1fr', width: 'calc(100% - 20px)' }}>
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
                                    <div className="absolute top-10 right-3 bg-white shadow-lg rounded-md border border-gray-200">
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
                                    <p className="text-md font-medium text-gray-700">
                                        Amount: <span className="font-semibold">$ {box.amount}</span>
                                    </p>
                                    <p className="text-md font-medium text-gray-700">
                                        Duration: <span className="font-semibold">{box.duration} months</span>
                                    </p>
                                    <p className="text-md font-medium text-gray-700">
                                        Min Interest: <span className="font-semibold">{box.minInterest}%</span>
                                    </p>
                                    <p className="text-md font-medium text-gray-700">
                                        Max Interest: <span className="font-semibold">{box.maxInterest}%</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add button centered at the bottom */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        Add
                    </button>
                </>
            )}
        </div>
    );
};

export default LendMoney;
