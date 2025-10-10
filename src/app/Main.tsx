'use client';

import { api } from '$convex/_generated/api';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '~/state/AppDataContext';
import { Preloaded, usePreloadedQuery, useConvexAuth } from 'convex/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion';
import { MONTH_NAMES, MONTH_NAMES_SHORT, NUMBER_SUFFIX } from '~/tools/date';
import { Home, Zap } from 'lucide-react';
import { cn } from '~/lib/utils';

type RentRecord =
  (typeof api.routes.rentData.getRentDataAnalysis._returnType)['data']['rent_data'][number];

export default function Page({
  preloadedRecords
}: {
  preloadedRecords: Preloaded<typeof api.routes.rentData.getRentDataAnalysis>;
}) {
  const data_ = usePreloadedQuery(preloadedRecords);
  const [data, setData] = useState(data_);
  const { user_info } = useContext(AppContext);
  const convexAuth = useConvexAuth();

  useEffect(() => {
    if (convexAuth.isLoading) return;
    setData(data_);
  }, [data_, convexAuth]);

  const rentData = data.data.rent_data as RentRecord[];
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['0-0']);

  const getDateList = (year: number, month: number) => {
    const dateRecords: RentRecord[][] = [];
    for (const rec of rentData) {
      const [yrStr, mnStr] = rec.month.split('-');
      const yr = parseInt(yrStr);
      const mn = parseInt(mnStr);
      if (yr !== year || mn !== month) continue;
      const idx = (() => {
        for (let i = 0; i < dateRecords.length; i++)
          if (dateRecords[i][0].date === rec.date) return i;
        return -1;
      })();
      if (idx === -1) dateRecords.push([rec]);
      else dateRecords[idx].push(rec);
    }
    return dateRecords;
  };

  const yearsSortedDesc = useMemo(() => {
    return Object.keys(data.data.info_analysis || {})
      .map((v) => parseInt(v))
      .sort((a, b) => b - a);
  }, [data.data.info_analysis]);

  return (
    <div className="space-y-6">
      {yearsSortedDesc.map((yr, i_yr) => {
        const yrInfo = data.data.info_analysis[
          yr as unknown as keyof typeof data.data.info_analysis
        ] as {
          amount: number;
          months: Record<number, { amount: number; electricity_total: number; rent_total: number }>;
        };
        const monthsSortedDesc = Object.keys(yrInfo.months)
          .map((v) => parseInt(v))
          .sort((a, b) => b - a);
        return (
          <Fragment key={yr}>
            <h5 className="my-3 text-lg font-bold">
              Year {yr}, Total <sup>₹</sup>
              {yrInfo.amount}
            </h5>
            <Accordion
              type="multiple"
              className="w-full"
              value={selectedMonths}
              onValueChange={setSelectedMonths}
            >
              {monthsSortedDesc.map((mn, i_mn) => {
                const mnInfo = yrInfo.months[mn as unknown as keyof typeof yrInfo.months];
                const dateRecords = getDateList(yr, mn);
                const renderTable = (type: RentRecord['rent_type']) => {
                  if (!user_info) return null;
                  return (
                    <table className="mt-1">
                      <tbody>
                        {dateRecords.map((dte, i) => {
                          const dt = dte[0].date; // yyyy-mm-dd
                          const day = parseInt(dt.split('-')[2]);
                          const rowsForType = dte.filter((r) => r.rent_type === type);
                          if (rowsForType.length === 0) return null;
                          return (
                            <tr key={`${dt}-${i}`}>
                              <td className="px-1 py-0.5 text-start text-sm">
                                {day}
                                <sup>{day % 10 === 0 ? 'th' : NUMBER_SUFFIX[(day % 10) - 1]}</sup>
                              </td>
                              <td className="px-1 py-0.5 text-start text-sm">
                                {MONTH_NAMES_SHORT[mn - 1]}
                              </td>
                              <td className="space-x-1 px-1 py-0.5 text-start text-sm">
                                {rowsForType.map((record, idx) => (
                                  <span
                                    key={idx}
                                    className={
                                      record.is_verification_request ? 'underline' : undefined
                                    }
                                  >
                                    ₹ {record.amount}
                                    {idx !== rowsForType.length - 1 ? ',' : ''}
                                  </span>
                                ))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                };
                return (
                  <AccordionItem value={`${i_yr}-${i_mn}`} key={`${i_yr}-${i_mn}`}>
                    <AccordionTrigger>
                      <span
                        className={cn(
                          'text-base',
                          i_mn === 0 && i_yr === 0 ? 'font-bold' : undefined
                        )}
                      >
                        {MONTH_NAMES[mn - 1]}, Total = <sup>₹</sup>
                        {mnInfo.amount}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="my-0.5 flex items-center gap-1">
                        <Home className="my-1 mr-0.5 size-4.5 text-blue-600 dark:text-sky-400" />
                        <span className="text-sm">₹ {mnInfo.rent_total}</span>
                      </div>
                      {renderTable('rent')}
                      <div className="flex items-center gap-1">
                        <Zap className="my-1 size-4.5 text-amber-600 dark:text-amber-300" />
                        <span className="text-sm">₹ {mnInfo.electricity_total}</span>
                      </div>
                      {renderTable('electricity')}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Fragment>
        );
      })}
      <div className="text-sm">Total = ₹ {data.data.total}</div>
    </div>
  );
}
