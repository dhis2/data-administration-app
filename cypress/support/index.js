import '@testing-library/cypress/add-commands.js'
import { enableAutoLogin, enableNetworkShim } from '@dhis2/cypress-commands'

enableAutoLogin()
enableNetworkShim()
