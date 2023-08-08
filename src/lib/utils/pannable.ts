export function pannable(node: HTMLElement) {
	let x: number
	let y: number
	let isTouchDevice = false

	function handleDown(event: MouseEvent | TouchEvent) {
		isTouchDevice = event.type === "touchstart"

		x = isTouchDevice
			? (event as TouchEvent).touches[0].clientX
			: (event as MouseEvent).clientX
		y = isTouchDevice
			? (event as TouchEvent).touches[0].clientY
			: (event as MouseEvent).clientY

		node.dispatchEvent(new CustomEvent("panstart"))

		window.addEventListener(
			isTouchDevice ? "touchmove" : "mousemove",
			handleMove
		)
		window.addEventListener(
			isTouchDevice ? "touchend" : "mouseup",
			handleUp
		)
	}

	function handleMove(event: MouseEvent | TouchEvent) {
		if (isTouchDevice && (event as TouchEvent).touches.length > 1) {
			// ignore multitouch events
			return
		}

		const dx =
			(isTouchDevice
				? (event as TouchEvent).touches[0].clientX
				: (event as MouseEvent).clientX) - x
		const dy =
			(isTouchDevice
				? (event as TouchEvent).touches[0].clientY
				: (event as MouseEvent).clientY) - y
		x = isTouchDevice
			? (event as TouchEvent).touches[0].clientX
			: (event as MouseEvent).clientX
		y = isTouchDevice
			? (event as TouchEvent).touches[0].clientY
			: (event as MouseEvent).clientY

		node.dispatchEvent(
			new CustomEvent("panmove", {
				detail: { dx, dy }
			})
		)
	}

	function handleUp(event: MouseEvent | TouchEvent) {
		x = isTouchDevice
			? (event as TouchEvent).changedTouches[0].clientX
			: (event as MouseEvent).clientX
		y = isTouchDevice
			? (event as TouchEvent).changedTouches[0].clientY
			: (event as MouseEvent).clientY

		node.dispatchEvent(new CustomEvent("panend"))

		window.removeEventListener(
			isTouchDevice ? "touchmove" : "mousemove",
			handleMove
		)
		window.removeEventListener(
			isTouchDevice ? "touchend" : "mouseup",
			handleUp
		)
	}

	node.addEventListener("mousedown", handleDown)
	node.addEventListener("touchstart", handleDown)

	return {
		destroy() {
			node.removeEventListener("mousedown", handleDown)
			node.removeEventListener("touchstart", handleDown)
		}
	}
}
