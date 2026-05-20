export function BridgeLinks({ targetChain }: { targetChain: "arbitrum" | "optimism" | "base" }) {
  const bridges = {
    arbitrum: [
      { name: "Arbitrum Bridge (공식)", url: "https://bridge.arbitrum.io" },
      { name: "Hop Protocol", url: "https://app.hop.exchange" },
    ],
    optimism: [
      { name: "Optimism Bridge (공식)", url: "https://app.optimism.io/bridge" },
      { name: "Across Protocol", url: "https://app.across.to" },
    ],
    base: [
      { name: "Base Bridge (공식)", url: "https://bridge.base.org" },
      { name: "Stargate", url: "https://stargate.finance" },
    ],
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
      <p className="font-bold mb-2">
        이 dApp은 {targetChain}에서 운영됩니다. ETH 브리지 방법:
      </p>
      <ul className="space-y-1">
        {bridges[targetChain].map((bridge) => (
          <li key={bridge.name}>
            <a href={bridge.url} target="_blank" rel="noopener noreferrer"
               className="text-blue-500 underline">
              {bridge.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm text-yellow-600 mt-2">
        공식 브리지가 가장 안전하지만 L2→L1 출금 시 7일이 소요됩니다.
      </p>
    </div>
  );
}
