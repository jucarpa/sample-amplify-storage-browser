import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myStorageBucket',
  isDefault: true,
   access: (allow) => ({
    'public/*': [
        allow.guest.to(['read', 'write']),
        allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'admin/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.authenticated.to(['read'])
    ],
    'private/{entity_id}/*': [
        allow.entity('identity').to(['read', 'write', 'delete'])
    ]
   })
});

export const anyCompanyStorage = defineStorage({
  name: 'anyCompanyBucket',
   access: (allow) => ({
    'public/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.groups(['anycompany_read']).to(['read']),
        allow.groups(['anycompany_write']).to(['read']),
    ],
    'private/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.groups(['anycompany_read']).to(['read']),
        allow.groups(['anycompany_write']).to(['read','write','delete']),
    ]
   })
});

export const otherCompanyStorage = defineStorage({
  name: 'otherCompanyBucket',
   access: (allow) => ({
    'public/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.groups(['othercompany_read']).to(['read']),
        allow.groups(['othercompany_write']).to(['read']),
    ],
    'private/*': [
        allow.groups(['admin']).to(['read', 'write', 'delete']),
        allow.groups(['othercompany_read']).to(['read']),
        allow.groups(['othercompany_write']).to(['read','write','delete']),
    ]
   })
});

export const assetsStorage = defineStorage({
  name: 'assetsStorage',
  bucketName: 'assets-files-jantcart-35667',
  access: (allow) => ({
    'admin/*': [
      allow.groups(['admin']).to(['read', 'write', 'delete'])
    ]
  })
});

