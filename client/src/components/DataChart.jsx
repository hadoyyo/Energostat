import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export default function DataChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    const years = data.map(item => item.year);
    const energyData = data.map(item => item.energyConsumptionTWh);
    const populationData = data.map(item => item.populationInMillions);
    const perCapitaData = data.map(item => item.energyPerCapitaMWh);

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Energy Consumption (TWh)',
            data: energyData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: 'Population (millions)',
            data: populationData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            yAxisID: 'y1'
          },
          {
            label: 'Energy per Capita (MWh)',
            data: perCapitaData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            tension: 0.1,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Energy (TWh)'
            },
            grid: {
              drawOnChartArea: true
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Population (millions)'
            }
          },
          y2: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Per Capita (MWh)'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="chart-container">
      <h2>Energy Consumption Data</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}