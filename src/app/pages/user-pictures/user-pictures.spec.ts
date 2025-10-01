import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPictures } from './user-pictures';

describe('UserPictures', () => {
  let component: UserPictures;
  let fixture: ComponentFixture<UserPictures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPictures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPictures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
