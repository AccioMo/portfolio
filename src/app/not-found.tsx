import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen font-bold">
            <div className="text-center leading-loose">
                <h1 className="text-5xl py-4">404</h1>
                <p className="font-normal">This is not the way...</p>
            </div>
        </div>
    );
};

export default NotFound;