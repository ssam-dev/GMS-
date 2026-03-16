import React, { useState, useEffect } from "react";
import { Equipment } from "@/entities/Equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Dumbbell, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EquipmentCard from "../components/equipment/EquipmentCard";
import EquipmentForm from "../components/equipment/EquipmentForm";
import EquipmentStats from "../components/equipment/EquipmentStats";
import EquipmentDetails from "../components/equipment/EquipmentDetails";
import MaintenanceDue from "../components/equipment/MaintenanceDue";
import EquipmentTable from "../components/equipment/EquipmentTable";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // cards or table
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Effect to load equipment based on filters and pagination
  useEffect(() => {
    loadEquipment();
  }, [currentPage, categoryFilter, conditionFilter, statusFilter, searchTerm, activeTab]);

  // Effect to reset page when filters change (except current page itself)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [categoryFilter, conditionFilter, statusFilter, searchTerm, activeTab]);

  const loadEquipment = async () => {
    setIsLoading(true);
    try {
      const filters = {};

      if (categoryFilter !== "all") {
        filters.category = categoryFilter;
      }
      if (conditionFilter !== "all") {
        filters.condition = conditionFilter;
      }
      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }

      let data = [];
      let calculatedTotalItems = 0;
      const today = new Date().toISOString().split('T')[0];

      if (searchTerm.trim()) {
        // For search, fetch a larger subset to perform client-side search efficiently.
        const searchBaseData = await Equipment.filter(filters, "-created_date", 200);

        // Apply search term client-side
        let allMatchingSearch = searchBaseData.filter(item =>
          (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.location || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply tab-specific client-side filtering
        if (activeTab === "maintenance") {
          allMatchingSearch = allMatchingSearch.filter(item =>
            item.status === 'maintenance' ||
            (item.next_maintenance_date && item.next_maintenance_date <= today)
          );
        } else if (activeTab === "issues" && conditionFilter === "all") {
          allMatchingSearch = allMatchingSearch.filter(item =>
            item.condition === 'needs_repair' ||
            item.condition === 'broken' ||
            item.status === 'broken'
          );
        }

        calculatedTotalItems = allMatchingSearch.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        data = allMatchingSearch.slice(startIndex, startIndex + itemsPerPage);

      } else {
        // No search term - use direct pagination from backend
        const offset = (currentPage - 1) * itemsPerPage;

        // Fetch paginated data
        data = await Equipment.filter(
          filters,
          "-created_date",
          itemsPerPage,
          offset
        );

        // Estimate total count based on returned data
        calculatedTotalItems = data.length < itemsPerPage ? 
          (currentPage - 1) * itemsPerPage + data.length : 
          currentPage * itemsPerPage + 1; // Estimate there's more

        // Apply tab-specific client-side filtering for properties not handled by backend filter
        if (activeTab === "maintenance") {
          data = data.filter(item =>
            item.status === 'maintenance' ||
            (item.next_maintenance_date && item.next_maintenance_date <= today)
          );
        } else if (activeTab === "issues" && conditionFilter === "all") {
          data = data.filter(item =>
            item.condition === 'needs_repair' ||
            item.condition === 'broken' ||
            item.status === 'broken'
          );
        }
      }

      // Ensure data is clean and valid
      const cleanData = Array.isArray(data) ? data.filter(item => item && typeof item === 'object' && item.id) : [];

      setEquipment(cleanData);
      setTotalItems(calculatedTotalItems);
      setTotalPages(Math.ceil(calculatedTotalItems / itemsPerPage));

    } catch (error) {
      console.error("Error loading equipment:", error);
      setEquipment([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (equipmentData) => {
    try {
      if (editingEquipment) {
        await Equipment.update(editingEquipment.id, equipmentData);
      } else {
        await Equipment.create(equipmentData);
      }
      setShowForm(false);
      setEditingEquipment(null);
      setCurrentPage(1); // Reset to first page after adding/editing
      loadEquipment();
    } catch (error) {
      console.error("Error saving equipment:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingEquipment(item);
    setShowForm(true);
  };

  const handleDelete = async (equipmentId) => {
    try {
      await Equipment.delete(equipmentId);
      loadEquipment();
      if (selectedEquipment?.id === equipmentId) {
        setSelectedEquipment(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedEquipment(item);
    setShowDetails(true);
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

  // Get maintenance due items
  const maintenanceDueItems = equipment.filter(item => {
    const today = new Date().toISOString().split('T')[0];
    return item.status === 'maintenance' || (item.next_maintenance_date && item.next_maintenance_date <= today);
  });

  // Get items with issues
  const issueItems = equipment.filter(item =>
    item.condition === 'needs_repair' ||
    item.condition === 'broken' ||
    item.status === 'broken'
  );

  return (
    <div className="flex flex-col gap-6 text-white pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Equipment Management
          </h1>
          <p className="text-sm text-slate-400">
            Track and manage all gym equipment, maintenance, and inventory ({totalItems} items found)
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
            className="hidden md:flex border-slate-800 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {viewMode === "cards" ? "Table View" : "Card View"}
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-none w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <EquipmentStats isLoading={isLoading} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-[#121A2F] border border-slate-800 rounded-lg p-1 gap-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#1A233A] data-[state=active]:text-white text-slate-400">All Equipment</TabsTrigger>
          <TabsTrigger value="maintenance" className="relative data-[state=active]:bg-[#1A233A] data-[state=active]:text-white text-slate-400">
            Maintenance
            {maintenanceDueItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {maintenanceDueItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="issues" className="relative data-[state=active]:bg-[#1A233A] data-[state=active]:text-white text-slate-400">
            Issues
            {issueItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {issueItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-[#1A233A] data-[state=active]:text-white text-slate-400">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Filters */}
          <Card className="bg-[#121A2F] border-slate-800 text-white shadow-none mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Search equipment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 bg-[#1A233A] border-slate-800 text-white placeholder-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex-1 min-w-[140px] h-10 px-3 py-2 bg-[#1A233A] border border-slate-800 text-sm text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="free_weights">Free Weights</option>
                    <option value="functional">Functional</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="flex-1 min-w-[140px] h-10 px-3 py-2 bg-[#1A233A] border border-slate-800 text-sm text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Conditions</option>
                    <option value="new">New</option>
                    <option value="good">Good</option>
                    <option value="needs_repair">Needs Repair</option>
                    <option value="broken">Broken</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 min-w-[140px] h-10 px-3 py-2 bg-[#1A233A] border border-slate-800 text-sm text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="operational">Operational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="broken">Broken</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Grid/Table */}
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <AnimatePresence>
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#121A2F] border border-slate-800 rounded-xl p-6 shadow-none"
                    >
                      <div className="animate-pulse">
                        <div className="w-full h-32 bg-[#1A233A] rounded-lg mb-4"></div>
                        <div className="h-4 bg-[#1A233A] rounded mb-2"></div>
                        <div className="h-3 bg-[#1A233A] rounded mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-[#1A233A] rounded flex-1"></div>
                          <div className="h-6 bg-[#1A233A] rounded flex-1"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : equipment.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No equipment found</h3>
                    <p className="text-sm text-slate-400 mb-6">
                      {searchTerm || categoryFilter !== "all" || conditionFilter !== "all" || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Get started by adding your first equipment"
                      }
                    </p>
                    {!searchTerm && categoryFilter === "all" && conditionFilter === "all" && statusFilter === "all" && (
                      <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Equipment
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  equipment.map((item, index) => (
                    item && item.id ? (
                      <EquipmentCard
                        key={`equipment-${item.id}-${index}`}
                        equipment={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                      />
                    ) : null
                  ))
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-slate-800 bg-[#121A2F] overflow-hidden">
              <EquipmentTable
                equipment={equipment}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card className="bg-[#121A2F] border-slate-800 text-white shadow-none mt-2">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Showing {Math.min(((currentPage - 1) * itemsPerPage) + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="border-slate-800 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 h-8"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Prev
                    </Button>
                    
                    <div className="hidden md:flex items-center gap-1">
                      {getPageNumbers().map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-lg ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-none' : 'border-slate-800 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white'}`}
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
                      className="border-slate-800 bg-[#1A233A] text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 h-8"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <MaintenanceDue
            equipment={equipment}
            onEdit={handleEdit}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <Card className="bg-[#121A2F] border-slate-800 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Equipment Issues</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {issueItems.map((item, index) => (
                  item && item.id ? (
                    <EquipmentCard
                      key={`issue-${item.id}-${index}`}
                      equipment={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                      highlightIssues={true}
                    />
                  ) : null
                ))}
                {issueItems.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-slate-500 text-sm">No equipment issues reported on this page</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-[#121A2F] border-slate-800 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Equipment by Category (Current Page)</h3>
                <div className="space-y-4">
                  {['cardio', 'strength', 'free_weights', 'functional', 'accessories'].map(category => {
                    const count = equipment.filter(e => e && e.category === category).length;
                    const percentage = equipment.length > 0 ? (count / equipment.length) * 100 : 0;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="capitalize text-sm font-medium text-slate-300">{category.replace('_', ' ')}</span>
                        <div className="flex items-center gap-4 flex-1 ml-4 justify-end">
                          <div className="w-32 h-2 bg-[#1A233A] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-300 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#121A2F] border-slate-800 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Condition Overview (Current Page)</h3>
                <div className="space-y-4">
                  {['new', 'good', 'needs_repair', 'broken'].map(condition => {
                    const count = equipment.filter(e => e && e.condition === condition).length;
                    const percentage = equipment.length > 0 ? (count / equipment.length) * 100 : 0;
                    const color = condition === 'new' ? 'bg-green-500' :
                      condition === 'good' ? 'bg-blue-500' :
                        condition === 'needs_repair' ? 'bg-yellow-500' : 'bg-red-500';
                    return (
                      <div key={condition} className="flex items-center justify-between">
                        <span className="capitalize text-sm font-medium text-slate-300">{condition.replace('_', ' ')}</span>
                        <div className="flex items-center gap-4 flex-1 ml-4 justify-end">
                          <div className="w-32 h-2 bg-[#1A233A] rounded-full overflow-hidden">
                            <div
                              className={`h-full ${color} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-300 w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Equipment Form Modal */}
      <AnimatePresence>
        {showForm && (
          <EquipmentForm
            equipment={editingEquipment}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEquipment(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Equipment Details Modal */}
      <AnimatePresence>
        {showDetails && selectedEquipment && (
          <EquipmentDetails
            equipment={selectedEquipment}
            onEdit={(equipment) => {
              setShowDetails(false);
              setSelectedEquipment(null);
              handleEdit(equipment);
            }}
            onDelete={handleDelete}
            onRefresh={(updatedEquipment) => setSelectedEquipment(updatedEquipment)}
            onClose={() => {
              setShowDetails(false);
              setSelectedEquipment(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
