import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Wrench,
  TrendingUp,
  Gauge,
  Activity,
  Filter,
  Droplets,
  CircleDot,
} from "lucide-react";

// --- Моковые данные -------------------------------------------------------

const gtmDynamics = [
  { month: "Янв", grp: 4, krs: 6 },
  { month: "Фев", grp: 6, krs: 5 },
  { month: "Мар", grp: 5, krs: 8 },
  { month: "Апр", grp: 9, krs: 7 },
  { month: "Май", grp: 7, krs: 10 },
  { month: "Июн", grp: 11, krs: 9 },
];

const wells = [
  { id: "№ 1024", status: "ГРП", pressure: 24.6, date: "02.06.2026", gain: 18.4 },
  { id: "№ 1187", status: "КРС", pressure: 19.2, date: "29.05.2026", gain: 9.1 },
  { id: "№ 0945", status: "Ожидание", pressure: 21.8, date: "21.05.2026", gain: 0 },
  { id: "№ 1330", status: "ГРП", pressure: 26.1, date: "04.06.2026", gain: 22.7 },
  { id: "№ 0871", status: "КРС", pressure: 17.5, date: "31.05.2026", gain: 6.3 },
  { id: "№ 1402", status: "Ожидание", pressure: 20.4, date: "18.05.2026", gain: 0 },
  { id: "№ 1156", status: "ГРП", pressure: 23.3, date: "05.06.2026", gain: 15.9 },
];

// --- Конфигурация статусов ------------------------------------------------

const STATUS_STYLES = {
  ГРП: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30",
    glow: "shadow-[0_0_8px_rgba(52,211,153,0.7)]",
  },
  КРС: {
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/30",
    glow: "shadow-[0_0_8px_rgba(56,189,248,0.7)]",
  },
  Ожидание: {
    dot: "bg-slate-400",
    badge: "bg-slate-400/10 text-slate-300 ring-1 ring-slate-400/30",
    glow: "",
  },
};

const FILTERS = ["Все", "ГРП", "КРС", "Ожидание"];

// --- Подкомпоненты --------------------------------------------------------

function KpiCard({ icon: Icon, label, value, unit, accent, sub }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/70">
      <div
        className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25 ${accent}`}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-slate-500 transition-colors group-hover:text-slate-300" />
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-slate-50">
          {value}
        </span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 font-medium text-slate-200">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-slate-300">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          {p.name}: <span className="font-semibold text-slate-100">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// --- Главный компонент ----------------------------------------------------

export default function Dashboard() {
  const [filter, setFilter] = useState("Все");

  const filteredWells = useMemo(
    () => (filter === "Все" ? wells : wells.filter((w) => w.status === filter)),
    [filter]
  );

  const totalInRepair = wells.filter((w) => w.status !== "Ожидание").length;
  const totalGain = wells.reduce((s, w) => s + w.gain, 0).toFixed(1);
  const avgPressure = (
    wells.reduce((s, w) => s + w.pressure, 0) / wells.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-200 antialiased lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Шапка */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 ring-1 ring-sky-500/30">
              <Droplets className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-50">
                Фонд бездействующих скважин
              </h1>
              <p className="text-xs text-slate-400">
                Федоровское месторождение · Мониторинг ГТМ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Данные в реальном времени · 06.06.2026
          </div>
        </header>

        {/* KPI */}
        <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard
            icon={Wrench}
            label="Скважин в ремонте"
            value={totalInRepair}
            unit="ед."
            accent="bg-sky-500"
            sub={`из ${wells.length} в фонде`}
          />
          <KpiCard
            icon={TrendingUp}
            label="Ожидаемый прирост"
            value={`+${totalGain}`}
            unit="т/сут"
            accent="bg-emerald-500"
            sub="суммарно по ГТМ"
          />
          <KpiCard
            icon={Gauge}
            label="Среднее пласт. давление"
            value={avgPressure}
            unit="МПа"
            accent="bg-indigo-500"
            sub="по активному фонду"
          />
        </section>

        {/* Контент: график + таблица */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* График */}
          <section className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Динамика проведения ГТМ
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={gtmDynamics} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="grp"
                  name="Гидроразрыв (ГРП)"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#34d399" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="krs"
                  name="Капремонт (КРС)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#38bdf8" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* Таблица */}
          <section className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 lg:col-span-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CircleDot className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Реестр скважин
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="mr-1 h-3.5 w-3.5 text-slate-500" />
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 ${
                      filter === f
                        ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40"
                        : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-700/40">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2.5 font-medium">Скважина</th>
                    <th className="px-3 py-2.5 font-medium">Статус</th>
                    <th className="px-3 py-2.5 text-right font-medium">Давление</th>
                    <th className="px-3 py-2.5 text-right font-medium">Проверка</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWells.map((w) => {
                    const st = STATUS_STYLES[w.status];
                    return (
                      <tr
                        key={w.id}
                        className="group border-b border-slate-800/60 transition-colors duration-150 last:border-0 hover:bg-sky-500/5"
                      >
                        <td className="px-3 py-2.5 font-medium text-slate-100">
                          {w.id}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${st.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${st.dot} ${st.glow}`}
                            />
                            {w.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-200">
                          {w.pressure.toFixed(1)}{" "}
                          <span className="text-xs text-slate-500">МПа</span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-xs text-slate-400">
                          {w.date}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredWells.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-xs text-slate-500"
                      >
                        Нет скважин с выбранным статусом
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-right text-xs text-slate-500">
              Показано: {filteredWells.length} из {wells.length}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
