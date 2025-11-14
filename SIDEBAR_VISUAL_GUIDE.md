# 🎨 Enhanced Sidebar - Visual Feature Guide

## Feature 1: Hover Previews

### How It Looks

```
┌─────────────────────────┐
│ NFT Hub    Customizable │
├─────────────────────────┤
│ 🔍 Search...            │
├─────────────────────────┤
│ [All] [Main] [Trading]  │
├─────────────────────────┤
│                         │                    ┌────────────────────────────┐
│ [≡] 🏠 Marketplace      │                    │                            │
│ [≡] 📈 Trending  ↗23.5% │ ────────────────→  │  Trending Now      3 items │
│                         │    (hover)         ├────────────────────────────┤
│ [≡] 🎨 Collections      │                    │ #1 🖼️ Bored Ape #8547     │
│ [≡] ⚡ Activity    [3]  │                    │     42.5 ETH  ↗ 15.3%     │
│ [≡] 🔄 Swap      [NEW]  │                    │     ❤️ 234    👁 1523     │
│ [≡] 🛒 Buy NFTs         │                    ├────────────────────────────┤
│ [≡] 💰 Sell NFTs        │                    │ #2 🖼️ CryptoPunk #4156    │
│ [≡] 📊 Portfolio  ↗8.2% │                    │     38.2 ETH  ↗ 8.7%      │
│ [≡] ❤️  Favorites       │                    │     ❤️ 456    👁 2341     │
│ [≡] 🔖 Watchlist  ↘2.3% │                    ├────────────────────────────┤
│                         │                    │ #3 🖼️ Azuki #9341         │
│                         │                    │     12.1 ETH  ↘ 3.2%      │
│ [Grid] [List]           │                    │     ❤️ 189    👁 987      │
│ ● Connected             │                    ├────────────────────────────┤
│ 0x1234...5678           │                    │ View All →                │
└─────────────────────────┘                    └────────────────────────────┘
```

### Supported Preview Items

| Nav Item      | Preview Shows                  | Data Displayed                    |
|---------------|--------------------------------|-----------------------------------|
| **Trending**  | Hot NFTs rising in value       | Price, % change, likes, views     |
| **Favorites** | Your liked NFTs                | Price, likes                      |
| **Watchlist** | Saved items you're tracking    | Price, % change                   |
| **Portfolio** | Your owned NFTs                | Price, % change since purchase    |
| **Activity**  | Recent transactions            | Price, transaction type, views    |
| **Collections** | Top performing collections   | Floor price, % change, volume     |

---

## Feature 2: Drag-to-Reorder

### Step 1: Hover to Reveal Handle

```
Before hover:
┌─────────────────────────┐
│ 🏠 Marketplace          │
│ 📈 Trending             │
│ 🎨 Collections          │
└─────────────────────────┘

After hover on "Trending":
┌─────────────────────────┐
│    🏠 Marketplace       │
│ [≡] 📈 Trending         │  ← Drag handle visible
│    🎨 Collections       │
└─────────────────────────┘
```

### Step 2: Drag Item

```
Dragging "Trending" to position 1:

┌─────────────────────────┐
│                         │
│ [≡] 📈 Trending  (50%)  │  ← Semi-transparent, being dragged
│ 🏠 Marketplace          │  ← Other items shift
│ 🎨 Collections          │
│                         │
└─────────────────────────┘
```

### Step 3: Drop & Save

```
After drop:
┌─────────────────────────┐
│ 📈 Trending             │  ← New position!
│ 🏠 Marketplace          │
│ 🎨 Collections          │
└─────────────────────────┘

Toast appears:
┌──────────────────────────┐
│ ✓ Navigation order       │
│   updated!               │
└──────────────────────────┘

Saved to localStorage:
{
  "sidebar-nav-order": [
    "trending",      ← Moved to first
    "marketplace",
    "collections",
    ...
  ]
}
```

---

## Feature 3: Auto-Collapse

### Timeline

