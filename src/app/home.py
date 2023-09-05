"""
Page :- /
"""
from fastapi import APIRouter, Request
from kry.plugins import render_page
from ._router import app_router

router = APIRouter(prefix="")


@router.get("/")
async def home_page(req: Request):
    return render_page("main", req)


app_router.include_router(router)
