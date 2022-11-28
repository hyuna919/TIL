## 개요
Google Kubernetes Engine은 컨테이너화된 애플리케이션을 배포, 관리, 확장하기 위한 관리형 환경 제공.
이번 실습에서는 GKE를 이용한 `컨테이너 생성 및 애플리케이션 배포를 실습`합니다.

<GKE의 영역 클러스터에 대한 아키텍처 개요>
![image](https://user-images.githubusercontent.com/49274191/179635708-7f538158-8a28-4972-ada2-eb84ca24918b.png)


### Google Kubernetes Engine을 사용한 클러스터 오케스트레이션
GKE는 Kubernetes 오픈소스 클러스터 관리 스시템을 기반으로 합니다.
Kubernetes는 컨테이너 클러스터와 상호작용하는 메커니즘을 제공합니다.
- 애플리케이션 배포 및 관리
- 관리 작업
- 정책 설정
- 배포된 워크로드의 상태 모니터링
- 자동 확장
- 롤링 업데이트( 파드 인스턴스를 점진적으로 새로운 것으로 _업데이트_하여 디플로이먼트 _업데이트_가 서비스 중단 없이 이루어질 수 있도록 해준다.)

### Google Cloud의 Kubernetes
GCP가 제공하는 고급 클러스터 관리 기능
-   Compute Engine 인스턴스의 [부하 분산](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling)
-   추가 유연성을 위해 클러스터 내에서 노드의 하위 집합을 지정하는 [노드 풀](https://cloud.google.com/kubernetes-engine/docs/node-pools)
-   클러스터의 노드 인스턴스 수 [자동 조정](https://cloud.google.com/kubernetes-engine/docs/cluster-autoscaler)
-   클러스터의 노드 소프트웨어에 대한 [자동 업그레이드](https://cloud.google.com/kubernetes-engine/docs/node-auto-upgrade)
-   노드 상태 및 가용성을 유지하기 위한 [노드 자동 복구](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-repair)
-   클러스터에 대한 가시성을 위한 Cloud Monitoring으로 [로깅 및 모니터링](https://cloud.google.com/kubernetes-engine/docs/how-to/logging)



## Task 1. 기본 컴퓨팅 영역 설정
[컴퓨팅 영역](https://cloud.google.com/compute/docs/regions-zones/#available) 은 클러스터와 해당 리소스가 있는 대략적인 지역 위치입니다.
**기본 컴퓨팅 영역** 을 로 설정 하려면 Cloud Shell에서 새 세션을 시작하고 다음 명령어를 실행합니다
```
gcloud config set compute/zone [지역명]
```

## Task 2. GKE 클러스터 만들기
[클러스터](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture) 는 하나 이상의 **클러스터 마스터** 시스템과 **노드** 라고 하는 여러 작업자 시스템으로 구성됩니다 . 노드는  [Compute Engine 가상 머신(VM) 인스턴스 입니다.](https://cloud.google.com/compute/docs/instances/)(클러스터의 일부로 만드는 데 필요한 Kubernetes 프로세스를 실행하는)

클러스터 생성
```
gcloud container clusters create [CLUSTER-NAME]
```

CLUSTER-NAME 명명규칙
```
1. 문자로 시작
2. 영문||숫자로 끝남
3. 40자 이하
```


## Task 3. 클러스터에 대한 인증 자격 증명 가져오기
클러스터를 만든 후 클러스터와 상호 작용하려면 인증 자격 증명이 필요하다.

클러스터 인증
```
gcloud container clusters get-credentials [CLUSTER-NAME]
```


## Task 4. 클러스터에 애플리케이션 배포
GKE는 Kubernetes 객체를 사용하여 클러스터의 리소스를 만들고 관리합니다.

GKE는 Kubernetes 객체를 사용하여 클러스터의 리소스를 만들고 관리합니다. Kubernetes는 웹 서버와 같은 상태 비저장 애플리케이션을 배포하기 위한 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) 개체를 제공합니다. [서비스](https://kubernetes.io/docs/concepts/services-networking/service/) 객체는 인터넷에서 애플리케이션에 액세스하기 위한 규칙과 로드 밸런싱을 정의합니다.

</br>

1. `hello-app`컨테이너 이미지에서 `hello-server`라는 Deployment를 만들기

```
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
```
- --image : 배포할 컨테이너 이미지 지정
- gcr.io/google-samples/hello-app:1.0 :  [Container Registry](https://cloud.google.com/container-registry/docs) 버킷에서 예시 이미지를 가져옴

</br>

2.  Kubernetes 서비스 생성
   Kubernetes 서비스 : 애플리케이션을 외부 트래픽에 노출해주는 k8s리소스
   ```
   kubectl expose deployment hello-server --type=LoadBalancer --port 8080
```
- --port : 컨테이너 노출 포트 지정
- --type=LoadBalancer : 컨테이너에 대한 Compute Engine LB생성

</br>

3.  서비스 검사
   ```
   kubectl get service
```
출력(저기에 나오는 EXTERNAL-IP사용하면 접근 가능)
![image](https://user-images.githubusercontent.com/49274191/179635563-94e7248d-ad24-40c3-99d5-49c5bf2dc533.png)

</br>

4. http://[EXTERNAL-IP]:8080 확인해보기

</br>

## Task 5. 클러스터 삭제
```
gcloud container clusters delete [CLUSTER-NAME]
```
