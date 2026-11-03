import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

const homeMembership: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { members: { contains: req.user.id } }
}

const assignCreatingUser: CollectionBeforeValidateHook = ({ data, operation, req }) => {
  if (operation !== 'create' || req.user?.collection !== 'users') return data
  return {
    ...data,
    members: [req.user.id],
  }
}

export const Homes: CollectionConfig = {
  slug: 'homes',
  access: {
    create: ({ req }) =>
      req.user?.collection === 'admins' || req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'admins',
    read: homeMembership,
    update: homeMembership,
  },
  admin: {
    group: 'Home',
    useAsTitle: 'name',
    defaultColumns: ['name', 'address'],
  },
  hooks: {
    beforeValidate: [assignCreatingUser],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      maxLength: 200,
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      minRows: 1,
    },
  ],
}
