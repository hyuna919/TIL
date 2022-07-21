## 개요
여러 이기종 배포가 사용되는 이러한 일반적인 시나리오를 수행할 수 있도록 컨테이너 확장 및 관리에 대한 실습
- Continuous Deployment
- Blue-Green Deployments"
- Canary Deployments


## 배포 소개
이기종 배포에는 일반적으로 둘 이상의 인프라 환경 또는 지역을 연결하는 작업이 포함된다.
세부사항에 따라 아래와 같이 구분된다.
- 단일 클라우드환경
- 멀티 클라우드 : 여러 퍼블릭 클라우드
- 하이브리드, 퍼블릭-프라이빗 : 온프레미스와 퍼블릭 클라우드 조합

### 단일 환경에서의 기술 문제
-   **최대 리소스** : 모든 단일 환경, 특히 온프레미스 환경에서는 프로덕션 요구 사항을 충족하는 컴퓨팅, 네트워킹 및 스토리지 ==리소스가 없을 수== 있습니다.
-   **제한된 지리적 범위** : 단일 환경에 배포하려면 지리적으로 멀리 떨어져 있는 사람들이 하나의 배포에 액세스해야 합니다. ==트래픽은 전 세계의 중앙 위치로 이동==할 수 있습니다.
-   **제한된 가용성** : 웹 규모의 트래픽 패턴은 애플리케이션이 내결함성과 탄력성을 유지하도록 요구합니다.
-   **공급업체 종속** : 공급업체 수준 플랫폼 및 인프라 추상화로 인해 애플리케이션을 이식할 수 없습니다.
-   **유연하지 않은 리소스** : 리소스가 특정 컴퓨팅, 스토리지 또는 네트워킹 오퍼링 세트로 제한될 수 있습니다. 

### 이기종 배포
좋은 배포 프로세스는 반복 가능해야 하며 프로비저닝, 구성 및 유지 관리를 위해 입증된 접근 방식을 사용해야 합니다.
일회성 또는 임시 배포 절차로 인해 배포 또는 프로세스가 취약해지고 실패를 용납하지 않을 수 있습니다. 임시 프로세스는 데이터를 손실하거나 트래픽을 삭제할 수 있습니다.

이기종 배포에 대한 세 가지 일반적인 시나리오
- 다중 클라우드 배포
- 온프레미스 데이터 프론팅 및 CI/CD(지속적 통합/지속적 전달) 프로세스


# 실습

영역설정+샘플코드+5개의 노드가 있는 클러스터 생성
```
gcloud config set compute/zone us-central1-a

gsutil -m cp -r gs://spls/gsp053/orchestrate-with-kubernetes .
cd orchestrate-with-kubernetes/kubernetes

gcloud container clusters create bootcamp --num-nodes 5 --scopes "https://www.googleapis.com/auth/projecthosting,storage-rw"
```


## explain 명령으로 Deployment 개체 확인하기
- Deployment 살펴보기
  ```
  kubectl explain deployment
   ```
- +모든 필드 확인
  ```
  kubectl explain deployment --recursive
   ```
- +개별 필드가 수행하는 작업 확인
  ```
  kubectl explain deployment.metadata.name
   ```

## Deployment 생성
인증 배포를 생성하기 위해 `kubectl create`명령을 실행하면 배포 매니페스트의 데이터를 준수하는 하나의 포드가 생성됩니다. 이는 `replicas`필드에 지정된 수를 변경하여 파드 수를 확장할 수 있음을 의미합니다.

03일차 분량과 동일하게 kubectl create진행됨
```
kubectl create -f deployments/auth.yaml
kubectl get deployments
kubectl get replicasets  // 배포용 replicaSet 생성 확인
...
```

`kubectl get services`로 알아내야하는 EXTERNAL-IP를 자동으로 사용하기
```
curl -ks https://`kubectl get svc frontend -o=jsonpath="{.status.loadBalancer.ingress[0].ip}"`
```

</br>


## 배포 확장

`spec.replicas`필드를 설명
```
kubectl explain deployment.spec.replicas
```


`spec.replicas`필드를 업데이트하여 배포 확장하기
```
kubectl scale deployment hello --replicas=5
```
   배포가 업데이트되면 Kubernetes는 연결된 ReplicaSet을 자동으로 업데이트하고 새 Pod를 시작하여 총 Pod 수가 5가 된다.

5개의 Pod가 실행 중인지 확인
```
kubectl get pods | grep hello- | wc -l
```



