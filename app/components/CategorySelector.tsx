import React from 'react'
import TagSelector, { Tag } from './shared/TagSelector'
import { Category } from '../model/Category';

const tags: Tag[] = [
    { label: "Computer Science", value: Category.SCIENCE_COMPUTERS },
    { label: "Sports", value: Category.SPORTS },
]

interface CategorySelectorProperties {
    onCategoryClick: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProperties> = ({ onCategoryClick }) => {
    return (
        <div>
            <h3>Category</h3>
            <TagSelector tags={tags} onTagClick={(tag) => onCategoryClick(tag.value)}>
            </TagSelector>
        </div>
    )
}

export default CategorySelector