'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AppContext } from '~/state/AppDataContext';
import { api } from '$convex/_generated/api';
import { useMutation } from 'convex/react';
import { MONTH_NAMES, normaliseDate } from '~/tools/date';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog';
import { Home, Zap, Plus } from 'lucide-react';
import AuthenticatePassword from './AuthenticatePassword';
import UserControls from './UserControls';
import { TiArrowRightOutline } from 'react-icons/ti';
import { AnimatePresence, motion } from 'framer-motion';

type RentType = 'rent' | 'electricity';
type Status = 'idle' | 'confirm' | 'submitting' | 'success' | 'error';

const getTodayDateString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function AddRentData() {
  const { user_info } = useContext(AppContext);

  const today = new Date();
  // const initialMonthNum = today.getMonth() + 1;
  const initialMonthNum = (() => {
    const mn = today.getMonth() + 1;
    const prev = mn === 1 ? 12 : mn - 1;
    return prev;
  })();
  // const initialYearNum = today.getFullYear();
  const initialYearNum = (() => {
    const yr = today.getFullYear();
    const prev = Number(initialMonthNum) === 1 ? yr - 1 : yr;
    return prev;
  })();

  const [month, setMonth] = useState<string>(initialMonthNum.toString());
  const [year, setYear] = useState<string>(initialYearNum.toString());
  const [date, setDate] = useState<string>(getTodayDateString());
  const [amount, setAmount] = useState<number | null>(null);
  const [rentType, setRentType] = useState<RentType>('rent');

  // Single status to represent mutation and UI flow
  const [status, setStatus] = useState<Status>('idle');

  const addRentData = useMutation(api.routes.addEditData.addRentData);

  const amountInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  const resetForm = () => {
    setDate(getTodayDateString());
    setMonth(String(initialMonthNum));
    setYear(String(initialYearNum));
    setAmount(null);
    setRentType('rent');
    setStatus('idle');
    setTimeout(() => amountInputRef.current?.focus(), 200);
  };

  const handleSubmitConfirmed = async () => {
    if (!date || amount === null || Number(amount) <= 0) return;
    const payload = {
      rent_type: rentType,
      date, // by default in yyyy-mm-dd format
      amount: Number(amount),
      month: `${year}-${String(month).padStart(2, '0')}`
    } as const;
    try {
      setStatus('submitting');
      await addRentData(payload);
      setStatus('success');
    } catch (err: any) {
      // Keep generic error to avoid separate error message state
      setStatus('error');
    }
  };

  if (!user_info) return <AuthenticatePassword />;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-end">
        <UserControls />
      </div>

      <AnimatePresence mode="wait">
        {status !== 'success' && (
          <motion.form
            key="add-form"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, duration: 0.25 }}
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!date || amount === null || Number(amount) < 100) return;
              setStatus('confirm');
            }}
          >
            {user_info?.role === 'admin' && (
              <RadioGroup
                className="flex gap-6"
                value={rentType}
                onValueChange={(v) => setRentType(v as RentType)}
              >
                <Label className="flex cursor-pointer items-center gap-2">
                  <RadioGroupItem value="rent" />
                  <Home className="size-5 text-sky-600 dark:text-sky-400" />
                  Rent
                </Label>
                <Label className="flex cursor-pointer items-center gap-2">
                  <RadioGroupItem value="electricity" id="rt_elec" />
                  <Zap className="size-5 text-yellow-600 dark:text-yellow-400" />
                  Electricity
                </Label>
              </RadioGroup>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
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
                    <SelectItem value={`${initialYearNum - 1}`}>{initialYearNum - 1}</SelectItem>
                    <SelectItem value={`${initialYearNum}`}>{initialYearNum}</SelectItem>
                    <SelectItem value={`${initialYearNum + 1}`}>{initialYearNum + 1}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={100}
                required
                value={amount ?? ''}
                onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
                ref={amountInputRef}
                placeholder="Amount"
              />
            </div>

            {status === 'error' && <div className="text-sm text-red-600">Failed to add record</div>}

            <Button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 inline-flex items-center gap-2 text-base font-semibold"
            >
              {status === 'submitting' ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="size-5" />
                  Add Record
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            key="success-block"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, duration: 0.2 }}
            className="space-y-2"
          >
            <Link href="/" className="inline-flex">
              <Button variant="default" className="gap-2" type="button">
                Home Page
              </Button>
            </Link>
            <div className="font-semibold">
              Successfully Added Record of ₹ {amount!} dated {normaliseDate(date)}.
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                resetForm();
              }}
            >
              Add More
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog
        open={status === 'confirm'}
        onOpenChange={(open) => setStatus(open ? 'confirm' : 'idle')}
      >
        <AlertDialogContent>
          <motion.div
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure to Add?</AlertDialogTitle>
              <AlertDialogDescription className="flex items-center justify-center gap-2 py-4 select-none sm:justify-start sm:py-0">
                ₹ {amount!} <TiArrowRightOutline className="size-4" />{' '}
                {MONTH_NAMES[parseInt(month) - 1]} {year}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={status === 'submitting'}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={status === 'submitting'}
                onClick={async () => {
                  await handleSubmitConfirmed();
                }}
                className="font-bold"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
