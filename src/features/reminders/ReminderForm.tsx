'use client'

import { createReminder } from './actions'

export function ReminderForm({ assets, userId }: { assets: any[], userId: string }) {
  return (
    <form action={createReminder} className="flex flex-col gap-4 max-w-md">
      {/* Hidden input to automatically link to user profile */}
      <input type="hidden" name="userId" value={userId} />
      
      <div className="flex flex-col">
        <label htmlFor="title" className="font-semibold mb-1">Reminder Task</label>
        <input name="title" id="title" type="text" required className="border p-2 rounded" />
      </div>

      <div className="flex flex-col">
        <label htmlFor="asset" className="font-semibold mb-1">Related Asset</label>
        <select name="asset" id="asset" required className="border p-2 rounded">
          <option value="">Select an asset...</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>{asset.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="dueDate" className="font-semibold mb-1">First Due Date</label>
        <input name="dueDate" id="dueDate" type="date" required className="border p-2 rounded" />
      </div>

      <div className="flex flex-col">
        <label htmlFor="frequency" className="font-semibold mb-1">Frequency</label>
        <select name="frequency" id="frequency" className="border p-2 rounded">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>

      <button type="submit" className="bg-black text-white p-2 rounded font-semibold mt-2">
        Save Reminder
      </button>
    </form>
  )
}