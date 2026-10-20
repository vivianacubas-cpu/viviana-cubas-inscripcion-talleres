import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });

  it('should create the application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start without registered participants', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.totalInscritos).toBe(0);
  });
});
