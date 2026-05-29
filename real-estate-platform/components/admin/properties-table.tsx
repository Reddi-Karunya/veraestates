import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil, Shield } from "lucide-react";
import { trustScoreColorClass } from "@/lib/trust/score";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { formatPriceINR } from "@/lib/format-price";
import type { AdminPropertyListItem } from "@/lib/data/admin";

const listingBadgeVariant: Record<string, string> = {
  available: "border-emerald-500/40 bg-emerald-50 text-emerald-800",
  sold: "border-red-500/40 bg-red-50 text-red-800",
  reserved: "border-amber-500/40 bg-amber-50 text-amber-800",
};

type PropertiesTableProps = {
  properties: AdminPropertyListItem[];
};

export function PropertiesTable({ properties }: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-muted-foreground">No properties match your filters.</p>
        <Button
          className="mt-4 bg-gold text-navy"
          render={<Link href="/admin/properties/new" />}
        >
          Add your first property
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trust</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => {
            const cover =
              property.property_images?.find((i) => i.is_cover) ??
              property.property_images?.[0];

            return (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="relative size-14 overflow-hidden rounded-lg bg-muted">
                    {cover?.public_url ? (
                      <Image
                        src={cover.public_url}
                        alt={`${property.title} thumbnail`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        —
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-navy">{property.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {property.locality}, {property.city}
                  </p>
                  <div className="mt-1 flex gap-2">
                    {property.is_published ? (
                      <Badge variant="outline" className="text-xs">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Draft
                      </Badge>
                    )}
                    {property.is_featured && (
                      <Badge className="bg-gold/10 text-xs text-navy">Featured</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gold">
                  {formatPriceINR(Number(property.price_inr))}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={listingBadgeVariant[property.listing_status] ?? ""}
                  >
                    {property.listing_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-display text-lg ${trustScoreColorClass(property.trust_score ?? 0)}`}
                  >
                    {property.trust_score ?? 0}
                  </span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {property.verification_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Verification"
                      render={
                        <Link href={`/admin/properties/${property.id}/verify`} />
                      }
                    >
                      <Shield />
                    </Button>
                    {property.is_published && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link
                            href={`/properties/${property.slug}`}
                            target="_blank"
                          />
                        }
                      >
                        <ExternalLink />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link href={`/admin/properties/${property.id}/edit`} />
                      }
                    >
                      <Pencil />
                    </Button>
                    <DeletePropertyButton
                      propertyId={property.id}
                      propertyTitle={property.title}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
