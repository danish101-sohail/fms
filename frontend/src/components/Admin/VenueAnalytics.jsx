import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
  } from 'chart.js';
  import PropTypes from 'prop-types';
  import { useEffect, useState } from 'react';
  import { Line, Pie } from 'react-chartjs-2';
  import api from '@/services/api';
  
  // Register Chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
  );
  
  const VenueAnalytics = ({ venueId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/admin/venues/${venueId}/analytics`);
          setAnalytics(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch analytics data');
          console.error('Analytics fetch error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }, [venueId]);
  
    if (loading) return <div className="text-center py-4">Loading analytics...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
    if (!analytics) return null;
  
    const monthlyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Bookings per Month',
        data: Object.values(analytics.monthlyBookings),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.1,
        fill: true
      }]
    };
  
    const slotData = {
      labels: ['Forenoon', 'Afternoon'],
      datasets: [{
        data: [analytics.slotCounts.Forenoon, analytics.slotCounts.Afternoon],
        backgroundColor: ['#4F46E5', '#10B981'],
        borderWidth: 1
      }]
    };
  
    const lineOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Booking Distribution'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  
    const pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Slot Distribution'
        }
      }
    };
  
    return (
      <div className="space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Monthly Bookings</h3>
          <div className="h-[300px]">
            <Line data={monthlyData} options={lineOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Slot Distribution</h3>
          <div className="h-[300px]">
            <Pie data={slotData} options={pieOptions} />
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Total Bookings: {analytics.totalBookings}
        </div>
      </div>
    );
  };
  
  VenueAnalytics.propTypes = {
    venueId: PropTypes.string.isRequired
  };
  
  export default VenueAnalytics;