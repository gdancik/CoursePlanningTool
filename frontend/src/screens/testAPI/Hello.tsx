import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hello: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // window.location.href = "http://localhost:5000/api/hello/";
    // window.location.href = "http://example.com";

    useEffect(() => {
        fetch('/api/hello/')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }, []);

    if (error) {
        return (
            <div>
                <h3> Error: either flask is not running, or you must <Link to="/login/">login</Link></h3>
            </div>
        );
    }

    return (
        <div>
            <h2>{message}</h2>
        </div>
    );
};
export default Hello;
