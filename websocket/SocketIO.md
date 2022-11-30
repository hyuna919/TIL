##### 특징
- 실시간 기능 구현을 위해 ws를 사용한다.(ws의 부가기능 아님)
	- 만약 ws가 작동하지 않는다면 [[http long polling]]을 사용한다.
	- ws와 호환되지 않는다. -> 브라우저측에 설치를 해야한다.
		- -> html쪽에 /socket.io/socket.io.js 다운받는 코드 삽입
		- 클라이언트 코드에서는 `const socket = io();`해서 받기만 하면 된다.
- Object 전송 가능!
		- http 이용시 Object 전송이 안돼서 Json을 string으로 바꿔야했다.

