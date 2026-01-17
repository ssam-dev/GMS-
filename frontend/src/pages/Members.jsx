import React, { useState, useEffect, useCallback } from "react";
import { Member } from "@/entities/Member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import MemberCard from "../components/members/MemberCard";
import MemberForm from "../components/members/MemberForm";
import MemberStats from "../components/members/MemberStats";
import MemberDetails from "../components/members/MemberDetails";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug: Option to disable filters and pagination
  const [debugShowAll, setDebugShowAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all members first, then filter client-side for simplicity
      console.log('🟢 Starting to load members...');
      const allMembers = await Member.list("-created_date", 200);
      console.log('🟢 Member.list() returned:', allMembers);
      console.log('🟢 Type:', typeof allMembers, 'IsArray:', Array.isArray(allMembers));

      // Ensure we have an array
      let data = Array.isArray(allMembers) ? allMembers : [];
      console.log('🟢 Members array length:', data.length);

      if (data.length > 0) {
        console.log('🟢 First member object:', JSON.stringify(data[0], null, 2));
        console.log('🟢 First member keys:', Object.keys(data[0]));
      }

      // Normalize backend field names to frontend format
      data = data.map(member => ({
        ...member,
        id: member.id || member._id,
        first_name: member.first_name || (member.name ? member.name.split(' ')[0] : ''),
        last_name: member.last_name || (member.name ? member.name.split(' ').slice(1).join(' ') : ''),
        membership_type: member.membership_type || member.membershipType,
        phoneNumber: member.phone,
        membership_start: member.membershipStart,
        membership_end: member.membershipEnd,
      }));

      // Debug: Option to disable filters and pagination
      if (!debugShowAll) {
        // Apply filters client-side
        if (statusFilter !== "all") {
          data = data.filter(m => m && m.status === statusFilter);
        }
        if (membershipFilter !== "all") {
          data = data.filter(m => m && (m.membership_type === membershipFilter || m.membershipType === membershipFilter));
        }
        // Apply search filter
        if (searchTerm.trim()) {
          const search = searchTerm.toLowerCase();
          data = data.filter(member =>
            (member.first_name || '').toLowerCase().includes(search) ||
            (member.last_name || '').toLowerCase().includes(search) ||
            (member.email || '').toLowerCase().includes(search)
          );
        }
      }

      // Calculate pagination
      let paginatedData = data;
      const totalCount = data.length;
      if (!debugShowAll) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        paginatedData = data.slice(startIndex, endIndex);
      }
      console.log('🟢 Setting members state with', paginatedData.length, 'items');
      setMembers(paginatedData);
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error("🔴 Error loading members:", error);
      setMembers([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, membershipFilter, searchTerm, debugShowAll, itemsPerPage]);

  useEffect(() => {
    // Reset to first page when filters change, otherwise load members
    if ((statusFilter !== "all" || membershipFilter !== "all" || searchTerm) && currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadMembers();
    }
  }, [currentPage, statusFilter, membershipFilter, searchTerm, loadMembers]);

  const handleSubmit = async (memberData) => {
    try {
      if (editingMember) {
        console.log('🟡 Updating member with data:', memberData);
        const updateResp = await Member.update(editingMember._id, memberData);
        console.log('🟡 Update response:', updateResp);
      } else {
        console.log('🟡 Creating member with data:', memberData);
        const createResp = await Member.create(memberData);
        console.log('🟡 Create response:', createResp);
      }
      setShowForm(false);
      setEditingMember(null);
      // Reset filters and pagination to default after add
      setStatusFilter("all");
      setMembershipFilter("all");
      setSearchTerm("");
      setCurrentPage(1);
      loadMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      // Re-throw the error so the form can handle it and show the toast
      throw error;
    }
    // Debug UI to toggle filters/pagination
    // Place this button somewhere in your render return for troubleshooting:
    // <Button onClick={() => setDebugShowAll(v => !v)} variant="outline">{debugShowAll ? "Enable Filters/Pagination" : "Show All Members (Debug)"}</Button>
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
  };

  const handleDelete = async (memberId) => {
    try {
      await Member.delete(memberId);
      toast.success("Member deleted successfully");
      loadMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      const errorMessage = error.message || "Failed to delete member. Please try again.";
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Members
            </h1>
            <p className="text-slate-600">
              Manage your gym members and memberships ({totalItems} total)
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </Button>
        </motion.div>

        {/* Stats - Load separately for performance */}
        <MemberStats isLoading={isLoading} />

        {/* Debug Info */}
        {members.length === 0 && !isLoading && (
          <Card className="bg-yellow-50 border-yellow-300 mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Debug:</strong> Loaded {totalItems} members from API. 
                Filters: Status={statusFilter}, Membership={membershipFilter}, Search="{searchTerm}"
              </p>
              <button 
                onClick={() => { setStatusFilter("all"); setMembershipFilter("all"); setSearchTerm(""); }}
                className="text-xs mt-2 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Reset Filters
              </button>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={membershipFilter}
                  onChange={(e) => setMembershipFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Memberships</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <AnimatePresence>
            {isLoading ? (
              Array(itemsPerPage).fill(0).map((_, i) => (
                <motion.div
                  key={`loading-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : members.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No members found</h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm || statusFilter !== "all" || membershipFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first member"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && membershipFilter === "all" && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Member
                  </Button>
                )}
              </motion.div>
            ) : (
              members.map((member) => (
                member && member.id ? (
                  <MemberCard
                    key={`member-${member.id}`}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ) : null
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} members
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  {/* Page numbers */}
                  <div className="hidden md:flex items-center gap-1">
                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Form Modal */}
        <AnimatePresence>
          {showForm && (
            <MemberForm
              member={editingMember}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMember(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Member Details Modal */}
        <AnimatePresence>
          {selectedMember && (
            <MemberDetails
              member={selectedMember}
              onEdit={(member) => {
                setSelectedMember(null);
                handleEdit(member);
              }}
              onDelete={(id) => {
                setSelectedMember(null);
                handleDelete(id);
              }}
              onClose={() => setSelectedMember(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
