import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(
  selector: string,
  options?: {
    y?: number
    stagger?: number
    duration?: number
    start?: string
    childSelector?: string
  },
) {
  const {
    y = 40,
    stagger = 0.08,
    duration = 0.7,
    start = 'top 85%',
    childSelector,
  } = options || {}

  onMounted(() => {
    const containers = document.querySelectorAll(selector)
    containers.forEach((container) => {
      const targets = childSelector
        ? container.querySelectorAll(childSelector)
        : [container]
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: 'play none none none',
        },
      })
    })
  })
}
