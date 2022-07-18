 # 개요
Docker는 애플리케이션 개발, 배송 및 실행을 위한 개방형 플랫폼입니다. Docker를 사용하면 애플리케이션을 인프라에서 분리하고 인프라를 관리되는 애플리케이션처럼 취급할 수 있습니다.

Docker는 커널 컨테이너화 기능을 애플리케이션 관리 및 배포에 도움이 되는 워크플로 및 도구와 결합하여 이를 수행합니다.

Docker 컨테이너는 Kubernetes에서 직접 사용할 수 있으므로 Kubernetes Engine에서 쉽게 실행할 수 있습니다.

</br>

## 학습내용
-   Docker 컨테이너를 빌드, 실행 및 디버그하는 방법입니다.
-   Docker Hub 및 Google Container Registry에서 Docker 이미지를 가져오는 방법.
-   Docker 이미지를 Google Container Registry에 푸시하는 방법.

</br></br>

# 설정
- 활성 계정 이름 나열
```
gcloud auth list
```

- 프로젝트 ID 나열
```
gcloud config list project
```

## 실행
### Dockerfile
```
cat > Dockerfile <<EOF
# Use an official Node runtime as the parent image
# 공식 노드 런타임을 상위 이미지로 사용
FROM node:lts
# Set the working directory in the container to /app
# 컨테이너의 작업 디렉터리를 /app으로 설정
WORKDIR /app
# Copy the current directory contents into the container at /app
# 현재 디렉터리 내용을 /app에 있는 컨테이너로 복사합니다.
ADD . /app
# Make the container's port 80 available to the outside world
# 컨테이너의 포트 80을 외부 세계에서 사용할 수 있도록 합니다.
EXPOSE 80
# Run app.js using node when the container launches
# 컨테이너가 실행될 때 node를 사용하여 app.js를 실행합니다.
CMD ["node", "app.js"]
EOF
```

### 실행용 node 파일
이것은 포트 80에서 수신 대기하고 "Hello World"를 반환하는 간단한 HTTP 서버입니다.
```
cat > app.js <<EOF
const http = require('http');
const hostname = '0.0.0.0';
const port = 80;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
server.listen(port, hostname, () => {
    console.log('Server running at http://%s:%s/', hostname, port);
});
process.on('SIGINT', function() {
    console.log('Caught interrupt signal and will exit');
    process.exit();
});
EOF
```


## 디버그
### docker exec -it
```
docker exec -it [container_id] bash
```
플래그를 사용 `-it`하면 의사 tty를 할당하고 표준 입력을 열린 상태로 유지하여 컨테이너와 상호 작용할 수 있습니다. bash는 에 `WORKDIR`지정된 디렉토리(/app) 에서 실행되었습니다 `Dockerfile`. 여기에서 컨테이너 내부에 디버그할 대화형 셸 세션이 있습니다.


### 컨테이너의 메타데이터 검사
```
docker inspect [container_id]
```

특정 필드만 보고싶다면
```
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' [container_id]
```


## Publishing
이제 이미지를 [Google Container Registry](https://cloud.google.com/container-registry/) (gcr)에 푸시합니다.
gcr에서 호스팅하는 비공개 레지스트리에 이미지를 푸시하려면 이미지에 레지스트리 이름을 태그해야 합니다. 형식은 `[hostname]/[project-id]/[image]:[tag]`
