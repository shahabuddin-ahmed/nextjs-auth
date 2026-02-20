"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchCampaigns } from "@/stores/slices/campaignSlice";
import { CampaignForm } from "@/components/campaign-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CampaignsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, accessToken } = useAppSelector((state) => state.auth);
    const { campaigns, isLoading } = useAppSelector((state) => state.campaign);
    const [showForm, setShowForm] = useState(false);
    const fetchInitiatedRef = useRef(false);

    useEffect(() => {
        if (!user || !accessToken) {
            router.push("/login");
            return;
        }

        if (!fetchInitiatedRef.current) {
            fetchInitiatedRef.current = true;
            dispatch(fetchCampaigns(accessToken));
        }
    }, [user, accessToken, dispatch, router]);

    const handleCampaignCreated = () => {
        setShowForm(false);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case "sent":
                return "bg-green-100 text-green-800";
            case "scheduled":
                return "bg-blue-100 text-blue-800";
            case "draft":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Campaigns
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Manage and create your email campaigns
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        {showForm ? (
                            <CampaignForm onSuccess={handleCampaignCreated} />
                        ) : (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="w-full"
                            >
                                Create New Campaign
                            </Button>
                        )}
                    </div>

                    {/* Campaigns List Section */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
                                        <p className="text-gray-600">
                                            Loading campaigns...
                                        </p>
                                    </div>
                                </div>
                            ) : campaigns.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-gray-600">
                                            No campaigns yet. Create your first
                                            campaign!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-gray-200 bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Subject
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Scheduled Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {campaigns.map((campaign) => (
                                                <tr
                                                    key={campaign.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {campaign.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {campaign.subject}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(campaign.status)}`}
                                                        >
                                                            {campaign.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                campaign.status.slice(
                                                                    1,
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {formatDate(
                                                            campaign.scheduledTime,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
