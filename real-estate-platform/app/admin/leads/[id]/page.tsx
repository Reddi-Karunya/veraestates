import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LeadDetailClient } from "@/components/admin/leads/lead-detail-client";
import { getLeadById, getStaffMembers } from "@/lib/data/leads";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: LeadDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const lead = await getLeadById(id);
  return {
    title: lead ? `${lead.name} | Leads` : "Lead",
  };
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const [lead, staff] = await Promise.all([
    getLeadById(id),
    getStaffMembers(),
  ]);

  if (!lead) notFound();

  return (
    <div>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ArrowLeft className="size-4" />
        Back to leads
      </Link>

      <div className="mt-6">
        <LeadDetailClient lead={lead} staff={staff} />
      </div>
    </div>
  );
}
