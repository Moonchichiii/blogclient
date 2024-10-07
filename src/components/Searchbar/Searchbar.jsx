import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';
import styles from './SearchBar.module.css';

const SearchBar = ({ setSearchQuery }) => {
    const [inputValue, setInputValue] = useState('');

    const debouncedSetSearchQuery = useCallback(
        debounce((value) => setSearchQuery(value.toLowerCase()), 300),
        [setSearchQuery]
    );

    useEffect(() => {
        return () => {
            debouncedSetSearchQuery.cancel();
        };
    }, [debouncedSetSearchQuery]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedSetSearchQuery(value);
    };

    return (
        <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className={styles.searchInput}
                />
            </div>
        </div>
    );
};

export default SearchBar;
