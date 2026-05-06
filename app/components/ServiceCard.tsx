import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;

  category?: {
    name: string;
    slug: string;
  };

  developer?: {
    name?: string;
  };
}

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">

      {/* HEADER */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold line-clamp-1">
            {service.title}
          </h3>

          {service.isFeatured && (
            <Badge className="bg-orange-100 text-orange-700">
              Featured
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {service.description}
        </p>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <div className="flex flex-col gap-2 text-sm text-gray-600">

          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="font-medium">
              {service.deliveryDays} days
            </span>
          </div>

          <div className="flex justify-between">
            <span>Revisions</span>
            <span className="font-medium">
              {service.revisions}
            </span>
          </div>

          {service.category && (
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-medium">
                {service.category.name}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Price</span>
            <span className="text-orange-600 font-bold">
              {service.price}€
            </span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex justify-end">
        <Link href={`/services/${service.id}`}>
          <Button>Voir détails</Button>
        </Link>
      </CardFooter>

    </Card>
  );
}