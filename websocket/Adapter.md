[공식문서](https://socket.io/docs/v4/adapter/) 에서 이미지 가져옴
![[Pasted image 20221212163403.png|400]]
![[Pasted image 20221212162547.png|400]]
![[Pasted image 20221212162554.png|400]]
![[Pasted image 20221212162602.png|400]]

클라이언트가 많을 것으로 예상되면 서버를 여러개 만들 수 있는데, 이 때 서버간에 연결해주는게 Adapter.
-> Adapter는 해당 서버의 모든 정보를 가지고 있어야한다. ( 모든 소켓ID, 방 목록 등)

Socket.IO에서는 Adapter를 레디스, 몽고DB, Postgres 등을 이용해 구현할 수 있다.  