import { Redirect } from 'expo-router';
import { useStore } from '@/lib/store';
export default function Index() { const { profile, ready } = useStore(); if (!ready) return null; return <Redirect href={profile.agreed ? '/shop' : '/welcome'}/>; }
