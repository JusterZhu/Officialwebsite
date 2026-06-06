"use client"

import { useEffect, useRef } from "react"

export default function LenisProvider({ children }) {
    const stateRef = useRef({ rafId: null, lenis: null })

    useEffect(() => {
        let cancelled = false
        const state = stateRef.current

        const initLenis = async () => {
            if (cancelled) return
            const [LenisModule, GSAPModule] = await Promise.all([
                import("lenis"),
                import("gsap"),
            ])
            const Lenis = LenisModule.default
            const gsap = GSAPModule.default
            const { ScrollTrigger } = await import("gsap/ScrollTrigger")

            if (cancelled) return
            gsap.registerPlugin(ScrollTrigger)

            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false,
            })
            state.lenis = lenis

            function raf(time) {
                if (cancelled) return
                lenis.raf(time)
                ScrollTrigger.update()
                state.rafId = requestAnimationFrame(raf)
            }

            state.rafId = requestAnimationFrame(raf)
        }

        initLenis()

        return () => {
            cancelled = true
            if (state.rafId) {
                cancelAnimationFrame(state.rafId)
            }
            if (state.lenis) {
                state.lenis.destroy()
            }
        }
    }, [])

    return children
}
