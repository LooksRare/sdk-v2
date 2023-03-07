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

### Submit a PR

Before you submit a PR, make sure that:

- All the tests pass ✅ and your code is covered
- Your code is properly formatted with Prettier
- You code doesn't raise any ESlint warning
- Your changes are explained in your PR

When in doubt, [Create a new issue](https://github.com/LooksRare/sdk-v2/issues/new) to discuss your proposal first.

### Release

- Create a [personal access token](https://github.com/settings/tokens/new?scopes=repo&description=release-it) (Don't change the default scope)
- Create an `.env` (copy `.env.template`) and set you github personal access token.
- `yarn release` will run all the checks, build, and publish the package, and publish the github release note.
- `yarn release --dry-run` simulates a release process.
