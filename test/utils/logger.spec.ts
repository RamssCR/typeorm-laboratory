import { describe, expect, test, vi } from 'vitest';
import { Writable } from 'node:stream';
import { logger } from '#utils/logger';
import winston from 'winston';

describe('Logger Utility Function', () => {
  test('should log info messages', () => {
    const mockWrite = vi.fn();

    const mockStream = new Writable({
      write(chunk, _, callback) {
        mockWrite(chunk.toString());
        callback();
      },
    });

    logger.add(new winston.transports.Stream({ stream: mockStream }));
    logger.info('Test info message');
    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining('Test info message'),
    );
  });

  test('should log error messages', () => {
    const mockWrite = vi.fn();

    const mockStream = new Writable({
      write(chunk, _, callback) {
        mockWrite(chunk.toString());
        callback();
      },
    });

    logger.add(new winston.transports.Stream({ stream: mockStream }));

    logger.error('Test error message');

    expect(mockWrite).toHaveBeenCalledWith(
      expect.stringContaining('Test error message'),
    );
  });
});
