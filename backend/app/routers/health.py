from fastapi import APIRouter

router = APIRouter(prefix="", tags=["health"])

@router.get("/healthz")
def healthz():
    return {"ok": True}
