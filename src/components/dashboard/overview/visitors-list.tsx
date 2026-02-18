const VISITORS = [
  { id: "V1GS...", country: "ng", duration: "00:50", date: "2/17/2026" },
  { id: "V1GS...", country: "ng", duration: "01:10", date: "2/18/2026" },
  { id: "V1GS...", country: "ng", duration: "00:40", date: "2/19/2026" },
  { id: "V1GS...", country: "ng", duration: "01:20", date: "2/20/2026" },
  { id: "V1GS...", country: "ng", duration: "00:30", date: "2/21/2026" },
];

export function VisitorsList() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Visitors</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              <th className="pb-3 font-normal">Visitor</th>
              <th className="pb-3 font-normal">Duration</th>
              <th className="pb-3 text-right font-normal">Time/Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {VISITORS.map((visitor, index) => (
              <tr key={index} className="group">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-5 w-7 shrink-0 flex-col overflow-hidden rounded-sm shadow-sm">
                      <div className="h-1/3 w-full bg-[#008751]"></div>
                      <div className="h-1/3 w-full bg-white"></div>
                      <div className="h-1/3 w-full bg-[#008751]"></div>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {visitor.id}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-xs font-bold text-gray-900">
                  {visitor.duration}
                </td>
                <td className="py-3 text-right text-xs font-bold text-gray-900">
                  {visitor.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
