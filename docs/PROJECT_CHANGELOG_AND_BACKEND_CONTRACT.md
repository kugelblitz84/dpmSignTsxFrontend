# Project Changelog & Backend Contract

_Last updated: 2025-09-27_

## 1. High-Level Overview
This document captures the cumulative frontend changes, behavioral expectations, API interaction patterns, payment flow adjustments, and the finalized data contract for product reviews. It is designed to onboard backend collaborators quickly and serve as a single source of truth for the current state of the checkout, order, payment intent, PDF export, and review systems.

---
## 2. Feature Areas & Status
| Area | Summary | Status |
|------|---------|--------|
| Invoice / PDF Export | A4 isolated capture with html2canvas + jsPDF, fixed header color loss, footer locked to bottom, controlled grand total width. | Complete |
| Auth & Checkout Flow | Registration-first modal, combined auth + order request actions, staff field optional, phone auto-filled if available. | Complete |
| Cart Integrity | Guest→auth merge, safe clearing after order, no page reload required, optimistic UI updates. | Complete |
| Payment Flow (Online vs COD) | Customer submits order with intent only. Staff later initiates actual online payment session (SSLCommerz) via backend; no automatic gateway call on customer submission. | Complete (Flow Realigned) |
| Payment Method Selection | Rewritten with native radio inputs + container click sync; Joi schema relaxed using `.unknown(true)` for UI-only keys. | Complete |
| Error Resilience (Images/Blobs) | Added safeCreateObjectURL wrapper; stripped transient blob references on state restore to prevent crashes. | Complete |
| Order History | Sorted newest-first client side in hook. | Complete |
| Product Gallery | Square thumbnails (`object-cover`), main image constrained height & `object-contain` (no cropping). | Complete |
| Product Reviews: Display & Submission | Displays reviewer name from backend `customer.name`; guest fallback to "Guest". Multi-variant guest payload attempts when creating review. | Complete (Backend Normalization Recommended) |
| Swiper Type Warnings | Caused by outdated `@types/swiper` + side-effect CSS imports. | Pending Cleanup |
| Optional Enhancements | Guest review name normalization, optimistic review insertion, payment resume link UI. | Deferred |

---
## 3. Detailed Change Log
### 3.1 Invoice / PDF Generation
- Technology: `html2canvas` + `jsPDF`.
- Print isolation: Invoice container cloned; background/palette preserved with `useCORS` and `backgroundColor` flags.
- Grand total box width reduced for better balance.
- Header color loss under print/export fixed via explicit inline/background styling and Tailwind overrides in print context.
- Footer pinned using flex + min-height strategy inside export wrapper.

### 3.2 Authentication & Modal Behavior
- Checkout no longer forces sign-in before building the order request; instead user triggers combined auth + order action.
- Registration-first emphasis: If unauthenticated, registration panel shown first; after success, order intent is sent.
- Staff selection removed as mandatory (now optional property in payload if chosen).
- Phone field auto-populates if profile phone exists.

### 3.3 Cart Lifecycle & State Safety
- On guest→auth transition, carts are merged (server authoritative, client reflects merged state).
- After successful order intent submission: cart cleared in state & storage; UI updates immediately; no reload.
- Defensive blob handling prevents errors when reopening modals containing image previews.

### 3.4 Online Payment Flow (Realigned)
Original Mistake: Customer submission immediately attempted to open SSLCommerz session.

Corrected Flow:
1. Customer selects payment method (e.g. `online` or `cod`) and submits order (intent phase). Backend stores order with `status = pending` and `method = online`.
2. Staff dashboard later triggers backend endpoint to start payment session (e.g. SSLCommerz create session) producing payment URL.
3. Customer receives link (email / dashboard / notification) and completes payment externally.
4. Backend webhook / callback updates order status (e.g. `paid`).

Frontend Impact:
- Removed automatic invocation of `startOnlinePayment` during checkout.
- Preserved a helper still callable by staff context if needed (not auto-triggered in customer flow).
- Payload now includes `method` (user intent) and optionally `paymentMethod` (UI selection).

### 3.5 Payment Method Input & Validation
- Replaced custom wrappers causing unselectable radios with native `<input type="radio">`.
- Container click delegates to input for larger hit zone.
- Joi schemas updated with `.unknown(true)` to allow UI-only `paymentMethod` until backend schema formally acknowledges it.

### 3.6 Order Fetching & Sorting
- `use-order` hook sorts orders descending by `createdAt` before exposing them to UI.
- No server change required; stable regardless of backend default ordering.

### 3.7 Media & Image Handling
- Product gallery: Square thumbnails ensure consistent grid; main image uses `max-h` constraint with `object-contain` to avoid cropping tall images.
- Safe URL creation: `safeCreateObjectURL` wrapper with try/catch; cleanup on component unmount.

