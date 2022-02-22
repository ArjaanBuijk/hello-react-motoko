# hello-react-motoko

A bootstrap React + Motoko example, using dracula UI styling

# Ubuntu

Development & CI/CD (GitHub Actions) is done on Ubuntu 20.04.

# Setup

## Git

```bash
git clone <this repo>
cd hello-react-motoko
```

## Conda

[Download MiniConda](https://docs.conda.io/en/latest/miniconda.html#linux-installers) and then install it:

```bash
bash Miniconda3-xxxxx.sh
```

Create a conda environment with NodeJS & Python:

```bash
conda create --name hello-react-motoko nodejs python=3.9
conda activate hello-react-motoko

# Make sure these are within the conda environment
which npm
which node
which pip
which python

# Check versions
npm --version
node --version
pip --version
python --version
```

## Python

```bash
conda activate hello-react-motoko

make python-install
```

## JavaScript

All styling is done using Dracula UI, for which you must [buy a licence](https://draculatheme.gumroad.com/l/dracula-ui) and then set up as explained in the [Dracula UI docs](https://ui.draculatheme.com/installation).

- Create a [GitHub Personal Access Token](https://github.com/settings/tokens/new)

- Store it in a `.env` file in the root of this repo, as:

  ```bash
  # GitHub Personal Access Token to install Dracula UI
  GITHUB_PAT_FOR_DRACULA_UI=ghp_...
  ```

- Run this script to install dracula UI and the other npm packages into the project:

  ```bash
  conda activate hello-react-motoko
  
  make javascript-install
  
  # If needed, run `npm audit fix` & check in the new package.json
  ```

## dfx

```bash
make dfx-install

# ~/bin must be on path. Is done automatic if it exists
source ~/.profile

# verify
dfx --version
```

## VS Code Extensions

Install these extensions:

- Motoko, by DFINITY Foundation
- Formatting Toggle, by tombonnike
- Prettier - Code formatter, by Prettier
- ESLint, by Microsoft

# Development

## Code formatting

### Python

- The `black` code format is enforced for `.py` files:

  ```bash
  make python-format
  make python-format-check
  ```

### JavaScript

- The `Prettier` code format is enforced for `.js` & `.jsx` files:

  ```bash
  make javascript-format
  make javascript-format-check
  ```

## Code linting

### Python

- The `pylint` & `mytype` code linter & typer are enforced for `.py` files:

  ```bash
  make python-lint
  make python-lint-check
  make python-type-check
  ```

### JavaScript

- The `ESLint` code linter is enforced for `.js` & `.jsx` files:

  ```bash
  make javascript-lint
  make javascript-lint-check
  ```

## Deploy to local network

```bash
cd hello-react-motoko

# Activate the conda environment
conda activate hello-react-motoko

# Start a local network
make dfx-local-network-start

# Deploy the canisters
conda activate hello-react-motoko
make dfx-deploy-local

# To develop the frontend, start a development server, with hot reloading
# - It does NOT clean out `dist` folder, so sometimes you might need to re-build
npm run start

# To develop the Motoko backend, after each change,re-do the canister deployment
make dfx-deploy-local

# To stop the local network
make dfx-local-network-stop
```

## Test & Debug

### Frontend

- open the browser at http://localhost:8080
  - make changes to the frontend code, and when you save it, everything will be auto-rebuild
  - We use webpack with sourcemaps, so you can use the devtools of the browser to debug the JS code

### Backend

Get the details of the canisters:

```bash
$ make dfx-canisters-of-project
```

Click on the link you want to test in the browser:

- \_\_Candid_UI of canisterMotoko: to test the public API of the backend

  

# Deploy to IC

Deployment to IC is automatic when you merge to the main branch.

When a new canister is introduced, first deploy it manually, as described next.

## Deploy

### Initial & Upgrade

A deployment to IC with the Makefile can only be done from a main branch without any unstaged or staged files.

So, make sure you are on the main branch, with everything checked in, and then run this command:

```bash
# Deploy all canisters to ic.
# Just re-run it to upgrade.
make dfx-deploy-ic
```

### Reinstall

From [docs: reinstall a canister smart contract](https://smartcontracts.org/docs/developers-guide/working-with-canisters.html#reinstall-canister):

> _During the development cycle, you might want to install, then replace your program as you debug and improve it._
>
> _In this scenario, you might want to keep the canister identifier you have registered but without preserving any of the canister code or state. For example, your canister might only have test data that you don’t want to keep or you might have decided to change the program altogether but want to reinstall under a canister identifier you used to install a previous program._

```bash
# run dfx directly to reinstall. You must run it per canister.

# to reinstall frontend
dfx deploy --network ic --mode reinstall canisterFrontend
# to reinstall backend
dfx deploy --network ic --mode reinstall canisterMotoko


# then check canister details
make dfx-canisters-of-project NETWORK=ic
```

## Test

Get the details of the canisters:

```bash
$ make dfx-canisters-of-project-ic
```

Click on the link you want to test in the browser. Most often, you want to check:

- Candid UI of canisterMotoko: to test the public API of the backend
- canisterFrontend : to test the application

# Appendix A: GitHub

## Secrets

The following GitHub repository secrets must be added in support of the GitHub Actions workflows:

- PERSONAL_ACCESS_TOKEN_TO_INSTALL_DRACULA_UI

- DFX_IDENTITY_PEM_ENCODED

  base64 encoded value of the file `~/.config/dfx/identitydefault/identity.pem`:

  Encode into a single line with the command:

  ```bash
  base64 -w 0 ~/.config/dfx/identitydefault/identity.pem
  ```

- DFX_WALLET_CANISTER_ID

  The canister-name of the wallet, which can be found by this command:

  ```bash
  dfx identity --network ic get-wallet
  ```
