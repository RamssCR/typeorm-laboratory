import { OUTPUT_FILE } from '#utils/constants';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

/**
 * Writes a JSON file to the specified path with the provided data.
 * @param data - Data to be written to the JSON file.
 * @returns A promise that resolves when the file has been written.
 * @example
 * await writeJson('data.json', { key: 'value' })
 * // Creates a file 'data.json' with the content: { "key": "value" }
 */
export const writeJson = async (
  data: Record<string, unknown>,
): Promise<void> => {
  try {
    const cwd = process.cwd();
    const fullPath = resolve(cwd, OUTPUT_FILE);
    await writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    if (error instanceof Error)
      throw new Error(
        `Error writing JSON file to ${OUTPUT_FILE}: ${error.message}`,
        { cause: error },
      );

    throw error;
  }
};
