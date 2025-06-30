import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { auth } from './auth/resource';
import { storage, anyCompanyStorage, otherCompanyStorage } from './storage/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  storage,
  anyCompanyStorage,
  otherCompanyStorage
});

// Referenciar bucket existente
const existingBucket = Bucket.fromBucketName(
  backend.storage.resources.bucket.stack,
  'ExistingAssetsBucket',
  'assets-files-jantcart-35667'
);

// Crear política para grupo admin
const adminGroupRole = backend.auth.resources.groups['admin'].role;
adminGroupRole.addToPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 's3:ListBucket'],
    resources: [
      existingBucket.bucketArn,
      `${existingBucket.bucketArn}/admin/*`
    ]
  })
);

// Añadir configuración del bucket existente
backend.addOutput({
  custom: {
    assetsStorageBucket: 'assets-files-jantcart-35667'
  }
});
