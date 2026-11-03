import { useAppRouter } from '@/lib/navigation';
import { Button, Card, Notice, Screen, Txt } from '@/components/ui/app';
export default function PaymentMethods(){ const router = useAppRouter();return <Screen title="결제수단 관리" back><Txt muted>현재 백엔드는 개발용 단건 결제만 지원합니다.</Txt><Notice text="저장된 결제수단이 없어요. 카드 정보 등록 API가 제공되면 이 화면에서 관리할 수 있습니다."/><Button title="주문에서 결제수단 선택하기" onClick={()=>router.push('/shop')}/><Card><Txt muted>실제 카드번호를 앱이나 서버에 저장하지 않습니다.</Txt></Card></Screen>}
