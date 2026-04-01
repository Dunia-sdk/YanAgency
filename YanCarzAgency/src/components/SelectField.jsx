import React from 'react';
import './SelectField.css';

const SelectField = ({ label, name, value, onChange, options, error, required, disabled }) => {
    return (
        <div className="input-group">
            {label && <label htmlFor={name} className="input-label">{label}</label>}
            <div className="input-wrapper">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`select-field ${error ? 'input-error' : ''}`}
                    required={required}
                    disabled={disabled}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SelectField;
