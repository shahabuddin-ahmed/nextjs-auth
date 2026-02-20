"use client";

import type React from "react";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { createCampaign } from "@/stores/slices/campaignSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CampaignFormProps {
    onSuccess?: () => void;
}

export function CampaignForm({ onSuccess }: CampaignFormProps) {
    const dispatch = useAppDispatch();
    const { isCreating, error } = useAppSelector((state) => state.campaign);
    const { accessToken } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        body: "",
        scheduledTime: "",
        status: "scheduled" as const,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            alert("Please log in first");
            return;
        }

        if (
            !formData.name ||
            !formData.subject ||
            !formData.body ||
            !formData.scheduledTime
        ) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const result = await dispatch(
                createCampaign({
                    payload: formData,
                    accessToken,
                }),
            ).unwrap();

            console.log("[v0] Campaign created successfully:", result);

            setFormData({
                name: "",
                subject: "",
                body: "",
                scheduledTime: "",
                status: "scheduled",
            });

            onSuccess?.();
        } catch (err) {
            console.error("[v0] Failed to create campaign:", err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
            <h2 className="text-xl font-semibold text-gray-900">
                Create New Campaign
            </h2>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Campaign Name
                </label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Summer Sale 2025"
                    className="mt-1"
                />
            </div>

            <div>
                <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                >
                    Subject
                </label>
                <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Special Offer Inside"
                    className="mt-1"
                />
            </div>

            <div>
                <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700"
                >
                    Body
                </label>
                <Textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder="Enter campaign content..."
                    rows={4}
                    className="mt-1"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="scheduledTime"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Scheduled Date
                    </label>
                    <Input
                        id="scheduledTime"
                        name="scheduledTime"
                        type="date"
                        value={formData.scheduledTime}
                        onChange={handleChange}
                        className="mt-1"
                    />
                </div>

                <div>
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="sent">Sent</option>
                    </select>
                </div>
            </div>

            <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Creating..." : "Create Campaign"}
            </Button>
        </form>
    );
}
