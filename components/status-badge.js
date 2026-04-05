const statusClassMap = {
  سليمة: "status-healthy",
  "تحت الصيانة": "status-maintenance",
  "حالة التماس": "status-fault",
  مغلقة: "status-closed",
  معتمد: "status-healthy",
  "قيد المراجعة": "status-maintenance",
  مرفوض: "status-fault",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${statusClassMap[status] || "status-closed"}`}>{status}</span>;
}
