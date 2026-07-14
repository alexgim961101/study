# OpenID Connect (OIDC)

OIDC는 OAuth 2.0 위에 **사용자 인증(authentication)** 을 추가한 표준이다.

- OAuth: 이 Client가 어떤 자원에 접근할 수 있는가?
- OIDC: 인증된 사용자가 누구인가?

예를 들어 “구글로 로그인”에서 굿커뮤니티는 사진 API 권한보다, 로그인한 사용자를 자기 서비스의 어떤 계정과 연결할지 알아야 한다.

## OAuth만으로 로그인하면 안 되는 이유

액세스 토큰은 Resource Server에 자원 접근 권한을 증명하는 토큰이다. Client에게 “이 사용자가 이 로그인 요청으로 인증되었다”라고 전달하는 표준 신원 증명서는 아니다.

따라서 액세스 토큰으로 프로필 API를 호출해 사용자를 추정하고 로그인시키면, 다른 Client를 대상으로 발급된 토큰을 잘못 받아들이는 **token substitution** 문제가 생길 수 있다.

OIDC는 이 문제를 해결하기 위해, Client가 직접 검증할 수 있는 ID Token을 추가한다.

## 등장인물

| OIDC 용어 | 역할 |
|---|---|
| End-User | 사용자. OAuth의 Resource Owner에 해당 |
| Relying Party (RP) | OpenID Provider의 인증 결과에 의존하는 Client |
| OpenID Provider (OP) | 인증하고 ID Token을 발급하는 Authorization Server |
| Resource Server | 액세스 토큰으로 보호된 자원을 제공하는 서버 |

UserInfo endpoint는 액세스 토큰으로 보호되는 Resource Server 역할을 한다.

## 기본 흐름: Authorization Code + PKCE + OIDC

~~~text
1. 사용자가 굿커뮤니티(RP)에서 "구글로 로그인"을 선택한다.
2. RP가 PKCE의 verifier/challenge와 state, nonce를 만들고,
   scope=openid와 함께 구글(OP)의 인증 화면으로 보낸다.
3. 사용자는 OP에서 인증하고 권한을 허용한다.
4. OP는 브라우저를 통해 RP에 authorization code를 보낸다.
5. RP는 code와 verifier를 token endpoint로 보내 토큰을 교환한다.
6. OP는 access token과 ID Token을 반환하고,
   필요하면 refresh token도 반환한다.
7. RP는 ID Token을 검증한다.
8. 검증에 성공하면 sub를 기준으로 RP의 사용자 계정과 연결한다.
9. 프로필 정보가 필요하면 access token으로 UserInfo endpoint를 호출한다.
~~~

OAuth의 Authorization Code + PKCE 흐름에 OIDC가 더하는 핵심은 **scope=openid**, **nonce**, ID Token이다. state와 PKCE의 역할은 OAuth 노트에서 다룬다.

## ID Token

ID Token은 OP가 RP에게 전달하는 **인증 결과**다. API 호출용 토큰이 아니다.

| | 액세스 토큰 | ID Token |
|---|---|---|
| 목적 | Resource Server의 자원 접근 | RP에게 인증 결과 전달 |
| 제시 대상 | Resource Server | RP |
| 형식 | 불투명 문자열 또는 JWT 등 | 서명된 JWT. 필요하면 암호화될 수 있음 |
| 핵심 식별자 | 자원 접근 권한 | sub: Issuer 안에서 사용자를 식별하는 값 |

UserInfo 같은 API를 호출할 때는 ID Token이 아니라 access token을 사용한다.

## ID Token 검증

RP는 최소한 다음을 확인해야 한다.

| 항목 | 확인 내용 |
|---|---|
| 서명 | 신뢰한 OP의 키로 서명되었는가? |
| iss | 내가 사용한 OP와 일치하는가? |
| aud | 내 client_id가 대상에 포함되어 있는가? |
| exp | 만료되지 않았는가? |
| nonce | 요청에 nonce를 보냈다면 응답의 값과 일치하는가? |

sub가 “누구인지”를 나타낸다. aud는 “누구 앞으로 발급되었는지”를 나타낸다. 사용자 식별자는 보통 iss와 sub를 함께 사용한다.

## nonce

RP는 로그인 요청마다 랜덤한 nonce를 만들고 요청에 포함할 수 있다. OP는 이를 ID Token의 nonce 클레임에 넣어 돌려주며, RP는 두 값이 같은지 확인한다.

nonce는 ID Token을 원래 로그인 요청에 묶는 값이다. Authorization Code Flow에서 PKCE를 사용하면 인가 코드 보호는 PKCE가 담당하지만, nonce를 요청했다면 ID Token에서 반드시 검증해야 한다. nonce는 PKCE나 client authentication을 대체하지 않는다.

## openid 스코프와 UserInfo

- scope에 openid를 포함하면 OIDC 요청이 된다.
- openid만 요청하면 기본적으로 sub를 포함한 인증 결과를 받는다.
- 이름·이메일·프로필 사진이 필요하면 profile, email 등의 스코프를 추가한다.
- 프로필 정보는 UserInfo endpoint에서 access token으로 요청한다.

## 한 줄 요약

OAuth가 **자원 접근 권한**을 위임한다면, OIDC는 그 위에 **사용자 인증 결과를 담은 ID Token**을 추가한다. RP는 ID Token의 서명과 iss, aud, exp, nonce를 검증하고 sub로 사용자를 식별한다.

## 공식 문서

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)
