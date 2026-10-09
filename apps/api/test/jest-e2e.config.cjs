/** Tests e2e: levantan la app completa contra una base de datos PostgreSQL real. */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testTimeout: 30000,
};
