import { Check, ChevronDown, ChevronUp, FileSpreadsheet, Info, Mail, MessageSquare, Search, Smartphone, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PRODUCTS, money } from '../data';
import { Button, ProductLogo } from '../components/VoucherlyComponents';

const DELIVERY_MODES = [
  {
    key: 'consolidated-file',
    title: 'Consolidated File',
    description: 'One file to distribute',
    icon: FileSpreadsheet,
    stepTitle: 'Download the consolidated file template.',
    guidance: ['Do not change or edit the headers.', 'Country code, subject and message columns are optional.', 'You can personalize the email subject and message by providing the same in the upload excel file.', 'Do not change the format of the file while uploading.'],
    columns: ['Recipient name', 'Voucher SKU', 'Quantity'],
  },
  {
    key: 'individual-email',
    title: 'Individual Email',
    description: 'Send each voucher by email',
    icon: Mail,
    stepTitle: 'Download the individual email template.',
    guidance: ['Do not change or edit the headers.', 'Country code, subject and message columns are optional.', 'You can personalize the email subject and message by providing the same in the upload excel file.', 'For scheduled orders, date is mandatory.'],
    columns: ['Recipient name', 'Email address', 'Voucher SKU'],
  },
  {
    key: 'individual-sms',
    title: 'Individual SMS',
    description: 'Send each voucher by text',
    icon: Smartphone,
    stepTitle: 'Download the individual SMS template.',
    guidance: ['Do not change or edit the headers.', 'User can provide mobile number with country code along with (+) symbols in the mobile column.', 'If country code is not specified either in country code column or the mobile column, system will use +91 value.', 'For scheduled orders, date is mandatory.'],
    columns: ['Recipient name', 'Mobile number', 'Voucher SKU'],
  },
  {
    key: 'individual-email-sms',
    title: 'Individual Email & SMS',
    description: 'Send by email and text',
    icon: MessageSquare,
    stepTitle: 'Download the individual email and SMS template.',
    guidance: ['Do not change or edit the headers.', 'Country code, subject and message columns are optional.', 'If delivery mode is only email, SMS fields can be left blank.', 'For scheduled orders, date is mandatory.'],
    columns: ['Recipient name', 'Email address', 'Mobile number'],
  },
];

