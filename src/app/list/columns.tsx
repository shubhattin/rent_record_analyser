import { ColumnDef } from '@tanstack/react-table';
import { api } from '$convex/_generated/api';
import { Home, Zap } from 'lucide-react';

type RentRecord = (typeof api.routes.rentData.getRentData._returnType)['page'][number];

export const columns: ColumnDef<RentRecord>[] = [
  {
    accessorKey: 'date',
    header: () => <div className="text-start font-semibold">Date</div>,
    cell: ({ row }) => {
      const [yr, mn, dt] = row.original.date.split('-');
      const month = mn.padStart(2, '0');
      const day = dt.padStart(2, '0');
      return `${day}/${month}/${yr}`;
    }
  },
  {
    accessorKey: 'month',
    header: () => <div className="text-start font-semibold">Month</div>
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-start font-semibold">Amount</div>
  },
  {
    accessorKey: 'rent_type',
    header: () => <div className="text-start text-xs font-semibold">Type</div>,
    cell: ({ row }) => {
      if (row.original.rent_type === 'rent')
        return <Home className="size-4 text-sky-600 dark:text-sky-300" />;
      if (row.original.rent_type === 'electricity')
        return <Zap className="size-4 text-amber-600 dark:text-amber-300" />;
      return <div className="text-start">Unknown</div>;
    }
  }
];
