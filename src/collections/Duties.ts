import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

const dutyMembership: Access = ({ req }) => {
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

export const Duties: CollectionConfig = {
  slug: 'duties',
  access: {
    create: ({ req }) =>
      req.user?.collection === 'admins' || req.user?.collection === 'users',
    delete: dutyMembership,
    read: dutyMembership,
    update: dutyMembership,
  },
  admin: {
    group: 'Home',
    useAsTitle: 'title',
    defaultColumns: ['title', 'home', 'dueDate', 'assignee', 'done'],
  },
  hooks: {
    beforeValidate: [validateHomeMembership],
  },
  fields: [
    {
      name: 'home',
      type: 'relationship',
      relationTo: 'homes',
      required: true,
      index: true,
    },
    { name: 'title', type: 'text', required: true, maxLength: 160 },
    { name: 'category', type: 'text', required: true, maxLength: 80 },
    { name: 'dueDate', type: 'text', required: true, maxLength: 80 },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      options: ['Monthly', 'Quarterly', 'Biannual', 'Annual'],
    },
    { name: 'assignee', type: 'text', required: true, maxLength: 100 },
    { name: 'done', type: 'checkbox', defaultValue: false },
    {
      name: 'priority',
      type: 'select',
      required: true,
      options: ['low', 'medium', 'high'],
    },
  ],
}
