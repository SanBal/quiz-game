import React, { forwardRef } from 'react';
import TagSelector, { Tag, TagSelectorRef } from './shared/TagSelector';
import { Category } from '../model/Category';

const tags: Tag[] = [
    { label: "Celebrities", value: Category.CELEBRITIES },
    { label: "Computer Science", value: Category.SCIENCE_COMPUTERS },
    { label: "Film", value: Category.ENTERTAINMENT_FILM },
    { label: "General Knowledge", value: Category.GENERAL_KNOWLEDGE },
    { label: "Mathematics", value: Category.SCIENCE_MATHEMATICS },
    { label: "Mythology", value: Category.MYTHOLOGY },
];

interface CategorySelectorProperties {
    onCategoryClick: (category: Category | null) => void;
}

const CategorySelector = forwardRef<TagSelectorRef, CategorySelectorProperties>(
    ({ onCategoryClick }: CategorySelectorProperties, ref) => {
        return (
            <TagSelector
                ref={ref}
                title="Category"
                tags={tags}
                onTagClick={(tag) => onCategoryClick(tag ? tag.value : null)}
            />
        );
    }
);

CategorySelector.displayName = 'CategorySelector';

export default CategorySelector;
