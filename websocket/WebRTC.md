### What is WebRTC?
- Web Real-Time Communication
- P2P
	- 서버의 역할이 컨텐츠 전송이 아니라 시그널링

### RTCPeerConnection이란?
WebRTC 호출을 수행하여 비디오/오디오를 스트리밍하고 데이터를 교환하기 위한 API이다.



![](https://raw.githubusercontent.com/satanas/simple-signaling-server/master/doc/RTCPeerConnection-diagram.png)
### 주의
- socket 속도가 워낙 빨라서 종속성 있는 작업을 그냥 수행하면 순서가 꼬일 수 있다.
### 용어
- offer
- description
- answer
- ICECandidate
	- Internet Connectivity Establishment : 인터넷 연결 생성
	- WebRTC에 필요한 프로토콜 for 멀리 떨어진 장치(브라우저)와의 소통
	- 어떤 소통 방법이 제일 좋은가


## WebRTC 요소
- RTCRtpSender: peer로 보내진 media stream track을 컨트롤하게 해줌
- DataChannel :  이미지, 파일, 패킷 등 더 다양한 데이터 전송 가능

### 유형

![[Pasted image 20221219221800.png]]