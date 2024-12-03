import React, { useEffect, useState } from 'react';
interface PointsForQuestionProps {
    points: number | null;
}

const PointsForQuestion: React.FC<PointsForQuestionProps> = ({ points }) => {
    const [fadeClass, setFadeClass] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        if (points !== null) {
            setFadeClass("fade-in-out");
            setIsVisible(true);
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [points]);

    return (
        isVisible && points !== null && (
            <div className={fadeClass}>
                <div>{points}P</div>
            </div>
        )
    );
};

export default PointsForQuestion;
