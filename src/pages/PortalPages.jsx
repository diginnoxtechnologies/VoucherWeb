import { ArrowLeft, Download, Eye, Edit2, Trash2, ChevronDown, ArrowRight, Check, CheckCircle2, ChevronRight, Circle, Clock3, FileText, History, Search, Send, ShieldCheck, Sparkles, WalletCards, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { CATEGORIES, PRODUCTS, getProduct, money, THEMES, DELIVERY_OPTIONS, DEFAULT_RECIPIENT } from '../data';
import { Badge, ProductLogo, QuantityControl, Modal, GiftCardPreview, Button, EmptyState, ProductCard, SearchField, ValidationState } from '../components/VoucherlyComponents';

export function CatalogPage({ onAdd, isAdding }) {
  const [category, setCategory] = useState('All vouchers');
  const [query, setQuery] = useState('');
  const filteredProducts = useMemo(() => PRODUCTS.filter((product) => (category === 'All vouchers' || product.category === category) && `${product.brand} ${product.name}`.toLowerCase().includes(query.toLowerCase().trim())), [category, query]);
  const featured = PRODUCTS.filter((product) => product.featured).slice(0, 3);
  return <main className="page-content catalog-page">
    <section className="catalog-hero">
      <div className="catalog-hero-copy animate-rise">
        <h1>The right <em>thank you</em><br />starts here.</h1>
        <p>Curated rewards for employees, customers, and the people who keep things moving.</p>
        <div className="hero-meta"><span><span className="hero-meta-dot" /> Same-day digital delivery</span><span><ShieldCheck size={15} /> Secure procurement</span></div>
      </div>
      <div className="hero-stamp animate-rise delay-2"><span>READY<br />WHEN<br />YOU ARE</span><Sparkles size={18} /></div>
    </section>
    <section className="catalog-toolbar-section">
      <div className="section-intro"><div><span className="eyebrow">THE COLLECTION</span><h2>Vouchers people want</h2></div><span className="result-count mono-font" data-testid="text-result-count">{filteredProducts.length} available</span></div>
      <div className="catalog-controls">
        <div className="category-filter" role="radiogroup" aria-label="Voucher category">{CATEGORIES.map((item) => <label className={`category-radio ${category === item ? 'is-selected' : ''}`} key={item}><input type="radio" name="category" value={item} checked={category === item} onChange={(event) => setCategory(event.target.value)} data-testid={`radio-category-${item.toLowerCase().replaceAll(' ', '-')}`} /><span>{item}</span></label>)}</div>
        <SearchField value={query} onChange={setQuery} />
      </div>
      {query === '' && category === 'All vouchers' && <div className="featured-strip"><div className="featured-label"><span className="eyebrow">A GOOD PLACE TO START</span><strong>Popular picks</strong></div>{featured.map((product) => <Link href={`/products/${product.id}`} key={product.id} className="featured-mini focus-ring" data-testid={`link-featured-${product.id}`}><span>{product.logoText}</span><div><strong>{product.brand}</strong><small>{money(product.price)} voucher</small></div><ChevronRight size={15} /></Link>)}</div>}
      {filteredProducts.length > 0 ? <div className="product-grid">{filteredProducts.map((product, index) => <div key={product.id} className={`delay-${Math.min(index + 1, 5)}`}><ProductCard product={product} onAdd={onAdd} isAdding={isAdding === product.id} /></div>)}</div> : <div className="empty-state animate-rise"><div className="empty-icon"><Search size={22} /></div><h2>No vouchers found</h2><p>Try another brand or category.</p><Button variant="secondary" onClick={() => { setCategory('All vouchers'); setQuery(''); }} testId="button-clear-filters">Clear filters <ArrowRight size={15} /></Button></div>}
    </section>
  </main>;
}

export function ProductPage({ onAdd, isAdding, cart }) {
  const { id } = useParams();
  const product = getProduct(id);
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const editItemId = searchParams.get('edit');
  
  const [amount, setAmount] = useState(product?.price ?? 0);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [themeId, setThemeId] = useState('theme-default');
  const [emailSubject, setEmailSubject] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (product && !editItemId) {
      setAmount(product.price);
    }
  }, [product, editItemId]);

  useEffect(() => {
    if (editItemId && cart) {
      const item = cart.find(c => c.cartItemId === editItemId);
      if (item && item.config) {
        setAmount(item.config.amount);
        setQuantity(item.quantity);
        setThemeId(item.config.themeId);
        setEmailSubject(item.config.emailSubject);
        setPersonalMessage(item.config.personalMessage);
      }
    }
  }, [editItemId, cart]);

  if (!product) return <main className="page-content"><EmptyState title="That voucher moved on" action="Back to collection" actionHref="/">We couldn't find the voucher you're looking for.</EmptyState></main>;
  
  const handleAdd = (redirect = false) => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < product.minAmount || amt > product.maxAmount) {
      setError(`Voucher value must be between ${money(product.minAmount)} and ${money(product.maxAmount)}.`);
      return;
    }
    setError('');
    const itemData = {
      productId: product.id,
      quantity,
      cartItemId: editItemId || null,
      config: { amount: amt, themeId, emailSubject, personalMessage }
    };
    onAdd(itemData, () => {
      if (redirect) setLocation('/checkout');
    });
  };

  return (
    <main className="page-content detail-page config-page">
      <Link href="/" className="back-link page-back" data-testid="link-back-catalog"><ArrowLeft size={15} /> Back to collection</Link>
      
      <div className="config-layout">
        <div className="config-left animate-slide">
          <div className="config-product-card">
            <div className="cp-image"><img src={product.imageUrl} alt="" /></div>
            <div className="cp-copy">
              <span className="eyebrow">{product.brand}</span>
              <h1>{product.name}</h1>
              <p className="cp-offer">{product.offerText}</p>
              <p className="cp-desc">{product.description}</p>
            </div>
            <div className="cp-terms">
              <button className="cp-terms-toggle" onClick={() => setTermsOpen(!termsOpen)} data-testid="button-toggle-terms">
                <span>Terms & Conditions</span>
                <ChevronDown size={16} style={{ transform: termsOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {termsOpen && (
                <ul className="cp-terms-list">
                  {product.termsAndConditions.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="config-right animate-rise delay-1">
          <div className="config-form-card">
            <h2>Configure Voucher</h2>
            
            <div className="config-row">
              <label className="form-label">
                Voucher Value
                <div className="amount-input-wrap">
                  <span className="currency-symbol">$</span>
                  <input type="number" min={product.minAmount} max={product.maxAmount} value={amount} onChange={e => setAmount(Number(e.target.value))} data-testid="input-amount" />
                </div>
                <span className="field-hint">Min: {money(product.minAmount)} - Max: {money(product.maxAmount)}</span>
              </label>
              
              <label className="form-label">
                Quantity
                <QuantityControl quantity={quantity} onChange={setQuantity} />
              </label>
            </div>

            <div className="config-section">
              <label className="form-label">Personalization Theme</label>
              <div className="theme-picker" role="radiogroup">
                {THEMES.map(t => (
                  <label key={t.id} className={`theme-radio ${themeId === t.id ? 'is-selected' : ''}`} data-testid={`radio-theme-${t.id}`}>
                    <input type="radio" name="theme" value={t.id} checked={themeId === t.id} onChange={(e) => setThemeId(e.target.value)} />
                    <div className="theme-swatch" style={{ background: t.color }}></div>
                    <span>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="form-label">
              Email Subject <span className="optional-label">Optional</span>
              <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="e.g. A gift for you!" data-testid="input-email-subject" />
            </label>

            <label className="form-label">
              Personal Message <span className="optional-label">Optional</span>
              <textarea value={personalMessage} onChange={e => setPersonalMessage(e.target.value)} placeholder="Write something nice..." rows="3" data-testid="input-personal-message" />
            </label>

            {error && <ValidationState onDismiss={() => setError('')}>{error}</ValidationState>}
            <div className="config-summary">
              <span>Total Amount</span>
              <strong>{money((Number(amount) ?? 0) * quantity)}</strong>
            </div>

            <div className="config-actions">
              <Button variant="secondary" onClick={() => setShowPreview(true)} testId="button-preview-card">Preview</Button>
              <Button variant="secondary" onClick={() => handleAdd(false)} disabled={isAdding === product.id} testId="button-add-cart">
                {isAdding === product.id ? 'Saving...' : (editItemId ? 'Update Cart' : 'Add to cart')}
              </Button>
              <Button onClick={() => handleAdd(true)} disabled={isAdding === product.id} testId="button-checkout-now">
                Checkout Now <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Voucher Preview">
        <GiftCardPreview product={product} config={{ amount, themeId, emailSubject, personalMessage }} />
      </Modal>
    </main>
  );
}

export function CartPage({ cart, user, onQuantityChange, onRemove, onClear }) {
  const [, setLocation] = useLocation();
  const [previewItem, setPreviewItem] = useState(null);

  const items = cart.map(item => ({ ...item, product: getProduct(item.productId) })).filter(item => item.product);
  const total = items.reduce((sum, item) => sum + (item.config?.amount ?? item.product.price) * item.quantity, 0);

  if (items.length === 0) return <main className="page-content"><div className="simple-page-heading"><span className="eyebrow">YOUR ORDER</span><h1>Cart</h1></div><EmptyState title="Your cart is waiting" action="Browse vouchers" actionHref="/"><span>Choose a few thoughtful things. We’ll keep them here while you decide.</span></EmptyState></main>;

  return (
    <main className="page-content cart-page">
      <div className="simple-page-heading animate-rise">
        <span className="eyebrow">YOUR ORDER / {items.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span>
        <h1>Review your cart</h1>
      </div>

      <div className="cart-layout-full animate-rise delay-1">
        <div className="cart-table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const amount = item.config?.amount ?? item.product.price;
                const theme = THEMES.find(t => t.id === item.config?.themeId);
                return (
                  <tr key={item.cartItemId} data-testid={`row-cart-${item.cartItemId}`}>
                    <td>
                      <div className="cart-cell-product">
                        <ProductLogo product={item.product} />
                        <div className="ccp-copy">
                          <strong>{item.product.brand} {item.product.name}</strong>
                          {theme && <span className="ccp-meta">Theme: {theme.name}</span>}
                          {item.config?.personalMessage && <span className="ccp-meta line-clamp-1">"{item.config.personalMessage}"</span>}
                        </div>
                      </div>
                    </td>
                    <td><strong>{money(amount)}</strong></td>
                    <td><QuantityControl quantity={item.quantity} onChange={(val) => onQuantityChange(item.cartItemId, val)} compact /></td>
                    <td><strong>{money(amount * item.quantity)}</strong></td>
                    <td>
                      <div className="cart-actions-row">
                        <button onClick={() => setPreviewItem(item)} aria-label="Preview" data-testid={`button-preview-${item.cartItemId}`}><Eye size={16} /></button>
                        <button onClick={() => setLocation(`/products/${item.productId}?edit=${item.cartItemId}`)} aria-label="Edit" data-testid={`button-edit-${item.cartItemId}`}><Edit2 size={16} /></button>
                        <button onClick={() => onRemove(item.cartItemId)} aria-label="Remove" data-testid={`button-remove-${item.cartItemId}`} className="text-destructive"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cart-table-footer">
            <button className="text-link" onClick={onClear} data-testid="button-clear-cart">Clear Cart</button>
          </div>
        </div>

        <div className="cart-bottom-actions">
          <Button variant="secondary" asLink href="/" testId="link-continue-shopping"><ArrowLeft size={16} /> Continue Shopping</Button>
          <div className="cart-bottom-total">
            <span>Subtotal:</span>
            <strong>{money(total)}</strong>
            <Button onClick={() => setLocation('/checkout')} testId="button-proceed-checkout">Checkout <ArrowRight size={16} /></Button>
          </div>
        </div>
      </div>

      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title="Voucher Preview">
        {previewItem && <GiftCardPreview product={previewItem.product} config={previewItem.config || { amount: previewItem.product.price, themeId: 'theme-default' }} />}
      </Modal>
    </main>
  );
}

export function CheckoutPage({ cart, user, onPlaceOrder, onRemove }) {
  const [, setLocation] = useLocation();
  const [deliveryMode, setDeliveryMode] = useState(DELIVERY_OPTIONS[0].id);
  const [recipient, setRecipient] = useState(DEFAULT_RECIPIENT);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [tempRecipient, setTempRecipient] = useState({ ...recipient });
  const [remarks, setRemarks] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  const items = cart.map(item => ({ ...item, product: getProduct(item.productId) })).filter(item => item.product);
  const totalAmount = items.reduce((sum, item) => sum + (item.config?.amount ?? item.product.price) * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) return <main className="page-content"><EmptyState title="Nothing to review yet" action="Browse vouchers" actionHref="/" /></main>;

  const activeDeliveryOption = DELIVERY_OPTIONS.find(d => d.id === deliveryMode);

  const saveRecipient = (e) => {
    e.preventDefault();
    setRecipient(tempRecipient);
    setIsEditingRecipient(false);
  };

  const submit = () => {
    if (!termsAccepted) return setError("Please accept the Terms and Conditions.");
    if (totalAmount > user.balance) {
      const shortfall = totalAmount - user.balance;
      return setError(`Your wallet balance is ${money(user.balance)}, but this order requires ${money(totalAmount)}. Add ${money(shortfall)} more or reduce your cart value.`);
    }
    
    const fields = activeDeliveryOption.fields;
    if (fields.includes('firstName') && !recipient.firstName?.trim()) return setError("First Name is required for this delivery method.");
    if (fields.includes('lastName') && !recipient.lastName?.trim()) return setError("Last Name is required for this delivery method.");
    if (fields.includes('email') && (!recipient.email?.trim() || !/^\S+@\S+\.\S+$/.test(recipient.email))) return setError("A valid Email Address is required for this delivery method.");
    if (fields.includes('phone') && (!recipient.phone?.trim() || recipient.phone.length < 5)) return setError("A valid Mobile Number is required for this delivery method.");
    
    setError('');
    onPlaceOrder({
      total: totalAmount,
      delivery: { mode: activeDeliveryOption.label, recipient },
      payment: { method: 'Advance Wallet' },
      remarks,
      termsAccepted
    });
  };

  return (
    <main className="page-content checkout-page config-checkout-page">
      <Link href="/cart" className="back-link page-back" data-testid="link-back-cart"><ArrowLeft size={15} /> Back to cart</Link>
      
      <div className="checkout-heading">
        <div>
          <span className="eyebrow">SECURE CHECKOUT</span>
          <h1>Place your order</h1>
        </div>
      </div>

      {error && <ValidationState onDismiss={() => setError('')}>{error}</ValidationState>}
      <div className="co-layout">
        <div className="co-main animate-slide">
          <div className="co-section">
            <h3>Delivery Options</h3>
            <div className="delivery-tabs">
              {DELIVERY_OPTIONS.map(opt => (
                <button 
                  key={opt.id} 
                  className={`delivery-tab ${deliveryMode === opt.id ? 'is-selected' : ''}`}
                  onClick={() => setDeliveryMode(opt.id)}
                  data-testid={`tab-delivery-${opt.id}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="co-section">
            <div className="co-section-header">
              <h3>Shipping Details</h3>
              <button className="text-link" onClick={() => { setTempRecipient({...recipient}); setIsEditingRecipient(true); }} data-testid="button-edit-shipping">Edit</button>
            </div>
            <div className="shipping-summary-card">
              <div className="ss-row"><span>Name:</span><strong>{recipient.firstName} {recipient.lastName}</strong></div>
              {activeDeliveryOption.fields.includes('email') && <div className="ss-row"><span>Email:</span><strong>{recipient.email}</strong></div>}
              {activeDeliveryOption.fields.includes('phone') && <div className="ss-row"><span>Mobile:</span><strong>{recipient.phone}</strong></div>}
            </div>
          </div>

          <div className="co-section">
            <h3>Cart Details</h3>
            <div className="co-cart-table-wrap">
              <table className="co-cart-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Amount</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const amount = item.config?.amount ?? item.product.price;
                    return (
                      <tr key={item.cartItemId} data-testid={`row-co-cart-${item.cartItemId}`}>
                        <td>
                          <strong>{item.product.brand} {item.product.name}</strong>
                          {item.config?.themeId && <div className="ccp-meta text-xs">Theme: {THEMES.find(t=>t.id===item.config.themeId)?.name}</div>}
                        </td>
                        <td>{money(amount)}</td>
                        <td>{item.quantity}</td>
                        <td><strong>{money(amount * item.quantity)}</strong></td>
                        <td>
                          <div className="cart-actions-row">
                            <button onClick={() => setPreviewItem(item)} aria-label="Preview"><Eye size={14} /></button>
                            <button onClick={() => setLocation(`/products/${item.productId}?edit=${item.cartItemId}`)} aria-label="Edit"><Edit2 size={14} /></button>
                            <button onClick={() => onRemove(item.cartItemId)} aria-label="Remove" className="text-destructive"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="co-sidebar animate-rise delay-1">
          <div className="co-sidebar-card">
            <label className="form-label">
              Remarks <span className="optional-label">Optional</span>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add order remarks..." rows="2" data-testid="input-remarks" />
            </label>

            <div className="co-summary-list">
              <div className="co-sl-row"><span>Total Quantity</span><strong>{totalQuantity}</strong></div>
              <div className="co-sl-row"><span>Total Amount</span><strong>{money(totalAmount)}</strong></div>
              <div className="co-sl-row"><span>Discount</span><strong>{money(0)}</strong></div>
              <div className="co-sl-row"><span>Convenience Fee</span><strong>{money(0)}</strong></div>
              <div className="co-sl-row co-sl-total"><span>Net Amount</span><strong>{money(totalAmount)}</strong></div>
            </div>

            <div className="co-wallet-select">
              <label className="form-label">Select Wallet / SVC
                <select className="v-select" data-testid="select-wallet">
                  <option>Advance Wallet ({money(user.balance)})</option>
                </select>
              </label>
            </div>

            <label className="terms-check form-label" style={{flexDirection: 'row', alignItems: 'center'}}>
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} data-testid="checkbox-terms" />
              <span>I accept the <a href="#" className="text-link">Terms and Conditions</a></span>
            </label>

            <Button className="co-place-order" onClick={submit} disabled={!termsAccepted} testId="button-place-order">Place Order</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditingRecipient} onClose={() => setIsEditingRecipient(false)} title="Edit Shipping Details">
        <form onSubmit={saveRecipient} className="shipping-form">
          {activeDeliveryOption.fields.includes('firstName') && (
            <label className="form-label">First Name<input value={tempRecipient.firstName} onChange={e => setTempRecipient({...tempRecipient, firstName: e.target.value})} required data-testid="input-shipping-first" /></label>
          )}
          {activeDeliveryOption.fields.includes('lastName') && (
            <label className="form-label">Last Name<input value={tempRecipient.lastName} onChange={e => setTempRecipient({...tempRecipient, lastName: e.target.value})} required data-testid="input-shipping-last" /></label>
          )}
          {activeDeliveryOption.fields.includes('email') && (
            <label className="form-label">Email<input type="email" value={tempRecipient.email} onChange={e => setTempRecipient({...tempRecipient, email: e.target.value})} required data-testid="input-shipping-email" /></label>
          )}
          {activeDeliveryOption.fields.includes('phone') && (
            <label className="form-label">Mobile Number<input type="tel" value={tempRecipient.phone} onChange={e => setTempRecipient({...tempRecipient, phone: e.target.value})} required data-testid="input-shipping-phone" /></label>
          )}
          <div className="shipping-form-actions">
            <Button variant="secondary" onClick={() => setIsEditingRecipient(false)} testId="button-cancel-shipping">Cancel</Button>
            <Button type="submit" testId="button-save-shipping">Save</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title="Voucher Preview">
        {previewItem && <GiftCardPreview product={previewItem.product} config={previewItem.config || { amount: previewItem.product.price, themeId: 'theme-default' }} />}
      </Modal>
    </main>
  );
}

export function OrdersPage({ orders }) {
  return <main className="page-content orders-page"><div className="orders-heading animate-rise"><div><span className="eyebrow">NORTHSTAR LABS / WALLET ACTIVITY</span><h1>Order history</h1><p>A quiet record of every good thing sent from your wallet.</p></div><Button variant="secondary" asLink href="/" testId="link-order-more">Browse vouchers <ArrowRight size={16} /></Button></div><div className="orders-summary-strip"><div><span className="eyebrow">TOTAL ORDERS</span><strong>{orders.length}</strong></div><div><span className="eyebrow">VOUCHERS SENT</span><strong>{orders.reduce((sum, order) => sum + order.itemCount, 0)}</strong></div><div><span className="eyebrow">THIS YEAR</span><strong>{money(orders.reduce((sum, order) => sum + order.total, 0))}</strong></div><div className="orders-summary-note"><History size={17} /><span>All activity is reconciled against your advance wallet.</span></div></div>{orders.length ? <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>Order</th><th>Date</th><th>Vouchers</th><th>Total</th><th>Status</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id} data-testid={`row-order-${order.id}`}><td><strong className="mono-font">{order.id}</strong></td><td>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td><td>{order.itemCount} vouchers</td><td><strong>{money(order.total)}</strong></td><td><Badge tone="success" icon={<Check size={12} />}>{order.status}</Badge></td><td><Link href={`/orders/${order.id}`} className="table-action focus-ring" data-testid={`link-view-order-${order.id}`}>View <ChevronRight size={15} /></Link></td></tr>)}</tbody></table></div> : <EmptyState title="No orders yet" action="Browse vouchers" actionHref="/">Your order history will appear here.</EmptyState>}<div className="orders-bottom-note"><FileText size={17} /><div><strong>Need an invoice?</strong><span>Every order includes a detailed receipt. Contact support if your finance team needs a copy.</span></div><button onClick={() => window.alert('Support request noted. A Voucherly specialist will be in touch.')} className="text-link" data-testid="button-contact-invoice">Contact support <ArrowRight size={14} /></button></div></main>;
}
export function OrderDetailPage({ orders }) {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);
  const [activeTab, setActiveTab] = useState('order-details');
  const [searchQuery, setSearchQuery] = useState('');

  const { products, cards, payment, billing, shipping, remarks, deliveryMode } = useMemo(() => {
    if (!order) return {};
    
    // Legacy fallback
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const p1 = PRODUCTS[seed % PRODUCTS.length];
    const p2 = PRODUCTS[(seed + 1) % PRODUCTS.length];
    
    let prods = [];
    if (order.items && order.items.length > 0) {
      prods = order.items.map(item => {
        const product = getProduct(item.productId);
        if (!product) return null;
        const amount = item.config?.amount ?? product.price;
        return {
          id: item.cartItemId,
          product,
          quantity: item.quantity,
          amount,
          total: amount * item.quantity,
          config: item.config
        };
      }).filter(Boolean);
    } else {
      const qty1 = Math.ceil(order.itemCount / 2);
      const qty2 = order.itemCount - qty1;
      if (qty1 > 0) prods.push({ id: `prod-1`, product: p1, quantity: qty1, amount: p1.price, total: qty1 * p1.price });
      if (qty2 > 0) prods.push({ id: `prod-2`, product: p2, quantity: qty2, amount: p2.price, total: qty2 * p2.price });
    }
    
    const allCards = [];
    let cardGlobalIndex = 0;
    prods.forEach(({ product, quantity, amount, config }) => {
      for (let i = 0; i < quantity; i++) {
        allCards.push({
          id: `${id}-${cardGlobalIndex}`,
          cardNumber: `XXXX-${String(1000 + (((seed + cardGlobalIndex) * 31) % 9000)).padStart(4, '0')}`,
          product,
          amount,
          config
        });
        cardGlobalIndex++;
      }
    });

    const recip = order.delivery?.recipient || {
        firstName: 'Maya',
        lastName: 'Chen',
        email: 'maya.chen@northstarlabs.com',
        phone: '+1 (555) 019-2834',
        address: '100 Northstar Way, Suite 400',
        city: 'San Francisco, CA 94107'
    };

    return {
      products: prods,
      cards: allCards,
      payment: {
        id: order.id,
        total: order.total,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        method: order.payment?.method || 'Advance Wallet'
      },
      billing: recip,
      shipping: recip,
      remarks: order.remarks || '',
      deliveryMode: order.delivery?.mode || 'Email'
    };
  }, [id, order]);



  if (!order) {
    return (
      <main className="page-content">
        <EmptyState title="Order not found" action="Back to history" actionHref="/orders">
          We couldn't locate this order. It may have been archived or doesn't exist.
        </EmptyState>
      </main>
    );
  }

  const isDelivered = order.status === 'Delivered';

  const filteredProducts = products.filter(p => p.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCards = cards.filter(c => c.product.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) || c.cardNumber.includes(searchQuery));

  return (
    <main className="page-content order-detail-page">
      <Link href="/orders" className="back-link page-back" data-testid="link-back-orders">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <div className="order-detail-header animate-rise">
        <div className="order-title-row">
          <span className="eyebrow">ORDER NO. {order.id}</span>
          <div className="order-title-group">
            <h1>Order Details</h1>
            <Badge tone={isDelivered ? 'success' : 'neutral'} icon={isDelivered ? <Check size={12} /> : <Clock3 size={12} />}>
              {order.status}
            </Badge>
          </div>
          <p className="order-date">
            Placed on {payment.date}
          </p>
        </div>

        <div className="order-tracker">
          <div className="tracker-step is-complete">
            <div className="step-icon"><Check size={18} strokeWidth={3} /></div>
            <div className="step-copy">
              <strong>Order Created</strong>
            </div>
          </div>
          <div className="tracker-line is-complete" />
          <div className="tracker-step is-complete">
            <div className="step-icon"><Check size={18} strokeWidth={3} /></div>
            <div className="step-copy">
              <strong>Cards Activation</strong>
              <span className="step-meta">
                <span className="meta-success"><CheckCircle2 size={12} /> Activated: {order.itemCount}</span>{' '}
                <span className="meta-error"><XCircle size={12} /> Failed: 0</span>
              </span>
            </div>
          </div>
          <div className="tracker-line is-complete" />
          <div className={`tracker-step ${isDelivered ? 'is-complete' : 'is-active'}`}>
            <div className="step-icon">{isDelivered ? <Check size={18} strokeWidth={3} /> : <Circle size={18} />}</div>
            <div className="step-copy">
              <strong>Order Completed</strong>
            </div>
          </div>
          <div className={`tracker-line ${isDelivered ? 'is-complete' : ''}`} />
          <div className={`tracker-step ${isDelivered ? 'is-complete' : ''}`}>
            <div className="step-icon">{isDelivered ? <Check size={18} strokeWidth={3} /> : <Circle size={18} />}</div>
            <div className="step-copy">
              <strong>Email Delivery</strong>
              <span className="step-meta">
                {isDelivered ? (
                  <><span className="meta-success"><CheckCircle2 size={12} /> Success: {order.itemCount}</span>{' '}<span className="meta-error"><XCircle size={12} /> Failed: 0</span></>
                ) : <span>Pending delivery</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="order-detail-tabs animate-rise delay-1">
        <button className={`tab-button ${activeTab === 'order-details' ? 'is-active' : ''}`} onClick={() => { setActiveTab('order-details'); setSearchQuery(''); }} data-testid="tab-order-details">Order Details</button>
        <button className={`tab-button ${activeTab === 'product-details' ? 'is-active' : ''}`} onClick={() => { setActiveTab('product-details'); setSearchQuery(''); }} data-testid="tab-product-details">Product Details</button>
        <button className={`tab-button ${activeTab === 'card-details' ? 'is-active' : ''}`} onClick={() => { setActiveTab('card-details'); setSearchQuery(''); }} data-testid="tab-card-details">Card & Delivery Details</button>
      </div>

      {activeTab === 'order-details' && (
        <div className="order-detail-content animate-rise delay-2">
          <div className="info-blocks">
            <div className="info-block">
              <h4>Payment Details</h4>
              <div className="info-row"><span>Order ID</span><strong className="mono-font">{payment.id}</strong></div>
              <div className="info-row"><span>Date</span><strong>{payment.date}</strong></div>
              <div className="info-row"><span>Order Total</span><strong>{money(payment.total)}</strong></div>
              <div className="info-row"><span>Payment Mode</span><strong>{payment.method}</strong></div>
              <div className="info-action">
                <Button variant="secondary" size="sm" onClick={() => window.print()} testId="button-download-receipt"><Download size={14} /> Download Order Receipt</Button>
              </div>
            </div>
            
            <div className="info-block">
              <h4>Delivery Details</h4>
              <div className="info-row"><span>Mode</span><strong>{deliveryMode}</strong></div>
              <div className="info-row"><span>Name</span><strong>{shipping.firstName} {shipping.lastName}</strong></div>
              {shipping.email && <div className="info-row"><span>Email</span><strong>{shipping.email}</strong></div>}
              {shipping.phone && <div className="info-row"><span>Phone</span><strong>{shipping.phone}</strong></div>}
              {shipping.address && <div className="info-row"><span>Address</span><strong>{shipping.address}{shipping.city ? <br/> : ''}{shipping.city}</strong></div>}
            </div>

            {remarks && (
              <div className="info-block">
                <h4>Order Remarks</h4>
                <div className="info-row"><span style={{fontSize: '14px', color: 'hsl(var(--foreground))', margin: 0, whiteSpace: 'pre-wrap'}}>{remarks}</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'product-details' && (
        <div className="order-detail-content animate-rise delay-2">
          <div className="tab-toolbar">
            <span className="tab-toolbar-count" data-testid="text-product-count">Total No. of Products : ({products.length})</span>
            <SearchField value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="voucher-list-wrap">
            <div className="voucher-list-head product-list-head">
              <span>Product Name</span>
              <span>Amount</span>
              <span>Quantity</span>
              <span>Order Value</span>
              <span>Discount</span>
              <span>Conv. Fee</span>
              <span>Net Value</span>
            </div>
            <div className="voucher-list">
              {filteredProducts.length === 0 && <div className="bulk-no-results">No products match your search.</div>}
              {filteredProducts.map((p) => (
                <div key={p.id} className="voucher-row product-row" data-testid={`row-product-${p.id}`}>
                  <div className="vr-col vr-col-product">
                    <span className="vr-label">Product Name</span>
                    <div className="product-cell-group">
                      <ProductLogo product={p.product} />
                      <span className="vr-product-name" data-testid={`text-product-name-${p.id}`}>{p.product.brand} {p.product.name.replace(p.product.brand, '').trim()}</span>
                      {p.config?.themeId && <div className="ccp-meta text-xs">Theme: {THEMES.find(t=>t.id===p.config.themeId)?.name}</div>}
                    </div>
                  </div>
                  <div className="vr-col"><span className="vr-label">Amount</span><strong data-testid={`text-amount-${p.id}`}>{money(p.amount)}</strong></div>
                  <div className="vr-col"><span className="vr-label">Quantity</span><strong data-testid={`text-quantity-${p.id}`}>{p.quantity}</strong></div>
                  <div className="vr-col"><span className="vr-label">Order Value</span><strong data-testid={`text-ordervalue-${p.id}`}>{money(p.total)}</strong></div>
                  <div className="vr-col"><span className="vr-label">Discount</span><strong data-testid={`text-discount-${p.id}`}>{money(0)}</strong></div>
                  <div className="vr-col"><span className="vr-label">Conv. Fee</span><strong data-testid={`text-fee-${p.id}`}>{money(0)}</strong></div>
                  <div className="vr-col"><span className="vr-label">Net Value</span><strong data-testid={`text-netvalue-${p.id}`}>{money(p.total)}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'card-details' && (
        <div className="order-detail-content animate-rise delay-2">
          <div className="tab-toolbar">
            <span className="tab-toolbar-count" data-testid="text-card-count">Total No. of Gift Cards : ({cards.length})</span>
            <SearchField value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="voucher-list-wrap">
            <div className="voucher-list-head card-list-head">
              <span>Card Number</span>
              <span>Amount</span>
              <span>Product Name</span>
              <span />
            </div>
            <div className="voucher-list">
              {filteredCards.length === 0 && <div className="bulk-no-results">No cards match your search.</div>}
              {filteredCards.map((item) => (
                <div key={item.id} className="voucher-row card-row" data-testid={`row-voucher-${item.id}`}>
                  <div className="vr-col">
                    <span className="vr-label">Card Number</span>
                    <strong className="mono-font" data-testid={`text-card-number-${item.id}`}>{item.cardNumber}</strong>
                  </div>
                  <div className="vr-col">
                    <span className="vr-label">Amount</span>
                    <strong data-testid={`text-card-amount-${item.id}`}>{money(item.amount)}</strong>
                  </div>
                  <div className="vr-col vr-col-product">
                    <span className="vr-label">Product Name</span>
                    <span className="vr-product-name" data-testid={`text-card-product-${item.id}`}>
                      {item.product.brand} {item.product.name.replace(item.product.brand, '').trim()}
                    </span>
                  </div>
                  <div className="vr-col vr-col-action">
                    <button className="resend-action" onClick={() => window.alert(`Resend email triggered for ${item.cardNumber}.`)} data-testid={`button-resend-${item.id}`}>
                      <Send size={15} /> Resend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export function OrderSuccessPage({ orders }) {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) return <main className="page-content"><EmptyState title="Order not found" action="Back to catalog" actionHref="/" /></main>;

  return (
    <main className="page-content success-page">
      <div className="success-card animate-rise">
        <div className="success-icon"><CheckCircle2 size={48} strokeWidth={2} /></div>
        <h1>Thank You!</h1>
        <p className="success-subtitle">Your order has been placed successfully.</p>
        
        <div className="success-details">
          <div className="sd-row"><span>Order Number:</span><strong className="mono-font">{order.id}</strong></div>
          <div className="sd-row"><span>Total Amount:</span><strong>{money(order.total)}</strong></div>
        </div>

        <div className="success-actions">
          <Button asLink href="/" variant="secondary" testId="link-success-continue">Continue Shopping</Button>
          <Button asLink href={`/orders/${order.id}`} testId="link-success-view">View Your Order</Button>
        </div>
      </div>
    </main>
  );
}

export function ProfilePage({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, mobile: user.mobile });
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) return setError('Name is required');
    if (!editForm.mobile.trim()) return setError('Mobile number is required');
    
    onUpdateUser({ name: editForm.name, mobile: editForm.mobile });
    setIsEditing(false);
    setError('');
  };

  return (
    <main className="page-content profile-page">
      <div className="simple-page-heading animate-rise">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>Account & Settings</h1>
        <p>Manage your personal profile and view corporate details.</p>
      </div>

      <div className="profile-layout animate-rise delay-1">
        <div className="profile-section">
          <div className="profile-section-header">
            <h2>Your Profile</h2>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} testId="button-edit-request"><Edit2 size={14} /> Edit Request</Button>
          </div>
          
          <div className="profile-card">
            <div className="profile-row">
              <span className="pr-label">Name</span>
              <strong className="pr-value" data-testid="text-profile-name">{user.name}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Email ID (User ID)</span>
              <strong className="pr-value" data-testid="text-profile-email">{user.email}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Mobile Number</span>
              <strong className="pr-value" data-testid="text-profile-mobile">{user.mobile}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Account Number</span>
              <strong className="pr-value mono-font" data-testid="text-profile-account">{user.accountNumber}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Card Details</span>
              <strong className="pr-value mono-font" data-testid="text-profile-card">{user.cardDetails}</strong>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-header">
            <h2>Your Corporate Details</h2>
          </div>
          
          <div className="profile-card">
            <div className="profile-row">
              <span className="pr-label">Corporate Name</span>
              <strong className="pr-value" data-testid="text-corp-name">{user.corporate?.legalName}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Address</span>
              <strong className="pr-value" data-testid="text-corp-address">{user.corporate?.address}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">City</span>
              <strong className="pr-value" data-testid="text-corp-city">{user.corporate?.city}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">State</span>
              <strong className="pr-value" data-testid="text-corp-state">{user.corporate?.state}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Zip Code</span>
              <strong className="pr-value" data-testid="text-corp-zip">{user.corporate?.zip}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Country</span>
              <strong className="pr-value" data-testid="text-corp-country">{user.corporate?.country}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Contact Person Name</span>
              <strong className="pr-value" data-testid="text-corp-contact-name">{user.corporate?.contactName}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Contact Email</span>
              <strong className="pr-value" data-testid="text-corp-contact-email">{user.corporate?.contactEmail}</strong>
            </div>
            <div className="profile-row">
              <span className="pr-label">Contact Phone</span>
              <strong className="pr-value" data-testid="text-corp-contact-phone">{user.corporate?.contactPhone}</strong>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditing} onClose={() => { setIsEditing(false); setError(''); setEditForm({ name: user.name, mobile: user.mobile }); }} title="Edit Profile Details">
        <form onSubmit={handleSave} className="profile-edit-form">
          {error && <ValidationState onDismiss={() => setError('')}>{error}</ValidationState>}
          <label className="form-label">Name
            <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} data-testid="input-edit-name" />
          </label>
          <label className="form-label">Mobile Number
            <input type="tel" value={editForm.mobile} onChange={e => setEditForm({...editForm, mobile: e.target.value})} data-testid="input-edit-mobile" />
          </label>
          <div className="pe-actions">
            <Button variant="secondary" onClick={() => setIsEditing(false)} testId="button-cancel-edit">Cancel</Button>
            <Button type="submit" testId="button-save-edit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
