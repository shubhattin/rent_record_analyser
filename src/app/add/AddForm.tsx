"use client";

import { normaliseDate } from "@/tools/date";
import { fetch_post } from "@/tools/fetch";
import Link from "next/link";
import { useRef, useState } from "react";

type lastDateIntoType = [string, number];

const AddForm = () => {
  const [passUnlocked, setPassUnlocked] = useState(false);
  const [passKey, setPassKey] = useState("");
  const last_date_data = useRef<lastDateIntoType>(null!);

  const check_pass = async () => {
    if (passKey === "") return;
    const req = fetch_post("/api/add/verify_pass", {
      json: {
        key: passKey,
      },
    });
    const resp = await req;
    if (!resp.ok) {
      setPassKey("");
      return;
    }
    const json: {
      verified: boolean;
      last_date?: lastDateIntoType;
    } = await resp.json();
    if (!json.verified) setPassKey("");
    else {
      setPassUnlocked(true);
      last_date_data.current = json.last_date!;
    }
  };

  return (
    <div>
      {!passUnlocked && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check_pass();
          }}
        >
          <input
            type="password"
            value={passKey}
            onChange={({ currentTarget: { value } }) => setPassKey(value)}
            placeholder="गूढपद"
            required
          />
          <input type="submit" value="Submit" />
        </form>
      )}
      {passUnlocked && (
        <AddRentData
          passKey={passKey}
          last_date_data={last_date_data.current}
        />
      )}
    </div>
  );
};

const AddRentData = ({
  passKey,
  last_date_data,
}: {
  passKey: string;
  last_date_data: lastDateIntoType;
}) => {
  const [date, setDate] = useState(""); // default value woll be today's
  const [amount, setAmount] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sumbit_data = async () => {
    if (date === "" || amount === "") return;
    const req = fetch_post("/api/add/submit", {
      json: {
        key: passKey,
        date: date, // sending date without normalization in form yyyy-mm-dd
        amount: parseInt(amount),
      },
    });
    const res = await req;
    if (!res.ok) return;
    const { status }: { status: string } = await res.json();
    if (status === "date_smaller") {
      setErrorStatus(true);
      setTimeout(() => setErrorStatus(false), 4000);
      setDate("");
      setAmount("");
    } else if (status === "success") {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <h4 style={{ marginBottom: "5px" }}>Add New Entry</h4>
      {!errorStatus && !submitted && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sumbit_data();
          }}
        >
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.currentTarget.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            required
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      )}
      {errorStatus && (
        <input
          type="text"
          value="Cannot Add Record before the Last Date"
          readOnly
          aria-invalid="true"
        ></input>
      )}
      {submitted && (
        <>
          <Link href="/">Home Page</Link>
          <div>
            <strong>
              Successfully Added Record of ₹ {amount} dated{" "}
              {normaliseDate(date)}.
            </strong>
          </div>
        </>
      )}
      <div style={{ marginTop: "45px" }}>
        <strong>Last Record</strong> {"=>"} {last_date_data[0]} :- ₹{" "}
        {last_date_data[1]}
      </div>
    </div>
  );
};
export default AddForm;
