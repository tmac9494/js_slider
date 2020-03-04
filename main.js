class Slider {
	constructor(sliderID, slideClassName) {
		this.container = document.getElementById(sliderID);
		this.slides = document.getElementsByClassName(slideClassName)
		this.slideClassName = slideClassName;
		this.total = this.slides.length;
		this.index = 0;
		this.currentSlide = () => this.slides[this.index];
		this.container.style.position = 'relative';
		this.container.style.width = '100%';
		this.container.style.overflow = 'hidden';
		this.container.style.transition = 'height .2s';
    this.circBtns = [];
    this.timeoutFunc = null;
    this.hover = false;
		this.initialize();
    ['changeSlide', 'changeIndex', 'updateClasses', 'generateButtons']
    .forEach(fName =>  this[fName].bind(this) );
	}
	changeSlide(increment) {
			const newIndex = this.index + increment;
			if (newIndex <= this.total - 1 && newIndex >= 0) {
				const currentSlide = this.slides[this.index].element;
				const nextSlide = this.slides[newIndex].element;
				currentSlide.style.left = (newIndex > this.index ? '-' : '') + '110%';
				currentSlide.style.transform = 'translate(0, -50%)';
				nextSlide.style.left = '50%';
				nextSlide.style.transform = 'translate(-50%, -50%)';
				this.index = newIndex;
				this.sizeContainer();
        this.updateClasses();
			} else {
        this.changeIndex(newIndex > this.total - 1 ? 0 : this.total - 1);
      }
	}
  changeIndex(newIndex) {
    let greaterThan = newIndex > this.index;
    if (newIndex !== this.index) {
      for (let i = 0;i < this.slides.length;i++) {
        const slide = this.slides[i].element;
        slide.style.left = (i < newIndex ? '-' : '') + '110%';
        slide.style.transform = 'translate(0, -50%)';
      }
      this.slides[newIndex].element.style.left = '50%';
      this.slides[newIndex].element.style.transform = 'translate(-50%, -50%)';
      this.index = newIndex;
      this.sizeContainer();
      this.updateClasses();
    }
  }
  updateClasses() {
    for (let i = 0;i < this.circBtns.length;i++) {
      this.circBtns[i].className = 'slider_circ_btn' + (i === this.index ? ' active' : '');
    }
  }
	initialize() {
		// hide and size slides/container
		let slides = [];
		for (let i = 0;i < this.slides.length;i++) {
			slides.push({
				element: this.slides[i],
				height: this.slides[i].clientHeight,
				width: this.slides[i].clientWidth
			})
			const element = slides[i].element;
			element.style.position = 'absolute';
			element.style.left = i !== this.index ? '110%' : '50%';;
			element.style.top = '50%';
			element.style.transform = i !== this.index ?'translate(0%, -50%)' : 'translate(-50%, -50%)';
			element.style.zIndex = 6;
		}
		this.slides = slides;
		this.sizeContainer();
		// generate buttons
		this.generateButtons();
	}
	generateButtons() {
		// generate button stylsheet
		const btnCss = '.slider_btn {display:block;position:absolute;top:50%;transform:translateY(-50%);width:50px;height:160px;background:none;border:none;outline:none;cursor:pointer;z-index: 10;} .slider_btn svg {fill:rgba(0,0,0,0.32)} .slider_circ_btn {width: 15px;height:15px;border-radius:30px;background:rgba(0,0,0,0.32);display: inline-block;border:none;outline:none;margin-right:8px;cursor:pointer;} .slider_circ_btn:hover, .slider_circ_btn.active {background: rgba(0,0,0,0.55)} @media (max-width: 768px) {.slider_btn svg {fill: rgba(0,0,0,0) !important;}}';
		const css = '.slider_btn:hover svg {fill: rgba(0,0,0,0.55)} .slider_btn:focus, .slider_circ_btn:focus {outline: none} .' + this.slideClassName + '{transition: left .42s, transform .42s}' + btnCss;
		const style = document.createElement('style');
		if (style.styleSheet) style.styleSheet.cssText = css
		else style.appendChild(document.createTextNode(css));
		document.getElementsByTagName('head')[0].appendChild(style);
		// svg button elements
		let buttons = [
			document.createElement('button'),
			document.createElement('button')
		]
		const svgStyle = 'display:block;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);width:30px;height:auto;'
		buttons[0].innerHTML = '<svg style="' + svgStyle + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/></svg>';
		buttons[1].innerHTML = '<svg style="' + svgStyle + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/></svg>';
		buttons[0].className = 'slider_btn slider_btn_left';
    buttons[0].setAttribute('aria-label', 'change slide backwards');
		buttons[1].className = 'slider_btn slider_btn_right';
    buttons[1].setAttribute('aria-label', 'change slide forwards');
		buttons[0].style.cssText = 'left:0;right:auto;';
		buttons[1].style.cssText = 'right:0;left:auto;';
		this.container.appendChild(buttons[0]);
		this.container.appendChild(buttons[1]);
		buttons[0].addEventListener('click', () => this.changeSlide(-1))
		buttons[1].addEventListener('click', () => this.changeSlide(1))
    const circleButtonContainer = document.createElement('div');
    circleButtonContainer.style.cssText='position:absolute;left:50%;bottom:0;top:auto;transform:translateX(-50%);padding:0 0 2px 0;z-index:7;';
    for (let i = 0;i < this.total;i++) {
      let circBtn = document.createElement('button');
      circBtn.className = 'slider_circ_btn' + (i === 0 ? ' active' : '');
      circBtn.addEventListener('click', () => this.changeIndex(i));
      circBtn.setAttribute('aria-label', 'slide ' + (i + 1));
      this.circBtns.push(circBtn);
      circleButtonContainer.appendChild(circBtn);
    }
    this.container.appendChild(circleButtonContainer);
    // listeners
    this.container.addEventListener('mouseover', () => {
      if (!this.hover) {
        this.hover = true;
        clearTimeout(this.timeoutFunc)
      }
    })
    this.container.addEventListener('mouseleave', () => {
      if (this.hover) {
        this.hover = false;
        this.timeoutFunc = setTimeout(() => this.timeoutEvent(this), 4000);
      }
    })
    if (!this.hover && isElementInView(this.container)) this.timeoutFunc = setTimeout(() => this.timeoutEvent(this), 4000);
	}
  timeoutEvent(thisRef) {
    thisRef.changeSlide(1);
    if (isElementInView(thisRef.container)) thisRef.timeoutFunc = setTimeout(() => thisRef.timeoutEvent(thisRef), 4000)
  }
	sizeContainer() {
		this.container.style.height = this.currentSlide().height + 100 + 'px';
	}
}
