import { useParams } from 'react-router-dom';
import { ListX } from 'lucide-react';
import Header from '../components/Header.jsx';
import TaskForm from '../components/TaskForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { FormSkeleton } from '../components/Skeleton.jsx';
import { addTask, updateTask, useTasks } from '../hooks/useTasks.js';
import { toast } from '../utils/toast.js';
import { useGoBack } from '../utils/helpers.js';

export default function TaskEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const goBack = useGoBack(isEdit ? `/task/${id}` : '/tasks');
  const { tasks, status } = useTasks();
  const task = isEdit ? tasks.find((t) => t.id === id) : null;

  const title = isEdit ? 'Edit task' : 'New task';

  if (isEdit && status === 'loading') {
    return (
      <>
        <Header title={title} back />
        <FormSkeleton />
      </>
    );
  }

  if (isEdit && !task) {
    return (
      <>
        <Header title={title} back />
        <EmptyState icon={ListX} title="Task not found" message="It may have been deleted." action={{ label: 'View all tasks', to: '/tasks' }} />
      </>
    );
  }

  const submit = async (values) => {
    if (isEdit) {
      await updateTask(id, values);
      toast.success('Task updated');
    } else {
      await addTask(values);
      toast.success('Task created');
    }
    goBack();
  };

  return (
    <>
      <Header title={title} back />
      <TaskForm initial={task} submitLabel={isEdit ? 'Save changes' : 'Create task'} onSubmit={submit} />
    </>
  );
}
