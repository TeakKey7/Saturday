import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

const categories = [
  'HVAC',
  'Plumbing',
  'Kitchen',
  'Laundry',
  'Electrical',
  'Garage',
  'Exterior',
  'Safety',
] as const

const isAssetAppRequest: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { 'home.members': { contains: req.user.id } }
}

const validateHomeMembership: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (req.user?.collection !== 'users' || !data?.home) return data
  await req.payload.findByID({
    collection: 'homes',
    id: typeof data.home === 'object' ? data.home.id : data.home,
    overrideAccess: false,
    user: req.user,
  })
  return data
}

export const Assets: CollectionConfig = {
  slug: 'assets',
  access: {
    create: ({ req }) =>
      req.user?.collection === 'admins' || req.user?.collection === 'users',
    delete: () => false,
    read: isAssetAppRequest,
    update: isAssetAppRequest,
  },
  admin: {
    group: 'Home',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status', 'nextService'],
  },
  hooks: {
    beforeValidate: [validateHomeMembership],
  },
  fields: [
    {
      name: 'home',
      type: 'relationship',
      relationTo: 'homes',
      index: true,
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: categories.map(value => ({ label: value, value })),
    },
    {
      name: 'brand',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'model',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'installed',
      type: 'text',
      maxLength: 80,
    },
    {
      name: 'lastService',
      type: 'text',
      maxLength: 80,
    },
    {
      name: 'nextService',
      type: 'text',
      maxLength: 80,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'good',
      options: [
        { label: 'Good', value: 'good' },
        { label: 'Needs attention', value: 'attention' },
        { label: 'Overdue', value: 'overdue' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      maxLength: 2000,
    },
  ],
  versions: false,
}
