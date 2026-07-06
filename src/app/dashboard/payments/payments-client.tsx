"use client"

import { useState, useEffect } from "react"
import {
  generateMonthlyPayments,
  markPaymentPaid,
  getPaymentsForMonth,
} from "@/app/actions/payment"

type Payment = {
  id: string
  amount: number
  status: "PAID" | "PENDING" | "OVERDUE"
  student: { name: string; phone: string | null; batch: { name: string } }
}

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function PaymentsClient() {
  const [month, setMonth] = useState(currentMonth())
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("1000")

  async function loadPayments() {
    setLoading(true)
    const data = await getPaymentsForMonth(month)
    setPayments(data as Payment[])
    setLoading(false)
  }

  useEffect(() => {
    loadPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  async function handleGenerate() {
    setLoading(true)
    await generateMonthlyPayments(month, parseFloat(amount))
    await loadPayments()
  }

  async function handleMarkPaid(paymentId: string) {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "PAID" } : p))
    )
    await markPaymentPaid(paymentId, "cash")
  }

  function openWhatsApp(phone: string | null, name: string) {
    if (!phone) return
    const message = encodeURIComponent(
      `Hi, this is a reminder that ${name}'s payment for this month is still pending. Please pay at your earliest convenience.`
    )
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`, "_blank")
  }

  const pendingCount = payments.filter((p) => p.status !== "PAID").length

  return (
    <div>
      <div className="flex gap-3 mb-4 items-end">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded p-2 text-black"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Amount (per student)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2 text-black w-28"
          />
        </div>
        <button
          onClick={handleGenerate}
          className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800"
        >
          Generate dues
        </button>
      </div>

      {!loading && payments.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          {pendingCount} of {payments.length} students haven't paid yet
        </p>
      )}

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="space-y-2">
        {!loading && payments.length === 0 && (
          <p className="text-gray-500">
            No payment records for this month yet. Click "Generate dues" above.
          </p>
        )}
        {payments.map((p) => (
          <div
            key={p.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="text-black font-medium">{p.student.name}</p>
              <p className="text-xs text-gray-500">
                {p.student.batch.name} · ৳{p.amount}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {p.status === "PAID" ? (
                <span className="text-green-600 text-sm font-medium">Paid</span>
              ) : (
                <>
                  <button
                    onClick={() => openWhatsApp(p.student.phone, p.student.name)}
                    className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-700"
                  >
                    Remind
                  </button>
                  <button
                    onClick={() => handleMarkPaid(p.id)}
                    className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-700"
                  >
                    Mark paid
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}