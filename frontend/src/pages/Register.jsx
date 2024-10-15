import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
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

    const handlePinChange = (index, value, setPinFunc, pinArray) => {
        if (/^[0-9]?$/.test(value)) {
            const updatedPin = [...pinArray];
            updatedPin[index] = value;
            setPinFunc(updatedPin);
            if (value !== "" && index < 5) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    const handlePinDelete = (index, setPinFunc, pinArray) => {
        const updatedPin = [...pinArray];
        updatedPin[index] = "";
        setPinFunc(updatedPin);
        if (index > 0) {
            document.getElementById(`pin-${index - 1}`).focus();
        }
    };

    const handleNext = () => {
        if (step === 1 && (!fullName || !email || !phoneNumber)) {
            setError("All personal details are required.");
            return;
        }
        if (step === 2 && (!accountNumber || !accountNumberConfirm || !ifscNumber || !bankName)) {
            setError("All account details are required.");
            return;
        }
        if (step === 2 && accountNumber !== accountNumberConfirm) {
            setError("Account numbers do not match.");
            return;
        }
        if (step === 3 && (!upiId || pin.includes("") || confirmPin.includes(""))) {
            setError("UPI ID and both PINs must be filled out.");
            return;
        }
        if (step === 3 && pin.join('') !== confirmPin.join('')) {
            setError("PINs do not match.");
            return;
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
            fullName,
            email,
            phoneNumber,
            accountNumber,
            ifscNumber,
            bankName,
            upiId,
            pin: pin.join(""),
        };

        console.log("Registering user with data:", userData);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Registration successful!");
        } catch (err) {
            setError("Registration failed. Please try again.");
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
            <h1 className="text-3xl z-40  font-bold mb-4 text-green-400">Register as New User</h1>

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
                        <Label htmlFor="accountNumber" className="text-slate-100 text-md font-semibold">Account Number (Visible):</Label>
                        <TextInput type="text" id="accountNumber" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />

                        <Label htmlFor="accountNumberConfirm" className="text-slate-100 text-md font-semibold">Account Number (Password):</Label>
                        <TextInput type="password" id="accountNumberConfirm" placeholder="Re-enter your account number" value={accountNumberConfirm} onChange={(e) => setAccountNumberConfirm(e.target.value)} required />

                        <Label htmlFor="ifscNumber" className="text-slate-100 text-md font-semibold">IFSC Number:</Label>
                        <TextInput type="text" id="ifscNumber" placeholder="Enter your IFSC number" value={ifscNumber} onChange={(e) => setIfscNumber(e.target.value)} required />

                        <Label htmlFor="bankName" className="text-slate-100 text-md font-semibold">Bank Name:</Label>
                        <TextInput type="text" id="bankName" placeholder="Enter your bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Create UPI ID and PIN</h2>
                        <Label htmlFor="upiId" className="text-slate-100 text-md font-semibold">UPI ID:</Label>
                        <TextInput type="text" id="upiId" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} required />

                        <Label className="text-slate-100 text-md font-semibold">Create PIN:</Label>
                        <div className="flex gap-2">
                            {pin.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    type="text"
                                    id={`pin-${index}`}
                                    value={digit}
                                    maxLength={1}
                                    className="w-10 text-center"
                                    onChange={(e) => handlePinChange(index, e.target.value, setPin, pin)}
                                    onKeyDown={(e) => e.key === "Backspace" && handlePinDelete(index, setPin, pin)}
                                />
                            ))}
                        </div>

                        <Label className="text-slate-100 text-md font-semibold">Confirm PIN:</Label>
                        <div className="flex gap-2">
                            {confirmPin.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    type="password"
                                    id={`confirm-pin-${index}`}
                                    value={digit}
                                    maxLength={1}
                                    className="w-10 text-center"
                                    onChange={(e) => handlePinChange(index, e.target.value, setConfirmPin, confirmPin)}
                                    onKeyDown={(e) => e.key === "Backspace" && handlePinDelete(index, setConfirmPin, confirmPin)}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <Button type="button" color="gray" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    {step === 3 ? (
                        <Button type="submit" color="green

" isLoading={loading} disabled={loading}>
                            Register
                        </Button>
                    ) : (
                        <Button type="submit" color="green">
                            Next
                        </Button>
                    )}
                </div>

                {error && (
                    <Alert color="failure" className="mt-4">
                        {error}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default Register;