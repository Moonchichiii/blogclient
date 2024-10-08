import React from 'react';
import PropTypes from 'prop-types';

const RatingsItem = ({ rating, description }) => {
    return (
        <div className="ratings-item">
            <div className="rating-value">{rating}</div>
            <div className="rating-description">{description}</div>
        </div>
    );
};

RatingsItem.propTypes = {
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
};

export default RatingsItem;