```
t=0s: User interacts with sidebar
┌─────────────────────────┐
│ NFT Hub                 │  ← Fully expanded
│ 🔍 Search...            │
│ 🏠 Marketplace          │
│ 📈 Trending             │
│ ...                     │
└─────────────────────────┘
Timer: [████░░░░░░] 0s / 4s


t=2s: No interaction
┌─────────────────────────┐
│ NFT Hub                 │  ← Still expanded
│ 🔍 Search...            │
│ 🏠 Marketplace          │
│ 📈 Trending             │
│ ...                     │
└─────────────────────────┘
Timer: [████████░░] 2s / 4s


t=4s: Auto-collapse triggered
┌──┐
│🏠│  ← Collapsed!
│📈│
│🎨│
│⚡│
└──┘
Timer: [██████████] 4s / 4s

Toast appears:
┌──────────────────────────┐
│ ⚡ Sidebar auto-collapsed │
└──────────────────────────┘


Mouse enters sidebar → Instantly expands:
┌─────────────────────────┐
│ NFT Hub                 │  ← Expanded
│ 🔍 Search...            │
│ 🏠 Marketplace          │
│ 📈 Trending             │
│ ...                     │
└─────────────────────────┘
Timer: [░░░░░░░░░░] RESET
```

### Interactions That Reset Timer

```
✓ Mouse enter sidebar
✓ Mouse move in sidebar
✓ Click nav item
✓ Type in search
✓ Click category button
✓ Click view mode toggle
✓ Click collapse button

✗ Hover outside sidebar
✗ Scroll main content
✗ Click on main content
```

---

## Feature 4: Analytics Badges

### Badge Types

#### 1. Percentage Change (Green = Up, Red = Down)

```
Positive Change:
┌─────────────────────────────┐
│ 📈 Trending    [↗ +23.5%]   │  ← Green badge
│ 🎨 Collections [↗ +12.3%]   │  ← Green badge
│ 📊 Portfolio   [↗ +8.2%]    │  ← Green badge
└─────────────────────────────┘

Negative Change:
┌─────────────────────────────┐
│ 🔖 Watchlist   [↘ -2.3%]    │  ← Red badge
│ 💰 Sell NFTs   [↘ -5.1%]    │  ← Red badge
└─────────────────────────────┘
```

#### 2. Notification Count

```
┌─────────────────────────────┐
│ ⚡ Activity    [3]           │  ← Red bubble: 3 notifications
│ 🎁 Rewards     [12]          │  ← Red bubble: 12 items
└─────────────────────────────┘
```

#### 3. Status Badges

```
┌─────────────────────────────┐
│ 🔄 Swap       [NEW]          │  ← Green badge: New feature
│ 📈 Trending   [HOT]          │  ← Red badge: Hot items
│ 🎁 Rewards    [NEW]          │  ← Green badge: New
└─────────────────────────────┘
```

#### 4. Combined Badges

```
┌─────────────────────────────┐
│ 📈 Trending   [↗ +23.5%] [HOT] │  ← Analytics + Status
│ ⚡ Activity   [3] [↗ +15%]     │  ← Count + Analytics
│ 🔄 Swap       [NEW] [↗ +45%]   │  ← Status + Analytics
└─────────────────────────────┘
```

### Badge on Icon

```
Small badge on icon (top-right):
┌────────────┐
│ 📈 ← Icon  │
│    ²³      │ ← Tiny percentage badge
└────────────┘
```

---

## Complete Sidebar Layout

### Expanded State

