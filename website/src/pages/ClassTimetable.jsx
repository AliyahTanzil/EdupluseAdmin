import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/Shared';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';

const ClassTimetable = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Mock class data
  const classData = {
    '1': { name: '10-A', teacher: 'Dr. Smith' },
    '2': { name: '10-B', teacher: 'Ms. Johnson' },
    '3': { name: '9-A', teacher: 'Mr. Brown' },
    '4': { name: '9-B', teacher: 'Dr. Wilson' },
    '5': { name: '11-A', teacher: 'Ms. Taylor' },
    '6': { name: '11-B', teacher: 'Mr. Anderson' },
  };

  const currentClass = classData[classId] || { name: 'Class', teacher: 'Unknown' };

  const [timetable] = useState([
    {
      day: 'Monday',
      periods: [
        { period: 1, time: '8:00-8:45', subject: 'Mathematics', teacher: 'Dr. Smith', room: '101' },
        { period: 2, time: '8:45-9:30', subject: 'English', teacher: 'Ms. Brown', room: '102' },
        { period: 3, time: '9:45-10:30', subject: 'Science', teacher: 'Mr. Johnson', room: '103' },
        { period: 4, time: '10:30-11:15', subject: 'History', teacher: 'Mrs. Lee', room: '104' },
      ]
    },
    {
      day: 'Tuesday',
      periods: [
        { period: 1, time: '8:00-8:45', subject: 'Physics', teacher: 'Dr. Smith', room: '101' },
        { period: 2, time: '8:45-9:30', subject: 'Chemistry', teacher: 'Mr. Wilson', room: '102' },
        { period: 3, time: '9:45-10:30', subject: 'Biology', teacher: 'Ms. Davis', room: '103' },
        { period: 4, time: '10:30-11:15', subject: 'Geography', teacher: 'Mr. Taylor', room: '104' },
      ]
    },
    {
      day: 'Wednesday',
      periods: [
        { period: 1, time: '8:00-8:45', subject: 'Mathematics', teacher: 'Dr. Smith', room: '101' },
        { period: 2, time: '8:45-9:30', subject: 'Computer Science', teacher: 'Mr. Anderson', room: '102' },
        { period: 3, time: '9:45-10:30', subject: 'Art', teacher: 'Mrs. Martinez', room: '103' },
        { period: 4, time: '10:30-11:15', subject: 'Physical Education', teacher: 'Coach Miller', room: '104' },
      ]
    },
    {
      day: 'Thursday',
      periods: [
        { period: 1, time: '8:00-8:45', subject: 'English', teacher: 'Ms. Brown', room: '101' },
        { period: 2, time: '8:45-9:30', subject: 'Science', teacher: 'Mr. Johnson', room: '102' },
        { period: 3, time: '9:45-10:30', subject: 'Mathematics', teacher: 'Dr. Smith', room: '103' },
        { period: 4, time: '10:30-11:15', subject: 'History', teacher: 'Mrs. Lee', room: '104' },
      ]
    },
    {
      day: 'Friday',
      periods: [
        { period: 1, time: '8:00-8:45', subject: 'Physical Education', teacher: 'Coach Miller', room: '101' },
        { period: 2, time: '8:45-9:30', subject: 'Music', teacher: 'Ms. Harris', room: '102' },
        { period: 3, time: '9:45-10:30', subject: 'Library Period', teacher: 'Ms. Clark', room: '103' },
        { period: 4, time: '10:30-11:15', subject: 'Assembly', teacher: 'Admin', room: '104' },
      ]
    },
  ]);

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 border-blue-300',
      'English': 'bg-purple-100 border-purple-300',
      'Science': 'bg-green-100 border-green-300',
      'Physics': 'bg-red-100 border-red-300',
      'Chemistry': 'bg-orange-100 border-orange-300',
      'Biology': 'bg-emerald-100 border-emerald-300',
      'History': 'bg-amber-100 border-amber-300',
      'Geography': 'bg-teal-100 border-teal-300',
      'Computer Science': 'bg-indigo-100 border-indigo-300',
      'Art': 'bg-pink-100 border-pink-300',
      'Physical Education': 'bg-cyan-100 border-cyan-300',
      'Music': 'bg-rose-100 border-rose-300',
      'Library Period': 'bg-gray-100 border-gray-300',
      'Assembly': 'bg-yellow-100 border-yellow-300',
    };
    return colors[subject] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Classes
          </button>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{currentClass.name} - Timetable</h1>
            <p className="text-gray-600 mt-2">Class Teacher: <span className="font-semibold">{currentClass.teacher}</span></p>
          </div>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => alert('Add Class feature coming soon')}>
            <Plus size={18} />
            Add Class
          </Button>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="space-y-6">
        {timetable.map((daySchedule, dayIndex) => (
          <Card key={dayIndex}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{daySchedule.day}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {daySchedule.periods.map((period, periodIndex) => (
                  <div
                    key={periodIndex}
                    className={`p-4 rounded-lg border-2 ${getSubjectColor(period.subject)} cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Period {period.period}</p>
                        <p className="text-sm font-bold text-gray-800">{period.time}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <p className="font-semibold text-gray-800">{period.subject}</p>
                      <p className="text-xs text-gray-600">{period.teacher}</p>
                      <p className="text-xs text-gray-600">Room {period.room}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button onClick={() => alert(`Edit ${period.subject} class`)} className="text-blue-600 hover:text-blue-800 text-xs flex-1">
                        <Edit2 size={14} className="inline mr-1" />
                        Edit
                      </button>
                      <button onClick={() => alert(`Delete ${period.subject} class`)} className="text-red-600 hover:text-red-800 text-xs flex-1">
                        <Trash2 size={14} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassTimetable;
