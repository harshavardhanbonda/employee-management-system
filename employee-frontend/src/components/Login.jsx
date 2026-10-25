import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:8080';

function Login()
{
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    
    async function handleSubmit(event)
    {   
        console.log('Login button submitted');
        event.preventDefault();

        setError('');
        setLoading(true);
    

    try{
        const response = await fetch(`${API_URL}/auth/login`,{
            method:'POST',
            headers : {
                'Content-Type':'application/json',
            },
            body : JSON.stringify({email,password}),

        });

        if(!response.ok)
        {
            if(response.status===401)
            {
                throw new Error('Invalid email or passowrd.');
            }
            throw new Error('Login failed.PLease try again.');
        }
        const data = await response.json();

        if(!data.accessToken)
        {
            throw new Error ('The server did not return an access token.');
        }

        sessionStorage.setItem('accessToken',data.accessToken);
        sessionStorage.setItem('userEmail', email);

        console.log('Saved email:', sessionStorage.getItem('userEmail'));

        setError('');
        navigate('/');
    }
    catch(err)
    {
        setError(
            err instanceof TypeError ?
            'Can not connect to the server. Check that the backend is running.'
            :err.message
        );
    }
    finally{
        setLoading(false);
    }
}
    console.log('Login component rendered');
    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-brand">
                    <div className="brand-icon">E</div>
                    <h1>Employee Portal</h1>
                    <p>Sign in to manage your workforce</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(event)=>setEmail(event.target.value)}
                            autoComplete="email"
                            required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event)=>setPassword(event.target.value)}
                            autoComplete="current-password"
                            required/>
                    </div>
                    {error && (<p className="login-error" role="alert">{error}</p>)}
                    <button 
                    className="login-button" 
                    type="submit"
                    disabled={loading}>
                        {loading ?'Signing in...': 'Sign In'}</button>
                </form>
                <p className="register-prompt">
                    Don't have an account?{' '}
                    <Link className="text-button" to="/register">
                        Create One
                    </Link>
                </p>
                 
            </section>
        </main>
    );
}

export default Login;