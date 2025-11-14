import React, { useEffect, useState } from 'react';
import { Box, H3, H5, Text, Button } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

const StatCard = ({ title, value, subtitle, color = '#7C3AED' }) => (
  <Box
    flex
    flexDirection="column"
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      minHeight: '140px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <Text fontSize="sm" color="grey60" fontWeight="500" mb="xs">
      {title}
    </Text>
    <H3 style={{ margin: '8px 0', color: color, fontSize: '32px', fontWeight: '700' }}>
      {value !== undefined ? value : '—'}
    </H3>
    {subtitle && (
      <Text fontSize="sm" color="grey60" mt="xs">
        {subtitle}
      </Text>
    )}
  </Box>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api = new ApiClient();
    api.getDashboard()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Dashboard error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box p="xxl" textAlign="center">
        <Text fontSize="lg" color="grey60">Loading dashboard...</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p="xxl" textAlign="center">
        <Text fontSize="lg" color="error">Unable to load dashboard data</Text>
      </Box>
    );
  }

  const isAdmin = data.role === 'admin';

  return (
    <Box variant="grey" style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Header */}
      <Box mb="xl">
        <H3 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: '700', color: '#0F172A' }}>
          Welcome back, {data.userName}
        </H3>
        <Text fontSize="default" color="grey60">
          {isAdmin ? 'Administrator Dashboard' : 'User Dashboard'}
        </Text>
      </Box>

      {/* Admin Dashboard */}
      {isAdmin && (
        <>
          {/* User Stats */}
          <Box mb="lg">
            <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>User Overview</H5>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Total Users"
                value={data.totalUsers}
                color="#7C3AED"
              />
              <StatCard
                title="Administrators"
                value={data.adminUsers}
                color="#F59E0B"
              />
              <StatCard
                title="Regular Users"
                value={data.regularUsers}
                color="#059669"
              />
            </Box>
          </Box>

          {/* Product Stats */}
          <Box mb="lg">
            <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>Catalog Overview</H5>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Total Products"
                value={data.totalProducts}
                color="#7C3AED"
              />
              <StatCard
                title="Categories"
                value={data.totalCategories}
                color="#3B82F6"
              />
              <StatCard
                title="Low Stock Items"
                value={data.lowStockProducts}
                subtitle="Less than 10 units"
                color="#DC2626"
              />
            </Box>
          </Box>

          {/* Order Stats */}
          <Box mb="lg">
            <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>Sales Overview</H5>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Total Orders"
                value={data.totalOrders}
                color="#7C3AED"
              />
              <StatCard
                title="Pending Orders"
                value={data.pendingOrders}
                color="#F59E0B"
              />
              <StatCard
                title="Processing"
                value={data.processingOrders}
                color="#3B82F6"
              />
              <StatCard
                title="Delivered"
                value={data.deliveredOrders}
                color="#059669"
              />
            </Box>
          </Box>

          {/* Revenue Stats */}
          <Box mb="lg">
            <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>Revenue Overview</H5>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Total Revenue"
                value={`$${(data.totalRevenue || 0).toFixed(2)}`}
                color="#059669"
              />
              <StatCard
                title="Pending Revenue"
                value={`$${(data.pendingRevenue || 0).toFixed(2)}`}
                subtitle="From pending orders"
                color="#F59E0B"
              />
            </Box>
          </Box>

          {/* Recent Activity */}
          {data.recentOrders && data.recentOrders.length > 0 && (
            <Box>
              <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>Recent Orders</H5>
              <Box
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <Box style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Order ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Customer</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders.map((order, idx) => (
                        <tr key={order.id} style={{ borderBottom: idx < data.recentOrders.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>#{order.id}</td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151' }}>
                            {order.customer?.name || 'N/A'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                              color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF',
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151', fontWeight: '600', textAlign: 'right' }}>
                            ${(order.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}

      {/* User Dashboard */}
      {!isAdmin && (
        <>
          <Box mb="lg">
            <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>My Overview</H5>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Available Products"
                value={data.totalProducts}
                color="#7C3AED"
              />
              <StatCard
                title="Categories"
                value={data.totalCategories}
                color="#3B82F6"
              />
              <StatCard
                title="My Orders"
                value={data.myOrders}
                color="#059669"
              />
              <StatCard
                title="Pending Orders"
                value={data.myPendingOrders}
                color="#F59E0B"
              />
            </Box>
          </Box>

          <Box mb="lg">
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              <StatCard
                title="Total Spent"
                value={`$${(data.myTotalSpent || 0).toFixed(2)}`}
                color="#059669"
              />
            </Box>
          </Box>

          {data.myRecentOrders && data.myRecentOrders.length > 0 && (
            <Box>
              <H5 mb="default" style={{ color: '#1E293B', fontWeight: '600' }}>My Recent Orders</H5>
              <Box
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <Box style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Order ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.myRecentOrders.map((order, idx) => (
                        <tr key={order.id} style={{ borderBottom: idx < data.myRecentOrders.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>#{order.id}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                              color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF',
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '14px', color: '#374151', fontWeight: '600', textAlign: 'right' }}>
                            ${(order.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
