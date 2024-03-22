/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  tciAddress: 'https://localhost:7101/api/',
  rcrAddress: 'https://localhost:7138/api/',
  vendorAddress: 'https://localhost:7002/api/',
  focAddress: 'https://localhost:7191/api/',
  salesAddress: 'https://localhost:7082/api/',
};
