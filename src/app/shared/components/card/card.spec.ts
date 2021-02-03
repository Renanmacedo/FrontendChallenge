import { TestBed, async } from '@angular/core/testing';
import { SmCard } from './card';

describe('CardComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SmCard
      ],
    }).compileComponents();
  }));
  it('should create the component in app', async(() => {
    const fixture = TestBed.createComponent(SmCard);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});