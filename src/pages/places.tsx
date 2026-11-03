import { useAppRouter } from '@/lib/navigation';
import { Button, C, Card, Screen, Txt } from '@/components/ui/app';
import { useStore } from '@/lib/store';
const places=['1층 현관','2층 중앙 계단','운동장 입구','도서관 앞'];
export default function Places(){ const router = useAppRouter();const {profile,setProfile}=useStore();return <Screen title="수령 장소 변경" back><Txt muted>간식을 받을 장소를 선택해 주세요.</Txt>{places.map(x=><Card key={x} onClick={()=>{setProfile({place:x});router.back();}} style={{backgroundColor:profile.place===x?C.pale:C.white,borderColor:profile.place===x?C.red:C.line}}><Txt style={{fontWeight:'700'}}>{profile.place===x?'◉':'○'}  {x}</Txt></Card>)}<Button title="선택 완료" onClick={()=>router.back()}/></Screen>}
