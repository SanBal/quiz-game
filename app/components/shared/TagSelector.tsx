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
        <div className="flex flex-col items-center gap-1 w-full px-2">
            <div className="font-bold text-2xl text-cyan-400">{title.toUpperCase()}</div>
            <div className="flex flex-col gap-1 w-full">
                {tags.map((tag) => (
                    <div
                        key={tag.label}
                        className={`p-2 cursor-pointer hover:scale-105 text-center
                ${tag === selectedTag ? 'text-sky-400': 'none'}
              `}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TagSelector