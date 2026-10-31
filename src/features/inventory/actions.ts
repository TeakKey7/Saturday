'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import type { Asset, AssetInput } from '@/types/domain'
import { appAuth } from '@/lib/app-auth'

export type AssetActionResult =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Partial<Record<keyof AssetInput, string>> }

const categories = new Set([
  'HVAC',
  'Plumbing',
  'Kitchen',
  'Laundry',
  'Electrical',
  'Garage',
  'Exterior',
  'Safety',
])
const statuses = new Set(['good', 'attention', 'overdue'])

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validateAsset(input: AssetInput) {
  const data: AssetInput = {
    name: clean(input.name, 120),
    category: clean(input.category, 40),
    brand: clean(input.brand, 120),
    model: clean(input.model, 120),
    installed: clean(input.installed, 80),
    lastService: clean(input.lastService, 80),
    nextService: clean(input.nextService, 80),
    status: statuses.has(input.status) ? input.status : 'good',
    notes: clean(input.notes, 2000),
  }
  const fieldErrors: Partial<Record<keyof AssetInput, string>> = {}
  if (!data.name) fieldErrors.name = 'Enter an asset name.'
  if (!categories.has(data.category)) fieldErrors.category = 'Choose a valid category.'
  return { data, fieldErrors }
}

export async function saveAssetAction(
  input: AssetInput,
  homeId: string,
  id?: Asset['id'],
): Promise<AssetActionResult> {
  const { data, fieldErrors } = validateAsset(input)
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Review the highlighted fields.', fieldErrors }
  }

  try {
    const user = await appAuth.currentUser()
    if (!user) return { success: false, message: 'Sign in again to save this asset.' }
    const payload = await getPayload({ config })
    await payload.findByID({
      collection: 'homes',
      id: homeId,
      overrideAccess: false,
      user,
    })
    const payloadData = {
      home: homeId,
      name: data.name,
      category: data.category as 'HVAC' | 'Plumbing' | 'Kitchen' | 'Laundry' | 'Electrical' | 'Garage' | 'Exterior' | 'Safety',
      brand: data.brand || null,
      model: data.model || null,
      installed: data.installed || null,
      lastService: data.lastService || null,
      nextService: data.nextService || null,
      status: data.status,
      notes: data.notes || null,
    }

    if (id !== undefined) {
      await payload.update({
        collection: 'assets',
        id,
        data: payloadData,
        overrideAccess: false,
        user,
      })
    } else {
      await payload.create({
        collection: 'assets',
        data: payloadData,
        overrideAccess: false,
        user,
      })
    }

    return { success: true }
  } catch {
    return {
      success: false,
      message: 'We could not save this asset. Please try again.',
    }
  }
}
