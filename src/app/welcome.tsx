import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, C, Card, Field, Screen, Txt } from '@/components/ui/app';
import { useStore } from '@/lib/store';

const places = ['1층 현관', '2층 중앙 계단', '운동장 입구', '도서관 앞'];
export default function Welcome() {
  const { profile, setProfile } = useStore();
  const [step, setStep] = useState(0);
  const [checks, setChecks] = useState([false, false, false]);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [code, setCode] = useState('');
  const [place, setPlace] = useState(profile.place);
  const next = () => setStep(x => x + 1);
  const done = () => { setProfile({ name: name.trim() || '선린', phone: phone.replace(/\D/g, ''), school: '선린인터넷고등학교', place, agreed: true }); router.replace('/shop'); };
  return <Screen title={['서비스 이용 동의','교내 드론 배달','연락처 입력','학교 등록','기본 수령 장소'][step]}>
    {step>0 && <Pressable onPress={()=>setStep(step-1)}><Txt style={{color:C.red}}>‹ 이전</Txt></Pressable>}
    {step === 0 && <><Txt style={{ fontSize: 28, fontWeight: '800', lineHeight: 38 }}>학교 안 배달,{ '\n' }시작하기 전에 확인해요</Txt><Txt muted>안전한 주문과 수령을 위해 이용약관에 동의해 주세요.</Txt>{['서비스 이용약관 (필수)','개인정보 수집 및 이용 (필수)','혜택 및 이벤트 알림 수신 (선택)'].map((label,i) => <Pressable key={label} onPress={() => setChecks(prev => prev.map((v,j) => i === j ? !v : v))}><Card><Txt>{checks[i] ? '☑' : '□'}  {label}</Txt></Card></Pressable>)}<Button title="동의하고 시작하기" disabled={!checks[0] || !checks[1]} onPress={next}/></>}
    {step === 1 && <><View style={{ height: 180, borderRadius: 16, backgroundColor: C.pale, justifyContent: 'center', alignItems: 'center' }}><Txt style={{ fontSize: 52, color: C.red }}>⌁</Txt></View><Txt style={{ fontSize: 28, fontWeight: '800', lineHeight: 38 }}>매점 가는 시간까지{ '\n' }아껴드릴게요.</Txt><Txt muted>먹고 싶은 메뉴를 고르면 약속한 곳으로 가져다드려요.</Txt><Button title="휴대폰 번호로 시작하기" onPress={next}/><Button title="메뉴 먼저 둘러보기" secondary onPress={() => router.replace('/shop')}/></>}
    {step === 2 && <><Txt style={{ fontSize: 26, fontWeight: '800' }}>주문 안내를 받을 연락처</Txt><Txt muted>현재 서버에는 문자 인증 API가 없어 번호를 직접 등록합니다.</Txt><Field label="이름" value={name} onChangeText={setName} placeholder="이름을 입력해 주세요"/><Field label="휴대폰 번호" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="010-0000-0000"/><Button title="다음" disabled={name.trim().length < 2 || phone.replace(/\D/g,'').length < 10} onPress={next}/></>}
    {step === 3 && <><Txt style={{ fontSize: 26, fontWeight: '800' }}>어느 학교에서 이용하시나요?</Txt><Txt muted>현재 서비스는 선린인터넷고등학교 한 곳을 지원합니다. 개발용 코드는 123456입니다.</Txt><Field label="학교 코드" value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="학교에서 안내받은 6자리 코드"/>{code === '123456' && <Card><Txt style={{ fontWeight: '700' }}>선린인터넷고등학교</Txt><Txt muted>학교 코드 조회 API가 없어 개발용 코드 123456으로 연결됩니다.</Txt></Card>}{code.length===6 && code!=='123456' && <Card><Txt>학교를 찾을 수 없어요. 개발용 코드 123456을 입력해 주세요.</Txt></Card>}<Button title="이 학교로 연결하기" disabled={code !== '123456'} onPress={next}/></>}
    {step === 4 && <><Txt style={{ fontSize: 26, fontWeight: '800' }}>어디에서 받으실래요?</Txt><Txt muted>간식이 도착하면 선택한 장소로 안내해요.</Txt>{places.map(x => <Card key={x} onPress={() => setPlace(x)} style={{ borderColor: x === place ? C.red : C.line, backgroundColor: x === place ? C.pale : C.white }}><Txt style={{ fontWeight: '700' }}>{x === place ? '◉' : '○'}  {x}</Txt></Card>)}<Button title="시작하기" onPress={done}/></>}
  </Screen>;
}
