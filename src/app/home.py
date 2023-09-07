"""
Page :- /
"""
from fastapi import APIRouter, Request
from kry.plugins import render_page
from ._router import app_router
from kry.datt import Base
from .get_date_data import (
    MONTH_NAMES,
    MONTH_NAMES_SHORT,
    RentData,
    get_sorted_rent_data,
    join_amount,
    NUMBER_SUFFIX,
)

router = APIRouter(prefix="")


@router.get("/")
async def home_page(req: Request):
    def get_data():
        db = Base("rent_data")
        last = None
        data = []
        while True:
            res = db.fetch(last=last)  # type: ignore
            data.extend(res.items)
            if res.last is None:
                break
            last = res.last
        if len(data) == 0:
            return []
        else:
            return [RentData(**x) for x in data]

    DATA = get_sorted_rent_data(get_data())

    return render_page(
        "main",
        req,
        {
            "res": DATA,
            "MONTH_NAME": MONTH_NAMES,
            "MONTH_NAME_SHORT": MONTH_NAMES_SHORT,
            "join_amount": join_amount,
            "NUMBER_SUFFIX": NUMBER_SUFFIX,
        },
    )


app_router.include_router(router)
