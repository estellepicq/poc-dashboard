import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ChartBarComponent } from './d3-chart-bar.component';

describe('D3ChartBarComponent', () => {
  let component: D3ChartBarComponent;
  let fixture: ComponentFixture<D3ChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3ChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3ChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
