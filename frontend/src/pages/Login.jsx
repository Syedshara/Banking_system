import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import img from '../assets/Login/img.jpg';

const Login = () => {
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // One unified error message
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // State to control visibility

    // UPI ID validation regex
    const validateUpiId = (upiId) => /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(upiId);

    // PIN validation regex (6-digit numeric pin)
    const validatePin = (pin) => /^\d{6}$/.test(pin);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message
        setLoading(true); // Start loading state

        // Validation flags
        let valid = true;

        // Scenario 3: Both inputs are invalid (show UPI error only)
        if (!upiId || !validateUpiId(upiId)) {
            setErrorMessage("Invalid UPI ID. Format should be like: example@upi.");
            valid = false;
        } else if (!pin || !validatePin(pin)) {
            // Scenario 2: Only PIN is invalid
            setErrorMessage("Invalid PIN. Must be a 6-digit number.");
            valid = false;
        }

        if (!valid) {
            setLoading(false); // Stop loading if validation fails
            return;
        }

        // Simulated API call for login
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Login successful with UPI ID:", upiId);
        } catch (err) {
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    useEffect(() => {
        // Trigger visibility after the component mounts
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen flex relative">
            {/* Left side: Login form */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-900 relative z-10">
                <h1 className="text-3xl font-bold mb-4 animate-slide-down text-green-400">Login with UPI ID</h1>

                <div className="w-full min-w-5xl flex justify-center">
                    <form
                        className='w-full max-w-xl flex flex-col justify-center items-center gap-5 mt-5 animate-slide-up'
                        onSubmit={handleLogin}
                    >
                        {/* UPI ID Input */}
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

                        {/* PIN Input */}
                        <div className="w-full max-w-sm flex flex-col justify-center">
                            <Label htmlFor="pin" className="text-slate-100 text-md font-semibold" value="Your PIN :" />
                            <TextInput
                                type="password"
                                id="pin"
                                placeholder="Enter 6-digit PIN"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                required
                                className={`w-full max-w-md transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                            />
                        </div>

                        {/* Sign In Button */}
                        <Button
                            className={`w-full max-w-xs mt-5 transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
                            gradientDuoTone='greenToBlue'
                            type='submit'
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>

                        {/* Alert Box for Errors (Displayed under the login button) */}
                        {errorMessage && (
                            <Alert color="failure" className="w-full max-w-lg mt-4">
                                {errorMessage}
                            </Alert>
                        )}
                    </form>
                </div>
            </div>

            {/* Right side: Image */}
            <div
                className="w-1/2 bg-cover bg-center relative z-10"
                style={{
                    backgroundImage: `url(${img})`,
                }}
            >
            </div>

            {/* Slanted Divider */}
            <div className="absolute inset-0 w-1/2 bg-gray-900 transform skew-x-12 origin-right z-0"></div>
        </div>
    );
};

export default Login;
