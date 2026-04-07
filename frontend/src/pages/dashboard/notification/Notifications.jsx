import { useEffect, useState } from "react";
import DashboardHeader from "../../../layout/DashboardHeader";
import { DesktopSidebar, MobileSidebar } from "../../../layout/Sidebar";
import { CheckCircle2, Clock, XCircle, Check } from "lucide-react";
import { getNotificationList, markNotificationAsRead } from "../../../lib/operations/coreApis";
import { useSelector } from "react-redux";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const [loading, setLoading]= useState(false);
    const [markingRead, setMarkingRead] = useState(null);

    useEffect(() => {
        const getNotifications = async () => {
            setLoading(true);
            const res = await getNotificationList(token);
            console.log("response of getting notifications", res);
            setNotifications(res?.data || []);
                setLoading(false);
        };
        getNotifications();
    }, [token]);

 const handleMarkAsRead = async (id) => {
    try {
        setMarkingRead(id);
        await markNotificationAsRead(token, id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
        console.log("error marking notification read", error);
    } finally {
        setMarkingRead(null);
    }
};

    const getIcon = (status) => {
        if (status === "SUCCESSFUL") {
            return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
        } else if (status === "FAILED") {
            return <XCircle className="h-5 w-5 text-rose-500" />;
        } else {
            return <Clock className="h-5 w-5 text-amber-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0a0a0a] dark:text-white">
            <div className="flex">
                <DesktopSidebar />
                <MobileSidebar />

                <div className="flex min-h-screen flex-1 flex-col">
                    <DashboardHeader />

                    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-semibold">Notifications</h1>
                                <p className="text-sm text-gray-600 dark:text-white/60">
                                    Latest updates on your transactions and activity.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Empty State */}
                            {notifications.length === 0 ? (
                                <div className="text-center text-gray-500 py-6">
                                    {loading ? "Loading notifications..." : "No notifications found."}
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-black/40">
                                                {getIcon(n.tx_status)}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">
                                                        {n.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 dark:text-white/60">
                                                        {new Date(n.timestamp).toLocaleString()}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-gray-600 dark:text-white/70">
                                                    {n.message}
                                                </p>

                                                <div className="mt-2 flex items-center gap-3">
                                                    {!n.is_read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(n.id)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                           {markingRead === n.id ? "Marking..." : "Mark as Read"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500 dark:text-white/60">
                            You’re all caught up 🎉
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Notifications;