# 깊이 파는 블록체인 — 실습 코드

> [교재 바로가기](https://text.ibetter.kr/blockchain-deep)

이 저장소는 **깊이 파는 블록체인** 교재의 챕터별 실습 코드를 담고 있습니다.

## 기술 스택

- **스마트 컨트랙트**: Solidity 0.8+, OpenZeppelin 5.x
- **개발 도구**: Hardhat, Foundry
- **프론트엔드**: viem 2.x, Wagmi 2.x, RainbowKit, React/Next.js
- **인덱싱**: The Graph (subgraph)
- **보안 도구**: Slither, Mythril

## 브랜치 구조

각 브랜치는 해당 챕터까지의 **누적된 전체 코드**를 포함합니다.
챕터를 따라가며 `git checkout` 하면 그 시점까지의 완성된 코드를 확인할 수 있습니다.

| 브랜치 | 챕터 | 주요 내용 |
|--------|------|---------|
| `part01/ch-06` | PART 01 Ch 06 | Hello Web3 핸즈온 (HelloToken, Hardhat 기초) |
| `part02/ch-01` | PART 02 Ch 01 | SHA-256 해시 데모 (Python) |
| `part03/ch-06` | PART 03 Ch 06 | EVM 스토리지 모델 예제 |
| `part04/ch-01` | PART 04 Ch 01 | Solidity 기초 (타입·함수·제어 흐름) |
| `part04/ch-02` | PART 04 Ch 02 | 상속·인터페이스·modifier |
| `part04/ch-03` | PART 04 Ch 03 | ERC-20 MyToken + Hardhat 테스트 |
| `part04/ch-04` | PART 04 Ch 04 | ERC-721 MyNFT |
| `part04/ch-05` | PART 04 Ch 05 | 접근 제어 (Ownable/Role) |
| `part04/ch-06` | PART 04 Ch 06 | UUPS 업그레이드 가능 컨트랙트 |
| `part04/ch-07` | PART 04 Ch 07 | Hardhat + Foundry 테스트 |
| `part05/ch-01` | PART 05 Ch 01 | viem 클라이언트 |
| `part05/ch-02` | PART 05 Ch 02 | Wagmi + RainbowKit 지갑 연결 UI |
| `part05/ch-03` | PART 05 Ch 03 | EIP-712 구조화 서명 |
| `part05/ch-04` | PART 05 Ch 04 | IPFS 메타데이터 업로드 |
| `part05/ch-05` | PART 05 Ch 05 | 이벤트 조회 + 실시간 업데이트 |
| `part05/ch-06` | PART 05 Ch 06 | The Graph 서브그래프 |
| `part05/ch-07` | PART 05 Ch 07 | NFT Marketplace 컨트랙트 |
| `part05/ch-08` | PART 05 Ch 08 | NFT Marketplace 프론트엔드 완성 |
| `part06/ch-03` | PART 06 Ch 03 | zkSync Era Hardhat 설정 |
| `part06/ch-04` | PART 06 Ch 04 | Arbitrum Sepolia 배포 + 가스 비교 |
| `part06/ch-05` | PART 06 Ch 05 | 브리지 링크 컴포넌트 |
| `part07/ch-03` | PART 07 Ch 03 | 토큰 이코노미 |
| `part07/ch-04` | PART 07 Ch 04 | 거버넌스 DAO (OpenZeppelin Governor) |
| `part07/ch-06` | PART 07 Ch 06 | Flash Loan (Aave v3) |
| `part08/ch-01` | PART 08 Ch 01 | 재진입 공격 방어 (CEI + ReentrancyGuard) |
| `part08/ch-05` | PART 08 Ch 05 | Foundry Invariant + Fuzz 테스트 |

## 사용법

```bash
# 저장소 클론
git clone https://github.com/sung2ne/textbook-blockchain-deep.git
cd textbook-blockchain-deep

# 특정 챕터 코드 확인 (예: ERC-20 완성 시점)
git checkout part04/ch-03

# 의존성 설치 (Hardhat 프로젝트)
npm install

# Solidity 컴파일
npx hardhat compile

# 테스트 실행
npx hardhat test
# 또는 Foundry
forge test
```

## 디렉토리 구조 (main 브랜치 = 전체 누적)

```
contracts/          Solidity 스마트 컨트랙트
├── MyToken.sol     ERC-20
├── MyNFT.sol       ERC-721
├── MyGovernor.sol  거버넌스 DAO
├── NFTMarketplace.sol
├── FlashLoanExample.sol
├── SecureBank.sol  재진입 방어
└── ...

test/               테스트 코드
├── MyToken.test.ts Hardhat + ethers
├── MyToken.t.sol   Foundry
├── TokenFuzz.t.sol Foundry Fuzz
└── TokenInvariant.t.sol

scripts/            배포 스크립트
src/                프론트엔드 (Next.js + Wagmi)
├── lib/            viem/wagmi 클라이언트
├── components/     React 컴포넌트
└── app/            Next.js App Router

hash_demo.py        Python SHA-256 데모
```

## 라이선스

MIT
