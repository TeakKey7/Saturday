import type { Access, CollectionConfig } from 'payload'

const ownProfile: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: () => false,
    create: () => true,
    delete: () => false,
    read: ownProfile,
    update: ownProfile,
  },
  admin: {
    hidden: true,
    useAsTitle: 'name',
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