```
┌─────────────────────────────────────────┐
│ ⚡ NFT Hub          Customizable    ☾ ⌃ │  ← Header
├─────────────────────────────────────────┤
│ 🔍 Search...                            │  ← Search
├─────────────────────────────────────────┤
│ [All] [Main] [Trading] [Create] ...     │  ← Categories
├─────────────────────────────────────────┤
│                                         │
│ Main Navigation                         │
│ [≡] 🏠 Marketplace                      │
│ [≡] 📈 Trending         [↗ +23.5%] [HOT]│
│ [≡] 🎨 Collections      [↗ +12.3%]      │
│ [≡] ⚡ Activity         [3]              │
│                                         │
│ Trading & Finance                       │
│ [≡] 🔄 Swap Tokens      [NEW]           │
│ [≡] 🛒 Buy NFTs                         │
│ [≡] 💰 Sell NFTs                        │
│ [≡] 📊 Portfolio        [↗ +8.2%]       │
│ [≡] 💳 Wallet                           │
│                                         │
│ Create & Mint                           │
│ [≡] ➕ Mint NFT                         │
│ [≡] 📤 Create Collection                │
│ [≡] ⚡ Bulk Mint                        │
│                                         │
│ Discover & Search                       │
│ [≡] 🔍 Search                           │
│ [≡] 🌍 Explore                          │
│ [≡] ❤️  Favorites                       │
│ [≡] 🔖 Watchlist        [↘ -2.3%]       │
│ [≡] 📊 Analytics        [↗ +15.7%]      │
│                                         │
│ Tools & Utilities                       │
│ [≡] 🔧 Advanced Filters                 │
│ [≡] 🎯 Price Alerts                     │
│ [≡] 📜 Transaction History              │
│ [≡] 🏆 Rewards          [NEW]           │
│ [≡] 🎁 Referrals                        │
│                                         │
│ Settings & Support                      │
│ [≡] ⚙️  Settings                        │
│ [≡] ❓ Help Center                      │
│ [≡] 📧 Contact Us                       │
│ [≡] ℹ️  About                           │
│                                         │
├─────────────────────────────────────────┤
│ View Mode:            [■ Grid] [≡ List] │  ← Footer
│                                         │
│ ● Connected                             │
│ 0x1234...5678                           │
└─────────────────────────────────────────┘
```

### Collapsed State (After 4s)

```
┌──┐
│⚡│  ← Logo only
├──┤
│🏠│
│📈│
│🎨│
│⚡│
│🔄│
│🛒│
│💰│
│📊│
│➕│
│🔍│
│❤️│
│🔖│
│⚙️│
├──┤
│■ │  ← View mode
│●│  ← Connected
└──┘
```

### Minimized State (Hidden)

```
┌──────┐
│  ☰   │  ← Floating button (top-left)
└──────┘

(Sidebar completely hidden)
```

---

## Interactive States

### Default State
```
┌─────────────────────────┐
│ [≡] 🏠 Marketplace      │  ← Gray background
└─────────────────────────┘
```

### Hover State
```
┌─────────────────────────┐
│ [≡] 🏠 Marketplace      │  ← Light gray background
└─────────────────────────┘
     ↑
  Drag handle appears
```

### Active State
```
┌─────────────────────────┐
│ [≡] 🏠 Marketplace  →   │  ← Blue background, arrow
└─────────────────────────┘
```

### Dragging State
```
┌─────────────────────────┐
│ [≡] 🏠 Marketplace      │  ← 50% opacity
└─────────────────────────┘
    ↑
 Cursor: grabbing
```

### Disabled State (Wallet Required)
```
┌─────────────────────────┐
│ [≡] 📊 Portfolio        │  ← Grayed out
│ [≡] 💳 Wallet           │  ← Grayed out
│ [≡] ➕ Mint NFT         │  ← Grayed out
└─────────────────────────┘
      ↑
 Requires wallet connection
```

---

## Mobile Layout

### Portrait Mode

```
┌─────────────────────┐
│  ☰  NFT Hub      ☾  │  ← Compact header
├─────────────────────┤
│ 🔍 Search...        │
├─────────────────────┤
│ [All] [Main]        │  ← Scrollable categories
├─────────────────────┤
│                     │
│ [≡] 🏠 Marketplace  │
│ [≡] 📈 Trending     │
│     [↗ +23.5%]      │  ← Badge below
│ [≡] 🎨 Collections  │
│ [≡] ⚡ Activity [3] │
│                     │
│ ...                 │
│                     │
├─────────────────────┤
│ ● Connected         │
└─────────────────────┘

     Tap to drag ↑
     Tap to preview →
```

