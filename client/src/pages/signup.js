import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignupApi } from '../api/userApi';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [panId, setPanId] = useState("");
    const [log, setLog] = useState("");
    const navigate = useNavigate();

    const onClick = async () => {
        try {
            const result = await SignupApi({ email, password, panId });
            if (result.token) {
                setLog("Loading !..........");
                localStorage.setItem('token', result.token);
                navigate('/');
            } else if (result.response.status == 403) {
                setLog("User Already exists!")
            } else if (result.response.status == 500) {
                setLog("Try Again!");
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setLog("");
        }, 3000);
    }, [log]);

    return (
        <div className='container'>
            <div className="row mt-5 pt-5">
                <div className="col-4"></div>
                <div className="col-4">
                    <div className="card text-bg-dark mb-3 border-3">
                        <div className="card-header pt-4 pb-2">Please enter your details!</div>
                        <div className="card-body row mb-5 pb-5 pt-4 mt-3">
                            <div className="col-5">
                                <p style={{ fontSize: "17px" }}>Email</p>
                                <p className='pt-1' style={{ fontSize: "17px" }}>Password</p>
                                <p className='pt-1' style={{ fontSize: "17px" }}>Pan Id</p>
                            </div>
                            <div className="col-7">
                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control input_shares ps-2"
                                        aria-label="Example text with button addon"
                                        aria-describedby="button-addon1"
                                    />
                                </div>
                                <div className="input-group mt-3">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control input_shares ps-2"
                                        aria-label="Example text with button addon"
                                        aria-describedby="button-addon1"
                                    />
                                </div>
                                <div className="input-group mt-3">
                                    <input
                                        type="text"
                                        value={panId}
                                        onChange={(e) => setPanId(e.target.value)}
                                        className="form-control input_shares ps-2"
                                        aria-label="Example text with button addon"
                                        aria-describedby="button-addon1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer row ps-4 pe-4 mt-5">
                            <p className='text-danger mb-0 fw-small'>{log}</p>
                            <button type="button" className="btn btn-secondary mt-3" onClick={() => onClick()}>Signup</button>
                        </div>
                    </div>
                    <p className='text-info create_account ps-3' onClick={() => navigate('/login')}>Already have an account ! Login ?</p>
                </div>
                <div className="col-4"></div>
            </div>
        </div>
    )
}

export default Signup