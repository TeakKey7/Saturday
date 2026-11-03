import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

const createBlankHomeOnSignup: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  await req.payload.create({
    collection: 'homes',
    data: {
      name: 'Blank Home (Please Edit)',
      address: 'Address to be updated',
      members: [doc.id],
    },
    overrideAccess: true,
  })

  return doc
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => req.user?.collection === 'admins',
    create: () => true,
    delete: ({ req }) => req.user?.collection === 'admins',
    read: () => true,
    update: ({ req }) => {
      if (req.user?.collection === 'admins') return true
      if (req.user?.collection !== 'users') return false
      return { id: { equals: req.user.id } }
    },
  },
  admin: {
    group: 'Accounts',
    useAsTitle: 'name',
  },
  hooks: {
    afterChange: [createBlankHomeOnSignup],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: true,
      requireUsername: true,
    },
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    useSessions: false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
  ],
}
