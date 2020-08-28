import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChartPieComponent } from './d3-chart-pie.component';

describe('D3ChartPieComponent', () => {
  let component: D3ChartPieComponent;
  let fixture: ComponentFixture<D3ChartPieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ChartPieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
