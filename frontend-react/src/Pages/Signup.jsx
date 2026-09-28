import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Signup.css';
import { toast } from 'react-toastify';

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = () => {
        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                console.log("Sign Up:", { name, email, password });
                toast.success("Account created! Redirecting...");
                navigate("/home");
            } else {
                toast.error("Passwords do not match!");
            }
        } else {
            toast.error("Please fill in all fields!");
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <><div className='signup-page'></div><div className='container'>
            <div className='header'>
                <div className='text'>Create Account</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='input'>
                    <input
                        type="email"
                        placeholder="your@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='input'>
                    <input
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='input'>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </div>

            <div className='button-container'>
                <div className='sign-in-button' onClick={handleSignUp}>Register</div>
                <div className='visitor-button' onClick={handleBackToLogin}>Back to Login</div>
            </div>
        </div></>
    );
};

export default SignUp;
