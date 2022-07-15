## 프로젝트 생성
- JAVA 8 이상
- 의존성 : JPA하이버네이트, 사용할 DB
- 영속성(Spring data jpa기준) : spring.datasource(연결할 DB정보), spring.jpa(jpa 설정)
- jpa 버전 : spring 사이트>project>spring boot>버전클릭>spring boot버전에 맞는 jpa버전 표가 있는 페이지로 이동


## 데이터베이스 방언(dialect)
- JPA는 특정 DB에 종속x
근데 각 DB가 제공하는 SQL문법과 함수가 조금씩 다름
- 방언 : SQL표준을 지키지 않는 특정 DB만의 고유 기능
ex) VARCHAR(MySQL) vs VARCHAR2(Oracle)

![image](https://user-images.githubusercontent.com/49274191/179122087-93695075-ff04-4eb8-9229-616307cca4cc.png)

## properties 괄련
### javax vs hibernate
- javax : 표준확장패키지
JPA는 그 자체가 어떤 표준을 이르는 말. -> hibernate가 아닌 JPA구현체를 다른 걸 써도 그대로 적용됨
- hibernate : hibernate에서만 사용하는 옵션

</br></br></br></br>

## JPA 구동 방식
![image](https://user-images.githubusercontent.com/49274191/179122078-5ce05afe-98aa-4fbe-b225-4e596926e894.png)
<일반 JAVA프로젝트에서 사용법(강의 기준)>
```
public static void main(String[] args){
	EntityManagerFactory emf = Persistence.createEntityManagerFactory("persistenceUnitName이름");
	EntityManager em = emf.createEntityManager();
	EntityTransaction tx = em.getTransaction();
	tx.begin();
	
	// code
	try {
		Member member = new Memeber(1L, "aaa");
		em.persist(member);
		tx.commit();
	}catch(Exception e){
		tx.rollback();
	}finally {
		em.close();
	}
	
	emf.close();
}
```
- EntityManagerFactory : 하나만 생성해서 애플리케이션 전체에서 공유
- EntityManager : 쓰래드간 공유x(사용하고 버려야)
- JPA의 모든 데이터 변경은 트랜잭션 안에서 실행


<Spring에서(따로 찾아봄)>
```
persistence파일 자체가 없다. cuz 자동으로 설정해주니까.
위의 과정 할 필요 없지만 테스트코드 등에서 사용하고 싶으면 @PersistenceContext를 사용한다.
핵심 코드정도만 써주면 된다.

Member member = new Memeber(1L, "aaa");
em.persist(member);
```


### 객체와 테이블 생성 및 매핑
```
@Entity
public class Member {
	@Id
	private Long id;
}
```
@Entity : JPA가 관리해야할 객체임을 알려줌
@ID : 데이터베이스 PK와 매핑 -> 공식적으로 Long 권장 (참고 : https://www.inflearn.com/questions/35759) -> primitive타입이면 0인지 null인지 구분이 어려워서
@Table : 객체명과 테이블 명이 다르면 따로 테이블 이름 지정 가능
@Column : 컬럼명 지정

### 사용
<저장>
```
Member member = new Memeber(id, "aaa");
em.persist(member);
```
<조회>
```
Member member = em.find(Memeber.class, id);
```
<삭제>
```
em.remove(id);
```
<수정> : 환상적
```
Member member = em.find(Memeber.class, id);
member.setName("bbb");
```
JPA를 이용해 가져온 객체는 JPA가 계속 관리함
-> 트랜잭션 commit시점에 변경여부 확인해서 같이 보냄
</br></br></br></br>

## JPQL(복잡한 조회)
- 등장배경
	- JPA는 테이블이 아닌 ==엔티티 객체를 대상==으로 쿼리문을 짠다.
	- 검색 시 모든 DB데이터를 객체로 변환하고 검색하는 건 불가능
	- 검색조건이 포함된 SQL필요
- 특징
	- JPA는 SQL을 추상화한 JPQL이라는 객체지향 쿼리 언어 제공
		- JPQL : 엔티티 객체가 대상
		- SQL : DB 테이블이 대상
	- SQL를 추상화하기 때문에 특정 DB SQL에 의존 x
</br>

<전체회원 조회>
```
em.createQuery("select m from Member as m", Member.class)
	.getResultList();
```

</br>

<+페이지네이션>
```
em.createQuery("select m from Member as m", Member.class)
	.setFirstResult(6);
	.setMaxResults(10);
	.getResultList();
```