### 3.8 Product Reviews (Frontend Behavior)
- Display name logic: `review.customer?.name || "Guest"`.
- When creating a review as guest, frontend attempts multiple property naming conventions to match possible backend expectations (e.g. `name`, `guestName`, `reviewerName`, `customerName`). This should be simplified once backend standardizes.
- After creation, UI refreshes list from server (no optimistic insertion yet).

### 3.9 Type Warnings (Swiper)
- Warnings triggered by CSS side-effect imports plus old `@types/swiper`.
- Resolution paths:
  1. Remove `@types/swiper` if using Swiper 7+ (bundles its own types).
  2. Or add ambient module declarations for imported CSS if needed.
  3. Ensure tsconfig `skipLibCheck` not masking deeper issues (optional).

---
## 4. Current Frontend → Backend Data Contracts
### 4.1 Order Intent Submission (Customer)
Example Payload (JSON):
```json
{
  "items": [
    { "productId": "<string>", "quantity": 2, "price": 1200 }
  ],
  "shippingAddress": {
    "line1": "...",
    "city": "...",
    "region": "...",
    "postalCode": "...",
    "country": "..."
  },
  "customerNote": "Optional note",
  "method": "online",            
  "paymentMethod": "sslcommerz",  
  "staffId": null,                 
  "couponCode": "SAVE10"          
}
```
Required Backend Response (Intent Accepted):
```json
{
  "orderId": "ORD-2025-000123",
  "status": "pending",
  "method": "online",
  "amount": 2400,
  "currency": "BDT",
  "createdAt": "2025-09-27T10:11:12.345Z"
}
```
Notes:
- No payment URL should be returned at this phase.
- Validation: If `method = online`, backend must still accept order without starting session.

### 4.2 Staff-Initiated Payment Session
Request (Staff Panel):
```json
{ "orderId": "ORD-2025-000123" }
```
Backend Response:
```json
{
  "orderId": "ORD-2025-000123",
  "paymentSessionId": "PS_f83b2...",
  "gateway": "sslcommerz",
  "paymentUrl": "https://securepay.example/session/PS_f83b2...",
  "expiresAt": "2025-09-27T10:41:12.345Z"
}
```
Subsequent Webhook / Polling Update (Backend → Client fetch):
```json
{
  "orderId": "ORD-2025-000123",
  "status": "paid",
  "paidAt": "2025-09-27T10:20:05.000Z",
  "transactionId": "TX_9081234",
  "gateway": "sslcommerz"
}
```

### 4.3 Product Review List Response
Backend SHOULD return reviews embedded under product fetch or via dedicated endpoint.

Minimal Required Product Shape (Excerpt):
```json
{
  "id": "prod_123",
  "name": "Sample Product",
  "images": ["/uploads/p1.jpg"],
  "reviews": [
    {
      "id": "rev_001",
      "rating": 4,
      "comment": "Nice quality",
      "createdAt": "2025-09-20T09:15:00.000Z",
      "customer": { "name": "Alice", "email": "alice@example.com" }
    },
    {
      "id": "rev_002",
      "rating": 5,
      "comment": "Excellent!",
      "createdAt": "2025-09-21T11:00:00.000Z",
      "customer": null
    }
  ]
}
```
Display Rule:
- If `customer && customer.name` → show that name.
- Else show literal `"Guest"`.

### 4.4 Create Review Request (Guest & Authenticated — Standardized Contract 2025-09-27)
Backend requires `guestName` and `guestEmail` ALWAYS. `customerId` is optional; if present and valid, backend overwrites the provided guestName/guestEmail with authoritative customer info. If `customerId` is missing or invalid, review is treated as guest.

Guest Example:
```json
{
  "rating": 4,
  "description": "Nice texture, could be thicker.",
  "productId": 101,
  "guestName": "Chris",
  "guestEmail": "chris@example.com"
}
```

Authenticated Example:
```json
{
  "rating": 5,
  "description": "Exactly what I needed. Fast delivery.",
  "productId": 101,
  "customerId": 7,
  "guestName": "Placeholder",
  "guestEmail": "ignored@example.com"
}
```

Response (normalized):
```json
{
  "id": "rev_100",
  "productId": 101,
  "rating": 5,
  "description": "Exactly what I needed. Fast delivery.",
  "createdAt": "2025-09-27T09:58:00.000Z",
  "customer": { "name": "Authoritative Name", "email": "user@example.com" },
  "status": "published"
}
```

Frontend Now Sends: `{ rating, description, productId, guestName, guestEmail, customerId? }`.


