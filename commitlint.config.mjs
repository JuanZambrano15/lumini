// Valida que los mensajes de commit sigan Conventional Commits.
// https://www.conventionalcommits.org/es/v1.0.0/
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['api', 'web', 'db', 'docker', 'ci', 'deps', 'docs', 'repo']],
  },
};
