'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { appAuth } from '@/lib/app-auth'

export type ReminderInput = {
  title: string
  asset: string
  dueDate: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export type ReminderActionResult =
  | { success: true }
  | { success: false; message: string; fieldErrors?: Partial<Record<keyof ReminderInput, string>> }

const frequencies = new Set(['daily', 'weekly', 'monthly', 'yearly'])

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validateReminder(input: ReminderInput) {
  const data: ReminderInput = {
    title: clean(input.title, 120),
    asset: clean(input.asset, 120),
    dueDate: clean(input.dueDate, 80),
    // Ensure TypeScript narrows this back to the literal union type
    frequency: (frequencies.has(input.frequency) ? input.frequency : 'monthly') as ReminderInput['frequency'],
  }
  const fieldErrors: Partial<Record<keyof ReminderInput, string>> = {}
  
  if (!data.title) fieldErrors.title = 'Enter a reminder title.'
  if (!data.asset) fieldErrors.asset = 'Select a related asset.'
  if (!data.dueDate) fieldErrors.dueDate = 'Select a due date.'
  
  return { data, fieldErrors }
}

export async function saveReminderAction(
  input: ReminderInput,
  homeId: string,
  id?: string,
): Promise<ReminderActionResult> {
  const { data, fieldErrors } = validateReminder(input)
  
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Review the highlighted fields.', fieldErrors }
  }

  try {
    const user = await appAuth.currentUser()
    if (!user) return { success: false, message: 'Sign in again to save this reminder.' }
    
    const payload = await getPayload({ config })
    
    // Verify home access
    await payload.findByID({
      collection: 'homes',
      id: homeId,
      overrideAccess: false,
      user,
    })

    // Safely format the incoming YYYY-MM-DD to a standard ISO string for Payload
    let parsedDate = data.dueDate
    try {
      parsedDate = new Date(data.dueDate).toISOString()
    } catch {
      // Fallback to raw string if parsing fails
    }

    const payloadData = {
      home: homeId,
      user: user.id,
      title: data.title,
      asset: data.asset,
      dueDate: parsedDate,
      // Explicit cast for Payload's strict generated types
      frequency: data.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly', 
    }

    // Use a truthy check to prevent empty string IDs ("") from crashing the update query
    if (id) {
      await payload.update({
        collection: 'duties',
        id,
        data: payloadData,
        overrideAccess: false,
        user,
      })
    } else {
      await payload.create({
        collection: 'duties',
        data: payloadData,
        overrideAccess: false,
        user,
      })
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: 'We could not save this reminder. Please try again.',
    }
  }
}