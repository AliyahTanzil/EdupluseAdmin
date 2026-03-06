import React from 'react';

const Timetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00'];

  const schedule = {
    Monday: ['Math', 'English', 'Science', 'Break', 'History', 'PE'],
    Tuesday: ['Science', 'Math', 'English', 'Break', 'Geography', 'Art'],
    Wednesday: ['English', 'Science', 'Math', 'Break', 'PE', 'Music'],
    Thursday: ['Math', 'History', 'English', 'Break', 'Science', 'Drama'],
    Friday: ['Science', 'English', 'Math', 'Break', 'Geography', 'Sports'],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Timetable</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Timetable
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              {days.map(day => (
                <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {periods.map((period, index) => (
              <tr key={period} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {period}
                </td>
                {days.map(day => (
                  <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={`p-2 rounded ${
                      schedule[day][index] === 'Break' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {schedule[day][index]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;