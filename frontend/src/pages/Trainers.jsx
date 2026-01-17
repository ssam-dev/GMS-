import React, { useState, useEffect } from "react";
import { Trainer } from "@/entities/Trainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Filter, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import TrainerCard from "../components/trainers/TrainerCard";
import TrainerForm from "../components/trainers/TrainerForm";
import TrainerStats from "../components/trainers/TrainerStats";
import TrainerDetails from "../components/trainers/TrainerDetails";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Available specializations for filter
  const [availableSpecializations, setAvailableSpecializations] = useState([]);

  useEffect(() => {
    // Reset to first page when filters change, otherwise load trainers
    if ((statusFilter !== "all" || specializationFilter !== "all" || availabilityFilter !== "all" || searchTerm) && currentPage !== 1) {
      setCurrentPage(1);
    } else {
      loadTrainers();
      loadSpecializations();
    }
  }, [currentPage, statusFilter, specializationFilter, availabilityFilter, searchTerm]);

  const loadTrainers = async () => {
    setIsLoading(true);
    try {
      console.log('🟢 Starting to load trainers...');
      const allTrainers = await Trainer.list("-created_date", 200);
      console.log('🟢 Trainer.list() returned:', allTrainers);

      let data = Array.isArray(allTrainers) ? allTrainers : [];
      console.log('🟢 Trainers array length:', data.length);

      if (data.length > 0) {
        console.log('🟢 First trainer object:', JSON.stringify(data[0], null, 2));
      }

      // Normalize backend field names to frontend format
      data = data.map(trainer => ({
        ...trainer,
        id: trainer.id || trainer._id,
        first_name: trainer.first_name || (trainer.name ? trainer.name.split(' ')[0] : ''),
        last_name: trainer.last_name || (trainer.name ? trainer.name.split(' ').slice(1).join(' ') : ''),
        specializations: trainer.specializations || (trainer.specialization ? [trainer.specialization] : []),
        certifications: trainer.certifications || [],
        phoneNumber: trainer.phone,
      }));

      // Apply filters client-side
      if (statusFilter !== "all") {
        data = data.filter(t => t && t.status === statusFilter);
      }
      if (specializationFilter !== "all") {
        data = data.filter(t => t && Array.isArray(t.specializations) && t.specializations.includes(specializationFilter));
      }
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        data = data.filter(trainer =>
          (trainer.first_name || '').toLowerCase().includes(search) ||
          (trainer.last_name || '').toLowerCase().includes(search) ||
          (trainer.email || '').toLowerCase().includes(search)
        );
      }

      // Calculate pagination
      const totalCount = data.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      console.log('🟢 Setting trainers state with', paginatedData.length, 'items');
      setTrainers(paginatedData);
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      
      // Update available specializations
      const specs = new Set();
      data.forEach(t => {
        if (t && Array.isArray(t.specializations)) {
          t.specializations.forEach(spec => specs.add(spec));
        }
      });
      setAvailableSpecializations(Array.from(specs));
    } catch (error) {
      console.error("🔴 Error loading trainers:", error);
      setTrainers([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

    // Hoisted function to load available specializations (prevents ReferenceError)
    async function loadSpecializations() {
      try {
        const all = await Trainer.list("-created_date", 1000);
        const specs = new Set();
        if (Array.isArray(all)) {
          all.forEach((t) => {
            if (!t) return;
            const list = t.specializations || (t.specialization ? [t.specialization] : []);
            if (Array.isArray(list)) {
              list.forEach((s) => {
                if (s) specs.add(s);
              });
            }
          });
        }
        setAvailableSpecializations(Array.from(specs));
      } catch (err) {
        console.error("🔴 Error loading specializations:", err);
        setAvailableSpecializations([]);
      }
    }

  const handleSubmit = async (trainerData) => {
    try {
      if (editingTrainer) {
        console.log('🟡 Updating trainer with data:', trainerData);
        const updateResp = await Trainer.update(editingTrainer._id || editingTrainer.id, trainerData);
        console.log('🟡 Update response:', updateResp);
        toast.success("Trainer updated successfully!");
      } else {
        console.log('🟡 Creating trainer with data:', trainerData);
        const createResp = await Trainer.create(trainerData);
        console.log('🟡 Create response:', createResp);
        toast.success("Trainer created successfully!");
      }
      setShowForm(false);
      setEditingTrainer(null);
      setStatusFilter("all");
      setSpecializationFilter("all");
      setSearchTerm("");
      setCurrentPage(1);
      loadTrainers();
    } catch (error) {
      console.error("Error saving trainer:", error);
      const errorMessage = error.message || "Failed to save trainer. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  const handleViewDetails = (trainer) => {
    setSelectedTrainer(trainer);
    setShowDetails(true);
  };

  const handleDelete = async (trainerId) => {
    try {
      await Trainer.delete(trainerId);
      toast.success("Trainer deleted successfully!");
      loadTrainers();
    } catch (error) {
      console.error("Error deleting trainer:", error);
      const errorMessage = error.message || "Failed to delete trainer. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
      });
    }
  };

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
              Trainers
            </h1>
            <p className="text-slate-600">
              Manage your gym trainers and their specializations ({totalItems} total)
            </p>
          </div>
          <Button
            onClick={() => { setShowForm(true); setEditingTrainer(null); }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Trainer
          </Button>
        </motion.div>

        {/* Stats */}
        <TrainerStats isLoading={isLoading} />

        {/* Debug Info */}
        {trainers.length === 0 && !isLoading && (
          <Card className="bg-yellow-50 border-yellow-300 mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Debug:</strong> Loaded {totalItems} trainers from API. 
                Filters: Status={statusFilter}, Specialization={specializationFilter}, Search="{searchTerm}"
              </p>
              <button 
                onClick={() => { setStatusFilter("all"); setSpecializationFilter("all"); setSearchTerm(""); }}
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
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search trainers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Specializations</option>
                  {availableSpecializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Availability</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                  <option value="full">Full Day</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
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
                    <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-200 rounded flex-1"></div>
                      <div className="h-6 bg-slate-200 rounded flex-1"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : trainers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No trainers found</h3>
                <p className="text-slate-500 mb-4">
                  {searchTerm || statusFilter !== "all" || specializationFilter !== "all" || availabilityFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first trainer"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && specializationFilter === "all" && availabilityFilter === "all" && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Trainer
                  </Button>
                )}
              </motion.div>
            ) : (
              trainers.map((trainer) => (
                trainer && trainer.id ? (
                  <TrainerCard
                    key={`trainer-${trainer.id}`}
                    trainer={trainer}
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} trainers
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

        {/* Trainer Form Modal */}
        <AnimatePresence>
          {showForm && (
            <TrainerForm
              trainer={editingTrainer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTrainer(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Trainer Details Modal */}
        <AnimatePresence>
          {showDetails && selectedTrainer && (
            <TrainerDetails
              trainer={selectedTrainer}
              onEdit={(trainer) => {
                setShowDetails(false);
                setSelectedTrainer(null);
                handleEdit(trainer);
              }}
              onDelete={handleDelete}
              onClose={() => {
                setShowDetails(false);
                setSelectedTrainer(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
