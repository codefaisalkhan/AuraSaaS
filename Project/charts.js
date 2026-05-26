// Chart visualizations configurations and dynamic updates

let revenueAcquisitionChartInstance = null;
let trafficDonutChartInstance = null;

// Initialize Dashboard Charts
function initCharts() {
  const { analyticsHistory, trafficBreakdown } = window.DashboardData;
  
  // ----------------------------------------------------
  // CHART 1: REVENUE GROWTH VS CUSTOMER ACQUISITION (DUAL-AXIS AREA)
  // ----------------------------------------------------
  const ctxLine = document.getElementById("revenueGrowthChart").getContext("2d");
  
  // Create area gradients
  const revenueGradient = ctxLine.createLinearGradient(0, 0, 0, 280);
  revenueGradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
  revenueGradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
  
  const acquisitionGradient = ctxLine.createLinearGradient(0, 0, 0, 280);
  acquisitionGradient.addColorStop(0, "rgba(6, 182, 212, 0.35)");
  acquisitionGradient.addColorStop(1, "rgba(6, 182, 212, 0.0)");

  const lineConfig = {
    type: "line",
    data: {
      labels: analyticsHistory.months,
      datasets: [
        {
          label: "Revenue ($k)",
          data: analyticsHistory.revenue,
          borderColor: "#6366f1",
          backgroundColor: revenueGradient,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "rgba(255,255,255,0.2)",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#6366f1",
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: "y-revenue"
        },
        {
          label: "Acquisitions",
          data: analyticsHistory.acquisition,
          borderColor: "#06b6d4",
          backgroundColor: acquisitionGradient,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointBackgroundColor: "#06b6d4",
          pointBorderColor: "rgba(255,255,255,0.2)",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#06b6d4",
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: "y-acquisition"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: false // We use our custom UI toggles
        },
        tooltip: {
          backgroundColor: "#0f0f12",
          titleColor: "#f4f4f5",
          bodyColor: "#a1a1aa",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          bodyFont: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12
          },
          titleFont: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 13,
            weight: "bold"
          },
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.datasetIndex === 0) {
                label += "$" + context.parsed.y.toFixed(1) + "k";
              } else {
                label += context.parsed.y + " users";
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(255, 255, 255, 0.06)"
          },
          ticks: {
            color: "#a1a1aa",
            font: {
              family: "'Plus Jakarta Sans', sans-serif"
            }
          }
        },
        "y-revenue": {
          type: "linear",
          display: true,
          position: "left",
          grid: {
            color: "rgba(255, 255, 255, 0.03)"
          },
          ticks: {
            color: "#a1a1aa",
            font: {
              family: "'Plus Jakarta Sans', sans-serif"
            },
            callback: function (value) {
              return "$" + value + "k";
            }
          }
        },
        "y-acquisition": {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            drawOnChartArea: false // prevent grid line overlap
          },
          ticks: {
            color: "#a1a1aa",
            font: {
              family: "'Plus Jakarta Sans', sans-serif"
            }
          }
        }
      }
    }
  };
  
  revenueAcquisitionChartInstance = new Chart(ctxLine, lineConfig);

  // ----------------------------------------------------
  // CHART 2: TRAFFIC BREAKDOWN (DONUT)
  // ----------------------------------------------------
  const ctxDonut = document.getElementById("trafficBreakdownChart").getContext("2d");
  
  const donutConfig = {
    type: "doughnut",
    data: {
      labels: trafficBreakdown.labels,
      datasets: [
        {
          data: trafficBreakdown.data,
          backgroundColor: trafficBreakdown.colors,
          borderWidth: 2,
          borderColor: "#121214", // card bg equivalent
          hoverBorderColor: "#121214",
          borderRadius: 4,
          spacing: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          display: false // We use our custom list legend
        },
        tooltip: {
          backgroundColor: "#0f0f12",
          titleColor: "#f4f4f5",
          bodyColor: "#a1a1aa",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          bodyFont: {
            family: "'Plus Jakarta Sans', sans-serif"
          },
          callbacks: {
            label: function (context) {
              return ` ${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  };
  
  trafficDonutChartInstance = new Chart(ctxDonut, donutConfig);
  
  renderTrafficLegend();
}

// Render custom HTML legend for traffic sources with percentages
function renderTrafficLegend() {
  const container = document.getElementById("donut-legend-container");
  const { labels, data, colors } = window.DashboardData.trafficBreakdown;
  
  container.innerHTML = "";
  
  labels.forEach((label, index) => {
    const value = data[index];
    const color = colors[index];
    
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";
    legendItem.dataset.segment = index;
    
    legendItem.innerHTML = `
      <div class="legend-item-left">
        <span class="legend-color-indicator" style="background-color: ${color}; box-shadow: 0 0 6px ${color};"></span>
        <span class="legend-label">${label}</span>
      </div>
      <span class="legend-value">${value}%</span>
    `;
    
    // Add hover behavior connecting custom legend items with donut segments
    legendItem.addEventListener("mouseenter", () => {
      trafficDonutChartInstance.setActiveElements([{ datasetIndex: 0, index }]);
      trafficDonutChartInstance.update();
    });
    
    legendItem.addEventListener("mouseleave", () => {
      trafficDonutChartInstance.setActiveElements([]);
      trafficDonutChartInstance.update();
    });
    
    container.appendChild(legendItem);
  });
}

// Toggle visibility of specific series on the main chart
function toggleLineSeries(seriesName) {
  if (!revenueAcquisitionChartInstance) return;
  
  const datasetIndex = seriesName === "revenue" ? 0 : 1;
  const meta = revenueAcquisitionChartInstance.getDatasetMeta(datasetIndex);
  
  // Toggle the visible flag
  meta.hidden = meta.hidden === null ? !revenueAcquisitionChartInstance.data.datasets[datasetIndex].hidden : null;
  
  // Update dual y-axis visibility if dataset is hidden
  const yAxisID = datasetIndex === 0 ? "y-revenue" : "y-acquisition";
  revenueAcquisitionChartInstance.options.scales[yAxisID].display = !meta.hidden;
  
  revenueAcquisitionChartInstance.update();
}

// Update line charts with new live operations metrics (e.g. increments)
function updateLineData(type, newValue) {
  if (!revenueAcquisitionChartInstance) return;
  
  const datasetIndex = type === "revenue" ? 0 : 1;
  const dataArray = revenueAcquisitionChartInstance.data.datasets[datasetIndex].data;
  
  // Update the last element with new incremented values to simulate live revenue/acquisitions accumulation
  dataArray[dataArray.length - 1] = newValue;
  revenueAcquisitionChartInstance.update("none"); // smooth update without full entry animation
}

// Dynamic theme updates for chart elements
function updateChartTheme(isLightMode) {
  if (!revenueAcquisitionChartInstance || !trafficDonutChartInstance) return;
  
  const gridColor = isLightMode ? "rgba(15, 23, 42, 0.06)" : "rgba(255, 255, 255, 0.03)";
  const tickColor = isLightMode ? "#475569" : "#a1a1aa";
  const tooltipBg = isLightMode ? "#0f172a" : "#0f0f12";
  const donutBorderColor = isLightMode ? "#ffffff" : "#121214";
  
  // Update main chart axes grid lines and labels
  revenueAcquisitionChartInstance.options.scales.x.grid.color = gridColor;
  revenueAcquisitionChartInstance.options.scales.x.ticks.color = tickColor;
  
  revenueAcquisitionChartInstance.options.scales["y-revenue"].grid.color = gridColor;
  revenueAcquisitionChartInstance.options.scales["y-revenue"].ticks.color = tickColor;
  revenueAcquisitionChartInstance.options.scales["y-acquisition"].ticks.color = tickColor;
  
  // Update tooltip styles
  revenueAcquisitionChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
  trafficDonutChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
  
  // Update donut chart styling
  trafficDonutChartInstance.data.datasets[0].borderColor = donutBorderColor;
  trafficDonutChartInstance.data.datasets[0].hoverBorderColor = donutBorderColor;
  
  // Redraw
  revenueAcquisitionChartInstance.update();
  trafficDonutChartInstance.update();
}

// Export functions to global scope
window.DashboardCharts = {
  init: initCharts,
  toggleSeries: toggleLineSeries,
  updateLineData: updateLineData,
  updateTheme: updateChartTheme
};