function StepMarker({ number, children, caption, open, onClick }) {
  return (
    <button type="button" className="bulk-step-heading" onClick={onClick} aria-expanded={open}>
      <span className="bulk-step-number">{number}</span>
      <div>
        <h2>{children}</h2>
        {caption && <p>{caption}</p>}
      </div>
      <span className="bulk-step-chevron">{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
    </button>
  );
}

export function BulkOrderPage() {
  const [cardType, setCardType] = useState('digital');
  const [deliveryMode, setDeliveryMode] = useState('consolidated-file');
  const [skuQuery, setSkuQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openStep, setOpenStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notice, setNotice] = useState('');
  const mode = DELIVERY_MODES.find((item) => item.key === deliveryMode) || DELIVERY_MODES[0];
  const requiredColumns = cardType === 'physical' ? [...mode.columns, 'Shipping address'] : mode.columns;
  const matchingProducts = useMemo(() => PRODUCTS.filter((product) => `${product.brand} ${product.name} ${product.id}`.toLowerCase().includes(skuQuery.toLowerCase().trim())).slice(0, 4), [skuQuery]);

  const selectMode = (key) => {
    setDeliveryMode(key);
    setNotice('');
  };

  const downloadTemplate = () => {
    const header = requiredColumns.join(',');
    const example = requiredColumns.map((column) => column === 'Voucher SKU' ? selectedProduct?.id || 'target-50' : column === 'Quantity' ? '25' : '').join(',');
    const file = new Blob([`${header}\n${example}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `voucherly-${deliveryMode}-template.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Template downloaded');
  };

  const submitBulkOrder = () => {
    if (!selectedProduct) {
      setNotice('Choose a voucher SKU in Step 2 to continue');
      return;
    }
    if (!selectedFile) {
      setNotice('Upload your recipient file in Step 3 to continue');
      return;
    }
    setNotice(`Bulk order ready: ${selectedProduct.brand} via ${mode.title}`);
  };

  return (
    <main className="page-content bulk-page">
      <div className="bulk-reference-tabs" role="tablist" aria-label="Order method">
        <a href="/" className="bulk-reference-tab" role="tab">Order through product selection</a>
        <button type="button" className="bulk-reference-tab is-selected" role="tab" aria-selected="true">Order through file upload</button>
      </div>

      <section className="bulk-card-tabs" role="tablist" aria-label="Card type">
        <button type="button" className={`bulk-card-tab ${cardType === 'digital' ? 'is-selected' : ''}`} onClick={() => setCardType('digital')} role="tab" aria-selected={cardType === 'digital'} data-testid="tab-digital-cards">Digital cards</button>
        <button type="button" className={`bulk-card-tab ${cardType === 'physical' ? 'is-selected' : ''}`} onClick={() => setCardType('physical')} role="tab" aria-selected={cardType === 'physical'} data-testid="tab-physical-cards">Physical cards</button>
      </section>

      <section className="bulk-reference-section">
        <div className="bulk-reference-label">Delivery Mode</div>
        <div className="bulk-mode-grid" role="radiogroup" aria-label="Delivery mode">
          {DELIVERY_MODES.map((item) => {
            const Icon = item.icon;
            const selected = deliveryMode === item.key;
            return (
              <button type="button" key={item.key} className={`bulk-mode-card ${selected ? 'is-selected' : ''}`} onClick={() => selectMode(item.key)} role="radio" aria-checked={selected} data-testid={`button-mode-${item.key}`}>
                <span className="bulk-mode-icon"><Icon size={29} strokeWidth={1.3} /></span>
                <span className="bulk-mode-copy"><strong>{item.title}</strong></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bulk-upload-card">
        <div className="bulk-upload-card-heading">
          <strong>Upload CSV or Excel File</strong>
          <span className="bulk-mode-context">{mode.title}</span>
        </div>
        <div className="bulk-steps">
          <div className={`bulk-step ${openStep === 1 ? 'is-open' : ''}`}>
            <StepMarker number="Step 1" open={openStep === 1} onClick={() => setOpenStep(openStep === 1 ? 0 : 1)}>Download the CSV or Excel template</StepMarker>
            {openStep === 1 && <div className="bulk-step-content">
              <p className="bulk-download-copy"><span>Download the <button type="button" onClick={downloadTemplate}>CSV</button> or <button type="button" onClick={downloadTemplate}>Excel</button> template</span></p>
              <ul className="bulk-guidance-list">{mode.guidance.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="bulk-required-fields"><strong>Required fields:</strong> {requiredColumns.map((column) => <span key={column}>{column}</span>)}</p>
            </div>}
          </div>

          <div className={`bulk-step ${openStep === 2 ? 'is-open' : ''}`}>
            <StepMarker number="Step 2" open={openStep === 2} onClick={() => setOpenStep(openStep === 2 ? 0 : 2)}>Search for product SKU</StepMarker>
            {openStep === 2 && <div className="bulk-step-content">
              <label className="bulk-sku-search">
                <Search size={16} />
                <input value={skuQuery} onChange={(event) => setSkuQuery(event.target.value)} placeholder="Search for product SKU or brand" aria-label="Search voucher SKU" data-testid="input-sku-search" />
                {skuQuery && <button type="button" onClick={() => setSkuQuery('')} aria-label="Clear SKU search"><X size={14} /></button>}
              </label>
              {skuQuery && <div className="bulk-sku-results">
                {matchingProducts.map((product) => (
                  <button type="button" key={product.id} className={`bulk-sku-result ${selectedProduct?.id === product.id ? 'is-selected' : ''}`} onClick={() => { setSelectedProduct(product); setSkuQuery(''); }} data-testid={`button-select-sku-${product.id}`}>
                    <ProductLogo product={product} />
                    <span><strong>{product.brand}</strong><small>{product.name}</small></span>
                    <b>{money(product.price)}</b>
                    {selectedProduct?.id === product.id && <Check size={15} />}
                  </button>
                ))}
                {!matchingProducts.length && <p className="bulk-no-results">No vouchers match that search.</p>}
              </div>}
              {selectedProduct && !skuQuery && <div className="bulk-selected-sku"><ProductLogo product={selectedProduct} /><span><small>Selected SKU</small><strong>{selectedProduct.brand} / {selectedProduct.id}</strong></span><b>{money(selectedProduct.price)}</b><button type="button" onClick={() => setSelectedProduct(null)} aria-label="Remove selected SKU"><X size={15} /></button></div>}
            </div>}
          </div>

          <div className={`bulk-step ${openStep === 3 ? 'is-open' : ''}`}>
            <StepMarker number="Step 3" open={openStep === 3} onClick={() => setOpenStep(openStep === 3 ? 0 : 3)}>Prepare and upload CSV or Excel</StepMarker>
            {openStep === 3 && <div className="bulk-step-content">
              <label className={`bulk-file-drop ${selectedFile ? 'has-file' : ''}`}>
                <input type="file" accept=".csv,.xlsx,.xls" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} data-testid="input-recipient-file" />
                <span className="bulk-file-icon">{selectedFile ? <Check size={20} /> : <Upload size={20} />}</span>
                <span><strong>{selectedFile ? selectedFile.name : 'Choose a CSV or Excel file'}</strong><small>{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB ready to validate` : 'Drag and drop here, or browse from your computer'}</small></span>
                {selectedFile && <button type="button" className="bulk-file-remove" onClick={(event) => { event.preventDefault(); setSelectedFile(null); }} aria-label="Remove uploaded file"><X size={15} /></button>}
              </label>
              <button type="button" className="bulk-template-button" onClick={downloadTemplate} data-testid="button-download-template">Download a CSV template <ChevronDown size={14} /></button>
            </div>}
          </div>
        </div>
      </section>

      <div className="bulk-footer-actions">
        <Button variant="secondary" onClick={() => setOpenStep(selectedProduct ? 3 : 2)} testId="button-review-bulk-order">Review bulk order</Button>
        {notice && <p className="bulk-notice" role="status"><Info size={14} /> {notice}</p>}
        <span className="bulk-secure-note"><Info size={14} /> Your file is used only to prepare this order.</span>
      </div>
    </main>
  );
}