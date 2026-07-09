import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaChartBar, FaCheckCircle, FaTimesCircle, FaArrowRight } from 'react-icons/fa';
import './RentVsBuyPage.css';

const products = [
  { name: 'Smart TV 43"', buyPrice: 32000, monthlyRent: 899, maintenance: 2000 },
  { name: 'Smart TV 55"', buyPrice: 55000, monthlyRent: 1299, maintenance: 2500 },
  { name: 'Refrigerator 260L', buyPrice: 28000, monthlyRent: 799, maintenance: 1800 },
  { name: 'Washing Machine 7kg', buyPrice: 25000, monthlyRent: 699, maintenance: 1500 },
  { name: 'Air Conditioner 1.5T', buyPrice: 38000, monthlyRent: 999, maintenance: 3000 },
  { name: 'Laptop (Mid-range)', buyPrice: 55000, monthlyRent: 1499, maintenance: 2000 },
  { name: 'Custom', buyPrice: 0, monthlyRent: 0, maintenance: 0 },
];

const RentVsBuyPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [months, setMonths] = useState(12);
  const [buyPrice, setBuyPrice] = useState(products[0].buyPrice);
  const [monthlyRent, setMonthlyRent] = useState(products[0].monthlyRent);
  const [maintenance, setMaintenance] = useState(products[0].maintenance);
  const [securityDeposit, setSecurityDeposit] = useState(Math.round(products[0].monthlyRent * 2));

  const handleProductChange = (e) => {
    const p = products.find(x => x.name === e.target.value);
    setSelectedProduct(p);
    setBuyPrice(p.buyPrice);
    setMonthlyRent(p.monthlyRent);
    setMaintenance(p.maintenance);
    setSecurityDeposit(Math.round(p.monthlyRent * 2));
  };

  const results = useMemo(() => {
    const totalRent = monthlyRent * months + securityDeposit;
    const rentRefund = securityDeposit;
    const netRentCost = totalRent - rentRefund;

    const depreciation = buyPrice * 0.20; // ~20% annual depreciation per year
    const annualDepreciation = (depreciation / 12) * months;
    const buyResaleValue = Math.max(0, buyPrice - annualDepreciation);
    const totalBuyCost = buyPrice + maintenance - buyResaleValue;

    const saving = totalBuyCost - netRentCost;
    const rentIsBetter = saving > 0;

    return {
      totalRent,
      netRentCost,
      totalBuyCost,
      buyResaleValue: Math.round(buyResaleValue),
      saving: Math.abs(Math.round(saving)),
      rentIsBetter,
    };
  }, [buyPrice, monthlyRent, months, securityDeposit, maintenance]);

  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

  return (
    <div className="rvb-page">
      <div className="rvb-hero">
        <div className="container">
          <div className="rvb-hero-icon"><FaCalculator /></div>
          <h1>Rent vs Buy Calculator</h1>
          <p>Make a data-driven decision — see exactly which option costs you less.</p>
        </div>
      </div>

      <div className="container rvb-layout">
        {/* Calculator Inputs */}
        <div className="rvb-calculator">
          <h2>Configure Your Comparison</h2>

          <div className="rvb-form">
            <div className="form-group">
              <label className="form-label">Select Product</label>
              <select className="form-control" value={selectedProduct.name} onChange={handleProductChange}>
                {products.map(p => <option key={p.name}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (months): <strong>{months}</strong></label>
              <input
                type="range" min="3" max="60" step="3"
                value={months}
                onChange={e => setMonths(Number(e.target.value))}
                className="range-input"
              />
              <div className="range-labels"><span>3 mo</span><span>5 years</span></div>
            </div>

            <div className="rvb-split">
              <div className="rvb-section buy-section">
                <h3>🛒 Buy Option</h3>
                <div className="form-group">
                  <label className="form-label">Purchase Price (₹)</label>
                  <input type="number" className="form-control" value={buyPrice} onChange={e => setBuyPrice(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Annual Maintenance Cost (₹)</label>
                  <input type="number" className="form-control" value={maintenance} onChange={e => setMaintenance(Number(e.target.value))} />
                </div>
              </div>

              <div className="rvb-section rent-section">
                <h3>🏷️ Rent Option</h3>
                <div className="form-group">
                  <label className="form-label">Monthly Rent (₹)</label>
                  <input type="number" className="form-control" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Security Deposit (₹)</label>
                  <input type="number" className="form-control" value={securityDeposit} onChange={e => setSecurityDeposit(Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="rvb-results">
          <h2>Your Results</h2>

          <div className={`winner-badge ${results.rentIsBetter ? 'rent-winner' : 'buy-winner'}`}>
            {results.rentIsBetter ? (
              <><FaCheckCircle /> Renting saves you {fmt(results.saving)} over {months} months</>
            ) : (
              <><FaCheckCircle /> Buying saves you {fmt(results.saving)} over {months} months</>
            )}
          </div>

          <div className="results-comparison">
            <div className={`result-card ${results.rentIsBetter ? 'winner' : ''}`}>
              <h3>🏷️ Rent Total Cost</h3>
              <div className="result-amount">{fmt(results.netRentCost)}</div>
              <div className="result-breakdown">
                <div className="breakdown-row">
                  <span>Monthly Rent × {months}</span>
                  <span>{fmt(monthlyRent * months)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Security Deposit (paid)</span>
                  <span>+{fmt(securityDeposit)}</span>
                </div>
                <div className="breakdown-row refund">
                  <span>Security Deposit (refunded)</span>
                  <span>−{fmt(securityDeposit)}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Net Cost</span>
                  <span>{fmt(results.netRentCost)}</span>
                </div>
              </div>
              {results.rentIsBetter && <div className="winner-label">✅ Better Option</div>}
            </div>

            <div className={`result-card ${!results.rentIsBetter ? 'winner' : ''}`}>
              <h3>🛒 Buy Total Cost</h3>
              <div className="result-amount">{fmt(results.totalBuyCost)}</div>
              <div className="result-breakdown">
                <div className="breakdown-row">
                  <span>Purchase Price</span>
                  <span>{fmt(buyPrice)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Maintenance ({months} mo)</span>
                  <span>+{fmt((maintenance / 12) * months)}</span>
                </div>
                <div className="breakdown-row refund">
                  <span>Estimated Resale Value</span>
                  <span>−{fmt(results.buyResaleValue)}</span>
                </div>
                <div className="breakdown-row total">
                  <span>Net Cost</span>
                  <span>{fmt(results.totalBuyCost)}</span>
                </div>
              </div>
              {!results.rentIsBetter && <div className="winner-label">✅ Better Option</div>}
            </div>
          </div>

          {/* When to rent vs buy */}
          <div className="rvb-guide">
            <div className="guide-section rent-guide">
              <h4>✅ Rent if you...</h4>
              <ul>
                <li><FaCheckCircle /> Need it for less than 18 months</li>
                <li><FaCheckCircle /> Want to avoid maintenance headaches</li>
                <li><FaCheckCircle /> Frequently relocate or travel</li>
                <li><FaCheckCircle /> Want to try before committing</li>
                <li><FaCheckCircle /> Prefer predictable monthly costs</li>
              </ul>
            </div>
            <div className="guide-section buy-guide">
              <h4>✅ Buy if you...</h4>
              <ul>
                <li><FaCheckCircle /> Plan to use it for 3+ years</li>
                <li><FaCheckCircle /> Have budget for upfront payment</li>
                <li><FaCheckCircle /> Want full ownership and control</li>
                <li><FaCheckCircle /> Don't mind handling maintenance</li>
                <li><FaCheckCircle /> Have a stable home/address</li>
              </ul>
            </div>
          </div>

          <Link to="/products?orderType=rent" className="btn btn-primary btn-block" style={{ marginTop: 16, justifyContent: 'center' }}>
            Start Renting Now <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuyPage;
