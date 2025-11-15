import React, { useEffect, useState } from 'react';

import { Box, H3, H5, Text, Button, Icon } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#7C3AED', '#F59E0B', '#059669', '#3B82F6', '#DC2626', '#EC4899'];

const StatCard = ({ title, value, subtitle, color = '#7C3AED', icon, trend, trendValue }) => (
  <Box
    flex
    flexDirection="column"
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      minHeight: '160px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: color, opacity: 0.1 }}></div>
    
    <Box flex justifyContent="space-between" alignItems="flex-start" mb="sm">
      <Text fontSize="sm" color="grey60" fontWeight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {title}
      </Text>
      {trend && (
        <Box style={{ 
          padding: '4px 8px', 
          borderRadius: '6px', 
          background: trend === 'up' ? '#D1FAE5' : '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{ color: trend === 'up' ? '#065F46' : '#991B1B', fontSize: '10px', fontWeight: '700' }}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        </Box>
      )}
    </Box>
    
    <H3 style={{ margin: '12px 0', color: color, fontSize: '36px', fontWeight: '800', lineHeight: '1' }}>
      {value !== undefined ? value : '—'}
    </H3>
    
    {subtitle && (
      <Text fontSize="sm" color="grey60" mt="xs" style={{ fontWeight: '500' }}>
        {subtitle}
      </Text>
    )}
  </Box>
);

const ChartCard = ({ title, children }) => (
  <Box
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
    }}
  >
    <H5 mb="lg" style={{ color: '#1E293B', fontWeight: '700', fontSize: '18px' }}>{title}</H5>
    {children}
  </Box>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = () => {
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
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [refreshKey]);

  if (loading) {
    return (
      <Box p="xxl" textAlign="center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTop: '4px solid #7C3AED', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <Text fontSize="lg" color="grey60" mt="lg">Loading dashboard...</Text>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p="xxl" textAlign="center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Text fontSize="xl" color="error" style={{ fontWeight: '700' }}>⚠️ Unable to load dashboard data</Text>
        <Button onClick={() => setRefreshKey(k => k + 1)} mt="lg" variant="primary">Retry</Button>
      </Box>
    );
  }

  const isAdmin = data.role === 'admin';

  // Prepare chart data
  const orderStatusData = isAdmin ? [
    { name: 'Pending', value: data.pendingOrders || 0, color: '#F59E0B' },
    { name: 'Processing', value: data.processingOrders || 0, color: '#3B82F6' },
    { name: 'Delivered', value: data.deliveredOrders || 0, color: '#059669' },
  ] : [];

  const revenueData = isAdmin ? [
    { name: 'Total Revenue', amount: data.totalRevenue || 0 },
    { name: 'Pending', amount: data.pendingRevenue || 0 },
  ] : [];

  const userDistribution = isAdmin ? [
    { name: 'Admins', value: data.adminUsers || 0, color: '#7C3AED' },
    { name: 'Users', value: data.regularUsers || 0, color: '#3B82F6' },
  ] : [];

  return (
    <Box variant="grey" style={{ minHeight: '100vh', padding: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <Box mb="xl" style={{ 
          background: 'rgba(255,255,255,0.95)', 
          borderRadius: '16px', 
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box flex justifyContent="space-between" alignItems="center">
            <div>
              <H3 style={{ marginBottom: '8px', fontSize: '32px', fontWeight: '800', color: '#0F172A', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {isAdmin ? '👋 Welcome back, ' : '👋 Hello, '}{data.userName}
              </H3>
              <Text fontSize="default" color="grey60" style={{ fontWeight: '500' }}>
                {isAdmin ? '🔑 Administrator Dashboard • Full System Access' : '👤 User Dashboard • Personal Overview'}
              </Text>
            </div>
            <Button onClick={() => setRefreshKey(k => k + 1)} variant="primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', padding: '12px 24px', fontWeight: '600' }}>
              🔄 Refresh Data
            </Button>
          </Box>
        </Box>

        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 200px)' }}>
          {/* Admin Dashboard */}
          {isAdmin && (
            <>
              {/* Quick Stats Grid */}
              <Box mb="lg">
                <H5 mb="default" style={{ color: '#fff', fontWeight: '700', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  📊 Key Performance Indicators
                </H5>
                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <StatCard
                    title="Total Revenue"
                    value={`$${(data.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subtitle="All-time earnings"
                    color="#059669"
                    icon="💰"
                    trend="up"
                    trendValue="12.5%"
                  />
                  <StatCard
                    title="Total Orders"
                    value={data.totalOrders}
                    subtitle={`${data.pendingOrders} pending review`}
                    color="#7C3AED"
                    icon="📦"
                  />
                  <StatCard
                    title="Total Users"
                    value={data.totalUsers}
                    subtitle={`${data.adminUsers} admins, ${data.regularUsers} users`}
                    color="#3B82F6"
                    icon="👥"
                    trend="up"
                    trendValue="8%"
                  />
                  <StatCard
                    title="Products"
                    value={data.totalProducts}
                    subtitle={`${data.lowStockProducts} low stock alerts`}
                    color="#F59E0B"
                    icon="🏷️"
                  />
                </Box>
              </Box>

              {/* Charts Section */}
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}
              >
                {/* Order Status Distribution */}
                <ChartCard title="📈 Order Status Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Revenue Overview */}
                <ChartCard title="💵 Revenue Overview">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="amount" fill="#059669" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

              {/* Detailed Stats */}
              <Box
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}
              >
                <StatCard title="Pending Orders" value={data.pendingOrders} color="#F59E0B" icon="⏳" />
                <StatCard title="Processing" value={data.processingOrders} color="#3B82F6" icon="⚙️" />
                <StatCard title="Delivered" value={data.deliveredOrders} color="#059669" icon="✅" />
                <StatCard title="Categories" value={data.totalCategories} color="#EC4899" icon="🗂️" />
                <StatCard title="Low Stock" value={data.lowStockProducts} color="#DC2626" icon="⚠️" subtitle="Urgent attention needed" />
              </Box>

              {/* Recent Orders Table */}
              {data.recentOrders && data.recentOrders.length > 0 && (
                <Box mb="lg">
                  <H5 mb="default" style={{ color: '#fff', fontWeight: '700', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    🕒 Recent Orders
                  </H5>
                  <Box
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Order ID</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Customer</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Email</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '700' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentOrders.map((order, idx) => (
                            <tr key={order.id} style={{ 
                              borderBottom: idx < data.recentOrders.length - 1 ? '1px solid #f3f4f6' : 'none',
                              transition: 'background 0.2s',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <td style={{ padding: '16px', fontSize: '14px', color: '#7C3AED', fontWeight: '700' }}>
                                #{order.id}
                              </td>
                              <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                                {order.customer?.name || 'N/A'}
                              </td>
                              <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>
                                {order.customer?.email || 'N/A'}
                              </td>
                              <td style={{ padding: '16px' }}>
                                <span style={{
                                  padding: '6px 14px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                                  color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '16px', fontSize: '16px', color: '#059669', fontWeight: '800', textAlign: 'right' }}>
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

              {/* Top Products - Low Stock Alert */}
              {data.topProducts && data.topProducts.length > 0 && (
                <Box>
                  <H5 mb="default" style={{ color: '#fff', fontWeight: '700', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    ⚠️ Low Stock Products (Urgent)
                  </H5>
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {data.topProducts.map((product) => (
                      <Box
                        key={product.name}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '20px',
                          border: product.stock < 5 ? '2px solid #DC2626' : '1px solid #e5e7eb',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'transform 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <Text fontSize="sm" color="grey60" fontWeight="600" mb="xs">PRODUCT</Text>
                        <H5 style={{ color: '#1E293B', marginBottom: '8px', fontSize: '16px' }}>{product.name}</H5>
                        <Box flex justifyContent="space-between" alignItems="center">
                          <Text fontSize="lg" fontWeight="800" style={{ color: product.stock < 5 ? '#DC2626' : '#F59E0B' }}>
                            {product.stock} units
                          </Text>
                          <Text fontSize="default" fontWeight="600" color="grey60">
                            ${product.price}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* User Dashboard */}
          {!isAdmin && (
            <>
              <Box mb="lg">
                <H5 mb="default" style={{ color: '#fff', fontWeight: '700', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  📊 My Overview
                </H5>
                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px',
                  }}
                >
                  <StatCard
                    title="My Total Spent"
                    value={`$${(data.myTotalSpent || 0).toFixed(2)}`}
                    color="#059669"
                    icon="💰"
                  />
                  <StatCard
                    title="My Orders"
                    value={data.myOrders}
                    subtitle={`${data.myPendingOrders} pending`}
                    color="#7C3AED"
                    icon="📦"
                  />
                  <StatCard
                    title="Available Products"
                    value={data.totalProducts}
                    color="#3B82F6"
                    icon="🛍️"
                  />
                  <StatCard
                    title="Categories"
                    value={data.totalCategories}
                    color="#F59E0B"
                    icon="🗂️"
                  />
                </Box>
              </Box>

              {data.myRecentOrders && data.myRecentOrders.length > 0 && (
                <Box>
                  <H5 mb="default" style={{ color: '#fff', fontWeight: '700', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    🕒 My Recent Orders
                  </H5>
                  <Box
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Order ID</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '700' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '700' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.myRecentOrders.map((order, idx) => (
                            <tr key={order.id} style={{ 
                              borderBottom: idx < data.myRecentOrders.length - 1 ? '1px solid #f3f4f6' : 'none',
                              transition: 'background 0.2s',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <td style={{ padding: '16px', fontSize: '14px', color: '#7C3AED', fontWeight: '700' }}>#{order.id}</td>
                              <td style={{ padding: '16px' }}>
                                <span style={{
                                  padding: '6px 14px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
                                  color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF',
                                  textTransform: 'uppercase'
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '16px', fontSize: '16px', color: '#059669', fontWeight: '800', textAlign: 'right' }}>
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
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
