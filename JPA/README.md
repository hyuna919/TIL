해당 자료는 인프런 강의 '자바 ORM 표준 JPA 프로그래밍 - 기본편'(김영한)를 보며 정리하였습니다.

1.5회차이며, 이전에 필요한 부분만 골라 들은 적이 있습니다.



## 잊지 않기
- em은 트랜잭션 단위로 생성된다.

### 강의들으면서 생긴 의문
- 트랜잭션 커밋시점
  나는 여태껏 트랜잭션을 직접 관리한 적이 없단 말이지?
  -> Spring Data JPA가 관리하고 있기 때문
  -> 찾아보니 @Transactional 의 커밋과 JPA 의 영속성 컨텍스트의 관계를 제대로 이해하지 못해서 문제 생기는 경우가 있는 듯.( https://velog.io/@giantim/5)
  -> ==Spring Data JPA에 대해서도 알아봐야겠다.==
 
  

### 알게된점
- 저장 함수

|함수|기능|리턴|
|---|---|---|
| persist()| insert | x |
| merge()| update | x |
| save() | insert, update | o |


