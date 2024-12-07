import React from 'react';

interface StatsProperties {
    points: number[];
    currentRound: number;
}

const StatsView: React.FC<StatsProperties> = ({ points, currentRound }) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[400px] p-4">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left">Round</th>
                        <th className="px-4 py-2 border-b text-left">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {points.map((point, index) => (
                        <tr key={index} className={`${currentRound === index ? 'bg-cyan-400' : 'none'}`}>
                            <td className="px-4 py-2 border-b">{index + 1}</td>
                            <td className="px-4 py-2 border-b">{point}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StatsView;
