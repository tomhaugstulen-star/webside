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
      name: 'no-orphans',
      comment: 'Filer uten innkommende eller utgående avhengigheter skal vurderes fjernet eller koblet inn.',
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
