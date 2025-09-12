import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Logout: React.FC = () => {
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('/api/logout/', {
            credentials: 'include',
        })
            .catch((err) => setError(err));
    }, []);

    if (error) {
        return (
            <div>
                <h3>Error: Logout was not successful (is flask running?)</h3>
            </div>
        );
    }

    return (
        <div>
            <h2>You are logged out! Now check out <Link to="/api/hello/">/hello/</Link></h2>
        </div>
    );
};

export default Logout;
