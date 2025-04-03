import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupCounter } from '../counter';
/**
 * @vitest-environment jsdom
 */

// Mock the setupCounter function
vi.mock('../counter', () => ({
  setupCounter: vi.fn(),
}));

describe('main.ts', () => {
  let appDiv: HTMLDivElement;

  beforeEach(async () => {
    // Create a mock #app element before importing main.ts
    appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);

    // Import main.ts after the #app element is added to the DOM
    vi.resetModules();
    await import('../main');
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = '';
  });

  it('should render the #app element', () => {
    const app = document.querySelector<HTMLDivElement>('#app');
    expect(app).not.toBeNull();
  });

  it('should set the correct innerHTML for the #app element', () => {
    const app = document.querySelector<HTMLDivElement>('#app');
    expect(app!.innerHTML).toContain('<h1>Vite + TypeScript</h1>');
    expect(app!.innerHTML).toContain('<button id="counter" type="button"></button>');
  });

  it('should call setupCounter with the #counter button', () => {
    const counterButton = document.querySelector<HTMLButtonElement>('#counter');
    expect(setupCounter).toHaveBeenCalledWith(counterButton);
  });
});