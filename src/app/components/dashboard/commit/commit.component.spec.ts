import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitComponent } from './commit.component';

describe('CommitComponent', () => {
  let component: CommitComponent;
  let fixture: ComponentFixture<CommitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
