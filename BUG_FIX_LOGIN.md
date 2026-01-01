# Bug Fix: Login Redirect Issue

## Problem Identified

User reported issue where after successful login as KETUA_KAMAR:
- URL stuck at `http://localhost:5173/login?redirect=/dashboard`
- Page shows blank/white screen on refresh
- Login API response successful

## Root Cause

Backend API returns `roles` as array of **objects** `[{ kode: "KETUA_KAMAR", nama: "Ketua Kamar" }]`, but frontend code expected array of **strings** `["KETUA_KAMAR"]`.

This mismatch caused:
1. Role checks to fail throughout the app
2. Auth state validation issues
3. Redirect logic not working properly

## Solution Applied

### 1. Auth Service Transformation ([auth.service.js](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/features/auth/auth.service.js))

Added `transformUserData()` function to normalize API response:

```javascript
const transformUserData = (userData) => {
  if (!userData) return null
  
  // Transform roles from array of objects to array of strings
  const roles = Array.isArray(userData.roles) 
    ? userData.roles.map(role => typeof role === 'string' ? role : role.kode)
    : []

  return {
    ...userData,
    roles,
  }
}
```

Applied transformation in:
- `login()` method
- `refreshToken()` method

### 2. Login Redirect Logic ([LoginPage.vue](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/features/auth/LoginPage.vue))

Changed from `router.push()` to `router.replace()`:

```javascript
// Get redirect path from query or default to dashboard
const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'

// Replace instead of push to prevent going back to login page
await router.replace(redirectPath)
```

### 3. Auth Store Improvements ([auth.store.js](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/app/store/auth.store.js))

Added:
- Debug console.log statements for troubleshooting
- Improved role array validation in `userRoles` getter

## Testing Steps

1. Clear browser localStorage
2. Navigate to app (should redirect to `/login`)
3. Login with KETUA_KAMAR credentials
4. Verify redirect to `/dashboard` works
5. Check console for debug logs
6. Refresh page - should stay on dashboard
7. Verify roles display correctly on dashboard

## Expected Behavior

✅ Login successful → Redirect to `/dashboard`
✅ Refresh on dashboard → Stay on dashboard
✅ Roles display as badges: "Ketua Kamar"
✅ Bottom navigation shows based on role
✅ Console shows proper auth state

## Files Modified

- [src/features/auth/auth.service.js](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/features/auth/auth.service.js)
- [src/features/auth/LoginPage.vue](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/features/auth/LoginPage.vue)
- [src/app/store/auth.store.js](file:///home/rendy/Documents/projects/santri-pasir/pengurus-app/src/app/store/auth.store.js)
