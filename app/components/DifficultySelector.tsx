import React, { forwardRef } from 'react'
import TagSelector, { Tag } from './shared/TagSelector'
import { Difficulty } from '../model/Difficulty';

const tags: Tag[] = [
    { label: "Easy (10P)", value: Difficulty.EASY },
    { label: "Medium (20P)", value: Difficulty.MEDIUM },
    { label: "Hard (30P)", value: Difficulty.HARD }
]

interface DifficultySelectorProperties {
    onDifficultyClick: (difficulty: Difficulty) => void;
}

const DifficultySelector = forwardRef(
    ({ onDifficultyClick }: DifficultySelectorProperties, ref) => {
        return (
            <TagSelector
                ref={ref}
                title='Difficulty'
                tags={tags}
                onTagClick={(tag) => onDifficultyClick(tag ? tag.value : null)}>
            </TagSelector>
        );
    }
);

export default DifficultySelector