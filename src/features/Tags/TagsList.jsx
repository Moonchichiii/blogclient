import React, { useEffect, useState } from 'react';

const TagsList = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        // Fetch tags from an API or other source
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tags');
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    return (
        <div>
            <h2>Tags</h2>
            <ul>
                {tags.map(tag => (
                    <li key={tag.id}>{tag.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default TagsList;