### Landscape Mode

```
Same as desktop layout
(Sidebar width adapts)
```

---

## Color Scheme

### Light Mode

```
Background:     #FFFFFF (white)
Border:         #E5E7EB (gray-200)
Text:           #111827 (gray-900)
Active:         #DBEAFE (blue-100)
Hover:          #F3F4F6 (gray-100)
Green badge:    #D1FAE5 / #059669 (green)
Red badge:      #FEE2E2 / #DC2626 (red)
```

### Dark Mode

```
Background:     #111827 (gray-900)
Border:         #374151 (gray-700)
Text:           #FFFFFF (white)
Active:         #1E3A8A (blue-900)
Hover:          #1F2937 (gray-800)
Green badge:    #064E3B / #34D399 (green)
Red badge:      #7F1D1D / #F87171 (red)
```

---

## Animations

### Hover Preview

```
Entrance:
opacity: 0 → 1
scale: 0.9 → 1
x: -10 → 0
duration: 0.2s

Exit:
opacity: 1 → 0
scale: 1 → 0.9
x: 0 → -10
duration: 0.2s
```

### Drag Item

```
Grab:
opacity: 1 → 0.5
cursor: grab → grabbing
instant

Drop:
opacity: 0.5 → 1
position: smooth spring
duration: 0.3s
```

### Auto-Collapse

```
Collapse:
width: 240px → 60px
duration: 0.3s
easing: ease-in-out

Expand:
width: 60px → 240px
duration: 0.3s
easing: ease-in-out
```

### Badge Pulse (New Items)

```
@keyframes pulse {
  0%, 100%: opacity: 1
  50%: opacity: 0.5
}
duration: 2s
repeat: infinite
```

---

## Keyboard Shortcuts (Proposed)

```
Ctrl + K        → Toggle sidebar
Ctrl + R        → Reset navigation order
Arrow Up/Down   → Navigate items
Enter           → Select item
Esc             → Collapse sidebar
Ctrl + F        → Focus search
1-9             → Jump to category
```

---

## Accessibility

### Screen Reader Announcements

```
"Navigation item: Trending"
"Trending has increased by 23.5%"
"3 new notifications in Activity"
"Sidebar auto-collapsed after 4 seconds of inactivity"
"Navigation order updated"
```

### Keyboard Navigation

```
Tab:           Focus next item
Shift + Tab:   Focus previous item
Enter:         Activate item
Space:         Drag current item
Arrow keys:    Move dragged item
Esc:           Cancel drag
```

### ARIA Labels

```html
<button
  aria-label="Trending - Floor price up 23.5% - Hot items"
  aria-current={isActive}
  aria-disabled={isDisabled}
>
  Trending
</button>
```

---

## Summary Visual

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌────────────────────┐    ┌──────────────────────────┐    │
│  │  HOVER PREVIEWS    │    │   DRAG-TO-REORDER        │    │
│  │  ────────────────  │    │   ────────────────       │    │
│  │  Mini NFT cards    │    │   Grab handle            │    │
│  │  show near items   │    │   Reorder navigation     │    │
│  │  with stats        │    │   Save to localStorage   │    │
│  └────────────────────┘    └──────────────────────────┘    │
│                                                             │
│  ┌────────────────────┐    ┌──────────────────────────┐    │
│  │  AUTO-COLLAPSE     │    │   ANALYTICS BADGES       │    │
│  │  ────────────────  │    │   ────────────────       │    │
│  │  4s inactivity     │    │   Floor price %          │    │
│  │  Smart timer       │    │   Green/red colors       │    │
│  │  Toast alerts      │    │   Live updates           │    │
│  └────────────────────┘    └──────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**All features are visual, intuitive, and production-ready!** ✨
