DNS : 도메인이름 -(라우팅)-> IP Address
Domain : 웹페이지에 입력하는 모든 텍스트 문자열 ex) ibm.com
IP Address : 4단위 숫자 ex)111.11.11.111

## DNS 중요 구성
DNS Resolver : 전화번호부 역할

## DNS Loockup
![image](https://user-images.githubusercontent.com/49274191/177225830-7f15827e-ed98-4503-a0ce-1b2e1214cf8a.png)
|단계|위치|내용|
|-|---|---|
|1|사용자|웹브라우저에는 캐시메모리가 있다.|
|||캐시메모리에 내가 찾는 IP가 없으면 요청을 DNS Resolver로 보낸다|
|2|DNS Resolver|에도 자체 캐시가 있음|
|||여기에도 IP가 없으면 요청을 루트 서버로 라우팅|
|3|루트서버|DNS 계층구조 최상위|
|||루트서버는 세계 여러곳에 있다.|
|||여기에도 IP가 없으면 최상위 DNS서버의 IP를 얻는다.|
|||이제 TLD서버로 요청 보냄|
|4|TLD|Top Level Domain|
|||ex) .com .net|
|||나는 니가 원하는 IP주소는 없지만 Authoritative Nameserver로 요청을 보낼 수 있어|
|5|Authoritative Nameserver||
|||우리가 찾는 특정 IP주소 반환|
|6|DNS Resolver|캐시에 저장+웹브라우저로 전송|
|7|사용자(웹브라우저)|받은 IP주소가 가르키는 웹서버에 요청보내기|
|8|웹서버|웹페이지 표시에 필요한 모든 콘텐츠 존재|
|||콘텐츠 랜더링해서 반환|


### 루트 네임서버
[원문](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/)
참고로, 루트 네임서버는 13개가 있는데, 이는 루트 네임서버 시스템에 13대의 컴퓨터만 있다는 의미는 아닙니다. 13가지 유형의 루트 네임서버가 있지만 전 세계에 각각의 사본이 다수 있으며, Anycast 라우팅을 사용하여 빠른 응답을 제공합니다. 루트 네임서버의 모든 인스턴스를 더한다면, 전체 서버 수는 632개입니다

# 영상
https://www.youtube.com/watch?v=nyH0nYhMW9M&list=PLOspHqNVtKAA_5N3pI49wkH4WsTkeZ_iQ&index=2
