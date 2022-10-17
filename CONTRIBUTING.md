## Dev

### Setup

Install dependencies with `yarn`

### Commands

- **Dev**: `yarn dev`
- **Build**: `yarn build`
- **Test**: `yarn test`
- **Lint**: `yarn lint`
- **Format**: `yarn format:check`, `yarn format:write`
- **Documentation**: `yarn doc`

### Release

- Create a [Personal access token](https://github.com/settings/tokens/new?scopes=repo&description=release-it) (Don't change the default scope)
- Create an `.env` (copy `.env.template`) and set you github personal access token.
- `yarn release` will run all the checks, build, and publish the package, and publish the github release note.
