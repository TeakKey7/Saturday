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
    create: () => true,
    read: ({ req: { user } }) => true, // Optionally restrict to user.id === doc.user
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      required: true,
      admin: {
        description: 'The asset this reminder relates to',
      }
    },
    {
      name: 'home',
      type: 'relationship',
      relationTo: 'homes',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
    },
    {
      name: 'frequency',
      type: 'select',
      options: ['daily', 'weekly', 'monthly', 'yearly'],
      admin: {
        description: 'Automatically setup recurring reminders',
      }
    }
  ],
}