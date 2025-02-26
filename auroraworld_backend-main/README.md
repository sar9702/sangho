## 설치 및 실행 방법

### 1. 프로젝트 클론
```bash
git clone https://github.com/ktkdgh-projects/auroraworld_backend.git
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정
```bash
SECRET_KEY=
DEBUG=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

```
.env 파일을 열어 각 환경 변수 값을 작성해주세요.

### 4. 데이터베이스 설정
```bash
python manage.py migrate
```

### 서버 실행
```bash
python manage.py runserver
```
이제 서버를 실행할 준비가 되었습니다.

```bash
http://localhost:8000 
```

## API 명세서

### 1. 사용자 인증 관련 API & 기본 URL: `api/auth/`

#### 1.1. 사용자 등록
- **URL**: `/register/`
- **메소드**: `POST`
- **설명**: 새로운 사용자를 등록합니다.
    ```json
    // 요청
    {
        "username": "new_user",
        "password": "password"
    }
    ```
    ```json
    // 응답
    {
       "message": "회원가입이 성공적으로 처리되었습니다."
    }
    ```

#### 1.2. 사용자 로그인
- **URL**: `/login/`
- **메소드**: `POST`
- **설명**: 사용자 로그인 및 JWT 토큰 발급.
    ```json
    // 요청
    {
        "username": "new_user",
        "password": "password123"
    }
    ```
    ```json
    // 응답
    {
        "access_token": "JWT_ACCESS_TOKEN",
        "refresh_token": "JWT_REFRESH_TOKEN"
    }
    ```


#### 1.3. 사용자 로그아웃
- **URL**: `/logout/`
- **메소드**: `POST`
- **설명**: 로그아웃 후 토큰 무효화.
    ```json
    // 요청 헤더
    {
        "Authorization": "Bearer JWT_ACCESS_TOKEN"
    }
    ```
    ```json
    // 응답
    {
        "message": "로그아웃이 성공적으로 처리되었습니다."
    }
    ```

#### 1.4. JWT 리프레시
- **URL**: `/refresh/`
- **메소드**: `POST`
- **설명**: 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
    ```json
    // 요청 헤더
    {
        "Authorization": "Bearer JWT_REFRESH_TOKEN"
    }
    ```
    ```json
    // 응답
    {
        "access_token": "JWT_ACCESS_TOKEN",
        "refresh_token": "JWT_REFRESH_TOKEN"
    }
    ```

#### 1.5. 사용자명 중복 체크
- **URL**: `/check-username/`
- **메소드**: `GET`
- **설명**: 사용자가 입력한 사용자명이 이미 존재하는지 확인합니다.
- **요청 파라미터**:
    - `username`: 사용자가 확인하려는 사용자명

    ```json
    // 응답
    {
        "message": "사용 가능한 아이디입니다."
    }
    ```
    
---
### 2. 웹링크 관련 API & 기본 URL: `api/weblink/`

#### 2.1. 웹링크 생성
- **URL**: `/`
- **메소드**: `POST`
- **설명**: 새로운 웹링크를 생성합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "url": "https://example.com",
        "name": "example",
        "category": "work"
    }
    ```

    ```json
    // 응답
    {
        "message": "웹링크가 성공적으로 추가되었습니다."
    }
    ```

#### 2.2. 웹링크 수정
- **URL**: `/update/`
- **메소드**: `PATCH`
- **설명**: 기존 웹링크의 정보를 수정합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "weblink_id": 1,
        "url": "https://example.com",
        "name": "example",
        "category": "work"
    }
    ```
    ```json
    // 응답
    {
        "message": "웹링크가 성공적으로 변경되었습니다."
    }
    ```

#### 2.3. 웹링크 삭제
- **URL**: `/delete/`
- **메소드**: `DELETE`
- **설명**: 웹링크를 삭제합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "weblink_id": 1,
    }
    ```

    ```json
    {
        "message": "웹링크가 성공적으로 삭제되었습니다."
    }
    ```

#### 2.4. 웹링크 검색
- **URL**: `/search/`
- **메소드**: `GET`
- **설명**: 웹링크를 검색합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    params : {
        "category": 1,
        "keyword": "e"
    }
    ```
    ```json
    // 응답
    {
        "response": [
            {
                "id": 1,
                "name": "example",
                "url": "https://example.com",
                "category": "work",
                "shared": False,                
                "image_url": "https://example.com",
                "can_delete": False,
                "can_edit": False
            }
        ]
    }
    ```

#### 2.5. 사용자별 웹링크 검색
- **URL**: `/search/user`
- **메소드**: `GET`
- **설명**: 특정 사용자가 생성한 웹링크를 검색합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    params : {
        "keyword": "k"
    }
    ```
    ```json
    // 응답
    {
        "response": [
            {
                "id": 1,
                "username": "ktkdgh",
                "permission": "write",
            }
        ]
    }
    ```

#### 2.6. 공유된 웹링크 검색
- **URL**: `/search/share/user`
- **메소드**: `GET`
- **설명**: 다른 사용자와 공유된 웹링크를 검색합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    params : {
        "weblink_id": 1
    }
    ```
    ```json
    // 응답
    {
        "response": [
            {
                "id": 2,
                "username": "ktkdgh",
                "permission": "write",
            }
        ]
    }
    ```

#### 2.7. 웹링크 공유
- **URL**: `/share/`
- **메소드**: `POST`
- **설명**: 웹링크를 다른 사용자와 공유합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "weblinkId": 1,
        "userId": 1
    }
    ```
    ```json
    // 응답
    {
        "message": "웹링크 공유가 성공적으로 추가되었습니다."
    }
    ```

#### 2.8. 웹링크 공유 수정
- **URL**: `/share/update/`
- **메소드**: `PATCH`
- **설명**: 이미 공유된 웹링크의 공유 대상을 수정합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "weblinkId": 1,
        "userId": 1,
        "permission": "write"
    }
    ```
    ```json
    {
       "message": "웹링크 공유가 성공적으로 변경되었습니다."
    }
    ```

#### 2.9. 웹링크 공유 삭제
- **URL**: `/share/delete/`
- **메소드**: `DELETE`
- **설명**: 공유된 웹링크의 공유 관계를 삭제합니다.
    ```json
    // 요청
    { 
        "Authorization": "Bearer JWT_ACCESS_TOKEN" 
    }

    {
        "weblinkId": 1,
        "userId": 1,
    }
    ```
    ```json
    {
       "message": "웹링크 공유가 성공적으로 삭제되었습니다."
    }
    ```
---

## 데이터베이스 스키마

### 1. `users` 테이블

| 컬럼         | 데이터 타입   | 설명                                   |
|--------------|---------------|----------------------------------------|
| `id`         | `INT`         | 자동 증가하는 기본 키.                 |
| `username`   | `VARCHAR(255)` | 고유한 사용자명.                       |
| `password`   | `BINARY`      | 암호화된 비밀번호.                     |
| `refresh`    | `BINARY`      | 기본 리프레시 토큰 (기본값: `b'auroraworld'`). |
| `created_at` | `DATETIME`    | 생성 일시 (기본값: 현재 시간).         |
| `updated_at` | `DATETIME`    | 수정 일시 (자동 업데이트).             |

---

### 2. `weblinks` 테이블

| 컬럼            | 데이터 타입     | 설명                                             |
|-----------------|-----------------|--------------------------------------------------|
| `id`            | `INT`           | 자동 증가하는 기본 키.                           |
| `name`          | `VARCHAR(255)`   | 웹링크 이름.                                     |
| `url`           | `VARCHAR(255)`   | 웹링크 URL.                                      |
| `category`      | `ENUM`          | 카테고리 ('favorites', 'work', 'reference', 'education'). |
| `image_url`     | `VARCHAR(500)`   | 웹링크 관련 이미지 URL (선택사항).               |
| `shared`        | `BOOLEAN`       | 공유 여부 (기본값: `FALSE`).                     |
| `created_at`    | `DATETIME`      | 생성 일시 (기본값: 현재 시간).                   |
| `updated_at`    | `DATETIME`      | 수정 일시 (자동 업데이트).                      |
| `created_by_id` | `INT`           | 생성한 사용자 ID (`users(id)` 외래 키).         |

---

### 3. `shares` 테이블

| 컬럼                     | 데이터 타입    | 설명                                             |
|--------------------------|----------------|--------------------------------------------------|
| `id`                     | `INT`          | 자동 증가하는 기본 키.                           |
| `permission`             | `ENUM`         | 권한 ('read' 또는 'write').                     |
| `created_at`             | `DATETIME`     | 생성 일시 (기본값: 현재 시간).                   |
| `updated_at`             | `DATETIME`     | 수정 일시 (자동 업데이트).                      |
| `shared_with_user_id`    | `INT`          | 공유받은 사용자 ID (`users(id)` 외래 키).       |
| `shared_by_weblink_id`   | `INT`          | 공유된 웹링크 ID (`weblinks(id)` 외래 키).        |
