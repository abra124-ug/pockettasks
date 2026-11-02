import { Compass } from 'lucide-react';
import Header from '../components/Header.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function NotFound() {
  return (
    <>
      <Header title="Not found" back backTo="/" />
      <EmptyState icon={Compass} title="Page not found" message="That screen doesn't exist." action={{ label: 'Go home', to: '/' }} />
    </>
  );
}
