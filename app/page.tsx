'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/Dashboard'
import { LandingPage } from '@/components/LandingPage'

export default function Home() {
    const [showLanding, setShowLanding] = useState(true)
    const [userName, setUserName] = useState('')

    if (showLanding) {
        return <LandingPage onStart={(name) => {
            setUserName(name);
            setShowLanding(false);
        }} />
    }

    return (
        <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex justify-center overflow-hidden font-sans relative">
            <div className="w-full max-w-md h-screen relative bg-[var(--color-bg)] flex flex-col">
                <Dashboard userName={userName} />
            </div>
        </div>
    )
}
