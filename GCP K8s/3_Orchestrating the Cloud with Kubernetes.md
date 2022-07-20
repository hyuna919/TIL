## 개요
- [Kubernetes Engine](https://cloud.google.com/container-engine) 을 사용하여 완전한 [Kubernetes](http://kubernetes.io/) 클러스터를 프로비저닝합니다.
- kubectl을 이용해 Docker 컨테이너를 배포하고 관리
- Kubernetes의 배포 및 서비스를 사용하여 애플리케이션을 마이크로서비스로 나눕니다.

이 실습에서 Kubernetes Engine과 같은 관리형 환경을 사용하면 기본 인프라를 설정하는 대신 Kubernetes 경험에 집중할 수 있습니다

</br>

## 사전 설정
```
gcloud config set compute/zone us-central1-b
gcloud container clusters create io
```

</br>

## Task 1. Get the sample code
![image](https://user-images.githubusercontent.com/49274191/180096698-bf884a4d-c89f-4960-a0d2-8dc673ca96f2.png)
```
gsutil cp -r gs://spls/gsp021/* .
cd orchestrate-with-kubernetes/kubernetes
ls
```

</br>

## Task 2. Quick Kubernetes Demo
1. Deployment 생성
```
kubectl create deployment nginx --image=nginx:1.10.0
```
- 배포가 실행되는 노드가 실패하더라도 Deployment가 pods을 계속 실행
- Kubernetes에서 모든 컨테이너는 포드에서 실행됩니다.

</br>

2. 실행 중인 nginx 컨테이너 확인
```
kubectl get pods
```

</br>

3. 2에서 status가 Runnung이면 expose 가능
```
kubectl expose deployment nginx --port 80 --type LoadBalancer
```
- Kubernetes는 공개 IP 주소가 연결된 외부 로드 밸런서를 생성했습니다. 
- 해당 공용 IP 주소에 도달한 모든 클라이언트는 서비스 뒤의 포드로 라우팅됩니다. 이 경우 nginx 포드가 됩니다.

</br>

4.  서비스 목록 확인
```
kubectl get services
```

</br>

5. nginx 컨테이너를 원격으로
```
curl http://<External IP>:80
```

</br>

## Task 3. Pods
![image](https://user-images.githubusercontent.com/49274191/180096733-b149dda4-9046-40ff-b87d-1c06d491d97d.png)
- Pod는 하나 이상의 컨테이너 컬렉션을 나타내고 보유한다.
- 일반적으로 서로에 대한 종속성이 강한 여러 컨테이너가 있는 경우 컨테이너를 단일 포드 안에 패키징한다.

Volumes
- 볼륨은 포드가 살아있는 동안 지속되는 데이터 디스크
- 해당 포드의 컨테이너에서 사용할 수 있다.
- 포드는 콘텐츠에 대한 공유 네임스페이스를 제공한다.
- 예제 포드 내부의 두 컨테이너는 서로 통신할 수 있으며 연결된 볼륨도 공유할 수 있다.

Network Namespace
- 네트워크 네임스페이스를 공유한다.
- 이는 포드당 하나의 IP 주소가 있음을 의미

</br>

## Task 4. Creating pods
pod는 pod구성파일을 사용해 생성할 수 있다.
1. pods 구성 파일 확인
   ```
   cat pods/monolith.yaml
   ```
   -   포드는 하나의 컨테이너(모놀리스)로 구성됩니다.
    -   컨테이너가 시작될 때 몇 가지 인수를 컨테이너에 전달합니다.
    -   http 트래픽을 위해 포트 80을 여는 중입니다.

</br>

2. pod 만들기
   ```
   kubectl create -f pods/monolith.yaml
   ```
   
</br>

3. pod 목록
   ```
   kubectl get pods
   ```
   
</br>

4. pod에 대한 상세
   ```
   kubectl describe pods monolith
   ```
	- Pod IP 주소 및 이벤트 로그를 포함하여 모놀리스 Pod에 대한 많은 정보를 볼 수 있습니다. 이 정보는 문제를 해결할 때 유용합니다.

Kubernetes를 사용하면 구성 파일에 설명하여 포드를 쉽게 생성하고 실행 중일 때 이에 대한 정보를 쉽게 볼 수 있습니다. 이 시점에서 배포에 필요한 모든 포드를 생성할 수 있습니다!
</br>

   
</br>

## Task 5. Interacting with pods
기본적으로 포드에는 사설 IP 주소가 할당되며 클러스터 외부에서 연결할 수 없습니다. 
`kubectl port-forward` 명령을 사용하여 로컬 포트를 모놀리스 포드 내부의 포트에 매핑합니다.

1. port-forwarding 설정
   ```
   kubectl port-forward monolith 10080:80
   ```
2. pod와 통신
   ```
   curl http://127.0.0.1:10080
   ```

3. 해당 프로젝트에 로그인하고 토큰받는 처리~
   ```
   // Cloud Shell은 긴 문자열 복사를 잘 처리하지 못하므로 토큰에 대한 환경 변수를 만듭니다.
   TOKEN=$(curl http://127.0.0.1:10080/login -u user|jq -r '.token')  

   // 환경변수 이용해서 로그인
   curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:10080/secure
   ```
4. 실시간 log 스트림
   ```
   kubectl logs -f monolith
   ```
5. pod 내에서 대화형 셸 실행
   ```
   kubectl exec monolith --stdin --tty -c monolith -- /bin/sh
   
   // 외부연결테스트
   ping -c 3 google.com

   ```

</br>

## Task 6. Services
![image](https://user-images.githubusercontent.com/49274191/180096758-156435fc-5224-44eb-b599-6d8daded9580.png)
서비스는 Pod에 안정적인 엔드포인트를 제공합니다.
why?
- 포드는 영구적이지 않습니다.활성 상태 또는 준비 상태 확인 실패와 같은 여러 가지 이유로 중지되거나 시작될 수 있으며 이로 인해 문제가 발생합니다.
- Pod 집합과 통신하려는 경우 어떻게 됩니까? 다시 시작할 때 다른 IP 주소를 가질 수 있습니다.

label
- 서비스는 레이블을 사용하여 작동하는 Pod를 결정한다.
- Pod에 올바른 레이블이 있으면 자동으로 선택되어 서비스에 노출된다.

Service's type
서비스가 포드 세트에 제공하는 액세스 수준은 서비스 유형에 따라 다릅니다. 현재 세 가지 유형이 있습니다.
-   `ClusterIP`(내부) -- 기본 유형은 이 서비스가 클러스터 내부에서만 볼 수 있음을 의미합니다.
-   `NodePort`클러스터의 각 노드에 외부에서 액세스할 수 있는 IP를 제공하고
-   `LoadBalancer`서비스에서 서비스 내의 노드로 트래픽을 전달하는 클라우드 공급자의 로드 밸런서를 추가합니다.

</br>

## Task 7. Creating a service
### https 트래픽 처리 위한 보안 포드 생성
```
kubectl create secret generic tls-certs --from-file tls/
kubectl create configmap nginx-proxy-conf --from-file nginx/proxy.conf
kubectl create -f pods/secure-monolith.yaml
```

### 서비스 설정파일
![Pasted image 20220720084413](https://user-images.githubusercontent.com/49274191/180096820-6f385f9f-c844-4acb-8c96-31ba6c174a69.png)
-   `app: monolith`및 레이블이 있는 모든 포드를 자동으로 찾고 노출하는 데 사용되는 선택기가 있습니다 `secure: enabled`.
-   이제 포트 31000에서 nginx(포트 443에서)로 외부 트래픽을 전달하는 방법이므로 여기에서 노드 포트를 노출해야 합니다.


### 서비스 생성
```
kubectl create -f services/monolith.yaml
```
포트를 사용하여 서비스를 노출하고 있습니다. 즉, 다른 앱이 서버 중 하나의 포트 31000에 바인딩하려고 하면 포트 충돌이 발생할 수 있습니다.

일반적으로 Kubernetes는 이 포트 할당을 처리합니다. 이 실습에서는 나중에 상태 확인을 더 쉽게 구성할 수 있도록 포트를 선택했습니다.


### 트래픽 허용
```
gcloud compute firewall-rules create allow-monolith-nodeport \
  --allow=tcp:31000
```

### 테스트
1. 노드 중 하나의 expose ip 가져와서 요청보내기
   ```
   gcloud compute instances list
   curl -k https://<EXTERNAL_IP>:31000
   ```
2. 1에서 시간초과 시 아래 질문 확인하고 다음 섹션에서 문제 해결
   ```
   `kubectl get services monolith`
   ```
   ![Pasted image 20220720085102](https://user-images.githubusercontent.com/49274191/180096923-4e44f92d-a46e-4545-ad34-7919bc15a0ab.png)
   ```
   `kubectl describe services monolith`
   ```
   ![Pasted image 20220720085125](https://user-images.githubusercontent.com/49274191/180097019-faef9513-85d3-4683-be1d-04df92ceb9cc.png)
   -   모노리스 서비스에서 응답을 받을 수 없는 이유는 무엇입니까?
   -   모놀리스 서비스에는 몇 개의 엔드포인트가 있습니까?
   -   모놀리스 서비스에서 Pod가 선택해야 하는 레이블은 무엇인가요?
</br>

## Task 8. Adding labels to pods
현재 모놀리스 서비스에는 endpoint가 없습니다.
이와 같은 문제를 해결하는 한 가지 방법은 레이블 쿼리와 함께 `kubectl get pods`명령을 사용하는 것입니다.

1.  모놀리스 레이블로 실행 중인 포드가 꽤 있음을 알 수 있습니다.
   ```
   kubectl get pods -l "app=monolith"
   ```
   
2.  그러나 "app=monolith" 및 "secure=enabled"는 어떻습니까?
   ```
   kubectl get pods -l "app=monolith,secure=enabled"
   ```
이 레이블 쿼리는 결과를 인쇄하지 않습니다. "secure=enabled" 레이블을 추가해야 할 것 같습니다.

3.  명령을 사용 하여 보안 모노리스 Pod에 `kubectl label`누락된 레이블을 추가합니다 . `secure=enabled`그런 다음 레이블이 업데이트되었는지 확인할 수 있습니다.
   ```
   kubectl label pods secure-monolith 'secure=enabled'
   kubectl get pods secure-monolith --show-labels
   ```


4.  이제 팟(Pod)에 올바르게 레이블이 지정되었으므로 모놀리스 서비스에서 엔드포인트 목록을 확인하십시오.
   ```
   kubectl describe services monolith | grep Endpoints
   ```
![Pasted image 20220720085629](https://user-images.githubusercontent.com/49274191/180097083-05e83438-c4a4-40f5-ac80-4a5fac375aab.png)

5.  노드 중 하나를 다시 눌러 이것을 테스트하십시오.
   ```
   gcloud compute instances list
   curl -k https://<EXTERNAL_IP>:31000
   ```

</br>

## Task 9. Deploying applications with Kubernetes
![image](https://user-images.githubusercontent.com/49274191/180097121-80524305-02a8-49be-83c5-fb6762afc6f5.png)
배포는 실행 중인 Pod 수가 사용자가 지정한 원하는 Pod 수와 동일하도록 하는 선언적 방법입니다.

배포의 주요 이점은 Pod 관리의 낮은 수준 세부 정보를 추상화한다는 것입니다. 배후에서 배포는 [복제본 세트](http://kubernetes.io/docs/user-guide/replicasets/) 를 사용하여 Pod 시작 및 중지를 관리합니다. Pod를 업데이트하거나 확장해야 하는 경우 배포에서 처리합니다. 어떤 이유로 인해 중단된 경우 배포에서 Pod 다시 시작도 처리합니다.

### 예제
![image](https://user-images.githubusercontent.com/49274191/180097126-7d879c9c-a17e-4b8a-aa6b-0c460504281d.png)

Pod는 생성된 노드의 수명과 연결됩니다. 위의 예에서 Node3이 다운되었습니다(Pod와 함께 사용). 새 포드를 수동으로 생성하고 이에 대한 노드를 찾는 대신 배포에서 새 포드를 생성하고 Node2에서 시작했습니다.

</br>

## Task 10. Creating deployments
모놀리스 앱을 세 개의 개별 조각으로 나눕니다.

-   **auth** - 인증된 사용자에 대한 JWT 토큰을 생성합니다.
-   **안녕하세요** - 인증된 사용자를 환영합니다.
-   **프론트엔드** - auth 및 hello 서비스로 트래픽을 라우팅합니다.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth
spec:
  selector:
    matchlabels:
      app: auth
  replicas: 1
  template:
    metadata:
      labels:
        app: auth
        track: stable
    spec:
      containers:
        - name: auth
          image: "kelseyhightower/auth:2.0.0"
          ports:
            - name: http
              containerPort: 80
            - name: health
              containerPort: 81
```

배포에서 1개의 복제본이 생성되고 인증 컨테이너 버전 2.0.0을 사용하고 있습니다.

인증 배포를 생성하기 위해 명령을 실행하면 `kubectl create`배포 매니페스트의 데이터를 준수하는 하나의 포드가 생성됩니다. 즉, Replicas 필드에 지정된 수를 변경하여 Pod 수를 확장할 수 있습니다.


1. Deployment +service 만들기
   ```
   kubectl create -f deployments/auth.yaml
   kubectl create -f services/auth.yaml
   
   kubectl create -f deployments/hello.yaml
   kubectl create -f services/hello.yaml
   
   kubectl create configmap nginx-frontend-conf --from-file=nginx/frontend.conf
   kubectl create -f deployments/frontend.yaml
   kubectl create -f services/frontend.yaml
   ```

2. 외부 IP를 가져온 다음 컬링하여 프런트엔드와 상호 작용합니다.
   ```
   kubectl get services frontend
   curl -k https://<EXTERNAL-IP>
   ```







