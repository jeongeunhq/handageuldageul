# 📚 게시판 프로젝트

> Next.js와 TypeScript를 활용한 게시판 애플리케이션입니다.



## 📌 소개

게시글 작성, 조회, 수정, 삭제가 가능한 게시판이며 해당 게시글에 댓글도 남길 수 있습니다．
프론트엔드 중심으로 개발되었으며 반응형 디자인을 지원합니다.

---

## ✨ 주요 기능

- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 댓글 목록 조회
- 댓글 작성

---

## 🛠 사용 기술

- **Next.js** (v14)
- **TypeScript** (v5)
- **Tailwind CSS** (v3)
- **Axios** (API 통신)
- **React Hook Form** (폼 관리)
- **Zustand** (전역 상태 관리)
- **Tanstack query** （서버 상태 관리）
  
---
## 📁 폴더 구조

```plaintext
/public
  (정적 파일들: 이미지 등)
/src
  /api                   # 관련 api
  /app
    /login               # 로그인 페이지
    /posts               # 게시판 리스트 페이지
    /posts/[id]          # 게시글 상세 조회 페이지
    /posts/create        # 게시글 작성, 수정 페이지
  /components
    /post                # 게시판 관련 컴포넌트
    /auth                # 로그인 관련 컴포넌트
    /comments            # 댓글 관련 컴포넌트
    /main                # 메인 페이지 관련 컴포넌트
  /lib
    authOption.ts        # NextAuth.js를 사용하여 인증 시스템
    pagination           # 페이지네이션
  /store
    userStore.ts         # Zustand 상태 관리
  /types
    next-auth.d.ts       # 세션, 사용자 타입 정의
  /widgets
    /hooks               # 상태 관리, API 호출
    /providers           # 세션 상태를 Zustand 상태 관리
    /shared              # header 컴포넌트
```
---
## 배포 사이트

배포된 사이트는 아래 링크에서 확인할 수 있습니다:

[**[배포된 사이트 링크]([https://your-deployed-site.com](https://handageuldageul-jeongeunhas-projects.vercel.app/))**](https://handageuldageul-jeongeunhas-projects.vercel.app/)
