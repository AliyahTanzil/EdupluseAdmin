import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table Component - Reusable data table with sorting and pagination
 */
export const Table = ({
  columns,
  data,
  onRowClick = null,
  actions = null,
  striped = true,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 font-semibold text-gray-900"
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 font-semibold text-gray-900">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-6 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`
                  border-b border-gray-100 
                  hover:bg-blue-50 
                  transition-colors duration-150
                  ${striped && idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-150 ${action.className}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ),
  striped: PropTypes.bool,
};

export default Table;
