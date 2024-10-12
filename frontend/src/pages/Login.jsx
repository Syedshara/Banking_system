import { useEffect, useState } from "react";
import { Alert, Button, Label, TextInput } from 'flowbite-react';

const Login = () => {
    const [upiId, setUpiId] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // State to control visibility

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true); // Start loading state

        // Basic validation for UPI ID and PIN
        if (!upiId || !pin) {
            setError("Both UPI ID and PIN are required.");
            setLoading(false);
            return;
        }

        if (pin.length !== 6) {
            setError("PIN must be 6 digits.");
            setLoading(false);
            return;
        }

        // Here, you would normally make an API call to check the UPI ID and PIN
        console.log("Logging in with", upiId, pin);
        // Example API call (replace with your actual API call)
        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // If successful, redirect or show success message
            console.log("Login successful!");
        } catch (err) {
            // Handle login error
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    useEffect(() => {
        // Trigger visibility after the component mounts
        setIsVisible(true);
    }, []);

    return (
        <div
            className="flex flex-col justify-center items-center min-h-screen"
            style={{
                backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
                backgroundColor: '#1f2937', // Fallback color for older browsers
            }}
        >
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
                        size="lg" // Disable button when loading
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    {error && <Alert color="failure" className="mb-4">{error}</Alert>}
                </form>
            </div>
        </div>
    );
};

export default Login;
