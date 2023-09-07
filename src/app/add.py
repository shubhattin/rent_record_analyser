"""
Page :- /add
"""

from fastapi import APIRouter, Request, Form, Response
from ._router import app_router
from kry.plugins import render_page
from kry.datt import Base
from .get_date_data import join_amount, get_date
from kry.gupta import puShTi

router = APIRouter(prefix="/add")


@router.get("")
async def index(req: Request):
    return render_page("add_init", req)


@router.post("")
async def index_post(req: Request, key: str = Form()):
    HASH_KEY = Base("others").get("passkey")["value"]  # type: ignore
    if not puShTi(key, HASH_KEY):
        return """
            <strong>Wrong Key!</strong>
            <div hx-boost="true"><a href="/add">Retry</a></div>
        """
    last_date: str = get_date(Base("others").get("last_date")["value"]).str_nm  # type: ignore
    last_record: dict = Base("rent_data").get(last_date)  # type: ignore
    return render_page(
        "add",
        req,
        {
            "last_record": {
                "date": last_date,
                "amount": join_amount(last_record["amount"]),  # type:  ignore
            }
        },
    )


@router.post("/add_data")
def add_new_entry(date: str = Form(), amount: int = Form()):
    date_spl = date.replace("-", "/").split("/")
    date = get_date("/".join(date_spl[::-1])).str_nm
    dt = get_date(date)
    last_date_str: str = get_date(Base("others").get("last_date")["value"]).str_nm  # type: ignore
    last_date = get_date(last_date_str)

    def compare_dates():
        """Chcking if `last date` is biggger than `dt`"""
        if last_date.year > dt.year:
            return True
        elif last_date.year < dt.year:
            return False
        else:
            if last_date.month > dt.month:
                return True
            elif last_date.month < dt.month:
                return False
            else:
                if last_date.day > dt.day:
                    return True
                return False

    # If Before last Date
    if compare_dates():
        return """
            <input type="text" value="Cannot Add Record before the Last Date" readonly aria-invalid="true">
        """
    data = {"key": date, "amount": [amount]}
    if date == last_date_str:
        data = Base("rent_data").get(last_date_str)
        data["amount"].append(amount)  # type: ignore
    Base("rent_data").put(data)  # type: ignore
    Base("others").put(date, "last_date")
    return f"""
        <div hx-boost="true">
            <a href="/" role="button">Home Page</a>
        </div>
        <strong>Succesfully Added Record of ₹ {amount} dated {date}.</strong>
    """


app_router.include_router(router)
