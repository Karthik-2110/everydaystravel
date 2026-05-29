import '@testing-library/jest-dom'

// Radix UI pointer event polyfills for jsdom
window.HTMLElement.prototype.hasPointerCapture = () => false
window.HTMLElement.prototype.releasePointerCapture = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}

// Radix uses PointerEvent constructor — jsdom doesn't have it
class MockPointerEvent extends MouseEvent {
  pointerId: number
  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props)
    this.pointerId = props.pointerId ?? 1
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent

// Radix UI floating content requires ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Radix UI media query polyfill
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
