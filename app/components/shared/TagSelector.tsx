import React, { useState, useImperativeHandle, forwardRef } from 'react';

export interface TagSelectorRef {
    reset: () => void;
}

interface TagSelectorProperties {
    title: string;
    tags: Tag[];
    onTagClick: (tag: Tag | null) => void;
}

export interface Tag {
    label: string;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    value: any;
}

const TagSelector = forwardRef<TagSelectorRef, TagSelectorProperties>(
    ({ title, tags, onTagClick }: TagSelectorProperties, ref) => {
        const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

        useImperativeHandle(ref, () => ({
            reset() {
                setSelectedTag(null);
            },
        }));

        const handleTagClick = (tag: Tag) => {
            if (tag !== selectedTag) {
                setSelectedTag(tag);
                onTagClick(tag);
            }
        };

        return (
            <div className="flex flex-col items-center gap-1 w-full px-2">
                <div className="font-bold text-2xl text-cyan-400">
                    {title.toUpperCase()}
                </div>
                <div className="flex flex-col gap-1 w-full">
                    {tags.map((tag) => (
                        <div
                            key={tag.label}
                            className={`p-2 cursor-pointer hover:scale-105 text-center ${tag === selectedTag ? 'text-sky-400' : 'none'
                                }`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag.label}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

TagSelector.displayName = 'TagSelector';

export default TagSelector;
