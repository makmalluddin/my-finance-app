export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    // Fetch data dengan service role (bypass RLS)
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch data from Supabase" },
        { status: 500 }
      );
    }

    console.log("Fetched rows:", data?.length);

    // Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Transactions");

    // Header
    sheet.addRow(["ID", "Amount", "Type", "Description", "Created At"]);

    // Isi data
    data.forEach((t) => {
      sheet.addRow([
        t.id,
        t.amount,
        t.type,
        t.description ?? "",
        t.created_at,
      ]);
    });

    // Buffer Excel
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=transactions.xlsx",
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Failed to export Excel" },
      { status: 500 }
    );
  }
}
