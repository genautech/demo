"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"
import { eventBus } from "@/lib/eventBus"
import { useTheme } from "next-themes"

export function CelebrationHandler() {
  const { theme } = useTheme()

  useEffect(() => {
    // Only trigger celebrations in "fun" mode or if specifically requested
    const triggerConfetti = (options?: any) => {
      const isFunMode = document.documentElement.classList.contains("fun")
      
      if (isFunMode) {
        // More intense confetti for fun mode - following the redesigned palette
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4a6cf7", "#4ade80", "#fb923c", "#f472b6"], // Cobalt, Mint, Coral, Pink
          ...options
        })
      } else {
        // subtle confetti for normal modes
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.7 },
          ...options
        })
      }
    }

    const unsubscribeOrder = eventBus.subscribe("order.created", () => {
      setTimeout(() => triggerConfetti(), 500)
    })

    const unsubscribeAchievement = eventBus.subscribe("achievement.unlocked", () => {
      triggerConfetti({
        particleCount: 200,
        scalar: 1.2,
        shapes: ["star"]
      })
    })

    const unsubscribeCorporateAchievement = eventBus.subscribe("corporate.achievement.unlocked", () => {
      triggerConfetti({
        particleCount: 300,
        scalar: 1.5,
        shapes: ["star", "circle"],
        colors: ["#FFD700", "#FFA500", "#FF6347"],
        origin: { y: 0.5 }
      })
    })

    const unsubscribeTeamMilestone = eventBus.subscribe("team.milestone.reached", () => {
      triggerConfetti({
        particleCount: 250,
        spread: 100,
        scalar: 1.3,
        colors: ["#4a6cf7", "#4ade80", "#fb923c"],
        ticks: 100
      })
    })

    const unsubscribeLevelUp = eventBus.subscribe("user.level.up", () => {
      triggerConfetti({
        particleCount: 400,
        spread: 120,
        scalar: 1.8,
        shapes: ["star", "square", "circle"],
        origin: { y: 0.4 },
        gravity: 1.2
      })
    })

    const unsubscribeTest = eventBus.subscribe("celebration.test", () => {
      triggerConfetti()
    })

    return () => {
      unsubscribeOrder()
      unsubscribeAchievement()
      unsubscribeCorporateAchievement()
      unsubscribeTeamMilestone()
      unsubscribeLevelUp()
      unsubscribeTest()
    }
  }, [])

  return null
}
