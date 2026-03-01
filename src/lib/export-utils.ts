import type { InventoryItem, FlightInfo } from './types'
import type { ConsumptionDataPoint, ConsumptionTrend, CategoryAnalytics, PhaseAnalytics, PredictiveInsight } from './consumption-analytics'

export interface ConsumptionReportData {
  flightInfo: FlightInfo
  generatedAt: number
  consumptionData: ConsumptionDataPoint[]
  trends: ConsumptionTrend[]
  categoryAnalytics: CategoryAnalytics[]
  phaseAnalytics: PhaseAnalytics[]
  insights: PredictiveInsight[]
  inventory: InventoryItem[]
}

export function exportToCSV(reportData: ConsumptionReportData): void {
  const { flightInfo, generatedAt, trends, categoryAnalytics, phaseAnalytics, insights } = reportData
  
  const sections: string[] = []
  
  sections.push('CABIN CREW CONSUMPTION REPORT')
  sections.push('')
  sections.push(`Flight Number,${flightInfo.flightNumber}`)
  sections.push(`Route,${flightInfo.departure} → ${flightInfo.arrival}`)
  sections.push(`Departure Time,${flightInfo.departureTime}`)
  sections.push(`Arrival Time,${flightInfo.arrivalTime}`)
  sections.push(`Current Phase,${flightInfo.currentPhase}`)
  sections.push(`Report Generated,${new Date(generatedAt).toISOString()}`)
  sections.push('')
  sections.push('')
  
  sections.push('CONSUMPTION TRENDS BY ITEM')
  sections.push('Item Name,Category,Total Consumed,Average Rate (per min),Peak Phase')
  trends.forEach(trend => {
    sections.push(
      `"${trend.itemName}",${trend.category},${trend.totalConsumed},${trend.averageRate.toFixed(2)},${trend.peakPhase}`
    )
  })
  sections.push('')
  sections.push('')
  
  sections.push('CATEGORY ANALYTICS')
  sections.push('Category,Total Consumed,Items Tracked,Average Consumption Rate (per min),Top Items')
  categoryAnalytics.forEach(cat => {
    const topItemsList = cat.topItems.map(item => `${item.name} (${item.consumed})`).join('; ')
    sections.push(
      `${cat.category},${cat.totalConsumed},${cat.itemsTracked},${cat.averageConsumptionRate.toFixed(2)},"${topItemsList}"`
    )
  })
  sections.push('')
  sections.push('')
  
  sections.push('FLIGHT PHASE ANALYTICS')
  sections.push('Phase,Total Consumed,Duration (minutes),Category Breakdown')
  phaseAnalytics.forEach(phase => {
    const categoryBreakdown = phase.itemBreakdown.map(item => `${item.category}: ${item.consumed}`).join('; ')
    sections.push(
      `${phase.phase},${phase.totalConsumed},${Math.round(phase.duration / 60000)},"${categoryBreakdown}"`
    )
  })
  sections.push('')
  sections.push('')
  
  sections.push('PREDICTIVE INSIGHTS')
  sections.push('Type,Item Name,Severity,Message,Estimated Time')
  insights.forEach(insight => {
    const estimatedTime = insight.estimatedTime ? new Date(insight.estimatedTime).toISOString() : 'N/A'
    sections.push(
      `${insight.type},"${insight.itemName}",${insight.severity},"${insight.message}",${estimatedTime}`
    )
  })
  
  const csvContent = sections.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `consumption-report-${flightInfo.flightNumber}-${new Date(generatedAt).toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportToPDF(reportData: ConsumptionReportData): Promise<void> {
  const { flightInfo, generatedAt, trends, categoryAnalytics, phaseAnalytics, insights, inventory } = reportData
  
  const totalConsumed = trends.reduce((sum, t) => sum + t.totalConsumed, 0)
  const totalCategories = categoryAnalytics.length
  const totalItems = trends.length
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Consumption Report - ${flightInfo.flightNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 40px;
      color: oklch(0.20 0.02 250);
      background: white;
      line-height: 1.6;
    }
    
    .header {
      border-bottom: 3px solid oklch(0.35 0.15 250);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: oklch(0.35 0.15 250);
      margin-bottom: 8px;
    }
    
    .header .subtitle {
      font-size: 14px;
      color: oklch(0.50 0.02 250);
    }
    
    .flight-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 30px;
      padding: 20px;
      background: oklch(0.96 0.01 250);
      border-radius: 8px;
    }
    
    .flight-info-item {
      display: flex;
      flex-direction: column;
    }
    
    .flight-info-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      color: oklch(0.50 0.02 250);
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .flight-info-value {
      font-size: 16px;
      font-weight: 600;
      color: oklch(0.20 0.02 250);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      padding: 16px;
      background: oklch(0.96 0.01 250);
      border-radius: 8px;
      border-left: 4px solid oklch(0.75 0.20 145);
    }
    
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      color: oklch(0.50 0.02 250);
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: oklch(0.20 0.02 250);
    }
    
    .stat-subtext {
      font-size: 11px;
      color: oklch(0.50 0.02 250);
      margin-top: 2px;
    }
    
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: oklch(0.35 0.15 250);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid oklch(0.88 0.02 250);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    
    th {
      background: oklch(0.93 0.02 250);
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: oklch(0.25 0.02 250);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 2px solid oklch(0.88 0.02 250);
    }
    
    td {
      padding: 12px;
      font-size: 13px;
      border-bottom: 1px solid oklch(0.93 0.02 250);
    }
    
    tr:hover {
      background: oklch(0.98 0.005 250);
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    .badge-meals {
      background: oklch(0.646 0.222 41.116 / 0.15);
      color: oklch(0.646 0.222 41.116);
    }
    
    .badge-beverages {
      background: oklch(0.6 0.118 184.704 / 0.15);
      color: oklch(0.6 0.118 184.704);
    }
    
    .badge-duty-free {
      background: oklch(0.398 0.07 227.392 / 0.15);
      color: oklch(0.398 0.07 227.392);
    }
    
    .badge-supplies {
      background: oklch(0.828 0.189 84.429 / 0.15);
      color: oklch(0.828 0.189 84.429);
    }
    
    .badge-low {
      background: oklch(0.75 0.20 145 / 0.15);
      color: oklch(0.70 0.18 145);
    }
    
    .badge-medium {
      background: oklch(0.80 0.18 65 / 0.15);
      color: oklch(0.80 0.18 65);
    }
    
    .badge-high {
      background: oklch(0.65 0.24 25 / 0.15);
      color: oklch(0.65 0.24 25);
    }
    
    .insight-card {
      padding: 14px;
      margin-bottom: 12px;
      background: oklch(0.96 0.01 250);
      border-radius: 6px;
      border-left: 4px solid oklch(0.75 0.20 145);
    }
    
    .insight-card.severity-high {
      border-left-color: oklch(0.65 0.24 25);
      background: oklch(0.65 0.24 25 / 0.05);
    }
    
    .insight-card.severity-medium {
      border-left-color: oklch(0.80 0.18 65);
      background: oklch(0.80 0.18 65 / 0.05);
    }
    
    .insight-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    .insight-type {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: oklch(0.50 0.02 250);
    }
    
    .insight-message {
      font-size: 14px;
      color: oklch(0.20 0.02 250);
      line-height: 1.5;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid oklch(0.88 0.02 250);
      text-align: center;
      font-size: 11px;
      color: oklch(0.50 0.02 250);
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Cabin Crew Consumption Report</h1>
    <p class="subtitle">Comprehensive analysis of in-flight inventory consumption</p>
  </div>
  
  <div class="flight-info">
    <div class="flight-info-item">
      <div class="flight-info-label">Flight Number</div>
      <div class="flight-info-value">${flightInfo.flightNumber}</div>
    </div>
    <div class="flight-info-item">
      <div class="flight-info-label">Route</div>
      <div class="flight-info-value">${flightInfo.departure} → ${flightInfo.arrival}</div>
    </div>
    <div class="flight-info-item">
      <div class="flight-info-label">Departure Time</div>
      <div class="flight-info-value">${flightInfo.departureTime}</div>
    </div>
    <div class="flight-info-item">
      <div class="flight-info-label">Current Phase</div>
      <div class="flight-info-value" style="text-transform: capitalize;">${flightInfo.currentPhase}</div>
    </div>
  </div>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Total Consumed</div>
      <div class="stat-value">${totalConsumed}</div>
      <div class="stat-subtext">items tracked</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Categories</div>
      <div class="stat-value">${totalCategories}</div>
      <div class="stat-subtext">active categories</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Items Tracked</div>
      <div class="stat-value">${totalItems}</div>
      <div class="stat-subtext">unique items</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Insights</div>
      <div class="stat-value">${insights.length}</div>
      <div class="stat-subtext">predictions</div>
    </div>
  </div>
  
  ${insights.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Predictive Insights</h2>
    ${insights.map(insight => `
      <div class="insight-card severity-${insight.severity}">
        <div class="insight-header">
          <span class="insight-type">${insight.type}</span>
          <span class="badge badge-${insight.severity}">${insight.severity}</span>
        </div>
        <p class="insight-message">${insight.message}</p>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <div class="section">
    <h2 class="section-title">Consumption Trends by Item</h2>
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th>Total Consumed</th>
          <th>Average Rate</th>
          <th>Peak Phase</th>
        </tr>
      </thead>
      <tbody>
        ${trends.map(trend => `
          <tr>
            <td><strong>${trend.itemName}</strong></td>
            <td><span class="badge badge-${trend.category}">${trend.category}</span></td>
            <td>${trend.totalConsumed} units</td>
            <td>${formatRate(trend.averageRate)}</td>
            <td style="text-transform: capitalize;">${trend.peakPhase}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2 class="section-title">Category Analytics</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Consumed</th>
          <th>Items Tracked</th>
          <th>Average Rate</th>
          <th>Top Items</th>
        </tr>
      </thead>
      <tbody>
        ${categoryAnalytics.map(cat => `
          <tr>
            <td><span class="badge badge-${cat.category}">${cat.category}</span></td>
            <td>${cat.totalConsumed} units</td>
            <td>${cat.itemsTracked}</td>
            <td>${formatRate(cat.averageConsumptionRate)}</td>
            <td>${cat.topItems.slice(0, 3).map(item => `${item.name} (${item.consumed})`).join(', ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2 class="section-title">Flight Phase Analytics</h2>
    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Total Consumed</th>
          <th>Duration</th>
          <th>Category Breakdown</th>
        </tr>
      </thead>
      <tbody>
        ${phaseAnalytics.map(phase => `
          <tr>
            <td style="text-transform: capitalize;"><strong>${phase.phase}</strong></td>
            <td>${phase.totalConsumed} units</td>
            <td>${Math.round(phase.duration / 60000)} minutes</td>
            <td>${phase.itemBreakdown.map(item => `${item.category}: ${item.consumed}`).join(', ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p>Report generated on ${new Date(generatedAt).toLocaleString()}</p>
    <p style="margin-top: 4px;">Cabin Crew Operations Platform - Consumption Analytics</p>
  </div>
</body>
</html>
`
  
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const printWindow = window.open(url, '_blank')
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }
  
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

function formatRate(rate: number): string {
  if (rate < 1) {
    return `${(rate * 60).toFixed(1)}/hr`
  }
  return `${rate.toFixed(1)}/min`
}
