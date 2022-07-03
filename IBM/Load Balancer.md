## 필요상황
사이트 이용자가 굉장히 많은경우 -> 어플리케이션 서버를 포화시킬 수 있다


## 해결-서버확장
앱서버를 계속 수평적으로 확장하기 -> 그럼 ==로드밸런서==가 필요해진다.

## 로드밸런서
- 하드웨어 장치거나 소프트웨어 정의 장치일 수 있다.
- 고객과 앱서버 사이에 위치한다.
- 모든 트래픽을 가로챈다. -> 어떤 앱서버로 보낼지 결정 -> 정보 수집 가능 -> 동적+자동 확장 가능 -> 비용절감 가능
	- 정보 수집 : ex) 어떤 앱서버는 현재 20%만 사용되고 있다


## 시나리오
### 시나리오1(비교적 멍청한 LB)
- 라운드로빈 사용 : 사용자별 접속 시간이 다르기 때문에 비효율적
- LB가 모든 걸 통제

### 시나리오2(스마트 LB)
- 어플리케이션 서버 부하 인식 LB
- LB가 앱서버화 협력 : 앱서버는 지속적으로 자신이 얼마나 바쁜지 LB에 전달 -> LB는 그 정보에 따라 어디에 연결할 지 결정
- 더 좋지만 / 설정이 더 복잡함 / 더 비쌈
- 즉 더 좋은 LB가 늘 더 적합하지 않음

### 시나리오3(균형LB)
- 시나리오2만큼 구성을 복잡하게 하긴 싫지만 시나리오1보다는 똑똑했으면
- 선택 가능한 몇가지 알고리즘이 있음(이건 IBM제품 기준인듯?) -> 라운드로빈처럼 무조건 순차 아님
- 랜덤 배치라는 말을 하던데 이건 한쪽으로 몰리는걸 방지하기 위한 장치가 있는거겠지?(가중치같은..?)


## 의문점(댓글참고)
- 서버가 복제되면 DB랑 연결을 어떻게 하는가 -> 데이터를 다른 서버에 저장한다..?
- LB와 하이퍼바이저의 차이는 무엇인가 ->(내생각)대상 서버가 컨테이너냐 아니냐의 차이 아닐까?
- 하나의 서버는 10000개의 트래픽을 감당할 수 없는데 어떻게 하나의 LB는 그걸 감당하는가?
	- LB의 유일한 목적은 N개의 client에 대한 워크로드를 지원하는 M개의 서버간 활성 세션 수를 분배하는 것
	- LB자체는 세션 시작시에만 사용된다(일정한 중간지점이 아니다)



## 영상
https://www.youtube.com/watch?v=sCR3SAVdyCc&list=PLOspHqNVtKAA_5N3pI49wkH4WsTkeZ_iQ