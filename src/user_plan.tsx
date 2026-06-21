'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Shield, CheckCircle2, AlertCircle, RefreshCw, Key, Users, User, ChevronDown, Search, X, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { listAllUsersAndPlans, grantPaidPlanAccessById } from './user_plan.actions';

type DevUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  planName: 'Starter' | 'Professional' | 'Business';
  status: string;
  endDate: string | null;
};

const ITEMS_PER_PAGE = 10;

export default function UserPlanEditor() {
  const [users, setUsers] = useState<DevUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Selected user and plan modal state
  const [selectedUser, setSelectedUser] = useState<DevUser | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Professional' | 'Business'>('Professional');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await listAllUsersAndPlans();
      if (res.success && res.users) {
        setUsers(res.users as DevUser[]);
      } else {
        setErrorMsg(res.error || 'Failed to fetch users.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while loading users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (user: DevUser) => {
    setSelectedUser(user);
    setSelectedPlan(user.planName);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleUpdatePlan = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await grantPaidPlanAccessById(selectedUser.id, selectedPlan);
      if (res.success) {
        setSuccessMsg(`Successfully updated plan for ${selectedUser.email} to ${selectedPlan}!`);
        handleCloseModal();
        await loadData();
      } else {
        setErrorMsg(res.error || 'Failed to update plan.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while updating the plan.');
    } finally {
      setUpdating(false);
    }
  };

  // 1. Filter users based on search query (by email or name)
  const filteredUsers = users.filter((u) => {
    const emailMatch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const nameMatch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    return emailMatch || nameMatch;
  });

  // 2. Paginate filtered users
  const totalPages = Math.max(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE), 1);
  
  // Reset page if filters change and make current page exceed total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [searchQuery, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Lifetime';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      {/* Dev Portal Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0 bg-card">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-accent" />
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            SwiftMail Dev Portal
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
              Production Users
            </span>
          </h1>
        </div>
        
        <button
          onClick={loadData}
          disabled={loading}
          className={`p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
 loading ? 'animate-spin opacity-50' : ''
 }`}
          title="Refresh user list"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Status Alerts */}
        {errorMsg && (
          <div className="flex items-start space-x-2.5 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 text-sm font-medium animate-in fade-in duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start space-x-2.5 p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-sm font-medium animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border text-foreground focus:border-accent rounded-xl py-2 pl-9 pr-4 text-sm placeholder-text-muted outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground font-medium bg-card border border-border rounded-xl px-4 py-2 flex.shrink-0">
            Showing <span className="font-bold text-foreground">{filteredUsers.length}</span> of <span className="font-bold text-foreground">{users.length}</span> users
          </div>
        </div>

        {/* Tabular View */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading && users.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <RefreshCw className="h-8 w-8 text-accent animate-spin" />
              <p className="text-sm text-muted-foreground">Retrieving live production user list...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground text-sm border-dashed border border-border/40 rounded-2xl m-6">
              No users found matching your search query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Plan</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedUsers.map((u) => {
                    let planBadgeColor = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
                    if (u.planName === 'Professional') {
                      planBadgeColor = 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
                    } else if (u.planName === 'Business') {
                      planBadgeColor = 'bg-accent/10 text-accent border-accent/20';
                    }

                    return (
                      <tr 
                        key={u.id} 
                        className="hover:bg-accent/20 transition-colors cursor-pointer"
                        onClick={() => handleOpenModal(u)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                          {u.firstName || u.lastName ? `${u.firstName} ${u.lastName}`.trim() : '(No Name)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-xs font-bold border px-2 py-0.5 rounded-full uppercase ${planBadgeColor}`}>
                            {u.planName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(u.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenModal(u)}
                            className="inline-flex items-center space-x-1 rounded-xl border border-border bg-card hover:bg-accent px-3 py-1.5 text-xs font-bold text-foreground transition-colors cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Modify</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-muted-foreground font-medium">
              Page <span className="font-bold text-foreground">{currentPage}</span> of <span className="font-bold text-foreground">{totalPages}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-xl bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-border rounded-xl bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal Popup Overlay */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4.5 w-4.5 text-accent" />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Configure Subscription tier</h3>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body: User details snapshot */}
            <div className="bg-muted/80 border border-border rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                <div>
                  <p className="text-muted-foreground font-medium">Name</p>
                  <p className="font-bold text-foreground mt-0.5 text-sm">
                    {selectedUser.firstName || selectedUser.lastName
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`.trim()
                      : '(No name set)'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Primary Email</p>
                  <p className="font-mono text-muted-foreground mt-0.5 text-xs truncate select-all" title={selectedUser.email}>
                    {selectedUser.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground font-medium">User ID</p>
                  <p className="font-mono text-muted-foreground mt-0.5 select-all break-all select-all">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Active Plan</p>
                  <p className="font-bold text-accent mt-0.5 text-sm uppercase">
                    {selectedUser.planName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Expires</p>
                  <p className="font-medium text-muted-foreground mt-0.5">
                    {formatDate(selectedUser.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Form: Plan Dropdown Selection */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Subscription Plan</label>
                <div className="relative">
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value as any)}
                    className="w-full bg-background border border-border focus:border-accent text-foreground rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Starter">Starter (Free plan limits)</option>
                    <option value="Professional">Professional (₹599/mo premium tier)</option>
                    <option value="Business">Business (₹999/mo business tier)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-border hover:bg-accent px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdatePlan}
                  disabled={updating}
                  className="rounded-xl bg-accent hover:bg-accent/90 hover:shadow-sm active:scale-[0.98] text-white font-bold text-xs px-5 py-2.5 cursor-pointer flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-3.5 w-3.5" />
                      <span>Apply changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
