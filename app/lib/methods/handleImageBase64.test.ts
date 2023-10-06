import { sanitizeLikeString } from '../database/utils';
import { getBase64MimeType, isImageBase64, valueOfFirst120CharactersOfImageBase64 } from './handleBase64';

const base64 =
	'data:image/png;base64,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';

describe('Test the isImageBase64', () => {
	it.each([
		['test', false],
		['/file-upload/oTQmb2zRCsYF4pdHv/help-image-url.png', false],
		[base64, true]
	])('return properly the boolean', (data, res) => {
		const result = isImageBase64(data);
		expect(result).toBe(res);
	});
});

describe('Test the valueOfFirst120CharactersOfImageBase64', () => {
	it('should return at least the first 120 characters of the data', () => {
		const expected =
			'iVBORw0KGgoAAAANSUhEUgAAAKkAAADcCAIAAACEWBYKAAAAA3NCSVQICAjb4U/gAAAgAElEQVR4nO29aZAc13WoeXOtrMza967qHd1ooAGRBLQNTcnUxmHM';
		const result = valueOfFirst120CharactersOfImageBase64(base64);
		expect(result).toBe(expected);
	});

	it('return correctly the value either when the base64 data has less then 120 characters', () => {
		const dataLessCharactersThan120 = base64.slice(0, 100);
		const expected = 'iVBORw0KGgoAAAANSUhEUgAAAKkAAADcCAIAAACEWBYKAAAAA3NCSVQICAjb4U/gAAAgAElEQVR4nO';
		const result = valueOfFirst120CharactersOfImageBase64(dataLessCharactersThan120);
		expect(result).toBe(expected);
	});
});

describe('Sanitize the result of valueOfFirst120CharactersOfImageBase64', () => {
	it('return the sanitized value without special characters', () => {
		const expected =
			'iVBORw0KGgoAAAANSUhEUgAAAKkAAADcCAIAAACEWBYKAAAAA3NCSVQICAjb4U_gAAAgAElEQVR4nO29aZAc13WoeXOtrMza967qHd1ooAGRBLQNTcnUxmHM';
		const result = sanitizeLikeString(valueOfFirst120CharactersOfImageBase64(base64));
		expect(result).toBe(expected);
	});
});

describe('Test the getBase64MimeType', () => {
	it('return the mimeType expected from image base64', () => {
		const expected = 'image/png';
		const result = getBase64MimeType(base64);
		expect(result).toBe(expected);
	});
});
