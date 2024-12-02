import React from 'react'

interface TagSelectorProperties {
    tags: Tag[];
    onTagClick: (tag: Tag) => void;
}

export interface Tag {
    label: string;
    value: any;
}
const TagSelector: React.FC<TagSelectorProperties> = ({ tags, onTagClick }) => {
    return (
        <div>
            {tags.map(tag =>
                <div key={tag.label} onClick={() => onTagClick(tag)}>
                    {tag.label}
                </div>)}
        </div>
    )
}

export default TagSelector