import React, { useState } from 'react';
import { Plus, Trash2, UserCheck, Phone, User } from 'lucide-react';

export default function RoleManager({ roles, onChange }) {
  const [newRoleName, setNewRoleName] = useState('');
  const [newAssignedPerson, setNewAssignedPerson] = useState('');
  const [newContact, setNewContact] = useState('');

  function handleAddRole(e) {
    e.preventDefault();
    if (!newRoleName.trim() || !newAssignedPerson.trim()) return;

    const updatedRoles = [
      ...roles,
      {
        id: Date.now().toString(),
        roleName: newRoleName.trim(),
        assignedPerson: newAssignedPerson.trim(),
        contact: newContact.trim()
      }
    ];

    onChange(updatedRoles);
    setNewRoleName('');
    setNewAssignedPerson('');
    setNewContact('');
  }

  function handleRemoveRole(index) {
    const updatedRoles = roles.filter((_, i) => i !== index);
    onChange(updatedRoles);
  }

  return (
    <div className="space-y-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            Event-Specific Roles
          </h3>
          <p className="text-xs text-slate-400">
            Define custom roles for this event (e.g. Judge, Speaker, Coordinator, Host, In-charge)
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
          {roles.length} {roles.length === 1 ? 'Role' : 'Roles'} Added
        </span>
      </div>

      {/* Add Role Input Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Role Title *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Chief Judge, Speaker"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Assigned Person *</label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Dr. Jane Doe"
              value={newAssignedPerson}
              onChange={(e) => setNewAssignedPerson(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Contact Info (Optional)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. jane@domain.com / +1 555..."
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddRole}
        disabled={!newRoleName.trim() || !newAssignedPerson.trim()}
        className="w-full py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none rounded-xl text-xs font-semibold transition-all border border-indigo-500/30 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Role to Event
      </button>

      {/* Roles List */}
      {roles.length > 0 && (
        <div className="mt-4 space-y-2 pt-2 border-t border-slate-800">
          {roles.map((r, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">
                    {r.roleName} <span className="text-indigo-400 font-normal">→ {r.assignedPerson}</span>
                  </div>
                  {r.contact && (
                    <div className="text-xs text-slate-400">{r.contact}</div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveRole(index)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Remove Role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
