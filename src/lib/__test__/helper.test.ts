import type { SyntheticEvent } from 'react';

describe('helper', () => {
  it('should be able to import helper', () => {
    expect(() => import('../helper')).not.toThrow();
  });

  it('should prevent bubbling', async () => {
    const { preventBubbling } = await import('../helper');

    const mockCallback = jest.fn();

    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    };

    preventBubbling({ callback: mockCallback })(
      mockEvent as unknown as SyntheticEvent
    );

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should prevent default with prevent default', async () => {
    const { preventBubbling } = await import('../helper');

    const mockCallback = jest.fn();

    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn()
    };

    preventBubbling({ preventDefault: true, callback: mockCallback })(
      mockEvent as unknown as SyntheticEvent
    );

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalled();
  });

  it('should sleep', async () => {
    const { sleep } = await import('../helper');

    const mockCallback = jest.fn();

    await sleep(100).then(mockCallback);

    expect(mockCallback).toHaveBeenCalled();
  });
});
