class detailSelect {
  constructor(container) {
    this.container = document.querySelector(container);
    this.options = document.querySelectorAll(`${container} > .select > .select__option`);
    this.value = this.container.querySelector('summary').textContent;
    this.mouseDown = false;
    this._addEventListeners();
    this._setAria();
    this.updateValue();
  }

  // Private function to set event listeners
  _addEventListeners() {
    this.container.addEventListener('toggle', () => {
      if (this.container.open) return;
      this.updateValue();
    })

    this.container.addEventListener('focusout', e => {
      if (this.mouseDown) return;
      this.container.removeAttribute('open');
    })

    this.options.forEach(opt => {
      opt.addEventListener('mousedown', () => {
        this.mouseDown = true;
      })
      opt.addEventListener('mouseup', () => {
        this.mouseDown = false;
        this.container.removeAttribute('open');
      })
    })

    this.container.addEventListener('keyup', e => {
      const keycode = e.which;
      const current = [...this.options].indexOf(this.container.querySelector('.active'));
      switch (keycode) {
        case 27: // ESC
          this.container.removeAttribute('open');
          break;
        case 35: // END
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[this.options.length - 1].querySelector('input'))
          break;
        case 36: // HOME
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[0].querySelector('input'))
          break;
        case 38: // UP
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[current > 0 ? current - 1 : 0].querySelector('input'));
          break;
        case 40: // DOWN
          e.preventDefault();
          if (!this.container.open) this.container.setAttribute('open', '');
          this.setChecked(this.options[current < this.options.length - 1 ? current + 1 : this.options.length - 1].querySelector('input'));
          break;
      }
    })
  }

  _setAria() {
    this.container.setAttribute('aria-haspopup', 'listbox');
    const selectBox = this.container.querySelector('.select');
    selectBox.setAttribute('role', 'listbox');
    selectBox.querySelector('[type=radio]').setAttribute('role', 'option')
  }

  updateValue(e) {
    const that = this.container.querySelector('input:checked');
    if (!that) return;
    this.setValue(that)
  }

  setChecked(that) {
    that.checked = true;
    this.setValue(that)
  }

  setValue(that) {
    if (this.value == that.value) return;

    this.container.querySelector('summary').textContent = that.parentNode.textContent;
    this.value = that.value;

    this.options.forEach(opt => {
      opt.classList.remove('active');
    })
    that.parentNode.classList.add('active');

    this.container.dispatchEvent(new Event('change'));
  }
}


const ioHandler = (entries, self) => {
  for (let entry of entries) {
    const target = entry.target;

    if (entry.intersectionRatio > 0.7) {
      console.log('target :', target);
      target.classList.add(target.getAttribute("data-animation"))
      self.unobserve(target);
    }
  }
}

const ioConfig = {
  threshold: 0.7
};

const elFactory = (type, attributes, ...children) => {
  const el = document.createElement(type)

  for (key in attributes) {
    el.setAttribute(key, attributes[key])
  }

  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child))
    else el.appendChild(child)
  })

  return el
}

const createFrameSlides = chars => {
  const fragment = new DocumentFragment();
  chars = chars.split('');
  chars.forEach((char, index) => {
    const el = elFactory(
      'span',
      { 
        'data-char': `${char}`,
        class: `char`,
        style: `--char-index:${index}`
      },
      `${char}`
    )
    fragment.appendChild(el);
  })
  
  return fragment;
}


document.addEventListener('DOMContentLoaded', () => {
  
  let splits = document.querySelectorAll('[data-split-word]');

  splits.forEach(split => {
    let splitTextContent = split.textContent;
  
    split.innerHTML = '';
    split.appendChild(createFrameSlides(splitTextContent))
  })


  new detailSelect('#js-select-level');
  new detailSelect('#js-select-city');

  const blocks = document.querySelectorAll("[data-animation]");

  const io = new IntersectionObserver(ioHandler, ioConfig);

  [].forEach.call(blocks, block => io.observe(block));
  

});