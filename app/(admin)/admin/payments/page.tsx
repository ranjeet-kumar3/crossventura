"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  TrendingUp,
  CreditCard,
  XCircle,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRevenue: "$0.00", successfulCount: 0, failedCount: 0 });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/payments?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${searchTerm}`);
        const data = await res.json();
        if (!data.error) {
          setPayments(data.payments || []);
          setStats(data.stats || { totalRevenue: "$0.00", successfulCount: 0, failedCount: 0 });
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching payments", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="h-full xl:h-auto xl:max-h-[650px] 2xl:max-h-[1480px] flex flex-col space-y-3 animate-in fade-in duration-500 xl:max-w-[1300px] 2xl:max-w-[1650px]">
      {/* Title */}
      <h1 className="text-2xl font-bold text-[#3E4246] tracking-tight flex-shrink-0">Payment Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        {/* Total Revenue */}
        <div className="bg-white p-4 2xl:p-5 rounded-2xl 2xl:rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5 2xl:space-y-1">
            <p className="text-[10px] 2xl:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
            <div className="flex items-center gap-3">
              <h2 className="text-[22px] 2xl:text-[32px] font-bold text-[#3E4246]">{stats.totalRevenue}</h2>
            </div>
          </div>
          <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-[#2B7FFF] rounded-lg 2xl:rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <TrendingUp className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-4 2xl:p-5 rounded-2xl 2xl:rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5 2xl:space-y-1">
            <p className="text-[10px] 2xl:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Successful Payments</p>
            <h2 className="text-[22px] 2xl:text-[32px] font-bold text-[#3E4246]">{stats.successfulCount}</h2>
          </div>
          <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-[#10B981] rounded-lg 2xl:rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <CreditCard className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
          </div>
        </div>

        {/* Failed Transactions */}
        <div className="bg-white p-4 2xl:p-5 rounded-2xl 2xl:rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5 2xl:space-y-1">
            <p className="text-[10px] 2xl:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Failed Transactions</p>
            <h2 className="text-[22px] 2xl:text-[32px] font-bold text-[#3E4246]">{stats.failedCount}</h2>
          </div>
          <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-[#EF4444] rounded-lg 2xl:rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
            <XCircle className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white flex-1 min-h-0 rounded-[20px] border border-gray-300 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-4 xl:p-6 border-b border-gray-300 flex items-center justify-between flex-shrink-0">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search payments"
              className="w-72 bg-gray-50 text-black border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            {/* <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <SlidersHorizontal className="w-4 h-4" />
            </button> */}
          </div>
          <span className="text-[15px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {totalItems} TOTAL PAYMENTS
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8F9FA]/50 border-b border-gray-300">
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider w-24">#</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">User Name</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Payment Type</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 xl:px-6 2xl:px-10 py-2.5 xl:py-3.5 2xl:py-5 text-[11px] xl:text-[15px] 2xl:text-[15px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 xl:px-6 2xl:px-10 py-8 2xl:py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2B7FFF]" />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 xl:px-6 2xl:px-10 py-8 2xl:py-10 text-center text-gray-400 font-medium">
                    No payments found.
                  </td>
                </tr>
              ) : (
                 payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 text-[12px] xl:text-sm font-bold text-gray-400 group-hover:text-[#3E4246] transition-colors">
                      {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 text-[12px] xl:text-[14px] 2xl:text-[16px] font-bold text-[#3E4246] group-hover:text-[#2B7FFF] transition-colors">{payment.userName}</td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 text-[12px] xl:text-[14px] 2xl:text-[16px] font-bold text-[#3E4246]">{payment.amount}</td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 max-w-[180px] 2xl:max-w-[200px]">
                      <span className="text-[12px] xl:text-[14px] 2xl:text-[16px] font-medium text-gray-500 truncate block" title={payment.type}>
                        {payment.type}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5">
                      <span className={`text-[12px] xl:text-[14px] 2xl:text-[16px] font-bold ${payment.status === 'Paid' ? 'text-[#10B981]' :
                        payment.status === 'Pending' ? 'text-[#F59E0B]' :
                          'text-[#EF4444]'
                        }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 text-[12px] xl:text-[14px] 2xl:text-[16px] font-medium text-gray-500">{payment.date}</td>
                    <td className="px-4 xl:px-6 2xl:px-10 py-2 xl:py-3.5 2xl:py-5 text-center">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-gray-400 hover:text-[#2B7FFF] transition-all active:scale-110 cursor-pointer"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 xl:p-6 flex items-center justify-center border-t border-gray-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${currentPage === i + 1
                    ? "bg-white text-gray-900 border border-gray-100 shadow-sm"
                    : "text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-[800px] overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-8 flex items-center justify-center border-b border-gray-50">
              <button
                onClick={() => setSelectedPayment(null)}
                className="absolute left-8 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-xl transition-all active:scale-90 cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>
              <h3 className="text-2xl font-bold text-[#3E4246]">Payment Details</h3>
            </div>

            <div className="px-12 py-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="space-y-8">
                {/* Transaction Summary */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-3xl font-bold text-[#3E4246] mt-1">{selectedPayment.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-sm font-bold ${selectedPayment.status === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981]' :
                        selectedPayment.status === 'Pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                  {/* User Info */}
                  <div>
                    <h4 className="text-lg font-bold text-[#3E4246] mb-4 pb-2 border-b border-gray-100">Customer Info</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</p>
                        <p className="text-sm font-semibold text-[#3E4246]">{selectedPayment.userName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-semibold text-[#3E4246]">{selectedPayment.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-semibold text-[#3E4246]">{selectedPayment.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div>
                    <h4 className="text-lg font-bold text-[#3E4246] mb-4 pb-2 border-b border-gray-100">Transaction Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                        <p className="text-sm font-semibold text-[#3E4246] break-all">{selectedPayment.stripePaymentIntentId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Type</p>
                        <p className="text-sm font-semibold text-[#3E4246]">{selectedPayment.type}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="text-sm font-semibold text-[#3E4246]">{selectedPayment.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full max-w-sm py-4 bg-[#2B7FFF] text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedPayment(null)} />
        </div>
      )}
    </div>
  );
}
