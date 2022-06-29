# SQL 중심 개발의 문제
- SQL에 의존적인 개발을 피하기 어렵다
- 패러다임의 불일치 : <span style="background-color:palevioletred">객체 vs 관계</span>
	- 차이 : 상속, 연관관계, 데이터 타입, 데이터 식별법
	- DB에 저장할 객체에는 상속 관계를 안쓰게 된다
		 ``` 
		 상속 쓴다면 일이 너무 번거롭다
		 1.각 테이블에 따른 join sql작성
		 2.각 객체 생성
		 3....
		 
		 ```
		 
	- 객체는 참조(단방향)를 사용, 테이블은 FK(양방향)를 사용
	- 엔티티 신뢰문제
		- 객체는 자유롭게 그래프를 탐색할 수 있어야한다. 
		    ```member.getOrder(), member.getTeam()```
		- 하지만 처음 실행하는 sql에  따라 탐색 범위가 결정되는 문제 생김
			``` 
			SELECT M.*, T.* 
			FROM Memeber M
			JOIN Team T On M.TEAM_ID = T.TEAM_ID

			-------------------------------------
			[o] member.getTeam()
			[x] member.getOrder()
			```
		- 따라서 해당 엔티티를 채우기 위해 실제로 어떤 sql이 실행되었는지 모르면 getter가 있더라도 신뢰할 수 없는 상황이 생긴다.
		- 그렇다고 모든 객체를 미리 로딩할 수도 없다.
		- 진정한 의미의 계층 분할이 어렵다
	- 비교문제
		```
		Member m1 = memberDAO.getMember(memberID);
		Member m2 = memberDAO.getMember(memberID);
		----------------------
		[x] m1 == m2
		```
		- 만약 자바 컬렉션에서 이런 작업을 했다면 비교 가능했을것.

- 객체답게 모델링할 수록 매핑이 어려워진다.


	<span style="background-color:olivedrab">olivedrab</span>
	<span style="background-color:palevioletred">palevioletred</span>
	<span style="background-color:peru">peru</span>

</br></br>
***
# JPA?
- Java Persistence API
- 자바 진영 **ORM** 기술 표준
	- Object-Relation Mapping
	- <span style="background-color:olivedrab">객체는 객체대로 설계 / RDB는 RDB 대로 설계 => ORM프레임워크가 중간에서 매핑</span>
- java와 jdbc 사이에서 동작

## 장점
- SQL중심 개발 -> 객체 중심 개발
- 생산성
- 유지보수
- 패러다임 불일치 해결
- 성능
- 데이터 접근 추상화와 벤더 독립성
- 표준


### 생산성
```
저장 : jpa.persist(member)
조회 : Member member = jpa.fine(id)
수정 : member.setName("변경할 이름")
삭제 : jpa.remove(member)
```

특히 **수정**같은 경우 기존의 'pk값을 이용한 업데이트' 명령을 할 필요 없이 setter로 해결이 가능해진다.
</br>

### 유지보수
기존 : 필드 변경 시 모든 sql의 필드명 수정해야함
jpa : 필드 추가만 하면 된다.
</br>

### 패러다임 불일치 해결
- 상속 문제
	- 상속을 받는 객체를 저장하려하면 JPA가 알아서 insert문 2개를 생성한다.
	- 조회할 때도 알아서 join해서 가져온다.
- 연관관계, 객체 그래프 탐색 가능 -> 엔티티 신뢰 가능
- 엔티티 비교 가능
</br>

### 성능 최적화
```
중간 처리 계층이 생기면 할 수 있는 일
- 버퍼링 : 모아서 쏘기
- 읽을 때 캐싱
```
- 1차 캐시와 동일성(identity) 보장
	- 같은 트랜잭션 안에서는 같은 엔티티 반환 -> 약간의 조회 성능 향상
		- 메서드가 쪼개지다 보면 같은 엔티티를 연달아 조회하는 일이 있다. -> 이럴때 JPA는 결과적으로 sql을 1번만 실행하게 된다.
		- 엄청 짧은 시간 안에서 일어나는 일이라 유의미한 효용을 보기는 어려움
	- (흐린눈)DB Isolation Level이 Read Commit이어도 / 애플리케이션에서 Repeatable Read보장
		

- 트랜잭션을 지원하는 쓰기 지연(INSERT)
	- 트랜잭션 커밋 할 때 까지  INSERT sql을 모음.
	- JDBC BATCH SQL 기능을 이용해 한번에 sql 전송
	```
	transaction.begin();
	
	em.persist(m1);
	em.persist(m2);
	em.persist(m3);
	// 아직 안보냄
	
	transaction.commit(); // 여기서 보낸다
	```
	
	
- 트랜잭션을 지원하는 쓰기 지연(UPDATE) -> 패스

- 지연 로딩과 즉시 로딩
	- 지연 로딩 : 객체가 실제 사용될 때 로딩
	- 즉시 로딩 : JOIN으로 한번에 연관된 객체까지 미리 조회
	
