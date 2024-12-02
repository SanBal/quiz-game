import React from 'react'
import TagSelector, { Tag } from './shared/TagSelector'
import { Difficulty } from '../model/Difficulty';

const tags: Tag[] = [
    { label: "Easy", value: Difficulty.EASY },
    { label: "Medium", value: Difficulty.MEDIUM },
    { label: "Hard", value: Difficulty.HARD }
]

interface DifficultySelectorProperties {
    onDifficultyClick: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProperties> = ({ onDifficultyClick }) => {
    return (
        <div>
            <h3>Difficulty</h3>
            <TagSelector tags={tags} onTagClick={(tag) => onDifficultyClick(tag.value)}>
            </TagSelector>
        </div>
    )
}

export default DifficultySelector