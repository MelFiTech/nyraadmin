import React from 'react';
interface UserFilterProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  export function UserFilter({ value, onChange }: UserFilterProps) {
    return (
      <select
        className="rounded-lg border border-gray-300 py-2 px-3 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="blocked">Blocked</option>
      </select>
    );
  }