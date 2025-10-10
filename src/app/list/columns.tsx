import { ColumnDef } from '@tanstack/react-table';
import { api } from '$convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { useQuery } from 'convex/react';
import { Home, Zap, MoreHorizontal, Pencil, User } from 'lucide-react';
import { MdDeleteOutline } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { useContext } from 'react';
import { AppContext } from '~/state/AppDataContext';

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
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const record = row.original;

      const { user_info } = useContext(AppContext);
      const is_admin = user_info?.role === 'admin';

      const verification_request_ids = useQuery(api.routes.rentData.getRentDataVerificationRequest);
      const is_verification_request = verification_request_ids?.some((v) => v[0] === record._id);

      const record_user_info = useQuery(api.routes.userInfo.getUserInfo, {
        user_id: record.user_id
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="select-none">
            <DropdownMenuLabel className="space-x-2">
              <span className="text-sm font-semibold">ID</span>
              <span className="text-xs text-muted-foreground">{record._id.slice(0, 5)}</span>
            </DropdownMenuLabel>
            <DropdownMenuLabel className="flex items-center space-x-1">
              <User className="size-3" />
              <span className="text-xs text-muted-foreground">
                {record_user_info?.name.split(' ')[0]}
              </span>
            </DropdownMenuLabel>
            {is_admin && (
              <>
                <DropdownMenuSeparator />
                {!is_verification_request && (
                  <>
                    <DropdownMenuItem className="gap-1 space-x-1">
                      <Pencil className="size-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Edit Record</span>
                    </DropdownMenuItem>
                  </>
                )}
                {is_verification_request && (
                  <>
                    <DropdownMenuItem className="gap-2">
                      <TiTick className="size-4 text-green-600 dark:text-green-400" />
                      <span>Verify Record</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem className="gap-1 space-x-1">
                  <MdDeleteOutline className="size-4 text-destructive" />
                  <span>Delete Record</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
