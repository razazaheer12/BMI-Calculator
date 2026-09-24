import React from 'react';

export const MaleIcon: React.FC<{ active?: boolean; className?: string }> = ({
  active = false,
  className = 'w-7 h-7',
}) => {
  const fillColor = active ? '#f58220' : '#8e8e93';

  return (
    <svg
      viewBox="0 0 24 32"
      className={className}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="5" r="4" />
      {/* Body & Arms */}
      <path
        d="M6 11C6 10.45 6.45 10 7 10H17C17.55 10 18 10.45 18 11V19C18 19.55 17.55 20 17 20H15.5V29C15.5 29.55 15.05 30 14.5 30H13.2C12.65 30 12.2 29.55 12.2 29V21.5H11.8V29C11.8 29.55 11.35 30 10.8 30H9.5C8.95 30 8.5 29.55 8.5 29V20H7C6.45 20 6 19.55 6 19V11Z"
      />
    </svg>
  );
};

export const FemaleIcon: React.FC<{ active?: boolean; className?: string }> = ({
  active = false,
  className = 'w-7 h-7',
}) => {
  const fillColor = active ? '#f58220' : '#8e8e93';

  return (
    <svg
      viewBox="0 0 24 32"
      className={className}
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="12" cy="5" r="4" />
      {/* Torso & Dress */}
      <path
        d="M8.2 10.5C8.2 10.22 8.42 10 8.7 10H15.3C15.58 10 15.8 10.22 15.8 10.5L18.5 20.8C18.6 21.2 18.3 21.6 17.9 21.6H14.5V29C14.5 29.55 14.05 30 13.5 30H12.5C12.1 30 11.8 29.7 11.8 29.3V21.6H12.2V29.3C12.2 29.7 11.9 30 11.5 30H10.5C9.95 30 9.5 29.55 9.5 29V21.6H6.1C5.7 21.6 5.4 21.2 5.5 20.8L8.2 10.5Z"
      />
    </svg>
  );
};
