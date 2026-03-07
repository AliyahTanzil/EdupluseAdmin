import React from 'react';
import { Card, Button } from '../components/Shared';

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
        <Button variant="primary">Edit Timetable</Button>
      </div>
      <Card elevation="lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-900">Time</th>
                {days.map(day => (
                  <th key={day} className="px-6 py-3 text-left font-semibold text-gray-900">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, index) => (
                <tr key={period} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {period}
                  </td>
                  {days.map(day => (
                    <td key={day} className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`px-3 py-2 rounded font-medium ${
                        schedule[day][index] === 'Break' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-blue-100 text-blue-800'
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
      </Card>
    </div>
  );
};

export default Timetable;