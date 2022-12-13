##### 특징
- 실시간 기능 구현을 위해 ws를 사용한다.(ws의 부가기능 아님)
	- 만약 ws가 작동하지 않는다면 [[http long polling]]을 사용한다.
	- ws와 호환되지 않는다. -> 브라우저측에 설치를 해야한다.
		- -> html쪽에 /socket.io/socket.io.js 다운받는 코드 삽입
		- 클라이언트 코드에서는 `const socket = io();`해서 받기만 하면 된다.

- 전송 데이터 양식 보다 자유로워짐
	- Object 전송 가능!
		- http 이용시 Object 전송이 안돼서 Json을 string으로 바꿔야했다.
	- 인자 수 마음대로
	- Callback 지원(done에 주목)
		- 마지막 인자로 보내야한다.

```
// front
socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done");
  });
```

```
// server
ioServer.on("connection", (socket) => {
  socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 1000);
  });
});
```


### 자주 쓰이는 함수

**서버측**
```
const io = socketIO();

io.on("connection", (socket) => {
	// 발생한 이벤트 알려줌
	socket.onAny((event) => {
		console.log(`Socket Event: ${event}`);
	});
	
	// 이벤트 반응
	socket.on("이벤트 이름", (인자, 인자, ...) =>{
		...
	})
	
	// 입장
	socket.join(방이름);
	
	// 특정 방에 요청보내기
	socket.to(방이름).emit("이벤트")
	
	// 접속 중지 but 방에서 나가는 것 아님
	socket.on("disconnecting", (reason) => {
		...
	})
})
```

**프론트측**
```
const socket = io();

// socket.on() 등등
```


### Adapter
[공식문서](https://socket.io/docs/v4/adapter/) 에서 이미지 가져옴
![[Pasted image 20221212163403.png|400]]
![[Pasted image 20221212162547.png|400]]
![[Pasted image 20221212162554.png|400]]
![[Pasted image 20221212162602.png|400]]

클라이언트가 많을 것으로 예상되면 서버를 여러개 만들 수 있는데, 이 때 서버간에 연결해주는게 Adapter.
-> Adapter는 해당 서버의 모든 정보를 가지고 있어야한다. ( 모든 소켓ID, 방 목록 등)

Socket.IO에서는 Adapter를 레디스, 몽고DB, Postgres 등을 이용해 구현할 수 있다.  


### Admin UI