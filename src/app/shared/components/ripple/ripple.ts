import { Directive, ElementRef, Input, Output, EventEmitter, Optional, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';



const events = [ "mousedown", "mouseup", "touched", "mouseleave", "touchstart", "touchcancel" ]

@Directive({
    selector: '[SmRipple]'
    , exportAs: 'SmRipple'
    , host: {
        'class': 'sm-ripple'
    }
})
export class SmRipple {


    @Input() disabled: boolean;

    @Input()
    get target(): HTMLElement  { return this._target};
    set target(element: HTMLElement ) {

      this._target = element;
      this._applayEventTarget();
    }
    private _target: HTMLElement ;

    @Output() readonly rippleStart: EventEmitter<any> = new EventEmitter<any>();

    @Output() readonly rippleEnd: EventEmitter<any> = new EventEmitter<any>();

    private eventTriggerFired: boolean;

    private initializad: boolean;

    private lastTouchedInteration: number;

    private ignoreIteractionElement: 900;

    private activeRipples: Set<RippleRef> = new Set<RippleRef>();

    private recentRippleRef: RippleRef | null;

    private persistEvent: boolean;

    constructor(
        private elementRef: ElementRef<HTMLElement>
        , @Optional() @Inject(DOCUMENT) private  _document: any
    ) { }

    private _applayEventTarget(){

    // remove all events
    if(this.initializad)
    events.forEach( event => this.targetHost.removeEventListener(event, $event => this.handleEvent($event,  this)));

    events.forEach(event => this.targetHost.addEventListener(event, $event => this.handleEvent($event, this)))
  }
  private _onMouseDown(event: MouseEvent) {

    const overflowEvent = this.lastTouchedInteration &&
      new Date().getTime() < this.lastTouchedInteration + this.ignoreIteractionElement;

    if(!overflowEvent) {
      this.eventTriggerFired = true;
      this.effect(event.clientX, event.clientY, this.targetHost.clientWidth);
    }
  }
  /**
   *
   */
  private _onTouched(event: TouchEvent) {

  }
  /**
   *
   */
  private _onMouseLeave(event: MouseEvent) {

  }
  /**
   *
   */
  private _onTouchStart(event: MouseEvent) {


    this.lastTouchedInteration = new Date().getTime();
  }

  private fadeOutUpEvent() {
    if(!this.eventTriggerFired)  return;

    this.eventTriggerFired = false;

    this.activeRipples.forEach(  ripple => {

      ripple.rippleRef.removeEffect(ripple);

    })
  }

  private handleEvent(event: Event, self) {
    switch(event.type) {
      case 'mousedown' :
        self._onMouseDown(event as MouseEvent);
        break;
      case "touchstart":
        self._onTouchStart(event as TouchEvent);
        break;
      default:
        self.fadeOutUpEvent();
    }

  }
  /**
   *
   */
  private _removeListenerEvent(){}

  private effect(offsetX: number, offsetY: number, offsetWidth: number) {

    const ref = this._document.createElement('div');
    ref.classList.add('sm-ripple-element');
    const clientRef = this.host.getBoundingClientRect();

    let height = clientRef.height;
    let width = clientRef.width;
    if(width >= height) {
      height = width
    }else  {
      width = height;
    }
    const radius = radiusCenterClickClient(offsetX, offsetY, clientRef); // refer angular-material

    const x = offsetX - clientRef.left

    const y = offsetY - clientRef.top;
    ref.style.left = `${x - radius}px`;
    ref.style.top = `${y - radius}px`;
    ref.style.width = `${radius * 2}px`;
    ref.style.height = `${radius * 2}px`;


    this.host.appendChild(ref);
    ref.style.transitionDuration = `${400}ms`;
    const ripple = new RippleRef();
    ripple.elementRef = ref;
    ripple.rippleRef = this;
    this.activeRipples.add(ripple);
    if(!this.persistEvent)
      this.recentRippleRef = ripple;

   setTimeout(() => {
     const recentRippleRef = ripple == this.recentRippleRef;
     if(recentRippleRef && !this.eventTriggerFired) {
        ref.parentNode.removeChild(ref);
     }
   }, 450)
  }

  removeEffect(ripple: RippleRef) {

    const deleted = this.activeRipples.delete(ripple);
    if(!deleted) return

    const riplerippleEl = ripple.elementRef;
    riplerippleEl.style.transitionDuration = `${400}ms`;

    if (ripple === this.recentRippleRef)
      this.recentRippleRef = null;

    setTimeout(() => {
    // riplerippleEl.parentNode.removeChild(riplerippleEl);
    }, 400)
  }
  /**
  * custom
  */
  get host() {
    return this.elementRef.nativeElement;
  }
  /**
  * return the host element based on passed element
  */
  get targetHost() {
    return this._target;
  }

}

// calculte center click or distance pointer
// ref @link {https://www.educamaisbrasil.com.br/enem/matematica/distancia-entre-dois-pontos}
// clientX, clientY where the element is visible in browser the client
export const radiusCenterClickClient = (x: number, y: number, clientRec: ClientRect) => {

  const distanceX = Math.max(Math.abs( x - clientRec.left ), Math.abs(x - clientRec.right));
  const distanceY = Math.max(Math.abs( y - clientRec.top ), Math.abs(y - clientRec.bottom ));

  return Math.sqrt(distanceX  * distanceX + distanceY * distanceY);
}

type RIPPLE_STATE = "VISIBLE" | "HIDDEN" | "DISABLED" | "FADEIN"  | "FADEOUT";

export class RippleRef {

  /**
  * Ripple reference the directive
  */
  rippleRef: SmRipple;

  /**
  * element ref on  elementRef<HTMLElement> inside the directive
  */
  elementRef: HTMLElement;

  /**
  * fake state that apply where fired event
  */
  statte:  RIPPLE_STATE;

  constructor() {}

}
