import React, { memo, useEffect, useState } from 'react';

interface PointsForQuestionProps {
    points: number | null;
}

const PointsForQuestion: React.FC<PointsForQuestionProps> = memo(({ points }) => {
    const [fadeClass, setFadeClass] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [color, setColor] = useState<string>('white');

    useEffect(() => {
        if (points !== null) {
            setColor(points > 0 ? "green" : "white")
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
            <div className={`${fadeClass} absolute top-32 right-4 text-7xl text-${color}-500`}>
                <div>+{points}P</div>
            </div>
        )
    );
});

export default PointsForQuestion;
