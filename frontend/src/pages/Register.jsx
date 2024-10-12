import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import img from '../assets/Register/bg-img.jpg'

const Register = () => {
    const [step, setStep] = useState(1);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isAccount, setIsAccount] = useState(true);

    // Account details
    const [accountNumber, setAccountNumber] = useState("");
    const [accountType, setAccountType] = useState("");
    const [bankName, setBankName] = useState("");

    // Card details
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    // UPI details
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (step === 1 && (!fullName || !email || !phoneNumber)) {
            setError("All personal details are required.");
            return;
        }
        if (step === 2) {
            if (isAccount) {
                if (!accountNumber || !accountType || !bankName) {
                    setError("All account details are required.");
                    return;
                }
            } else {
                if (!cardNumber || !cardType || !expiryDate || !cvv) {
                    setError("All card details are required.");
                    return;
                }
            }
        }
        if (step === 3 && (!upiId || pin.length !== 6)) {
            setError("UPI ID is required and PIN must be 6 digits.");
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
            ...(isAccount
                ? { accountNumber, accountType, bankName }
                : { cardNumber, cardType, expiryDate, cvv }),
            upiId,
            pin,
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
        <div className="flex flex-col justify-center ml-44 items-start min-h-screen text-white"
        >
            <div
                className="absolute inset-0 bg-cover bg-center -z-50"
                style={{
                    backgroundImage: `url(${img})`, // Replace with your image URL
                    opacity: 0.8,
                }}
            />
            <div
                className="absolute inset-0 -z-40 bg-slate-950 opacity-70" // Adjust opacity for shade effect
            />
            <h1 className="text-3xl z-40 font-bold mb-4 text-green-400">Register as New User</h1>

            <form className='w-full max-w-lg flex flex-col gap-5 mt-5' onSubmit={step === 3 ? handleRegister : (e) => { e.preventDefault(); handleNext(); }}>
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
                        <div>
                            <Label className="text-slate-100 text-md font-semibold">Select Account or Card:</Label>
                            <div className="flex justify-between">
                                <label className="flex items-center">
                                    <input type="radio" checked={isAccount} className="mr-2" onChange={() => setIsAccount(true)} />
                                    Account
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" checked={!isAccount} className="mr-2" onChange={() => setIsAccount(false)} />
                                    Card
                                </label>
                            </div>
                        </div>

                        {isAccount ? (
                            <>
                                <Label htmlFor="accountNumber" className="text-slate-100 text-md font-semibold">Account Number:</Label>
                                <TextInput type="text" id="accountNumber" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />

                                <Label htmlFor="accountType" className="text-slate-100 text-md font-semibold">Account Type:</Label>
                                <TextInput type="text" id="accountType" placeholder="Enter your account type" value={accountType} onChange={(e) => setAccountType(e.target.value)} required />

                                <Label htmlFor="bankName" className="text-slate-100 text-md font-semibold">Bank Name:</Label>
                                <TextInput type="text" id="bankName" placeholder="Enter your bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                            </>
                        ) : (
                            <>
                                <Label htmlFor="cardNumber" className="text-slate-100 text-md font-semibold">Card Number:</Label>
                                <TextInput type="text" id="cardNumber" placeholder="Enter your card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />

                                <Label htmlFor="cardType" className="text-slate-100 text-md font-semibold">Card Type:</Label>
                                <TextInput type="text" id="cardType" placeholder="Enter your card type" value={cardType} onChange={(e) => setCardType(e.target.value)} required />

                                <Label htmlFor="expiryDate" className="text-slate-100 text-md font-semibold">Expiry Date:</Label>
                                <TextInput type="date" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />

                                <Label htmlFor="cvv" className="text-slate-100 text-md font-semibold">CVV:</Label>
                                <TextInput type="text" id="cvv" placeholder="Enter CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                            </>
                        )}
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Create UPI ID and PIN</h2>
                        <Label htmlFor="upiId" className="text-slate-100 text-md font-semibold">UPI ID:</Label>
                        <TextInput type="text" id="upiId" placeholder="example@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} required />

                        <Label htmlFor="pin" className="text-slate-100 text-md font-semibold">6-Digit PIN:</Label>
                        <TextInput type="password" id="pin" placeholder="Enter 6-digit PIN" value={pin} onChange={(e) => setPin(e.target.value)} required minLength={6} maxLength={6} />
                    </>
                )}

                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <Button type="button" onClick={handleBack} gradientDuoTone='greenToBlue' className="w-36">
                            Back
                        </Button>
                    )}
                    <Button type="submit" disabled={loading} gradientDuoTone='greenToBlue' className="w-36">
                        {loading ? "Loading..." : step === 3 ? "Register" : "Next"}
                    </Button>
                </div>

                {error && <Alert color="failure" className="mb-4">{error}</Alert>}
            </form>
        </div>
    );
};

export default Register;
