# OAuth 2.0 (Authorization Code + PKCE)

OAuth 2.0은 사용자의 비밀번호를 제3자 앱에 넘기지 않고, **허용한 범위의 자원 접근 권한을 위임**하는 프레임워크다.

예를 들어 포토프린팅이 구글 포토의 사진을 읽으려면, 사용자는 구글에서 로그인하고 사진 읽기 권한을 허용한다. 포토프린팅은 구글 비밀번호를 알지 못한다.

## OAuth가 해결하는 문제

비밀번호를 앱에 직접 주면 다음 문제가 생긴다.

| 문제 | 설명 |
|---|---|
| 권한 범위가 넓음 | 사진 읽기만 허용하고 싶어도 계정 전체 권한을 넘기게 된다. |
| 개별 취소가 어려움 | 한 앱의 접근만 끊으려 해도 비밀번호를 바꿔야 하고, 다른 앱도 함께 로그아웃된다. |
| 자격증명 노출 | 앱에 비밀번호가 저장되고, 유출되면 계정 전체가 위험해진다. |

OAuth는 비밀번호 대신 앱별 토큰을 발급한다. 토큰의 권한 범위와 수명을 제한하면 피해를 줄일 수 있고, 제공자가 토큰 폐기를 지원하면 앱별 접근도 끊을 수 있다.

## 등장인물

| 역할 | 예시 |
|---|---|
| Resource Owner | 사용자. 데이터에 대한 권한을 가진 사람 |
| Client | 포토프린팅. 데이터에 접근하려는 앱 |
| Authorization Server | 구글의 로그인·동의·토큰 발급 서버 |
| Resource Server | 구글 포토 API. 액세스 토큰을 확인하고 사진을 제공 |

Authorization Server와 Resource Server는 논리적으로 분리된 역할이며, 실제로는 같은 서비스가 맡을 수도 있다.

## 기본 흐름: Authorization Code

```text
1. 사용자가 포토프린팅에서 "구글 포토 연결"을 선택한다.
2. Client가 구글의 인증 화면으로 사용자를 보낸다.
3. 사용자는 Authorization Server에서 로그인하고 권한을 허용한다.
4. Authorization Server는 브라우저를 통해 Client의 redirect URI로
   액세스 토큰이 아닌 일회용 authorization code를 보낸다.
5. Client는 token endpoint에 code를 보낸다.
   Confidential Client라면 등록된 client authentication도 수행한다.
6. Authorization Server가 code를 검증하면
   액세스 토큰과 필요할 경우 리프레시 토큰을 발급한다.
7. Client는 액세스 토큰으로 Resource Server에 요청한다.
8. 액세스 토큰이 만료되면 리프레시 토큰으로 새 액세스 토큰을 요청한다.
```

인가 코드는 브라우저를 통과하지만, Authorization Code Flow에서는 토큰을 token endpoint에서 교환한다. 서버형 웹 앱은 서버가 토큰을 받아 보관할 수 있다. 반면 SPA와 모바일 앱은 토큰을 앱이 직접 받으므로, “토큰은 항상 브라우저를 거치지 않는다”라고 일반화하면 안 된다.

## 토큰

| | 액세스 토큰 | 리프레시 토큰 |
|---|---|---|
| 제시 대상 | Resource Server | Authorization Server |
| 용도 | 보호된 자원에 접근 | 새 액세스 토큰 발급 |
| 형식 | 불투명 문자열 또는 JWT 등 | 보통 불투명 문자열 |
| 발급·수명 | Authorization Server가 정책으로 정한다. 실무에서는 짧게 설정 | 발급은 선택 사항이며, 보통 더 오래 유효 |

OAuth 표준은 공통 수명 값을 고정하지 않을 뿐, 운영자는 access token의 수명을 정해야 한다. 짧은 수명은 토큰이 탈취되었을 때 공격자가 사용할 수 있는 시간을 줄인다. 다만 만료 전 사용 자체를 막지는 못하므로, 최소 권한·대상 서버 제한·필요하면 sender-constrained token도 함께 고려한다. 리프레시 토큰은 Resource Server에 보내지 않으며, 액세스 토큰을 갱신할 때만 Authorization Server에 보낸다. 토큰 폐기는 제공자의 revocation 기능에 의존한다.

## PKCE

기본 흐름에서 “인가 코드를 탈취하면?”이라는 문제가 남는다. Public Client는 앱 코드에 client secret을 숨길 수 없으므로, PKCE는 고정된 secret 대신 요청마다 만든 `code_verifier`와 그 해시인 `code_challenge`를 사용해 **인가 코드를 처음 요청한 Client만 교환할 수 있게** 한다.

- `code_verifier`: Client가 생성해 보관하는 랜덤 값
- `code_challenge`: verifier를 `S256`으로 해시한 값. 인증 요청에 포함
- token endpoint: verifier를 다시 해시해 challenge와 비교

따라서 PKCE를 적용한 흐름에서는 2단계에 `code_challenge`를 함께 보내고, 5단계에 `code_verifier`를 함께 보낸다. Authorization Server는 두 값을 비교해 code 교환을 허용한다.

PKCE는 Public Client에서 필수로 사용하고, Confidential Client에서도 사용하는 것이 권장된다. 다만 PKCE는 client authentication 자체를 대체하지 않는다. Confidential Client의 `client_secret` 또는 다른 인증 방법은 별도로 적용할 수 있다.

`state`는 인증 요청과 응답을 브라우저 세션에 묶어 CSRF와 응답 주입을 막는 데 사용한다. PKCE를 지원하는 Authorization Server라면 PKCE도 이 공격을 완화하지만, `state`를 함께 사용하는 구현이 이해하기 쉽고 안전하다.

## 한 줄 요약

OAuth는 비밀번호 대신 **범위가 제한된 토큰으로 자원 접근 권한을 위임**한다. Authorization Code Flow는 브라우저로 일회용 code만 전달하고, PKCE는 그 code를 처음 요청한 Client만 토큰으로 교환하게 한다.

## 공식 문서

- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636.html)
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
