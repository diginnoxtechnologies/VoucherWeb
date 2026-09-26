import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Copy, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, WalletCards, X, Eye, Edit2 } from 'lucide-react';
// , Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Copy, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2, WalletCards, X } from 'lucide-react';
import { Link } from 'wouter';
import { getProduct, money, THEMES } from '../data';

export function BrandMark({ compact = false }) {
  return (
    <Link href="/" className={`brand-mark focus-ring ${compact ? 'brand-mark-compact' : ''}`} data-testid="link-brand-home">
      <span className="brand-mark-symbol">V</span>
      {!compact && <span className="brand-mark-word">voucherly</span>}
    </Link>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', testId, asLink, href }) {
  const classes = `v-button v-button-${variant} v-button-${size} ${className}`;
  if (asLink && !disabled) return <Link href={href} className={`${classes} focus-ring`} data-testid={testId}>{children}</Link>;
  return <button type={type} className={`${classes} focus-ring`} disabled={disabled} onClick={onClick} data-testid={testId}>{children}</button>;
}

export function Badge({ children, tone = 'neutral', icon }) {
  return <span className={`v-badge v-badge-${tone}`}>{icon}{children}</span>;
}

export function AppHeader({ user, cartCount, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <BrandMark />
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/bulk-order" className="header-nav-link" data-testid="link-bulk-order">Order</Link>
          <Link href="/orders" className="header-nav-link" data-testid="link-orders">Order History</Link>
        </nav>
        <div className="header-actions">
          <div className="balance-pill">
            <WalletCards size={15} />
            <span className="balance-label">Balance</span>
            <strong data-testid="text-header-balance">{money(user.balance, user.currency)}</strong>
          </div>
          <Link href="/cart" className="cart-button focus-ring" data-testid="link-cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>}
          </Link>
          <details className="profile-menu">
            <summary className="profile-trigger" data-testid="button-profile-menu">
              <span className="avatar">{user.name.split(' ').map((part) => part[0]).join('')}</span>
              <span className="profile-name">{user.name}</span>
              <ChevronDown size={14} />
            </summary>
            <div className="profile-dropdown">
              <p className="profile-company">{user.company}</p>
              <p className="profile-id mono-font">{user.userId}</p>
              <div className="dropdown-links">
                <Link href="/profile" className="dropdown-link" data-testid="link-profile">Profile</Link>
                <button onClick={onLogout} className="dropdown-action" data-testid="button-logout">Sign out <ArrowRight size={14} /></button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function ProductLogo({ product, large = false }) {
  return <div className={`product-logo product-logo-${product.logoTone} ${large ? 'product-logo-large' : ''}`} aria-label={`${product.brand} logo`}>{product.logoText}</div>;
}

export function ProductCard({ product, onAdd, isAdding = false }) {
  return (
    <article className="product-card animate-rise" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.id}`} className="product-card-clickable focus-ring" data-testid={`link-product-${product.id}`}>
        <div className="product-card-media">
          <img src={product.imageUrl} alt="" loading="lazy" />
          {product.featured && <Badge tone="featured" icon={<Sparkles size={12} />}>Popular</Badge>}
        </div>
        <div className="product-card-copy">
          <h3>{product.name}</h3>
          <p className="product-offer">{product.offerText}</p>
        </div>
        <div className="product-card-footer">
          <div>
            <span className="price-label">Voucher value</span>
            <strong>{money(product.price)}</strong>
          </div>
        </div>
      </Link>
      <Button size="sm" className="card-add-button" onClick={() => onAdd(product.id)} disabled={isAdding} testId={`button-add-${product.id}`}>
        {isAdding ? 'Adding…' : <><Plus size={15} /> Add</>}
      </Button>
    </article>
  );
}

export function DetailDisplay({ product, quantity, onQuantityChange, onAdd, isAdding }) {
  return (
    <div className="detail-display">
      <div className="detail-art">
        <div className="detail-art-pattern" />
        <ProductLogo product={product} large />
        <span className="detail-art-label">DIGITAL VOUCHER</span>
      </div>
      <div className="detail-copy">
        <div className="detail-brand-row"><span className="eyebrow">{product.brand}</span>{product.featured && <Badge tone="featured">Popular choice</Badge>}</div>
        <h1>{product.name}</h1>
        <p className="detail-description">{product.description}</p>
        <div className="detail-price-row"><strong>{money(product.price)}</strong><span>per voucher</span></div>
        <div className="detail-promise"><Check size={16} /><span>{product.delivery}</span></div>
        <div className="quantity-row">
          <span className="field-label">Quantity</span>
          <QuantityControl quantity={quantity} onChange={onQuantityChange} />
        </div>
        <Button onClick={() => onAdd(product.id, quantity)} disabled={isAdding} className="detail-add" testId={`button-detail-add-${product.id}`}>
          {isAdding ? 'Adding to cart…' : <><ShoppingBag size={17} /> Add to cart <ArrowRight size={16} /></>}
        </Button>
        <p className="detail-note"><Clock3 size={14} /> No setup, no minimum order, no expiry surprises.</p>
      </div>
    </div>
  );
}

export function QuantityControl({ quantity, onChange, compact = false }) {
  return (
    <div className={`quantity-control ${compact ? 'quantity-control-compact' : ''}`}>
      <button onClick={() => onChange(Math.max(1, quantity - 1))} aria-label="Decrease quantity" data-testid="button-decrease-quantity"><Minus size={14} /></button>
      <span data-testid="text-quantity">{quantity}</span>
      <button onClick={() => onChange(quantity + 1)} aria-label="Increase quantity" data-testid="button-increase-quantity"><Plus size={14} /></button>
    </div>
  );
}

export function EmptyState({ icon = <ShoppingBag size={22} />, title, children, action, actionHref }) {
  return (
    <div className="empty-state animate-rise" data-testid="empty-state">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{children}</p>
      {action && <Button asLink href={actionHref} variant="secondary" testId="link-empty-action">{action}<ArrowRight size={15} /></Button>}
    </div>
  );
}

export function ValidationState({ children, tone = 'error', onDismiss }) {
  return <div className={`validation-state validation-${tone}`} role="alert" data-testid={`validation-state-${tone}`}><CircleAlert size={17} /><span>{children}</span>{onDismiss && <button className="validation-dismiss" onClick={onDismiss} aria-label="Dismiss"><X size={15} /></button>}</div>;
}

export function CheckoutSummary({ items, total, balance, onCheckout, disabled = false, showAction = true }) {
  const afterBalance = balance - total;
  return (
    <aside className="checkout-summary">
      <div className="summary-heading"><h2>Order summary</h2><span className="mono-font">{items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
      <div className="summary-items">
        {items.map((item) => {
          const product = item.product;
          const quantity = item.quantity;
          const amount = item.config?.amount ?? product.price;
          return (
            <div className="summary-item" key={item.cartItemId || product.id}>
              <div className="summary-item-logo"><ProductLogo product={product} /></div>
              <div className="summary-item-copy"><strong>{product.brand}</strong><span>{quantity} × {money(amount)}</span></div>
              <strong>{money(amount * quantity)}</strong>
            </div>
          );
        })}
      </div>
      <div className="summary-divider" />
      <div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div>
      <div className="summary-line summary-balance"><span>Wallet balance</span><strong>{money(balance)}</strong></div>
      <div className={`summary-after ${afterBalance < 0 ? 'summary-after-negative' : ''}`}><span>Balance after order</span><strong>{money(afterBalance)}</strong></div>
      {afterBalance < 0 && <ValidationState>You'll need {money(Math.abs(afterBalance))} more in your wallet to place this order.</ValidationState>}
      {showAction && <Button onClick={onCheckout} disabled={disabled || afterBalance < 0} className="summary-action" testId="button-start-checkout">Continue to review <ArrowRight size={16} /></Button>}
      <p className="summary-footnote"><WalletCards size={13} /> Paid from your advance wallet</p>
    </aside>
  );
}

export function SearchField({ value, onChange }) {
  return <label className="search-field"><Search size={18} /><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by brand or voucher name" aria-label="Search vouchers" data-testid="input-product-search" />{value && <button onClick={() => onChange('')} aria-label="Clear search" data-testid="button-clear-search"><X size={15} /></button>}</label>;
}

export function Toast({ notice, onClose }) {
  if (!notice) return null;
  return <div className="toast animate-rise" role="status" data-testid="status-toast"><Check size={16} /><span>{notice}</span><button onClick={onClose} aria-label="Close notification"><X size={15} /></button></div>;
}

export function CartRow({ item, onQuantityChange, onRemove }) {
  const product = getProduct(item.productId);
  if (!product) return null;
  const amount = item.config?.amount ?? product.price;
  return <div className="cart-row" data-testid={`row-cart-${product.id}`}>
    <ProductLogo product={product} />
    <div className="cart-row-copy"><span className="eyebrow">{product.brand}</span><h3>{product.name}</h3><span className="cart-delivery">{product.delivery}</span></div>
    <div className="cart-row-unit"><span>Unit price</span><strong>{money(amount)}</strong></div>
    <QuantityControl quantity={item.quantity} onChange={(value) => onQuantityChange(item.cartItemId || product.id, value)} compact />
    <strong className="cart-row-total">{money(amount * item.quantity)}</strong>
    <button className="remove-button focus-ring" onClick={() => onRemove(item.cartItemId || product.id)} aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`}><Trash2 size={16} /></button>
  </div>;
}

export function getCartProducts(cart) {
  return cart.map((item) => ({ ...item, product: getProduct(item.productId) })).filter((item) => item.product);
}

export { ChevronLeft, ChevronRight, Copy, Search, ShoppingBag };

export function Modal({ isOpen, onClose, title, children, className = '' }) {
  if (!isOpen) return null;
  return (
    <div className="v-modal-overlay animate-rise" onClick={onClose} data-testid="modal-overlay">
      <div className={`v-modal-content ${className}`} onClick={e => e.stopPropagation()}>
        <div className="v-modal-header">
          <h2 data-testid="modal-title">{title}</h2>
          <button className="v-modal-close" onClick={onClose} data-testid="button-close-modal"><X size={20} /></button>
        </div>
        <div className="v-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export function GiftCardPreview({ product, config }) {
  const theme = THEMES.find(t => t.id === config.themeId) || THEMES[0];
  return (
    <div className="gift-card-preview-wrap">
      <div className="gift-card-preview" style={{ background: theme.bg }}>
        <div className="gcp-header">
          <ProductLogo product={product} />
          <strong style={{ color: theme.color }}>{theme.name}</strong>
        </div>
        <div className="gcp-body">
          <div className="gcp-brand">{product.brand}</div>
          <div className="gcp-name">{product.name}</div>
          <div className="gcp-amount">{money(config.amount)}</div>
        </div>
        {config.personalMessage && (
          <div className="gcp-message">
            "{config.personalMessage}"
          </div>
        )}
      </div>
    </div>
  );
}
