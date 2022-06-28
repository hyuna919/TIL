SQL 중심 개발의 문제

- SQL에 의존적인 개발을 피하기 어렵다
- 패러다임의 불일치 : 객체 vs 관계

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
      `member.getOrder(), member.getTeam()`
    - 하지만 처음 실행하는 sql에 따라 탐색 범위가 결정되는 문제 생김

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
