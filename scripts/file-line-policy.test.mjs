import assert from 'node:assert/strict'
import test from 'node:test'
import {
  countLines,
  findViolations,
  validateExceptionConfiguration,
} from './file-line-policy.mjs'

const file = (lines, path = 'src/example.ts') => ({ path, lines })

test('counts empty, trailing newline and CRLF content consistently', () => {
  assert.equal(countLines(''), 0)
  assert.equal(countLines('one line'), 1)
  assert.equal(countLines('one line\n'), 1)
  assert.equal(countLines('one\r\ntwo\r\n'), 2)
})

test('allows an ordinary production file with 249 lines', () => {
  assert.deepEqual(findViolations([file(249)], new Map()), [])
})

test('rejects an ordinary production file with 250 lines', () => {
  const violations = findViolations([file(250)], new Map())
  assert.equal(violations.length, 1)
  assert.match(violations[0], /250 linjer/)
})

test('allows a documented exception from 250 through 299 lines', () => {
  const exceptions = new Map([['src/example.ts', 'Temporary reviewed exception']])
  assert.deepEqual(findViolations([file(250)], exceptions), [])
  assert.deepEqual(findViolations([file(299)], exceptions), [])
})

test('rejects every production file with 300 lines, including exceptions', () => {
  const exceptions = new Map([['src/example.ts', 'Temporary reviewed exception']])
  const violations = findViolations([file(300)], exceptions)
  assert.equal(violations.length, 1)
  assert.match(violations[0], /hardgrensen/)
})

test('rejects an exception without a concrete reason', () => {
  const errors = validateExceptionConfiguration(
    new Map([['src/example.ts', file(250)]]),
    new Map([['src/example.ts', '   ']]),
  )
  assert.equal(errors.length, 1)
  assert.match(errors[0], /mangler en konkret begrunnelse/)
})

test('rejects an exception for an uncontrolled or missing file', () => {
  const errors = validateExceptionConfiguration(
    new Map(),
    new Map([['src/missing.ts', 'Temporary reviewed exception']]),
  )
  assert.equal(errors.length, 1)
  assert.match(errors[0], /ikke på en kontrollert produksjonsfil/)
})

test('rejects an outdated exception below the active limit', () => {
  const errors = validateExceptionConfiguration(
    new Map([['src/example.ts', file(249)]]),
    new Map([['src/example.ts', 'Temporary reviewed exception']]),
  )
  assert.equal(errors.length, 1)
  assert.match(errors[0], /foreldet/)
})

test('accepts a valid documented exception inside the exception range', () => {
  const errors = validateExceptionConfiguration(
    new Map([['src/example.ts', file(250)]]),
    new Map([['src/example.ts', 'Temporary reviewed exception']]),
  )
  assert.deepEqual(errors, [])
})
