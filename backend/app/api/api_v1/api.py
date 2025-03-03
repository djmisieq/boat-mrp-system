from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, products, boms, orders, setup, material_requirements

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(boms.router, prefix="/boms", tags=["boms"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(material_requirements.router, prefix="/material-requirements", tags=["material-requirements"])
api_router.include_router(setup.router, prefix="/setup", tags=["setup"])

# Dodanie testowego endpointu do sprawdzenia, czy API działa
@api_router.get("/healthcheck")
def health_check():
    """
    Endpoint sprawdzający, czy API działa
    """
    return {"status": "ok", "message": "API działa poprawnie"}
