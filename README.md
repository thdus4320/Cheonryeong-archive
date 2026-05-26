# Cheonryeong Archive

천령 天靈 Cheonryeong 캐릭터 프로필, 이미지 갤러리, 세계관, 권속, 설정 메모를 관리하는 단일 HTML 아카이브입니다.

## 파일 구성

- `index.html`: GitHub Pages 배포용 메인 파일
- `cheonryeong-archive.html`: 로컬에서 처음 만든 원본 이름의 동일 앱
- `assets/cheonryeong-reference.png`: 기본 캐릭터 시트 이미지
- `.nojekyll`: GitHub Pages가 정적 파일을 그대로 제공하게 하는 설정
- `supabase-setup.sql`: 공개 갤러리 업로드용 Supabase 테이블/RLS 설정

## 로컬에서 열기

`index.html` 또는 `cheonryeong-archive.html`을 브라우저로 열면 됩니다.

## 저장 방식

사이트에서 수정한 프로필, 등록한 항목, 업로드한 이미지는 브라우저의 `localStorage`에 저장됩니다.

다른 사람에게 같은 수정 내용을 전달하려면 사이트 상단의 `내보내기`로 JSON을 저장한 뒤, 상대가 `가져오기`로 불러오면 됩니다.

## 공개 갤러리 업로드

사이트는 Supabase의 `gallery_items` 테이블과 `gallery-images` Storage bucket을 사용해 방문자 이미지 제출을 받을 수 있습니다.

방문자가 등록한 이미지는 `pending` 상태로 저장되고, 관리자가 Supabase Table Editor에서 `status`를 `approved`로 바꾸면 공개 갤러리에 표시됩니다.

Supabase SQL Editor에서 `supabase-setup.sql` 내용을 실행하고, Storage에서 `gallery-images` bucket을 Public으로 생성해야 합니다.

## GitHub Pages 배포

1. GitHub에서 새 Repository를 만듭니다.
2. 이 폴더를 Git 저장소로 초기화합니다.
3. GitHub Repository 주소를 `origin`으로 연결합니다.
4. `main` 브랜치로 push합니다.
5. Repository Settings의 Pages에서 `main` 브랜치와 `/root` 폴더를 선택합니다.

예시 명령어:

```powershell
git init
git add .
git commit -m "Add Cheonryeong archive"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

GitHub Pages 주소는 보통 아래 형태입니다.

```text
https://사용자명.github.io/저장소명/
```
