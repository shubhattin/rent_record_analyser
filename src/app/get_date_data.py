from pydantic.dataclasses import dataclass

MONTH_NAMES_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]
MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

NUMBER_SUFFIX = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th"]


@dataclass
class DATE_OBJ:
    year: int
    month: int
    day: int
    str_nm: str


def sort_dict(val: dict, reverse=False):
    keys = sorted(list(val.keys()), reverse=reverse)
    VAL = {}
    for x in keys:
        VAL[x] = val[x]
    return VAL


def get_date(val: str):
    lst = val.split("/")
    day = int(lst[0])
    month = int(lst[1])
    year = int(lst[2])
    str_nm = f"{day}/{month}/{year}"
    return DATE_OBJ(day=day, month=month, year=year, str_nm=str_nm)


@dataclass
class RentData:
    amount: list[int]
    key: str


def get_sorted_rent_data(val: list[RentData]):
    out = {}

    # Making Entries for Years
    years = set()
    for dt in val:
        years.add(get_date(dt.key).year)
    years = sorted(years, reverse=True)
    for year in years:
        out[year] = {}

    # Making entries for months of each year
    for year in years:
        months = set()
        for dt in val:
            date = get_date(dt.key)
            if date.year != year:
                continue
            months.add(date.month)
        total_yr = 0
        months = sorted(months, reverse=True)
        for mn in months:
            out[year][mn] = {}
        for month in months:
            days = {}
            total = 0
            for dt in val:
                date = get_date(dt.key)
                if date.year != year or date.month != month:
                    continue
                days[date.day] = dt.amount
                for amt in dt.amount:
                    total += amt
            days = sort_dict(days, reverse=True)
            for dy in days:
                out[year][month][dy] = days[dy]
            out[year][month]["total"] = total
            total_yr += total
        out[year]["total"] = total_yr

    return out


def join_amount(amounts: list[int]):
    res = ""
    for i in range(len(amounts)):
        amount = amounts[i]
        res += f"₹ {amount}"
        if i != len(amounts) - 1:
            res += ", "
    return res
