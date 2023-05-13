import React from 'react';

import './TabContent.css';

const TabContent = ({ children }: {
    children: React.ReactNode;
}) => {
    return (
        <div className="ong-tab-content">
            {children}
        </div>
    );
};

export default TabContent;