### 4.6 Error Format (Recommendation)
Unified error response (suggested):
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Rating must be between 1 and 5.",
    "fieldErrors": { "rating": "Out of range" },
    "timestamp": "2025-09-27T09:59:11.000Z",
    "requestId": "req_abc123"
  }
}
```

---
## 5. Frontend Assumptions & Edge Cases
| Scenario | Handling |
|----------|----------|
| Missing `customer` on review | Displays `Guest`. |
| Payment intent created but session not started | Order remains `pending`; UI does not auto-prompt. |
| Network failure during PDF generation | User sees error toast; no partial file saved. |
| Image CORS issues during canvas render | `useCORS: true` attempts cross-origin; fallback: image may be blank silently. |
| Multiple payment attempts | Frontend expects idempotent backend: re-triggering staff payment should either reuse session or close old one. |

---
## 6. Technical Debt & Deferred Items
| Item | Description | Proposed Action |
|------|-------------|-----------------|
| Swiper type warnings | Caused by legacy `@types/swiper`. | Remove package or add ambient decl. |
| Review guest field variants | Multiple guess attempts inflate complexity. | Standardize backend to `guest` object. Remove fallbacks. |
| Optimistic review insertion | Currently waits full refetch. | Insert locally then reconcile. |
| Resume payment UI | If user abandons payment, no direct resume component. | Store `paymentUrl` after staff initiation and surface banner. |

---
## 7. Recommendations for Backend Team
1. Standardize guest review payload to: `{ guest: { name, email } }` and always return normalized `customer` object.
2. Persist `method` and differentiate from final `status`; introduce `paymentStatus` if mixing states becomes confusing.
3. Provide idempotent payment session endpoint; repeated calls return same active session until expiry.
4. Expose webhook verification endpoint and document signature scheme (HMAC secret, etc.).
5. Return uniform error envelope (see Section 4.6) for easier UI mapping.
6. Include `total`, `subtotal`, `discount`, `tax` fields explicitly in order response for invoice accuracy.

---
## 8. Suggested Next Frontend Tasks (If Approved)
1. Remove `@types/swiper` and add a short migration note in this file.
2. Refactor review creation service to single payload once backend confirms contract.
3. Add offline retry queue for order intents (localStorage) if network drops mid-submit.
4. Add print preview mode toggle for invoice prior to PDF export.

---
## 9. Quick Reference Payload Cheat Sheet
| Action | Endpoint (Indicative) | Payload Keys |
|--------|-----------------------|--------------|
| Create Order Intent | POST `/orders` | items[], shippingAddress{}, method, paymentMethod?, couponCode?, staffId? |
| Start Payment (Staff) | POST `/orders/:id/start-payment` | orderId |
| List Orders | GET `/orders?customer=self` | (query: pagination optional) |
| Fetch Product + Reviews | GET `/products/:id` | — |
| Create Review (Auth) | POST `/reviews` | productId, rating, comment |
| Create Review (Guest) | POST `/reviews` | productId, rating, comment, guest{name,email} |

---
## 10. Validation Guidelines (Frontend Expectations)
| Field | Rules |
|-------|-------|
| rating | Integer 1–5. |
| comment | 1–1000 chars (soft limit). |
| productId | Non-empty string (UUID or slug). |
| method | Enum: `online`, `cod`. |
| paymentMethod | Enum: `sslcommerz`, `cod` (future expansion ready). |
| guest.name | 1–80 chars. |
| guest.email | RFC 5322 validation pattern. |

---
## 11. Security & Integrity Notes
- Do NOT trust client-provided `amount`; backend recalculates totals server-side.
- Validate ownership on `orderId` for staff actions (RBAC required).
- Sanitize review `comment` (strip HTML or whitelist). Frontend displays as plain text.
- Implement replay protection & signature verification for payment gateway callbacks.

---
## 12. Invoice Data Requirements (Backend → Frontend)
Provide in order detail endpoint for accurate PDF:
```json
{
  "orderId": "ORD-2025-000123",
  "createdAt": "2025-09-27T10:11:12.345Z",
  "customer": { "name": "Alice", "email": "alice@example.com", "phone": "+8801..." },
  "shippingAddress": { "line1": "...", "city": "...", "region": "...", "postalCode": "...", "country": "BD" },
  "items": [
    { "sku": "SKU-001", "name": "Widget A", "qty": 2, "unitPrice": 1200, "lineTotal": 2400 }
  ],
  "subtotal": 2400,
  "discount": 240,
  "tax": 216,
  "total": 2376,
  "currency": "BDT",
  "method": "online",
  "status": "paid",
  "transactionId": "TX_9081234"
}
```

---
## 13. Glossary
| Term | Definition |
|------|------------|
| Intent | Initial order submission before payment session creation. |
| Payment Session | Gateway-specific session enabling redirection to payment UI. |
| Guest Review | Review created without authenticated user context. |

---
## 14. Change Management
- This file should be updated whenever:
  1. A new endpoint is consumed or contract changes.
  2. Payment flow or status model changes.
  3. Review payload is standardized.
- Versioning suggestion: Add a semantic header (e.g., `## v1.1`) upon contract-affecting modifications.

---
## 15. Maintainers
| Role | Contact (Placeholder) |
|------|-----------------------|
| Frontend Lead | frontend@example.com |
| Backend Lead | backend@example.com |
| DevOps | devops@example.com |

---
_End of Document_
