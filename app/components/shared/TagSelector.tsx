import React, { useState } from 'react'

interface TagSelectorProperties {
    title: string;
    tags: Tag[];
    onTagClick: (tag: Tag | null) => void;
}

export interface Tag {
    label: string;
    value: any;
}
const TagSelector: React.FC<TagSelectorProperties> = ({ title, tags, onTagClick }) => {
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

    const handleTagClick = (tag: Tag) => {
        if (tag !== selectedTag) {
            setSelectedTag(tag)
            onTagClick(tag)
        }
    }
    return (
        <div className="flex items-center gap-4">
            <div>{title}:</div>
            <div className="flex flex-row gap-4">
                {tags.map(tag =>
                    <div className={`rounded-lg border-solid border-2 p-1 cursor-pointer hover:scale-105 ${tag === selectedTag ? 'border-red-400' : 'none'}`}
                        key={tag.label}
                        onClick={() => handleTagClick(tag)}>
                        {tag.label}
                    </div>)}
            </div>
        </div>
    )
}

export default TagSelector