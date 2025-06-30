import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage, anyCompanyStorage, otherCompanyStorage, assetsStorage } from './storage/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  storage,
  anyCompanyStorage,
  otherCompanyStorage,
  assetsStorage
});
