import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
      ],
    }).compileComponents();
  });

  it('deve criar o app', () => {
    const appFixture = TestBed.createComponent(App);
    expect(appFixture.componentInstance).toBeTruthy();
  });

  it('deve renderizar a barra de ferramentas', async () => {
    const appFixture = TestBed.createComponent(App);
    await appFixture.whenStable();
    const appElement = appFixture.nativeElement as HTMLElement;
    expect(appElement.querySelector('mat-toolbar')).not.toBeNull();
  });

  it('deve renderizar o router outlet', async () => {
    const appFixture = TestBed.createComponent(App);
    await appFixture.whenStable();
    const appElement = appFixture.nativeElement as HTMLElement;
    expect(appElement.querySelector('router-outlet')).not.toBeNull();
  });
});
