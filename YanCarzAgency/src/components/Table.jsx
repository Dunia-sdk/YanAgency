import React from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick, activeRowId, emptyMessage = 'Aucune donnée disponible' }) => {
    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} style={{ width: col.width }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-empty">{emptyMessage}</td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr
                                key={row.id ?? idx}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`${onRowClick ? 'clickable' : ''} ${activeRowId === row.id ? 'active-row' : ''}`}
                            >
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
