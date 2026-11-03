import { Navigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
export default function Index() { const { profile, ready } = useStore(); if (!ready) return null; return <Navigate replace to={profile.agreed ? '/shop' : '/welcome'}/>; }
