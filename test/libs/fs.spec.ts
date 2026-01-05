import { describe, expect, test, vi } from 'vitest';
import { OUTPUT_FILE } from '#utils/constants';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { writeJson } from '#libs/fs';

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
}));

describe('writeJson', () => {
  test('should write a JSON file with the provided data at the specified path', async () => {
    const data = { key: 'value' };

    await writeJson(data);

    const expectedPath = resolve(process.cwd(), OUTPUT_FILE);
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  });

  test('should use "output.json" as the default path if no path is provided', async () => {
    const data = { anotherKey: 'anotherValue' };

    await writeJson(data);

    const expectedPath = resolve(process.cwd(), OUTPUT_FILE);
    expect(writeFile).toHaveBeenCalledWith(
      expectedPath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  });

  test('should throw an error if file writing fails', async () => {
    const errorMessage = 'Disk is full';
    vi.mocked(writeFile).mockRejectedValueOnce(new Error(errorMessage));

    await expect(writeJson({ key: 'value' })).rejects.toThrow(
      `Error writing JSON file to ${OUTPUT_FILE}: ${errorMessage}`,
    );
  });

  test('should rethrow non-Error exceptions', async () => {
    const nonError = 'Some string error';
    vi.mocked(writeFile).mockRejectedValueOnce(nonError);

    await expect(writeJson({ key: 'value' })).rejects.toBe(nonError);
  });
});
