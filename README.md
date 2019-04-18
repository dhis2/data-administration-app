# DHIS2 Data Administration App

[![Build Status](https://travis-ci.com/dhis2/data-administration-app.svg?branch=master)](https://travis-ci.com/dhis2/data-administration-app)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdhis2%2Fdata-administration-app.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdhis2%2Fdata-administration-app?ref=badge_shield)
[![Greenkeeper status](https://badges.greenkeeper.io/dhis2/data-administration-app.svg)](https://greenkeeper.io)

### Pre-requisites

* DHIS2 instance;
* node v9.3.0+;
* yarn v1.3.2+;

### Running the dev server

* Duplicate `.env.template` and rename it to `.env.development.local`
* Update the configuration in the new file to match your DHIS2 installation. For example:
    ```
    REACT_APP_DHIS2_BASE_URL=http://localhost:8080
    ```
* Update the api version in `package.json` at `manifest.webapp.dhis2.apiVersion` if it doesn't match your DHIS2 api version
* Add `http://localhost:3000` to your DHIS2 CORS whitelist (this can be done in the settings app)
* Execute the following commands:
    ```sh
    yarn install
    yarn start
    ```
* Login to your DHIS2 instance in your browser
* Open your browser at `http://localhost:3000`

### Building the project
To build a production version of the application run the following command:

```sh
yarn build
```

### Unit testing
To execute unit tests run the following command:

```sh
yarn test
```

### E2e testing

To execute end to end tests run the following command:

```sh
export DHIS2_BASE_URL=http://your_dhis2_instance.com/
yarn test-e2e
```

You must have the dev server running on port 3000, as explained previously.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdhis2%2Fdata-administration-app.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdhis2%2Fdata-administration-app?ref=badge_large)
