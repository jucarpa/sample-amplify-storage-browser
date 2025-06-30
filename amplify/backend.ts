import { defineBackend } from '@aws-amplify/backend';
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
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

// Crear stack dedicado para bucket existente
const customStack = backend.createStack("custom-bucket-stack");
const customBucket = Bucket.fromBucketAttributes(customStack, "MyCustomBucket", {
  bucketArn: "arn:aws:s3:::assets-files-jantcart-35667",
  region: "eu-west-1"
});

backend.addOutput({
  storage: {
    aws_region: customBucket.env.region,
    bucket_name: customBucket.bucketName,
    buckets: [
      {
        aws_region: customBucket.env.region,
        bucket_name: customBucket.bucketName,
        name: customBucket.bucketName,
        // @ts-expect-error: Amplify backend type issue - https://github.com/aws-amplify/amplify-backend/issues/2569
        paths: {
          "public/*": {
            //authenticated: ["get", "list", "write", "delete"],
          },
          "admin/*": {
            //authenticated: ["get", "list"],
            "groups:admin": ["get", "list", "write", "delete"],
          },
        },
      }
    ]
  },
});

/*
  Define an inline policy to attach to "admin" user group role
  This policy defines how authenticated users with 
  "admin" user group role can access your existing bucket
*/ 
const adminPolicy = new Policy(backend.stack, "customBucketAdminPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject", 
        "s3:DeleteObject"
      ],
      resources: [ `${customBucket.bucketArn}/admin/*`],
    }),
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `${customBucket.bucketArn}`,
        `${customBucket.bucketArn}/*`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["admin/*", "admin/"],
        },
      },
    }),
  ],
});


// Add the policies to the "admin" user group role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);

