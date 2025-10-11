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
import { useMutation, useQuery } from 'convex/react';
import { Home, Zap, MoreHorizontal, Pencil, User } from 'lucide-react';
import { MdDeleteOutline } from 'react-icons/md';
import { TiArrowRightOutline, TiTick } from 'react-icons/ti';
import { useContext, useState } from 'react';
import { AppContext } from '~/state/AppDataContext';
import { cn } from '~/lib/utils';
import type { Id } from '$convex/_generated/dataModel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { MONTH_NAMES } from '~/tools/date';

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
    header: () => <div className="text-start font-semibold">Amount</div>,
    cell: ({ row }) => {
      const verification_request_ids = useQuery(api.routes.rentData.getRentDataVerificationRequest);
      const is_verification_request = verification_request_ids?.some(
        (v) => v[0] === row.original._id
      );

      return (
        <span className={cn(is_verification_request && 'underline')}>{row.original.amount}</span>
      );
    }
  },
  {
    accessorKey: 'rent_type',
    header: () => <div className="text-start text-xs font-semibold">Type</div>,
    cell: ({ row }) => {
      if (row.original.rent_type === 'rent')
        return <Home className="size-3.5 text-sky-600 sm:size-4 dark:text-sky-300" />;
      if (row.original.rent_type === 'electricity')
        return <Zap className="size-3.5 text-amber-600 sm:size-4 dark:text-amber-300" />;
      return <div className="text-start">Unknown</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const record = row.original;

      const { user_info } = useContext(AppContext);
      const is_admin = user_info?.role === 'admin';

      const verification_request_ids = useQuery(
        api.routes.rentData.getRentDataVerificationRequest
      ) as [Id<'rent_data'>, Id<'verification_requests'>][] | undefined;
      const is_verification_request = verification_request_ids?.some((v) => v[0] === record._id);
      const verification_request_id = verification_request_ids?.find(
        (v) => v[0] === record._id
      )?.[1];

      const record_user_info = useQuery(api.routes.userInfo.getUserInfo, {
        user_id: record.user_id
      });

      const delete_rent_record_mut = useMutation(api.routes.addEditData.deleteRentData);
      const verify_rent_record_mut = useMutation(api.routes.addEditData.verifyRentData);

      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);

      return (
        <>
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
                  {record_user_info?.name.split(' ')[0] ?? '--'}
                </span>
              </DropdownMenuLabel>
              {is_admin && (
                <>
                  <DropdownMenuSeparator />
                  {!is_verification_request && (
                    <>
                      <DropdownMenuItem
                        className="gap-1 space-x-1"
                        onClick={() => setEditDialogOpen(true)}
                      >
                        <Pencil className="size-3.5 text-sky-600 dark:text-sky-400" />
                        <span>Edit Record</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  {is_verification_request && (
                    <>
                      <DropdownMenuItem className="gap-2" onClick={() => setVerifyDialogOpen(true)}>
                        <TiTick className="size-4 text-green-600 dark:text-green-400" />
                        <span>Verify Record</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    className="gap-1 space-x-1"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <MdDeleteOutline className="size-4 text-destructive" />
                    <span>Delete Record</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Verify this record?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the record as verified. You can\'t undo this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (!verification_request_id) return;

                    await verify_rent_record_mut({ id: verification_request_id });
                    toast.success('Record verified');
                  }}
                >
                  Verify
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={async () => {
                    await delete_rent_record_mut({ id: record._id });
                    toast.success('Record deleted');
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <EditRentRecordDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            record={record}
          />
        </>
      );
    }
  }
];

type RentRecord = (typeof api.routes.rentData.getRentData._returnType)['page'][number];

function EditRentRecordDialog({
  open,
  onOpenChange,
  record
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  record: RentRecord;
}) {
  const edit_rent_record_mut = useMutation(api.routes.addEditData.editRentData);

  const [date, setDate] = useState<string>(record.date);
  const [amount, setAmount] = useState<string>(String(record.amount));
  const [month, setMonth] = useState<string>(() => {
    const [, mn] = record.month.split('-');
    return String(parseInt(mn));
  });
  const [year, setYear] = useState<string>(() => record.month.split('-')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSave = async () => {
    const amtNum = Number(amount);
    if (!month || !year) {
      toast.error('Select month and year');
      return;
    }
    if (!Number.isFinite(amtNum) || amtNum < 100) {
      toast.error('Amount must be at least 100');
      return;
    }

    try {
      setSubmitting(true);
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      await edit_rent_record_mut({ id: record._id, amount: amtNum, date, month: monthStr });
      toast.success('Record updated');
      onOpenChange(false);
    } catch (e: any) {
      toast.error('Failed to update record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Update iD :{' '}
            <span className="font-semibold text-muted-foreground">{record._id.slice(0, 5)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.map((mn, i) => (
                    <SelectItem key={mn} value={`${i + 1}`}>
                      {mn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={`${currentYear - 1}`}>{currentYear - 1}</SelectItem>
                  <SelectItem value={`${currentYear}`}>{currentYear}</SelectItem>
                  <SelectItem value={`${currentYear + 1}`}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="edit-amount">Amount</Label>
            <Input
              id="edit-amount"
              type="number"
              min={100}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => setConfirmOpen(true)} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save changes?</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center justify-center gap-2 py-4 select-none sm:justify-start sm:py-0">
              ₹ {amount!} <TiArrowRightOutline className="size-4" />{' '}
              {MONTH_NAMES[parseInt(month) - 1]} {year}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={async () => {
                await handleSave();
                setConfirmOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
