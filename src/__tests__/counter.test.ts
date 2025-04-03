import { describe, it, expect, vi } from 'vitest';
import { setupCounter } from '../counter';

describe('setupCounter', () => {
  it('should initialize the counter to 0', () => {
    const button = document.createElement('button');
    setupCounter(button);
    expect(button.innerHTML).toBe('count is 0');
  });

  it('should increment the counter on click', () => {
    const button = document.createElement('button');
    setupCounter(button);

    button.click();
    expect(button.innerHTML).toBe('count is 1');

    button.click();
    expect(button.innerHTML).toBe('count is 2');
  });

  it('should not throw errors when clicking multiple times', () => {
    const button = document.createElement('button');
    setupCounter(button);

    expect(() => {
      for (let i = 0; i < 10; i++) {
        button.click();
      }
    }).not.toThrow();
  });
});