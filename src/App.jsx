import { ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AppHeader, Toast } from './components/VoucherlyComponents';
import { INITIAL_ORDERS, PRODUCTS, USER, readStorage } from './data';
import { LoginPage, VerifyOtpPage } from './pages/AuthPages';
import { CartPage, CatalogPage, CheckoutPage, OrdersPage, OrderDetailPage, ProductPage, OrderSuccessPage, ProfilePage } from './pages/PortalPages';
import { BulkOrderPage } from './pages/BulkOrderPage';

function ProtectedShell({ children, user, cart, onLogout, notice, onCloseNotice }) {
  return <div className="app-shell"><AppHeader user={user} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onLogout={onLogout} />{children}<Toast notice={notice} onClose={onCloseNotice} /></div>;
}

function Router() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('voucherly_auth') === 'true');
  const [cart, setCart] = useState(() => {
    const saved = readStorage('voucherly_cart', []);
    let counter = 0;
    return saved.map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) return null;
      
      const qty = Math.max(1, parseInt(item.quantity) || 1);
      let rawAmount = item.config?.amount;
      let amt = Number.isFinite(Number(rawAmount)) ? Number(rawAmount) : product.price;
      amt = Math.max(product.minAmount || 0, Math.min(product.maxAmount || Infinity, amt));

      counter++;
      return {
        ...item,
        cartItemId: item.cartItemId || `legacy-${Date.now()}-${counter}-${Math.random().toString(36).substr(2, 5)}`,
        quantity: qty,
        config: {
          ...item.config,
          amount: amt,
          themeId: item.config?.themeId || 'theme-default',
          emailSubject: item.config?.emailSubject || '',
          personalMessage: item.config?.personalMessage || ''
        }
      };
    }).filter(Boolean);
  });
  const [orders, setOrders] = useState(() => readStorage('voucherly_orders', INITIAL_ORDERS));
  const [user, setUser] = useState(() => {
    const storedUser = readStorage('voucherly_user', USER);
    return {
      ...USER,
      ...storedUser,
      corporate: {
        ...USER.corporate,
        ...(storedUser.corporate || {}),
      },
    };
  });
  const [notice, setNotice] = useState('');
  const [isAdding, setIsAdding] = useState('');

  useEffect(() => localStorage.setItem('voucherly_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('voucherly_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('voucherly_user', JSON.stringify(user)), [user]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const addToCart = (itemData, afterAdd) => {
    setIsAdding(itemData.productId || itemData);
    window.setTimeout(() => {
      setCart((current) => {
        if (typeof itemData === 'string') {
          const newItem = { 
            productId: itemData, 
            quantity: 1, 
            cartItemId: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
            config: { amount: PRODUCTS.find(p=>p.id===itemData)?.price ?? 0, themeId: 'theme-default', emailSubject: '', personalMessage: '' } 
          };
          return [...current, newItem];
        }
        if (itemData.cartItemId) {
          const existing = current.find((item) => item.cartItemId === itemData.cartItemId);
          if (existing) return current.map(c => c.cartItemId === itemData.cartItemId ? itemData : c);
        }
        return [...current, { ...itemData, cartItemId: Date.now().toString() + Math.random().toString(36).substr(2, 5) }];
      });
      setIsAdding('');
      setNotice(`${PRODUCTS.find((product) => product.id === (itemData.productId || itemData))?.brand || 'Voucher'} saved to your cart`);
      if (afterAdd) afterAdd();
    }, 240);
  };

  const updateQuantity = (cartItemId, quantity) => setCart((current) => current.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item));
  
  const removeFromCart = (cartItemId) => {
    setCart((current) => current.filter((item) => item.cartItemId !== cartItemId));
    setNotice(`Item removed from your cart`);
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderData) => {
    const snapshotItems = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) return null;
      return { ...item, config: { ...item.config } };
    }).filter(Boolean);

    if (snapshotItems.length === 0) return;

    const snapshotTotal = snapshotItems.reduce((sum, item) => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      return sum + (item.config?.amount ?? p.price) * item.quantity;
    }, 0);
    const snapshotItemCount = snapshotItems.reduce((sum, item) => sum + item.quantity, 0);

    const maxId = Math.max(...orders.map(o => parseInt(o.id.split('-')[1]) || 0), 10482);
    
    const newOrder = { 
      id: `VLY-${maxId + 1}`, 
      createdAt: new Date().toISOString(), 
      itemCount: snapshotItemCount, 
      total: snapshotTotal, 
      status: 'Processing',
      items: snapshotItems,
      delivery: orderData.delivery,
      payment: orderData.payment,
      remarks: orderData.remarks,
      termsAccepted: orderData.termsAccepted
    };
    setOrders((current) => [newOrder, ...current]);
    setUser((current) => ({ ...current, balance: current.balance - snapshotTotal }));
    setCart([]);
    setLocation(`/order-success/${newOrder.id}`);
  };

    const updateUser = (updates) => {
    setUser((current) => ({ ...current, ...updates }));
    setNotice('Profile updated successfully');
  };

  const logout = () => {
    localStorage.removeItem('voucherly_auth');
    setAuthenticated(false);
    setLocation('/login');
  };

  const protectedRoutes = useMemo(() => (
    <ProtectedShell user={user} cart={cart} onLogout={logout} notice={notice} onCloseNotice={() => setNotice('')}>
      <Switch>
        <Route path="/" component={() => <CatalogPage onAdd={addToCart} isAdding={isAdding} />} />
        <Route path="/products/:id" component={() => <ProductPage onAdd={addToCart} isAdding={isAdding} cart={cart} />} />
        <Route path="/cart" component={() => <CartPage cart={cart} user={user} onQuantityChange={updateQuantity} onRemove={removeFromCart} onClear={clearCart} />} />
        <Route path="/checkout" component={() => <CheckoutPage cart={cart} user={user} onPlaceOrder={placeOrder} onRemove={removeFromCart} />} />
        <Route path="/orders" component={() => <OrdersPage orders={orders} />} />
        <Route path="/orders/:id" component={() => <OrderDetailPage orders={orders} />} />
        <Route path="/order-success/:id" component={() => <OrderSuccessPage orders={orders} />} />
        <Route path="/profile" component={() => <ProfilePage user={user} onUpdateUser={updateUser} />} />
        <Route path="/bulk-order" component={BulkOrderPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ProtectedShell>
  ), [cart, isAdding, notice, orders, user]);

  useEffect(() => {
    if (!authenticated && window.location.pathname !== '/login' && window.location.pathname !== '/verify-otp') setLocation('/login');
  }, [authenticated, setLocation]);

  if (!authenticated) return <Switch><Route path="/verify-otp" component={() => <VerifyOtpPage onVerified={() => setAuthenticated(true)} />} /><Route path="/login" component={LoginPage} /><Route component={LoginPage} /></Switch>;
  return protectedRoutes;
}

function NotFoundPage() {
  return <main className="page-content"><div className="empty-state"><div className="empty-icon">404</div><h2>Page not found</h2><p>This part of Voucherly is not on the desk.</p><Link href="/" className="v-button v-button-secondary v-button-md focus-ring">Return to collection <ArrowRight size={15} /></Link></div></main>;
}

export default function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}
