import { ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';

export class Draggable {

  public dragElement = {
    targetEl: null,
    draggableEl: null,
    targetHeight: null,
    activeIndex: null,
    moveHandler: this.dragTo.bind(this),
    stopHandler: this.dragEnd.bind(this)
  };

  public elements;

  constructor(private el: ElementRef,
              private cdRef: ChangeDetectorRef,
              private zone: NgZone,
              private _rows: any[]) {

  }

  set rows(value) {
    this._rows = value;
  }

  /**
   * Prepare draggable elements and add events
   * @param event
   */
  public dragStart(event) {
    window.document.body.classList.add('reorder-in-progress');

    this.dragElement.targetEl = event.target;

    this.prepareElements();

    this.initDraggableElement(event);

    this.dragElement.targetEl.classList.add('draggable-elem');

    this.zone.runOutsideAngular(() => {
      window.document.addEventListener('mousemove', this.dragElement.moveHandler);
      window.document.addEventListener('touchmove', this.dragElement.moveHandler, {passive: false} as any);
      window.document.addEventListener('mouseup', this.dragElement.stopHandler);
      window.document.addEventListener('touchend', this.dragElement.stopHandler);
      window.document.addEventListener('touchcancel', this.dragElement.stopHandler);
    });

  }


  /**
   * Move draggable elements and swap items
   * @param event
   */
  public dragTo(event) {
    this.touchFix(event);
    const elemIndex = this.lookupElementUnder(event);


    if (elemIndex !== null) {
      this.swapWithIndex(elemIndex)
    }

    const topOffset = (event.y || event.clientY) - (this.dragElement.targetHeight / 2);
    this.dragElement.draggableEl.style.top =  topOffset + 'px';
  }

  /**
   * Remove events and classes after drag finish
   */
  public dragEnd() {
    this.dragElement.targetEl.classList.remove('draggable-elem');
    window.document.body.classList.remove('reorder-in-progress');
    this.dragElement.draggableEl.remove();
    window.document.removeEventListener('mousemove', this.dragElement.moveHandler);
    window.document.removeEventListener('touchmove', this.dragElement.moveHandler);
    window.document.removeEventListener('mouseup', this.dragElement.stopHandler);
    window.document.removeEventListener('touchend', this.dragElement.stopHandler);
    window.document.removeEventListener('touchcancel', this.dragElement.stopHandler);
  }

  /**
   * looking row elements and save their dims
   */
  private prepareElements() {
    this.lookupChildElements();
    this.calcElementsDimensions();
  }

  /**
   * Store child rows
   */
  private lookupChildElements() {
    this.elements = Array.from(
      this.el.nativeElement.querySelectorAll('tr')
    ).reduce((acc: any[], rowElement, index) => {
      const element: any = { target: rowElement };

      if (rowElement === this.dragElement.targetEl) {
        this.dragElement.activeIndex = index;
        element.active = true;
      }

      acc.push(element);

      return acc;
    }, []);
  }

  /**
   * Calc child rows sizes/offsets
   */
  private calcElementsDimensions() {
    this.elements.forEach((el: any, index) => {
      const dims = el.target.getBoundingClientRect();
      el.top = dims.top;
      el.height = dims.height;
      el.center = dims.top + (dims.height / 2);
      el.index = index;
    });
  }

  /**
   * Init draggable element
   * @param event
   */
  private initDraggableElement(event) {
    const el = event.target.cloneNode(true);
    const data = event.target.getBoundingClientRect();

    el.style.width = data.width + 'px';
    el.style.left = data.left + 'px';
    el.style.top = data.top + 'px';

    el.classList.add('draggable');

    this.el.nativeElement.append(el);

    this.dragElement.draggableEl = el;
    this.dragElement.targetHeight = data.height;

    this.updateDraggableDims(event);
  }

  /**
   * Looking by stored row elemens for overlapped row
   * @param event
   * @returns {any}
   */
  private lookupElementUnder(event) {
    const top = event.y || event.clientY - (this.dragElement.targetHeight / 2);
    const bottom = event.y || event.clientY + this.dragElement.targetHeight - (this.dragElement.targetHeight / 2);

    let elemIndex = null;

    for (let i = 0; i < this.elements.length; i++) {
      const el = this.elements[i];

      if (!el.active) {
        // 30 - it is offset from center
        if (top < el.center + 30 && el.index < this.dragElement.activeIndex
          || bottom > el.center - 30 && el.index > this.dragElement.activeIndex) {
          elemIndex = i;
        }
      }
    }

    return elemIndex;
  }

  /**
   * Swap rows
   * @param index
   */
  private swapWithIndex(index) {
    const activeIndex = this.dragElement.activeIndex;

    let activeRow = this._rows[activeIndex];
    this._rows[activeIndex] = this._rows[index];
    this._rows[index] = activeRow;

    activeRow = this.elements[activeIndex].target;
    this.elements[activeIndex].active = false;

    this.elements[activeIndex].target = this.elements[index].target;
    this.elements[index].target = activeRow;
    this.elements[index].active = true;
    this.dragElement.activeIndex = index;

    this.zone.run(() => {
      this.cdRef.markForCheck();
    })
  }

  /**
   * Update cell width for draggable elem
   * @param event
   */
  private updateDraggableDims(event) {
    const draggableCells: any = Array.from(this.dragElement.draggableEl.querySelectorAll('td'));

    Array.from(
      event.target.querySelectorAll('td')
    ).forEach((elem: any, index) => {
      const dims = elem.getBoundingClientRect();
      draggableCells[index].style.width = dims.width + 'px';
    });
  }

  /**
   * Fix background when mobile
   * @param e
   */
  private touchFix(e) {
    if (!('clientX' in e) && !('clientY' in e)) {
      const touches = e.touches || e.originalEvent.touches;
      if (touches && touches.length) {
        e.clientX = touches[0].clientX;
        e.clientY = touches[0].clientY;
      }
      e.preventDefault();
    }
  }
}