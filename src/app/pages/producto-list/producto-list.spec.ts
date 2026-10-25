import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoList } from './producto-list';

describe('ProductoList', () => {
  let component: ProductoList;
  let fixture: ComponentFixture<ProductoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
