import React, { useEffect, useState } from 'react'
import { Question } from '../services/QuestionsService'
import { getHintFor } from '../services/HintService';

interface HintViewProperties {
    question: Question;
}

const HintView: React.FC<HintViewProperties> = ({ question }) => {
    const [hint, setHint] = useState<string | null>(null)

    const fetchHint = async () => {
        setHint(await getHintFor(question))
    }

    useEffect(() => {
        fetchHint();
    }, [question])

    return (
        <div className='text-center'>{hint}</div>
    )
}

export default HintView