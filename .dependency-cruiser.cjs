/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Sirkulære avhengigheter gjør modulene vanskeligere å endre og teste.',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'not-to-unresolvable',
      comment: 'Alle importer skal kunne løses av prosjektet.',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-unreachable-from-main',
      comment: 'Alle kildekodemoduler skal være i bruk fra programmets inngangspunkt.',
      severity: 'error',
      from: {
        path: '^src/main\\.tsx$',
      },
      to: {
        path: '^src/',
        pathNot: '\\.d\\.ts$',
        reachable: false,
      },
    },
    {
      name: 'no-orphans',
      comment: 'Helt frakoblede filer skal vurderes fjernet eller koblet inn.',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)main\\.[cm]?[jt]sx?$',
          '(^|/)vite-env\\.d\\.ts$',
        ],
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: {
      path: '(^|/)node_modules/',
    },
    exclude: {
      path: [
        '(^|/)dist/',
        '(^|/)node_modules/',
      ],
    },
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
    tsPreCompilationDeps: true,
    reporterOptions: {
      mermaid: {
        minify: false,
      },
    },
  },
}
