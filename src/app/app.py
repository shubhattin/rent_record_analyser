from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from kry.plugins import render_page

app_router = APIRouter(prefix="", default_response_class=HTMLResponse)


@app_router.get("/")
async def home_page(req: Request):
    return render_page("main", req)
