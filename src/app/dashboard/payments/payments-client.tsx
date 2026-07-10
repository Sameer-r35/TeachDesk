"use client"

import { useState, useEffect } from "react"
import {
  generateMonthlyPayments,
  markPaymentPaid,
  getPaymentsForMonth,
} from "@/app/actions/payment"
import { StatCard } from "@/components/ui/stat-card"

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

  const collected = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status !== "PAID").reduce((s, p) => s + p.amount, 0)
  const pendingCount = payments.filter((p) => p.status !== "PAID").length
  const collectionRate = payments.length > 0
    ? Math.round((payments.filter((p) => p.status === "PAID").length / payments.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
      <div className="space-y-6 min-w-0">
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide block mb-1">
              Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-border rounded-md p-2 text-ink font-mono bg-paper focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide block mb-1">
              Amount / student
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-border rounded-md p-2 text-ink font-mono bg-paper w-28 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="bg-primary text-white rounded-md px-4 py-2 font-medium hover:bg-primary-dark transition-colors"
          >
            Generate dues
          </button>
        </div>

        {loading && <p className="text-sm text-ink-muted">Loading...</p>}

        <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
          {!loading && payments.length === 0 && (
            <p className="p-5 text-sm text-ink-muted">
              No payment records for this month yet. Click "Generate dues" above.
            </p>
          )}
          {payments.map((p) => (
            <div key={p.id} className="px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-ink font-medium">{p.student.name}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  {p.student.batch.name} · <span className="font-mono">৳{p.amount}</span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {p.status === "PAID" ? (
                  <span className="stamp text-success">Paid</span>
                ) : (
                  <>
                    <button
                      onClick={() => openWhatsApp(p.student.phone, p.student.name)}
                      className="px-3 py-1.5 rounded-md text-sm font-medium border border-border text-ink hover:bg-paper transition-colors"
                    >
                      Remind
                    </button>
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
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

      <aside className="space-y-4">
        <StatCard label="Collected" value={`৳${collected}`} sublabel={`${collectionRate}% of dues`} />
        <StatCard label="Pending" value={`৳${pending}`} sublabel={`${pendingCount} student${pendingCount !== 1 ? "s" : ""}`} />
      </aside>
    </div>
  )
}