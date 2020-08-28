import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChartLineComponent } from './d3-chart-line.component';

describe('D3ChartLineComponent', () => {
  let component: D3ChartLineComponent;
  let fixture: ComponentFixture<D3ChartLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ChartLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ChartLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
