# Catalog Master Import & Product Details

## Overview
Complete implementation of the master catalog import flow, budget-based replication, and product details management for the gestor (manager) role.

## Problem Statement
- Master catalog (BaseProducts) appeared empty when localStorage was corrupted or empty
- Gestor catalog used V2 products (Product) instead of company-specific V3 products (CompanyProduct)
- No functionality to view/edit product details in gestor catalog
- Budget flow didn't follow correct status sequence
- Manual replication without proper logging

## Solution

### 1. Master Catalog Auto-Seeding
**File**: `lib/storage.ts`

**Function**: `ensureBaseProductsSeeded()`
- Checks if `yoobe_base_products_v3` exists in localStorage
- Fixes empty array or invalid JSON cases
- Automatically resets to `initialBaseProducts` when needed
- Ensures master catalog is never empty

**Integration Points**:
- Called in `lib/demoClient.ts` → `importMasterProducts()`
- Called in `app/gestor/catalog/import/page.tsx` before loading products

**UI Enhancement**:
- "Resetar Catálogo Mestre" button when catalog is empty

### 2. Budget Workflow Correction
**File**: `app/gestor/budgets/page.tsx`

**Status Flow**:
```
submitted → approved → released → replicated
```

**Changes**:
- Added intermediate `released` status between `approved` and `replicated`
- New `handleRelease()` function to release approved budgets
- Replaced manual replication with `/api/replication` endpoint call
- Replication now creates proper logs via `createReplicationLog()`
- Toast with "Ver no Catálogo" link after successful replication

**Status Colors**:
- `released: "bg-purple-100 text-purple-800"`

### 3. Gestor Catalog: CompanyProducts V3
**File**: `app/gestor/catalog/page.tsx`

**Migration**:
- Replaced `useCatalog(env)` (V2) with `getCompanyProductsByCompany(companyId)` (V3)
- CompanyId obtained from `yoobe_auth` (not hardcoded)

**Field Mapping**:
- `images?.[0]` instead of `image`
- `stockQuantity` instead of `stock`
- `pointsCost` instead of `priceInPoints`
- `isActive` instead of `active`
- `finalSku` instead of `sku`

**UX Improvements**:
- Cards are clickable to navigate to `/gestor/catalog/[id]`
- Added eye icon button for quick view
- Product status badge display

### 4. Product Details Page
**File**: `app/gestor/catalog/[id]/page.tsx` (NEW)

**Features**:
- Complete `CompanyProduct` visualization
- Related `BaseProduct` reference display
- Edit mode for:
  - Price in R$ (`price`)
  - Price in Pontos (`pointsCost`)
  - Stock quantity (`stockQuantity`)
  - Active status (`isActive`)
- Product information:
  - Final SKU (`finalSku`)
  - Base Product ID (`baseProductId`)
  - Category
  - Status
  - Creation and update dates
- Image gallery (multiple product images)
- Status badges (Active/Inactive, In Stock/Out of Stock)

### 5. Replication Logs: Dynamic CompanyId
**File**: `app/gestor/catalog/replication-logs/page.tsx`

**Changes**:
- Removed hardcoded `company_1`
- Implemented `companyId` reading from `yoobe_auth`
- Conditional loading based on authentication
- "Atualizar" button disabled when no companyId

## Complete Flow

1. **Import**: `/gestor/catalog/import` → always shows products (auto-seed)
2. **Budget**: Select products → create budget → status `submitted`
3. **Approval**: `/gestor/budgets` → approve → status `approved`
4. **Release**: Release → status `released`
5. **Replication**: Replicate via `/api/replication` → creates CompanyProducts + logs → status `replicated`
6. **Catalog**: `/gestor/catalog` → lists replicated company products
7. **Details**: Click product → `/gestor/catalog/[id]` → view/edit
8. **Logs**: `/gestor/catalog/replication-logs` → view replication history

## Files Modified

- `lib/storage.ts`: Added `ensureBaseProductsSeeded()`
- `lib/demoClient.ts`: Updated `importMasterProducts()` to call seed
- `app/gestor/catalog/import/page.tsx`: Auto-seed + reset button
- `app/gestor/budgets/page.tsx`: Complete status flow + API replication
- `app/gestor/catalog/page.tsx`: Migration to CompanyProducts V3
- `app/gestor/catalog/[id]/page.tsx`: New details page (CREATED)
- `app/gestor/catalog/replication-logs/page.tsx`: Dynamic companyId

## Rules Established

### Master Catalog
- **Always Seed**: Call `ensureBaseProductsSeeded()` before using `getBaseProducts()`
- **Recovery**: If catalog appears empty, seed function automatically recovers
- **Storage Key**: `yoobe_base_products_v3` in localStorage
- **Never Empty**: Catalog should never be empty - seed ensures initial products exist

### Company Catalog
- **Use V3 Only**: Gestor catalog must use `CompanyProduct` (V3), never `Product` (V2)
- **Get by Company**: Always use `getCompanyProductsByCompany(companyId)` with companyId from `yoobe_auth`
- **Never Hardcode**: CompanyId must come from authentication, never hardcoded
- **Storage Key**: `yoobe_company_products_v3` in localStorage

### Budget Workflow
- **Status Flow**: `submitted → approved → released → replicated` (mandatory sequence)
- **Replication**: Always use `/api/replication` endpoint, never manual creation
- **Logs**: Replication must create logs via `createReplicationLog()` for audit trail
- **UI Feedback**: Show toast with "Ver no Catálogo" link after successful replication

### Product Details
- **Route Pattern**: `/gestor/catalog/[id]` for company product details
- **Editable Fields**: price, pointsCost, stockQuantity, isActive
- **Base Reference**: Always show related BaseProduct for context
- **Validation**: Ensure stockQuantity >= 0, prices >= 0

## Testing Checklist

- [x] Master catalog always shows products (even after localStorage clear)
- [x] Import page displays all base products
- [x] Budget creation works with selected products
- [x] Budget approval flow works correctly
- [x] Budget release works correctly
- [x] Replication creates CompanyProducts
- [x] Replication creates logs
- [x] Catalog shows replicated products
- [x] Product details page loads correctly
- [x] Product editing works (price, stock, status)
- [x] Replication logs show correct company
- [x] No hardcoded companyIds

## Future Enhancements

- Bulk product import from CSV
- Product variants support
- Product image upload
- Product tags management
- Advanced filtering in catalog
- Product history/versioning
- Bulk edit capabilities
