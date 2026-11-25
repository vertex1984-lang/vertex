import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

/** /register 静态壳（metadata；表单为 client 组件，见 RegisterForm.tsx） */
export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Makimoo account with just an email — add details later at checkout.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
