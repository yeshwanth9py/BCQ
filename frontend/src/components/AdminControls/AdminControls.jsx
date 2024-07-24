import React from 'react';

const AdminControls = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Add/Remove Rooms
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Add/Remove Users
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Add/Remove MCQs
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Add/Remove Code-Combat Questions
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          View Reports
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Manage Announcements
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          View User Statistics
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Access System Logs
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Customize Theme
        </button>
        <button className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Send Notifications
        </button>
      </div>
    </div>
  );
};

export default AdminControls;
