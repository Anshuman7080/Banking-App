import { Link } from "react-router-dom";

import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import DashboardHeader from "../../../layout/DashboardHeader";
import { PiggyBank, Calendar, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { savingGoalList } from "../../../lib/operations/coreApis";

const SavingsGoalsList = () => {
  const token = useSelector((state) => state.auth.token);
  const [savingList, setSavingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSavingList = async () => {
      setLoading(true);
      const res = await savingGoalList(token);
      console.log("res of saving goal list", res);
      setSavingList(res?.data || []);
       setLoading(false);
    };
    getSavingList();
  }, [token]);

  console.log("saving list is", savingList);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
      <div className="flex">
        {/* Sidebar */}
        <DesktopSidebar />
        <MobileSidebar />

        {/* Main */}
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Your Saving Goals</h1>
              <Link
                to="/dashboard/savings/new"
                className="inline-flex items-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 dark:bg-white dark:text-black"
              >
                + New Goal
              </Link>
            </div>

            {/* Grid of cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {savingList.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 dark:text-white/60">
                  {loading ? "Loading saving goals..." : "No saving goals found."}
                </div>
              ) : (
                savingList.map((goal) => {
                  const saved = Number(goal.current_amount || 0);
                  const target = Number(goal.target_amount || 1);
                  const percent = goal.progress_percentage ?? 0;

                  return (
                    <div
                      key={goal.uuid}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-medium">
                            {goal.name || "Saving Goal"}
                          </h2>
                          <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                            Target: ${target}
                          </p>
                        </div>
                        <div className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                          <PiggyBank className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-black dark:bg-white"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-white/60">
                        <span>${saved} saved</span>
                        <span>{percent}%</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Target: {goal.target_date}
                        </span>
                        <Link
                          to={`/dashboard/savings/${goal.uuid}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline dark:text-white"
                        >
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoalsList;