import React, { useEffect, useState } from 'react';

interface PointsForQuestionProps {
    points: number | null;
    version: number; // New prop to track updates explicitly
}

const PointsForQuestion: React.FC<PointsForQuestionProps> = ({ points, version }) => {
    const [fadeClass, setFadeClass] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [textColorClass, setTextColorClass] = useState<string>('none');

    useEffect(() => {
        if (points !== null) {
            setTextColorClass(points > 0 ? "text-green-500" : "text-red-400");
            setFadeClass("fade-in-out");
            setIsVisible(true);

            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [version]); // Depend on version

    return (
        isVisible && points !== null && (
            <div className={`${fadeClass} absolute bottom-32 right-4 text-7xl ${textColorClass}`}>
                <div>+{points}P</div>
            </div>
        )
    );
};

export default PointsForQuestion;
