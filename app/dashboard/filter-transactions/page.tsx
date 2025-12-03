// "use client";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { Button } from "@/components/ui/button";
// import { useMemo } from "react";
// import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

// interface Transaction {
//   id: string;
//   user_id: string;
//   type: "income" | "expense";
//   amount: number;
//   category: string;
//   created_at: string;
// }

// export default function FilterPage() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filtered, setFiltered] = useState<Transaction[]>([]);
//   const [month, setMonth] = useState<string>("");
//   const [type, setType] = useState<string>("");

//   // Format angka ke rupiah
//   function formatCurrency(amount: number) {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount);
//   }

//   // Load all transactions milik user login
//   useEffect(() => {
//     async function loadTransactions() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) return;

//       const { data, error } = await supabase
//         .from("transactions")
//         .select("*")
//         .eq("user_id", user.id)
//         .order("created_at", { ascending: false });

//       if (!error && data) {
//         setTransactions(data as Transaction[]);
//         setFiltered(data as Transaction[]);
//       }
//     }

//     loadTransactions();
//   }, []);

//   // Apply filter setiap kali month atau type berubah
//   useEffect(() => {
//     let result = [...transactions];

//     if (month) {
//       result = result.filter((tx) => tx.created_at.startsWith(month));
//     }

//     if (type) {
//       result = result.filter((tx) => tx.type === type);
//     }

//     setFiltered(result);
//   }, [month, type, transactions]);

//   return (
//     <div className="p-6 space-y-6">

//       <h1 className="text-2xl font-bold">Filter Transaksi</h1>

//       {/* Filter Controls */}
//       <div className="flex flex-wrap gap-4 items-center">

//         <div className="w-48">
//           <p className="text-sm mb-1">Filter Bulan</p>
//           <Select onValueChange={(v) => setMonth(v)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Pilih Bulan" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="2025-01">Januari 2025</SelectItem>
//               <SelectItem value="2025-02">Februari 2025</SelectItem>
//               <SelectItem value="2025-03">Maret 2025</SelectItem>
//               <SelectItem value="2025-04">April 2025</SelectItem>
//               <SelectItem value="2025-05">Mei 2025</SelectItem>
//               <SelectItem value="2025-06">Juni 2025</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="w-48">
//           <p className="text-sm mb-1">Filter Tipe</p>
//           <Select onValueChange={(v) => setType(v)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Pilih Tipe" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="income">Income</SelectItem>
//               <SelectItem value="expense">Expense</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Button variant="outline" onClick={() => { setType(""); setMonth(""); }}>
//           Reset
//         </Button>

//         <Button>Export PDF</Button>
//         <Button>Export Excel</Button>
//         <Button>Export CSV</Button>
//       </div>

//       {/* Transaction List */}
//       <div className="space-y-4">
//         {filtered.length === 0 && <p className="text-gray-500">Tidak ada transaksi ditemukan.</p>}

//         {filtered.map((tx) => (
//           <div
//             key={tx.id}
//             className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{tx.category}</p>
//               <p className="text-sm text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
//             </div>

//             <p
//               className={`font-semibold ${
//                 tx.type === "income" ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
//             </p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }
