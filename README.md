# Hyun-Tak-Lee.github.io

개인 기술 블로그 및 포트폴리오 웹사이트입니다.

## fnm 환경 설정 (cmd.exe)

### 1. fnm 설치
```cmd
winget install Schniz.fnm
```

### 2. cmd 자동 실행 스크립트 생성
```cmd
(echo @echo off & echo if not defined FNM_AUTORUN_GUARD ( & echo   set "FNM_AUTORUN_GUARD=AutorunGuard" & echo   FOR /f "tokens=*" %%%%z IN ('fnm env --use-on-cd'^) DO CALL %%%%z & echo ^)) > "%USERPROFILE%\fnm_init.cmd"
```

### 3. 레지스트리(AutoRun) 등록
```cmd
reg add "HKCU\Software\Microsoft\Command Processor" /v AutoRun /t REG_EXPAND_SZ /d "%USERPROFILE%\fnm_init.cmd" /f
```

## 개발 서버 실행 (Development)

로컬 개발 서버를 실행하는 명령어입니다:

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
# 또는
npx astro dev
```

기본적으로 `http://localhost:4321`에서 개발 서버가 구동됩니다.

## 주요 스크립트

- `npm run dev`: 로컬 개발 서버 실행 (`astro dev`)
- `npm run build`: 프로덕션 정적 사이트 빌드 (`astro build`)
- `npm run preview`: 빌드된 사이트 로컬 미리보기 (`astro preview`)
