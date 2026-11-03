import { router } from 'expo-router';
import { Button, Card, Notice, Screen, Txt } from '@/components/ui/app';
import { useStore } from '@/lib/store';
export default function Reviews(){const {profile}=useStore();return <Screen title="내 리뷰" back>{profile.review?<Card><Txt style={{fontWeight:'700'}}>선린인터넷고 매점</Txt><Txt>{profile.review}</Txt></Card>:<Notice text="작성한 리뷰가 없어요."/>}<Button title="주문 내역 보기" secondary onPress={()=>router.push('/orders')}/></Screen>}
