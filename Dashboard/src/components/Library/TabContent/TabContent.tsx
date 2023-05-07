import React from 'react';

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
