import React, { memo, useEffect, useState } from 'react';

interface PointsForQuestionProps {
    points: number | null;
}

const PointsForQuestion: React.FC<PointsForQuestionProps> = memo(({ points }) => {
    const [fadeClass, setFadeClass] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [textColorClass, setTextColorClass] = useState<string>('text-white-500');

    useEffect(() => {
        if (points !== null) {
            setTextColorClass(points > 0 ? "text-green-500" : "text-white-500")
            setFadeClass("fade-in-out");
            setIsVisible(true);
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [points]);

    return (
        isVisible && points !== null && (
            <div className={`${fadeClass} absolute top-32 right-4 text-7xl ${textColorClass}`}>
                <div>+{points}P</div>
            </div>
        )
    );
});

export default PointsForQuestion;
