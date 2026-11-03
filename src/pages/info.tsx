import { useAppParams } from '@/lib/navigation';
import { Card, Screen, Txt } from '@/components/ui/app';
export default function Info(){const {type}=useAppParams<{type:string}>();const privacy=type==='privacy';return <Screen title={privacy?'개인정보 처리방침':'이용약관'} back><Card><Txt style={{fontWeight:'800'}}>{privacy?'개인정보 이용 안내':'서비스 이용 안내'}</Txt><Txt>{privacy?'주문 처리에 필요한 이름, 휴대폰 번호, 수령 장소를 사용합니다. 현재 앱의 프로필 정보는 이 기기에 저장되며, 주문할 때 해당 정보가 백엔드로 전송됩니다.':'이 앱은 학교 내 매점 상품 주문과 배송 상태 확인을 위한 서비스입니다. 주문 및 결제는 개발용 백엔드 API로 처리됩니다.'}</Txt></Card><Txt muted>정식 약관과 개인정보 처리방침 문서는 아직 제공되지 않았습니다.</Txt></Screen>}
