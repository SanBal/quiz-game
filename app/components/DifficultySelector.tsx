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
        <TagSelector title='Difficulty' tags={tags} onTagClick={(tag) => onDifficultyClick(tag ? tag.value : null)}>
        </TagSelector>
    )
}

export default DifficultySelector