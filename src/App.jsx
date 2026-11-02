import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import TaskDetails from './pages/TaskDetails.jsx';
import TaskEditor from './pages/TaskEditor.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import { initTasks } from './hooks/useTasks.js';

export default function App() {
  useEffect(() => {
    initTasks();
  }, []);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="task/:id" element={<TaskDetails />} />
        <Route path="new" element={<TaskEditor />} />
        <Route path="edit/:id" element={<TaskEditor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