## 롤링 업데이트
배포는 롤링 업데이트 메커니즘을 통해 ==이미지를 새 버전으로 업데이트==하는 것을 지원한다.
Deployment가 새 버전으로 업데이트되면 새 ReplicaSet을 생성하고 이전 ReplicaSet의 복제본이 감소함에 따라 ==새 ReplicaSet의 복제본 수를 천천히 늘립==니다.

![Pasted image 20220721083750](https://user-images.githubusercontent.com/49274191/180126154-383ccd60-1b60-4d36-ba1d-af45212538f5.png)


### 롤링 업데이트 트리거
배포 업데이트->편집기로 전환->저장하고 종료하면 자동으로 K8s가 롤링 업데이트 시작
```
kubectl edit deployment hello
```

새로운 ReplicaSet 확인
```
kubectl get replicaset
```

roll out 기록
```
kubectl rollout history deployment/hello
```


### 롤링 업데이트 일시 중지
일시 중지
```
kubectl rollout pause deployment/hello
```

rollout 상태 확인
```
kubectl rollout status deployment/hello
```

rollout 상태 확인(Pod에서 직접)
```
kubectl get pods -o jsonpath --template='{range .items[*]}{.metadata.name}{"\t"}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
```


### 롤링 업데이트 재개
```
kubectl rollout resume deployment/hello
```
롤아웃 완료 확인
```
kubectl rollout status deployment/hello
```



### 업데이트 롤백
새 버전에서 문제 감지 -> 이전 버전으로 롤백
```
kubectl rollout undo deployment/hello
```

롤백 확인
```
kubectl rollout history deployment/hello
```

모든 Pod에서 롤백되었는지 확인
```
kubectl get pods -o jsonpath --template='{range .items[*]}{.metadata.name}{"\t"}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
```


## 카나리아 배포
사용자의 하위 집합을 사용하여 프로덕션에서 새 배포를 테스트하려는 경우.
Canary 배포를 사용하면 소규모 사용자 하위 집합에 대한 변경 사항을 릴리스하여 새 릴리스와 관련된 위험을 완화할 수 있다.

![Pasted image 20220721084531](https://user-images.githubusercontent.com/49274191/180126185-317739da-e680-49c5-9ce6-365e431e6d4b.png)
카나리아 배포는 새 버전이 포함된 별도의 배포와 정상적인 안정적인 배포와 카나리아 배포를 모두 대상으로 하는 서비스로 구성됩니다.

`hello`서비스에서 선택기는 제품 배포 및 카나리아 배포 모두에서 포드와 일치하는 선택기 를 사용 **합니다**`app:hello` . 그러나 카나리아 배포에는 포드 수가 적기 때문에 더 적은 수의 사용자에게 표시됩니다.


### 카나리아 배포 - 세션 선호도
사용자가 Canary 배포를 통해 서비스를 받지 않도록 하려면
- 응용 프로그램의 UI가 변경되어 사용자를 혼란스럽게 하고 싶지 않은 경우
- 사용자가 한 배포 또는 다른 배포를 "고정"하기를 원합니다.

동일한 사용자가 항상 동일한 버전에서 서비스를 받게 된다.
- yaml파일에서 새로운 `sessionAffinity`필드가 추가되어 ClientIP로 설정
	- 동일한 IP 주소를 가진 모든 클라이언트는 동일한 버전의 `hello`애플리케이션으로 요청을 보내게 된다.


## 블루-그린 배포
롤링 업데이트는 아래의 장접 취하면서 천천히 배포할 수 있어서 이상적
- 오버헤드 최소화
- 성능에 미치는 영향 최소화
- 가동 중지 시간 최소화

하지만 `새 버전이 완전히 배포된 후에만 새 버전 가리키도록 로드밸러서를 수정`하는 것이 유리한 경우가 있다. -> 블루-그린배포 사용

![Pasted image 20220721085228](https://user-images.githubusercontent.com/49274191/180126215-fc284cd4-f35a-4fc3-b35d-1f8f5ac936c9.png)

Kubernetes는 두 개의 개별 배포를 생성하여 이를 달성합니다. 하나는 이전 "파란색" 버전용이고 다른 하나는 새 "녹색" 버전용입니다. 
- "파란색" 버전 : 기존 배포
  배포는 라우터 역할을 하는 서비스를 통해 액세스됩니다. 
- 새로운 "그린" 버전이 실행되고 나면 서비스를 업데이트하여 해당 버전을 사용하도록 전환합니다.

단점
- 애플리케이션을 호스팅하는 데 필요한 클러스터에 최소 2배의 리소스가 필요

