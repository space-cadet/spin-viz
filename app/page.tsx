import dynamic from "next/dynamic"

const SpinNetwork = dynamic(() => import("../spin-network"), { ssr: false })

export default function Home() {
  return (
    <main>
      <SpinNetwork />
    </main>
  )
}

