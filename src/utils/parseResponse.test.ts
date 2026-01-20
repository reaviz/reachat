import { parseResponse } from './parseResponse';

describe('parseResponse util function', () => {
  it('should parse an empty string', () => {
    expect(parseResponse('')).to.equal('');
  });

  it('should parse an empty array', () => {
    expect(parseResponse([])).to.equal('');
  });

  it('should parse an standard string', () => {
    expect(parseResponse('hello world')).to.equal('hello world');
  });

  it('should parse an array with a single value', () => {
    expect(parseResponse(['hello world'])).to.equal('hello world');
  });

  it('should parse an array with multiple values', () => {
    expect(
      parseResponse(['hello', 'world', 'this', 'is', 'a', 'test'])
    ).to.equal('hello\nworld\nthis\nis\na\ntest');
  });
});
