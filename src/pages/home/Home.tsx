import React, { useState } from 'react';
import {
  Award,
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  Gift,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  User,
} from 'lucide-react';

const Home = () => {
  // Sample data for dashboard components
  const actionItems = [
    { id: 1, title: 'Review Q2 Financial Report', dueDate: '2025-05-15', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Approve Annual Leave Requests', dueDate: '2025-05-18', priority: 'Medium', status: 'Pending' },
    {
      id: 3,
      title: 'Sign Contract for New Office Equipment',
      dueDate: '2025-05-20',
      priority: 'High',
      status: 'Pending',
    },
    { id: 4, title: 'Schedule Team Building Event', dueDate: '2025-05-25', priority: 'Low', status: 'Pending' },
  ];

  const noticeBoard = [
    {
      id: 1,
      title: 'Office Closure: Memorial Day',
      content: 'Office will be closed on May 27th. Emergencies contact HR.',
      date: 'May 15, 2025',
      author: 'HR Department',
    },
    {
      id: 2,
      title: 'New Health Insurance Plans',
      content: 'New health plans available starting June 1st. Enrollment open till May 25.',
      date: 'May 10, 2025',
      author: 'Benefits Team',
    },
    {
      id: 3,
      title: 'Quarterly All-Hands Meeting',
      content: 'Join us for updates on May 22nd at 3pm in the main conference room.',
      date: 'May 8, 2025',
      author: 'Executive Office',
    },
  ];

  const employeeOfMonth = {
    name: 'Sarah Johnson',
    department: 'Customer Success',
    achievement: 'Increased customer retention by 22% through proactive outreach and outstanding problem-solving.',
    image: '/api/placeholder/200/200',
  };

  const todoItems = [
    { id: 1, task: 'Prepare presentation for client meeting', completed: false },
    { id: 2, task: 'Send weekly status report', completed: true },
    { id: 3, task: 'Review marketing materials', completed: false },
    { id: 4, task: 'Update team calendar', completed: false },
    { id: 5, task: 'Complete expense reports', completed: true },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Budget Planning Meeting', date: 'May 13, 2025', time: '10:00 AM', location: 'Conference Room A' },
    { id: 2, title: 'Team Lunch', date: 'May 16, 2025', time: '12:30 PM', location: 'Cafeteria' },
    { id: 3, title: 'Project Deadline: Marketing Campaign', date: 'May 20, 2025', time: 'EOD', location: '' },
    { id: 4, title: 'Department Review', date: 'May 24, 2025', time: '2:00 PM', location: 'Online Meeting' },
  ];

  const birthdays = [
    { id: 1, name: 'Michael Chen', department: 'Engineering', date: 'May 15', image: '/api/placeholder/40/40' },
    { id: 2, name: 'Jessica Wang', department: 'Marketing', date: 'May 18', image: '/api/placeholder/40/40' },
    { id: 3, name: 'Robert Kim', department: 'Finance', date: 'May 22', image: '/api/placeholder/40/40' },
    { id: 4, name: 'Emily Rodriguez', department: 'HR', date: 'May 30', image: '/api/placeholder/40/40' },
  ];

  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState(todoItems);

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: todos.length + 1, task: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <div className=" min-h-screen">
      <div className="w-full  px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8 lg:col-span-2">
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
              <div className="px-6 py-5 border-b ">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <CheckSquare size={18} className="text-indigo-600" />
                    </div>
                    My Action Items
                  </h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {actionItems.map((item) => (
                      <tr key={item.id} className="hover:bg-indigo-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-indigo-400" />
                            {item.dueDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              item.priority === 'High'
                                ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                                : item.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
                                : 'bg-green-100 text-green-700 ring-1 ring-green-200'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full ring-1 ring-indigo-200">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
              <div className="px-6 py-5 border-b ">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Bell size={18} className="text-indigo-600" />
                    </div>
                    Notice Board
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {noticeBoard.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-5 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                          {notice.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{notice.date}</span>
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{notice.content}</p>
                    <div className="mt-3 text-xs flex items-center text-gray-500">
                      <User size={12} className="mr-1.5" />
                      Posted by: <span className="font-medium ml-1 text-indigo-600">{notice.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Employee of the Month - For mobile view (shown below action items & notice board) */}
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden lg:hidden">
              <div className="px-6 py-5 border-b ">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Award size={18} className="text-indigo-600" />
                  </div>
                  Employee of the Month
                </h2>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-1">
                    <img
                      src={employeeOfMonth.image}
                      alt={employeeOfMonth.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-1.5 rounded-full shadow-lg">
                    <Star size={18} className="text-white" />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-indigo-900">{employeeOfMonth.name}</h3>
                <p className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {employeeOfMonth.department}
                </p>

                <div className="mt-4 text-sm text-gray-600 text-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="italic">{employeeOfMonth.achievement}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - 1/3 width on larger screens */}
          <div className="space-y-8">
            {/* Employee of the Month - For desktop view (shown in right column) */}
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden hidden lg:block">
              <div className="px-6 py-5 border-b ">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Award size={18} className="text-indigo-600" />
                  </div>
                  Employee of the Month
                </h2>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center p-1">
                    <img
                      src={employeeOfMonth.image}
                      alt={employeeOfMonth.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
                    <Star size={18} className="text-white" />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-indigo-900">{employeeOfMonth.name}</h3>
                <p className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-1.5">
                  {employeeOfMonth.department}
                </p>

                <div className="mt-5 text-sm text-gray-600 text-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <p className="italic">{employeeOfMonth.achievement}</p>
                </div>
              </div>
            </section>

            {/* To-Do List */}
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
              <div className="px-6 py-5 border-b ">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <List size={18} className="text-indigo-600" />
                  </div>
                  To-Do List
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded-md focus:ring-indigo-500"
                      />
                      <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {todo.task}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-indigo-100">
                  <div className="flex items-center space-x-2 bg-indigo-50 p-2 rounded-lg">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add new task..."
                      className="text-sm flex-grow rounded-lg border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white"
                    />
                    <button
                      onClick={handleAddTodo}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Planner / Upcoming Events */}
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
              <div className="px-6 py-5 border-b ">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Calendar size={18} className="text-indigo-600" />
                  </div>
                  Planner
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-4 p-3 rounded-xl hover:bg-indigo-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-14 h-14 flex flex-col items-center justify-center bg-indigo-100 rounded-lg border border-indigo-200 shadow-sm">
                      <span className="text-xs text-indigo-600 font-medium">{event.date.split(', ')[0]}</span>
                      <span className="text-sm text-indigo-800 font-bold">{event.date.split(', ')[1]}</span>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-800">{event.title}</h3>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <Clock size={14} className="text-indigo-400" />
                        <span className="text-xs text-gray-500">{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="text-xs text-indigo-600 mt-1.5 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Birthdays Section */}
            <section className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
              <div className="px-6 py-5 border-b ">
                <h2 className="text-lg font-bold text-indigo-900 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Gift size={18} className="text-indigo-600" />
                  </div>
                  Upcoming Birthdays
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {birthdays.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-0.5">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{person.name}</h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs text-gray-500">{person.department}</span>
                        <span className="w-1 h-1 bg-indigo-300 rounded-full"></span>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {person.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
