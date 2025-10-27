const images = [
	'assets/images/slider/bottom_food/1.jpg',
	'assets/images/slider/bottom_food/2.png',
	'assets/images/slider/bottom_food/3.png',
	'assets/images/slider/bottom_food/4.png',
	'assets/images/slider/bottom_food/5.png',
	'assets/images/slider/bottom_food/6.jpg',
]

const slider = document.querySelector('[data--slider]')
const prevBtn = document.querySelector('[data--btn__prev]')
const nextBtn = document.querySelector('[data--btn__next]')

let currentIndex = 0
let isAnimating = false
const visibleCount = 3
const slidesPerSide = 2

function setupSlides() {
	slider.innerHTML = ''
	const total = images.length
	const totalSlides = visibleCount + slidesPerSide * 2

	for (let i = -slidesPerSide; i < visibleCount + slidesPerSide; i++) {
		const index = (((currentIndex + i) % total) + total) % total
		const slide = document.createElement('div')
		slide.className = 'slide'
		const img = document.createElement('img')
		img.src = images[index]
		img.loading = 'lazy'
		slide.appendChild(img)
		slider.appendChild(slide)
	}
	setTranslate(slidesPerSide, false)
}

function getSlideWidth() {
	const slide = document.querySelector('.slide')
	const gap = parseFloat(getComputedStyle(slider).gap || '0')
	return slide.getBoundingClientRect().width + gap
}

function setTranslate(offsetIndex, withTransition = true) {
	const slideWidth = getSlideWidth()
	if (withTransition) slider.style.transition = 'transform 0.5s ease-in-out'
	else slider.style.transition = 'none'
	slider.style.transform = `translateX(-${slideWidth * offsetIndex}px)`
}

function goToNextSlide() {
	if (isAnimating) return
	isAnimating = true

	const slideWidth = getSlideWidth()
	const total = images.length
	currentIndex = (currentIndex + 1) % total

	const newIndex =
		(currentIndex + visibleCount + slidesPerSide - 1) % images.length
	const newSlide = createSlide(newIndex)
	slider.appendChild(newSlide)

	slider.style.transition = 'transform 0.5s ease-in-out'
	slider.style.transform = `translateX(-${slideWidth * (slidesPerSide + 1)}px)`

	slider.addEventListener(
		'transitionend',
		() => {
			slider.firstElementChild.remove()
			setTranslate(slidesPerSide, false)
			isAnimating = false
		},
		{ once: true }
	)
}

function goToPrevSlide() {
	if (isAnimating) return
	isAnimating = true

	const slideWidth = getSlideWidth()
	const total = images.length
	currentIndex = (currentIndex - 1 + total) % total

	const newIndex = (currentIndex - slidesPerSide + total) % total
	const newSlide = createSlide(newIndex)
	slider.insertBefore(newSlide, slider.firstElementChild)

	setTranslate(slidesPerSide + 1, false)

	requestAnimationFrame(() => {
		slider.style.transition = 'transform 0.5s ease-in-out'
		setTranslate(slidesPerSide, true)
	})

	slider.addEventListener(
		'transitionend',
		() => {
			slider.lastElementChild.remove()
			isAnimating = false
		},
		{ once: true }
	)
}

function createSlide(index) {
	const slide = document.createElement('div')
	slide.className = 'slide'
	const img = document.createElement('img')
	img.src = images[index]
	img.loading = 'lazy'
	slide.appendChild(img)
	return slide
}

setupSlides()
nextBtn.addEventListener('click', goToNextSlide)
prevBtn.addEventListener('click', goToPrevSlide)
window.addEventListener('resize', () => setTranslate(slidesPerSide, false))
