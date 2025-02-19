import dynamic from "next/dynamic"

const SpinNetworkPage = dynamic(() => import("./spin-network-page"), { ssr: false })

export default function Home() {
  return <SpinNetworkPage />
}

