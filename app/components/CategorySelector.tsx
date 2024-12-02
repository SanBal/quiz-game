import React from 'react'
import TagSelector, { Tag } from './shared/TagSelector'

export enum Category {
    SCIENCE,
    SPORTS
}
const tags: Tag[] = [
    { label: "Science", value: Category.SCIENCE },
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