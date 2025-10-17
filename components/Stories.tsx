import React from 'react';

const Stories: React.FC = () => {
    return (
        <div className="px-4 text-white h-full flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Stories</h1>
                <p className="text-slate-400">Temporary stories from users. Coming soon!</p>
                <div className="mt-6 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h3 className="font-semibold">Chloe's Adventure</h3>
                        <p className="text-sm text-slate-300">Exploring the city...</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h3 className="font-semibold">Marcus's Music</h3>
                        <p className="text-sm text-slate-300">New song in progress...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stories;
