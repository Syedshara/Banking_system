import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from "react-router-dom";
import img from '../assets/Login/img.jpg';
import { io } from 'socket.io-client';

const Login = () => {
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState(Array(6).fill(""));
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    const validateUpiId = (upiId) => /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(upiId);
    const validatePin = (pin) => pin.join("").length === 6;



    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors
        setLoading(true);

        let valid = true;

        // Validation for UPI ID and PIN
        if (!upiId || !validateUpiId(upiId)) {
            setErrorMessage("Invalid UPI ID. Format should be like: example@upi.");
            valid = false;
        } else if (!validatePin(pin)) {
            setErrorMessage("Invalid PIN. Must be a 6-digit number.");
            valid = false;
        }

        if (!valid) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    upi_id: upiId,
                    pin: pin.join(""),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful with UPI ID:", data.userId);
                localStorage.setItem("user_id", data.userId);
                navigate("/main?tag=home");// Call login function to check and establish socket connection

            } else {
                setErrorMessage(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsVisible(true);
        const userId = localStorage.getItem('user_id');
        if (userId) {
            navigate('/main');
        }
    }, [navigate]);

    const handleBack = () => {
        navigate('/');
    };

    const handlePinChange = (index, value) => {
        const newPin = [...pin];
        if (value.length <= 1) {
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 5) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    const handlePinKeyDown = (index, e) => {
        const newPin = [...pin];
        if (e.key === "Backspace" && index > 0 && !newPin[index]) {
            newPin[index - 1] = "";
            setPin(newPin);
            document.getElementById(`pin-${index - 1}`).focus();
        }
    };

    return (
        <div className="min-h-screen flex relative">
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-900 relative z-10">
                <h1 className="text-3xl font-bold mb-4 animate-slide-down text-green-400">Login with UPI ID</h1>

                <div className="w-full min-w-5xl flex justify-center">
                    <form
                        className='w-full max-w-xl flex flex-col justify-center items-center gap-5 mt-5 animate-slide-up'
                        onSubmit={handleLogin}
                    >
                        <div className="w-full max-w-sm flex flex-col justify-center">
                            <Label htmlFor="upiId" className="text-slate-100 text-md font-semibold" value="Your UPI ID :" />
                            <TextInput
                                type="text"
                                id="upiId"
                                placeholder="example@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required
                                className={`w-full max-w-lg transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                            />
                        </div>

                        <div className="w-full max-w-sm flex flex-col justify-center">
                            <Label className="text-slate-100 text-md font-semibold">Your PIN :</Label>
                            <div className="flex space-x-2">
                                {pin.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        type="password"
                                        id={`pin-${index}`}
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        onKeyDown={(e) => handlePinKeyDown(index, e)}
                                        maxLength={1}
                                        className="w-10 text-center"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between w-full max-w-xs mt-5">
                            <Button
                                className="w-full"
                                color="gray"
                                onClick={handleBack}
                                size="sm"
                            >
                                Back
                            </Button>
                            <Button
                                className="w-full ml-2"
                                gradientDuoTone='greenToBlue'
                                type='submit'
                                disabled={loading}
                                size="sm"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </div>

                        {errorMessage && (
                            <Alert color="failure" className="w-full max-w-lg mt-4">
                                {errorMessage}
                            </Alert>
                        )}
                    </form>
                </div>
            </div>

            <div
                className="w-1/2 bg-cover bg-center relative z-10"
                style={{
                    backgroundImage: `url(${img})`,
                }}
            >
            </div>

            <div className="absolute inset-0 w-1/2 bg-gray-900 transform skew-x-12 origin-right z-0"></div>
        </div>
    );
};

export default Login;