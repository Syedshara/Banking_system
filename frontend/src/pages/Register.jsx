import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import img from '../assets/Register/bg-img.jpg'

const Register = () => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountNumberConfirm, setAccountNumberConfirm] = useState("");
    const [ifscNumber, setIfscNumber] = useState("");
    const [bankName, setBankName] = useState("");
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState(Array(6).fill(""));
    const [confirmPin, setConfirmPin] = useState(Array(6).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    // Validation functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
    const validateAccountNumber = (accountNumber) => /^\d{9,18}$/.test(accountNumber); // Assuming account numbers are between 9 to 18 digits
    const validateIfscNumber = (ifscNumber) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscNumber);
    const validateUpiId = (upiId) => /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(upiId); // Simple UPI format
    const validatePin = (pin) => /^\d{6}$/.test(pin.join(""));

    const handlePinChange = (index, value, setPinFunc, pinArray) => {
        if (/^[0-9]?$/.test(value)) {
            const updatedPin = [...pinArray];
            updatedPin[index] = value;
            setPinFunc(updatedPin);

            if (value !== "" && index < 5) {
                const nextInput = pinArray === pin ? `pin-${index + 1}` : `confirmPin-${index + 1}`;
                document.getElementById(nextInput)?.focus();
            }
        }
    };


    const handlePinDelete = (index, setPinFunc, pinArray) => {
        const updatedPin = [...pinArray];
        if (updatedPin[index] === "") {
            const prevInput = pinArray === pin ? `pin-${index - 1}` : `confirmPin-${index - 1}`;
            document.getElementById(prevInput)?.focus();
        } else {
            updatedPin[index] = "";
            setPinFunc(updatedPin);
        }
    };


    const handleNext = () => {
        // Step 1 validation (Personal Details)
        if (step === 1) {
            if (!fullName || !email || !phoneNumber) {
                setError("All personal details are required.");
                return;
            }
            if (!validateEmail(email)) {
                setError("Please enter a valid email address.");
                return;
            }
            if (!validatePhoneNumber(phoneNumber)) {
                setError("Phone number must be exactly 10 digits.");
                return;
            }
        }

        // Step 2 validation (Account Details)
        if (step === 2) {
            if (!accountNumber || !accountNumberConfirm || !ifscNumber) {
                setError("All account details are required.");
                return;
            }
            if (!validateAccountNumber(accountNumber)) {
                setError("Account number must be between 9 to 18 digits.");
                return;
            }
            if (accountNumber !== accountNumberConfirm) {
                setError("Account numbers do not match.");
                return;
            }
            if (!validateIfscNumber(ifscNumber)) {
                setError("Please enter a valid IFSC code.");
                return;
            }
        }

        // Step 3 validation (UPI & PIN)
        if (step === 3) {
            if (!upiId || pin.includes("") || confirmPin.includes("")) {
                setError("UPI ID and both PINs must be filled out.");
                return;
            }
            if (!validateUpiId(upiId)) {
                setError("UPI ID must be in the format 'name@bank'.");
                return;
            }
            if (!validatePin(pin)) {
                setError("PIN must be exactly 6 digits.");
                return;
            }
            if (pin.join('') !== confirmPin.join('')) {
                setError("PINs do not match.");
                return;
            }
        }

        setError("");
        setStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((prevStep) => prevStep - 1);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            name: fullName,
            email,
            phone: phoneNumber,
            acc_number: accountNumber,
            IFSC: ifscNumber,
            upi_id: upiId,
            pin: pin.join(""),
        };

        console.log("Registering user with data:", userData);

        try {
            const response = await fetch('http://10.16.58.118:3000/auth/register', { // Make sure to include http://
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Registration failed. Please try again.');
            }

            const data = await response.json();
            console.log("Registration successful!", data);
            navigate('/main');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center ml-36 items-start min-h-screen text-white">
            <div
                className="absolute inset-0 bg-cover bg-center -z-50"
                style={{
                    backgroundImage: `url(${img})`,
                    opacity: 0.8,
                }}
            />
            <div className="absolute inset-0 -z-40 bg-slate-950 opacity-70" />
            <h1 className="text-3xl z-40 font-bold mb-4 text-green-400">Register as New User</h1>

            <form className="w-full max-w-lg flex flex-col gap-5 mt-5" onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); handleNext(); }}>
                {step === 1 && (
                    <>
                        <h2 className="text-xl text-white font-semibold mb-2">Personal Details</h2>
                        <Label htmlFor="fullName" className="text-slate-100 text-md font-semibold">Full Name:</Label>
                        <TextInput type="text" id="fullName" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

                        <Label htmlFor="email" className="text-slate-100 text-md font-semibold">Email:</Label>
                        <TextInput type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <Label htmlFor="phoneNumber" className="text-slate-100 text-md font-semibold">Phone Number:</Label>
                        <TextInput type="tel" id="phoneNumber" placeholder="Enter your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Account Details</h2>
                        <Label htmlFor="accountNumber" className="text-slate-100 text-md font-semibold">Account Number:</Label>
                        <TextInput type="text" id="accountNumber" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />

                        <Label htmlFor="accountNumberConfirm" className="text-slate-100 text-md font-semibold">Re-enter your Account Number:</Label>
                        <TextInput type="password" id="accountNumberConfirm" placeholder="Re-enter your account number" value={accountNumberConfirm} onChange={(e) => setAccountNumberConfirm(e.target.value)} required />

                        <Label htmlFor="ifscNumber" className="text-slate-100 text-md font-semibold">IFSC Number:</Label>
                        <TextInput type="text" id="ifscNumber" placeholder="Eg: SBIN0123456" value={ifscNumber} onChange={(e) => setIfscNumber(e.target.value)} required />
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">UPI & PIN</h2>
                        <Label htmlFor="upiId" className="text-slate-100 text-md font-semibold">UPI ID:</Label>
                        <TextInput type="text" id="upiId" placeholder="Eg: name@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} required />

                        <div className="flex flex-col gap-4">
                            <Label className="text-slate-100 text-md font-semibold">Enter UPI PIN:</Label>
                            <div className="flex gap-2">
                                {pin.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        id={`pin-${index}`}
                                        value={digit}
                                        type="password"
                                        maxLength={1}
                                        className="w-10 text-center"
                                        onChange={(e) => handlePinChange(index, e.target.value, setPin, pin)}
                                        onKeyDown={(e) => e.key === "Backspace" && handlePinDelete(index, setPin, pin)}
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            <Label className="text-slate-100 text-md font-semibold">Confirm UPI PIN:</Label>
                            <div className="flex gap-2">
                                {confirmPin.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        id={`confirmPin-${index}`}
                                        value={digit}
                                        type="password"
                                        maxLength={1}
                                        className="w-10 text-center"
                                        onChange={(e) => handlePinChange(index, e.target.value, setConfirmPin, confirmPin)}
                                        onKeyDown={(e) => e.key === "Backspace" && handlePinDelete(index, setConfirmPin, confirmPin)}
                                        required
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {error && <Alert color="failure" className="mb-2"><span>{error}</span></Alert>}

                <div className="flex justify-between">
                    <Button color="gray" onClick={() => { step === 1 ? navigate('/') : handleBack(); }} disabled={loading}>Back</Button>
                    {step === 3 ? <Button type="submit" isProcessing={loading} gradientDuoTone="greenToBlue">Register</Button> : <Button type="submit" gradientDuoTone="greenToBlue">Next</Button>}
                </div>
            </form>
        </div>
    );
};

export default Register;
