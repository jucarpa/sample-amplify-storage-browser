import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Stack } from 'aws-cdk-lib';
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

// Crear stack dedicado para bucket existente
const customStack = backend.createStack('AssetsStack');

// Referenciar bucket existente
const existingBucket = Bucket.fromBucketName(
  customStack,
  'ExistingAssetsBucket',
  'assets-files-jantcart-35667'
);

// Obtener el rol del grupo admin y añadir permisos
const adminRole = backend.auth.resources.groups.admin.role;
adminRole.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      's3:GetObject',
      's3:PutObject',
      's3:DeleteObject',
      's3:ListBucket'
    ],
    resources: [
      existingBucket.bucketArn,
      `${existingBucket.bucketArn}/admin/*`
    ]
  })
);

// Configuración del bucket existente para el frontend
backend.addOutput({
  storage: {
    aws_user_files_s3_bucket: existingBucket.bucketName,
    aws_user_files_s3_bucket_region: Stack.of(existingBucket).region
  }
});
