import type { Metadata } from 'next';
import LoginForm from './LoginForm';

/** /login 静态壳（metadata；表单为 client 组件，见 LoginForm.tsx） */
export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Makimoo account — orders, addresses and wishlist in one place.',
};

export default function LoginPage() {
  return <LoginForm />;
}
