(function (React, designSystem, adminjs) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const StatCard = ({
    title,
    value,
    subtitle,
    color = '#7C3AED'
  }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
    flex: true,
    flexDirection: "column",
    style: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      minHeight: '140px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    fontSize: "sm",
    color: "grey60",
    fontWeight: "500",
    mb: "xs"
  }, title), /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
    style: {
      margin: '8px 0',
      color: color,
      fontSize: '32px',
      fontWeight: '700'
    }
  }, value !== undefined ? value : '—'), subtitle && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
    fontSize: "sm",
    color: "grey60",
    mt: "xs"
  }, subtitle));
  const Dashboard = () => {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      const api = new adminjs.ApiClient();
      api.getDashboard().then(response => {
        setData(response.data);
        setLoading(false);
      }).catch(error => {
        console.error('Dashboard error:', error);
        setLoading(false);
      });
    }, []);
    if (loading) {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "xxl",
        textAlign: "center"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        fontSize: "lg",
        color: "grey60"
      }, "Loading dashboard..."));
    }
    if (!data) {
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "xxl",
        textAlign: "center"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
        fontSize: "lg",
        color: "error"
      }, "Unable to load dashboard data"));
    }
    const isAdmin = data.role === 'admin';
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "grey",
      style: {
        minHeight: '100vh',
        padding: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "xl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H3, {
      style: {
        marginBottom: '8px',
        fontSize: '28px',
        fontWeight: '700',
        color: '#0F172A'
      }
    }, "Welcome back, ", data.userName), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "default",
      color: "grey60"
    }, isAdmin ? 'Administrator Dashboard' : 'User Dashboard')), isAdmin && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "User Overview"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Total Users",
      value: data.totalUsers,
      color: "#7C3AED"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Administrators",
      value: data.adminUsers,
      color: "#F59E0B"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Regular Users",
      value: data.regularUsers,
      color: "#059669"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "Catalog Overview"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Total Products",
      value: data.totalProducts,
      color: "#7C3AED"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Categories",
      value: data.totalCategories,
      color: "#3B82F6"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Low Stock Items",
      value: data.lowStockProducts,
      subtitle: "Less than 10 units",
      color: "#DC2626"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "Sales Overview"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Total Orders",
      value: data.totalOrders,
      color: "#7C3AED"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Pending Orders",
      value: data.pendingOrders,
      color: "#F59E0B"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Processing",
      value: data.processingOrders,
      color: "#3B82F6"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Delivered",
      value: data.deliveredOrders,
      color: "#059669"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "Revenue Overview"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Total Revenue",
      value: `$${(data.totalRevenue || 0).toFixed(2)}`,
      color: "#059669"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Pending Revenue",
      value: `$${(data.pendingRevenue || 0).toFixed(2)}`,
      subtitle: "From pending orders",
      color: "#F59E0B"
    }))), data.recentOrders && data.recentOrders.length > 0 && /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "Recent Orders"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React__default.default.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
      style: {
        background: '#F9FAFB',
        borderBottom: '1px solid #e5e7eb'
      }
    }, /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Order ID"), /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Customer"), /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Status"), /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'right',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Total"))), /*#__PURE__*/React__default.default.createElement("tbody", null, data.recentOrders.map((order, idx) => /*#__PURE__*/React__default.default.createElement("tr", {
      key: order.id,
      style: {
        borderBottom: idx < data.recentOrders.length - 1 ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '500'
      }
    }, "#", order.id), /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151'
      }
    }, order.customer?.name || 'N/A'), /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
        color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF'
      }
    }, order.status)), /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '600',
        textAlign: 'right'
      }
    }, "$", (order.total || 0).toFixed(2)))))))))), !isAdmin && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "My Overview"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Available Products",
      value: data.totalProducts,
      color: "#7C3AED"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Categories",
      value: data.totalCategories,
      color: "#3B82F6"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "My Orders",
      value: data.myOrders,
      color: "#059669"
    }), /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Pending Orders",
      value: data.myPendingOrders,
      color: "#F59E0B"
    }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mb: "lg"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }
    }, /*#__PURE__*/React__default.default.createElement(StatCard, {
      title: "Total Spent",
      value: `$${(data.myTotalSpent || 0).toFixed(2)}`,
      color: "#059669"
    }))), data.myRecentOrders && data.myRecentOrders.length > 0 && /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      mb: "default",
      style: {
        color: '#1E293B',
        fontWeight: '600'
      }
    }, "My Recent Orders"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React__default.default.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React__default.default.createElement("thead", null, /*#__PURE__*/React__default.default.createElement("tr", {
      style: {
        background: '#F9FAFB',
        borderBottom: '1px solid #e5e7eb'
      }
    }, /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Order ID"), /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Status"), /*#__PURE__*/React__default.default.createElement("th", {
      style: {
        padding: '12px 16px',
        textAlign: 'right',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6B7280'
      }
    }, "Total"))), /*#__PURE__*/React__default.default.createElement("tbody", null, data.myRecentOrders.map((order, idx) => /*#__PURE__*/React__default.default.createElement("tr", {
      key: order.id,
      style: {
        borderBottom: idx < data.myRecentOrders.length - 1 ? '1px solid #f3f4f6' : 'none'
      }
    }, /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '500'
      }
    }, "#", order.id), /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        background: order.status === 'delivered' ? '#D1FAE5' : order.status === 'pending' ? '#FEF3C7' : '#DBEAFE',
        color: order.status === 'delivered' ? '#065F46' : order.status === 'pending' ? '#92400E' : '#1E40AF'
      }
    }, order.status)), /*#__PURE__*/React__default.default.createElement("td", {
      style: {
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151',
        fontWeight: '600',
        textAlign: 'right'
      }
    }, "$", (order.total || 0).toFixed(2)))))))))));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Dashboard = Dashboard;

})(React, AdminJSDesignSystem, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tcG9uZW50cy9EYXNoYm9hcmQuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEgzLCBINSwgVGV4dCwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBBcGlDbGllbnQgfSBmcm9tICdhZG1pbmpzJztcblxuY29uc3QgU3RhdENhcmQgPSAoeyB0aXRsZSwgdmFsdWUsIHN1YnRpdGxlLCBjb2xvciA9ICcjN0MzQUVEJyB9KSA9PiAoXG4gIDxCb3hcbiAgICBmbGV4XG4gICAgZmxleERpcmVjdGlvbj1cImNvbHVtblwiXG4gICAgc3R5bGU9e3tcbiAgICAgIGJhY2tncm91bmQ6ICd3aGl0ZScsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcbiAgICAgIHBhZGRpbmc6ICcyNHB4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMXB4IDNweCAwIHJnYmEoMCwgMCwgMCwgMC4xKScsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgI2U1ZTdlYicsXG4gICAgICBtaW5IZWlnaHQ6ICcxNDBweCcsXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMnMgZWFzZScsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB9fVxuICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHtcbiAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3hTaGFkb3cgPSAnMCAxMHB4IDI1cHggLTVweCByZ2JhKDAsIDAsIDAsIDAuMTUpJztcbiAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMnB4KSc7XG4gICAgfX1cbiAgICBvbk1vdXNlTGVhdmU9eyhlKSA9PiB7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJzAgMXB4IDNweCAwIHJnYmEoMCwgMCwgMCwgMC4xKSc7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xuICAgIH19XG4gID5cbiAgICA8VGV4dCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBmb250V2VpZ2h0PVwiNTAwXCIgbWI9XCJ4c1wiPlxuICAgICAge3RpdGxlfVxuICAgIDwvVGV4dD5cbiAgICA8SDMgc3R5bGU9e3sgbWFyZ2luOiAnOHB4IDAnLCBjb2xvcjogY29sb3IsIGZvbnRTaXplOiAnMzJweCcsIGZvbnRXZWlnaHQ6ICc3MDAnIH19PlxuICAgICAge3ZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6ICfigJQnfVxuICAgIDwvSDM+XG4gICAge3N1YnRpdGxlICYmIChcbiAgICAgIDxUZXh0IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwieHNcIj5cbiAgICAgICAge3N1YnRpdGxlfVxuICAgICAgPC9UZXh0PlxuICAgICl9XG4gIDwvQm94PlxuKTtcblxuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBbZGF0YSwgc2V0RGF0YV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KCk7XG4gICAgYXBpLmdldERhc2hib2FyZCgpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgc2V0RGF0YShyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdEYXNoYm9hcmQgZXJyb3I6JywgZXJyb3IpO1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgaWYgKGxvYWRpbmcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEJveCBwPVwieHhsXCIgdGV4dEFsaWduPVwiY2VudGVyXCI+XG4gICAgICAgIDxUZXh0IGZvbnRTaXplPVwibGdcIiBjb2xvcj1cImdyZXk2MFwiPkxvYWRpbmcgZGFzaGJvYXJkLi4uPC9UZXh0PlxuICAgICAgPC9Cb3g+XG4gICAgKTtcbiAgfVxuXG4gIGlmICghZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94IHA9XCJ4eGxcIiB0ZXh0QWxpZ249XCJjZW50ZXJcIj5cbiAgICAgICAgPFRleHQgZm9udFNpemU9XCJsZ1wiIGNvbG9yPVwiZXJyb3JcIj5VbmFibGUgdG8gbG9hZCBkYXNoYm9hcmQgZGF0YTwvVGV4dD5cbiAgICAgIDwvQm94PlxuICAgICk7XG4gIH1cblxuICBjb25zdCBpc0FkbWluID0gZGF0YS5yb2xlID09PSAnYWRtaW4nO1xuXG4gIHJldHVybiAoXG4gICAgPEJveCB2YXJpYW50PVwiZ3JleVwiIHN0eWxlPXt7IG1pbkhlaWdodDogJzEwMHZoJywgcGFkZGluZzogJzI0cHgnIH19PlxuICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgIDxCb3ggbWI9XCJ4bFwiPlxuICAgICAgICA8SDMgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnOHB4JywgZm9udFNpemU6ICcyOHB4JywgZm9udFdlaWdodDogJzcwMCcsIGNvbG9yOiAnIzBGMTcyQScgfX0+XG4gICAgICAgICAgV2VsY29tZSBiYWNrLCB7ZGF0YS51c2VyTmFtZX1cbiAgICAgICAgPC9IMz5cbiAgICAgICAgPFRleHQgZm9udFNpemU9XCJkZWZhdWx0XCIgY29sb3I9XCJncmV5NjBcIj5cbiAgICAgICAgICB7aXNBZG1pbiA/ICdBZG1pbmlzdHJhdG9yIERhc2hib2FyZCcgOiAnVXNlciBEYXNoYm9hcmQnfVxuICAgICAgICA8L1RleHQ+XG4gICAgICA8L0JveD5cblxuICAgICAgey8qIEFkbWluIERhc2hib2FyZCAqL31cbiAgICAgIHtpc0FkbWluICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICB7LyogVXNlciBTdGF0cyAqL31cbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxINSBtYj1cImRlZmF1bHRcIiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5Vc2VyIE92ZXJ2aWV3PC9INT5cbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI0MHB4LCAxZnIpKScsXG4gICAgICAgICAgICAgICAgZ2FwOiAnMjBweCcsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiVG90YWwgVXNlcnNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLnRvdGFsVXNlcnN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjN0MzQUVEXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJBZG1pbmlzdHJhdG9yc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2RhdGEuYWRtaW5Vc2Vyc31cbiAgICAgICAgICAgICAgICBjb2xvcj1cIiNGNTlFMEJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgICAgICB0aXRsZT1cIlJlZ3VsYXIgVXNlcnNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLnJlZ3VsYXJVc2Vyc31cbiAgICAgICAgICAgICAgICBjb2xvcj1cIiMwNTk2NjlcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICB7LyogUHJvZHVjdCBTdGF0cyAqL31cbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxINSBtYj1cImRlZmF1bHRcIiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5DYXRhbG9nIE92ZXJ2aWV3PC9INT5cbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI0MHB4LCAxZnIpKScsXG4gICAgICAgICAgICAgICAgZ2FwOiAnMjBweCcsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiVG90YWwgUHJvZHVjdHNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLnRvdGFsUHJvZHVjdHN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjN0MzQUVEXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJDYXRlZ29yaWVzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZGF0YS50b3RhbENhdGVnb3JpZXN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjM0I4MkY2XCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJMb3cgU3RvY2sgSXRlbXNcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLmxvd1N0b2NrUHJvZHVjdHN9XG4gICAgICAgICAgICAgICAgc3VidGl0bGU9XCJMZXNzIHRoYW4gMTAgdW5pdHNcIlxuICAgICAgICAgICAgICAgIGNvbG9yPVwiI0RDMjYyNlwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgIHsvKiBPcmRlciBTdGF0cyAqL31cbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxINSBtYj1cImRlZmF1bHRcIiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5TYWxlcyBPdmVydmlldzwvSDU+XG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyNDBweCwgMWZyKSknLFxuICAgICAgICAgICAgICAgIGdhcDogJzIwcHgnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgICAgICB0aXRsZT1cIlRvdGFsIE9yZGVyc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2RhdGEudG90YWxPcmRlcnN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjN0MzQUVEXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJQZW5kaW5nIE9yZGVyc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2RhdGEucGVuZGluZ09yZGVyc31cbiAgICAgICAgICAgICAgICBjb2xvcj1cIiNGNTlFMEJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgICAgICB0aXRsZT1cIlByb2Nlc3NpbmdcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLnByb2Nlc3NpbmdPcmRlcnN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjM0I4MkY2XCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPFN0YXRDYXJkXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJEZWxpdmVyZWRcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtkYXRhLmRlbGl2ZXJlZE9yZGVyc31cbiAgICAgICAgICAgICAgICBjb2xvcj1cIiMwNTk2NjlcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICB7LyogUmV2ZW51ZSBTdGF0cyAqL31cbiAgICAgICAgICA8Qm94IG1iPVwibGdcIj5cbiAgICAgICAgICAgIDxINSBtYj1cImRlZmF1bHRcIiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5SZXZlbnVlIE92ZXJ2aWV3PC9INT5cbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI0MHB4LCAxZnIpKScsXG4gICAgICAgICAgICAgICAgZ2FwOiAnMjBweCcsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiVG90YWwgUmV2ZW51ZVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2AkJHsoZGF0YS50b3RhbFJldmVudWUgfHwgMCkudG9GaXhlZCgyKX1gfVxuICAgICAgICAgICAgICAgIGNvbG9yPVwiIzA1OTY2OVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiUGVuZGluZyBSZXZlbnVlXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17YCQkeyhkYXRhLnBlbmRpbmdSZXZlbnVlIHx8IDApLnRvRml4ZWQoMil9YH1cbiAgICAgICAgICAgICAgICBzdWJ0aXRsZT1cIkZyb20gcGVuZGluZyBvcmRlcnNcIlxuICAgICAgICAgICAgICAgIGNvbG9yPVwiI0Y1OUUwQlwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgIHsvKiBSZWNlbnQgQWN0aXZpdHkgKi99XG4gICAgICAgICAge2RhdGEucmVjZW50T3JkZXJzICYmIGRhdGEucmVjZW50T3JkZXJzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgPEg1IG1iPVwiZGVmYXVsdFwiIHN0eWxlPXt7IGNvbG9yOiAnIzFFMjkzQicsIGZvbnRXZWlnaHQ6ICc2MDAnIH19PlJlY2VudCBPcmRlcnM8L0g1PlxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZTVlN2ViJyxcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJveCBzdHlsZT17eyBvdmVyZmxvd1g6ICdhdXRvJyB9fT5cbiAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBib3JkZXJDb2xsYXBzZTogJ2NvbGxhcHNlJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgICAgICAgICAgIDx0ciBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnI0Y5RkFGQicsIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjZTVlN2ViJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JywgdGV4dEFsaWduOiAnbGVmdCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM2QjcyODAnIH19Pk9yZGVyIElEPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JywgdGV4dEFsaWduOiAnbGVmdCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM2QjcyODAnIH19PkN1c3RvbWVyPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JywgdGV4dEFsaWduOiAnbGVmdCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM2QjcyODAnIH19PlN0YXR1czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzEycHggMTZweCcsIHRleHRBbGlnbjogJ3JpZ2h0JywgZm9udFNpemU6ICcxM3B4JywgZm9udFdlaWdodDogJzYwMCcsIGNvbG9yOiAnIzZCNzI4MCcgfX0+VG90YWw8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICB7ZGF0YS5yZWNlbnRPcmRlcnMubWFwKChvcmRlciwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtvcmRlci5pZH0gc3R5bGU9e3sgYm9yZGVyQm90dG9tOiBpZHggPCBkYXRhLnJlY2VudE9yZGVycy5sZW5ndGggLSAxID8gJzFweCBzb2xpZCAjZjNmNGY2JyA6ICdub25lJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4IDE2cHgnLCBmb250U2l6ZTogJzE0cHgnLCBjb2xvcjogJyMzNzQxNTEnLCBmb250V2VpZ2h0OiAnNTAwJyB9fT4je29yZGVyLmlkfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JywgZm9udFNpemU6ICcxNHB4JywgY29sb3I6ICcjMzc0MTUxJyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXIuY3VzdG9tZXI/Lm5hbWUgfHwgJ04vQSd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzRweCAxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBvcmRlci5zdGF0dXMgPT09ICdkZWxpdmVyZWQnID8gJyNEMUZBRTUnIDogb3JkZXIuc3RhdHVzID09PSAncGVuZGluZycgPyAnI0ZFRjNDNycgOiAnI0RCRUFGRScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogb3JkZXIuc3RhdHVzID09PSAnZGVsaXZlcmVkJyA/ICcjMDY1RjQ2JyA6IG9yZGVyLnN0YXR1cyA9PT0gJ3BlbmRpbmcnID8gJyM5MjQwMEUnIDogJyMxRTQwQUYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge29yZGVyLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMTJweCAxNnB4JywgZm9udFNpemU6ICcxNHB4JywgY29sb3I6ICcjMzc0MTUxJywgZm9udFdlaWdodDogJzYwMCcsIHRleHRBbGlnbjogJ3JpZ2h0JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkeyhvcmRlci50b3RhbCB8fCAwKS50b0ZpeGVkKDIpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC8+XG4gICAgICApfVxuXG4gICAgICB7LyogVXNlciBEYXNoYm9hcmQgKi99XG4gICAgICB7IWlzQWRtaW4gJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIDxCb3ggbWI9XCJsZ1wiPlxuICAgICAgICAgICAgPEg1IG1iPVwiZGVmYXVsdFwiIHN0eWxlPXt7IGNvbG9yOiAnIzFFMjkzQicsIGZvbnRXZWlnaHQ6ICc2MDAnIH19Pk15IE92ZXJ2aWV3PC9INT5cbiAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI0MHB4LCAxZnIpKScsXG4gICAgICAgICAgICAgICAgZ2FwOiAnMjBweCcsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiQXZhaWxhYmxlIFByb2R1Y3RzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZGF0YS50b3RhbFByb2R1Y3RzfVxuICAgICAgICAgICAgICAgIGNvbG9yPVwiIzdDM0FFRFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiQ2F0ZWdvcmllc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2RhdGEudG90YWxDYXRlZ29yaWVzfVxuICAgICAgICAgICAgICAgIGNvbG9yPVwiIzNCODJGNlwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxTdGF0Q2FyZFxuICAgICAgICAgICAgICAgIHRpdGxlPVwiTXkgT3JkZXJzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZGF0YS5teU9yZGVyc31cbiAgICAgICAgICAgICAgICBjb2xvcj1cIiMwNTk2NjlcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgICAgICB0aXRsZT1cIlBlbmRpbmcgT3JkZXJzXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17ZGF0YS5teVBlbmRpbmdPcmRlcnN9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjRjU5RTBCXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgPEJveCBtYj1cImxnXCI+XG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoYXV0by1maXQsIG1pbm1heCgyNDBweCwgMWZyKSknLFxuICAgICAgICAgICAgICAgIGdhcDogJzIwcHgnLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8U3RhdENhcmRcbiAgICAgICAgICAgICAgICB0aXRsZT1cIlRvdGFsIFNwZW50XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17YCQkeyhkYXRhLm15VG90YWxTcGVudCB8fCAwKS50b0ZpeGVkKDIpfWB9XG4gICAgICAgICAgICAgICAgY29sb3I9XCIjMDU5NjY5XCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAge2RhdGEubXlSZWNlbnRPcmRlcnMgJiYgZGF0YS5teVJlY2VudE9yZGVycy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgIDxINSBtYj1cImRlZmF1bHRcIiBzdHlsZT17eyBjb2xvcjogJyMxRTI5M0InLCBmb250V2VpZ2h0OiAnNjAwJyB9fT5NeSBSZWNlbnQgT3JkZXJzPC9INT5cbiAgICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2U1ZTdlYicsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxCb3ggc3R5bGU9e3sgb3ZlcmZsb3dYOiAnYXV0bycgfX0+XG4gICAgICAgICAgICAgICAgICA8dGFibGUgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgYm9yZGVyQ29sbGFwc2U6ICdjb2xsYXBzZScgfX0+XG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgICAgICAgICA8dHIgc3R5bGU9e3sgYmFja2dyb3VuZDogJyNGOUZBRkInLCBib3JkZXJCb3R0b206ICcxcHggc29saWQgI2U1ZTdlYicgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzEycHggMTZweCcsIHRleHRBbGlnbjogJ2xlZnQnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6ICcjNkI3MjgwJyB9fT5PcmRlciBJRDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgcGFkZGluZzogJzEycHggMTZweCcsIHRleHRBbGlnbjogJ2xlZnQnLCBmb250U2l6ZTogJzEzcHgnLCBmb250V2VpZ2h0OiAnNjAwJywgY29sb3I6ICcjNkI3MjgwJyB9fT5TdGF0dXM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4IDE2cHgnLCB0ZXh0QWxpZ246ICdyaWdodCcsIGZvbnRTaXplOiAnMTNweCcsIGZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogJyM2QjcyODAnIH19PlRvdGFsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAge2RhdGEubXlSZWNlbnRPcmRlcnMubWFwKChvcmRlciwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtvcmRlci5pZH0gc3R5bGU9e3sgYm9yZGVyQm90dG9tOiBpZHggPCBkYXRhLm15UmVjZW50T3JkZXJzLmxlbmd0aCAtIDEgPyAnMXB4IHNvbGlkICNmM2Y0ZjYnIDogJ25vbmUnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9e3sgcGFkZGluZzogJzEycHggMTZweCcsIGZvbnRTaXplOiAnMTRweCcsIGNvbG9yOiAnIzM3NDE1MScsIGZvbnRXZWlnaHQ6ICc1MDAnIH19PiN7b3JkZXIuaWR9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4IDE2cHgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNHB4IDEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNTAwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IG9yZGVyLnN0YXR1cyA9PT0gJ2RlbGl2ZXJlZCcgPyAnI0QxRkFFNScgOiBvcmRlci5zdGF0dXMgPT09ICdwZW5kaW5nJyA/ICcjRkVGM0M3JyA6ICcjREJFQUZFJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBvcmRlci5zdGF0dXMgPT09ICdkZWxpdmVyZWQnID8gJyMwNjVGNDYnIDogb3JkZXIuc3RhdHVzID09PSAncGVuZGluZycgPyAnIzkyNDAwRScgOiAnIzFFNDBBRicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7b3JkZXIuc3RhdHVzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcxMnB4IDE2cHgnLCBmb250U2l6ZTogJzE0cHgnLCBjb2xvcjogJyMzNzQxNTEnLCBmb250V2VpZ2h0OiAnNjAwJywgdGV4dEFsaWduOiAncmlnaHQnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7KG9yZGVyLnRvdGFsIHx8IDApLnRvRml4ZWQoMil9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICApfVxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vc3JjL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmQiXSwibmFtZXMiOlsiU3RhdENhcmQiLCJ0aXRsZSIsInZhbHVlIiwic3VidGl0bGUiLCJjb2xvciIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsImZsZXgiLCJmbGV4RGlyZWN0aW9uIiwic3R5bGUiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImJveFNoYWRvdyIsImJvcmRlciIsIm1pbkhlaWdodCIsInRyYW5zaXRpb24iLCJjdXJzb3IiLCJvbk1vdXNlRW50ZXIiLCJlIiwiY3VycmVudFRhcmdldCIsInRyYW5zZm9ybSIsIm9uTW91c2VMZWF2ZSIsIlRleHQiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJtYiIsIkgzIiwibWFyZ2luIiwidW5kZWZpbmVkIiwibXQiLCJEYXNoYm9hcmQiLCJkYXRhIiwic2V0RGF0YSIsInVzZVN0YXRlIiwibG9hZGluZyIsInNldExvYWRpbmciLCJ1c2VFZmZlY3QiLCJhcGkiLCJBcGlDbGllbnQiLCJnZXREYXNoYm9hcmQiLCJ0aGVuIiwicmVzcG9uc2UiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsInAiLCJ0ZXh0QWxpZ24iLCJpc0FkbWluIiwicm9sZSIsInZhcmlhbnQiLCJtYXJnaW5Cb3R0b20iLCJ1c2VyTmFtZSIsIkZyYWdtZW50IiwiSDUiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImdhcCIsInRvdGFsVXNlcnMiLCJhZG1pblVzZXJzIiwicmVndWxhclVzZXJzIiwidG90YWxQcm9kdWN0cyIsInRvdGFsQ2F0ZWdvcmllcyIsImxvd1N0b2NrUHJvZHVjdHMiLCJ0b3RhbE9yZGVycyIsInBlbmRpbmdPcmRlcnMiLCJwcm9jZXNzaW5nT3JkZXJzIiwiZGVsaXZlcmVkT3JkZXJzIiwidG90YWxSZXZlbnVlIiwidG9GaXhlZCIsInBlbmRpbmdSZXZlbnVlIiwicmVjZW50T3JkZXJzIiwibGVuZ3RoIiwib3ZlcmZsb3ciLCJvdmVyZmxvd1giLCJ3aWR0aCIsImJvcmRlckNvbGxhcHNlIiwiYm9yZGVyQm90dG9tIiwibWFwIiwib3JkZXIiLCJpZHgiLCJrZXkiLCJpZCIsImN1c3RvbWVyIiwibmFtZSIsInN0YXR1cyIsInRvdGFsIiwibXlPcmRlcnMiLCJteVBlbmRpbmdPcmRlcnMiLCJteVRvdGFsU3BlbnQiLCJteVJlY2VudE9yZGVycyIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUlBLE1BQU1BLFFBQVEsR0FBR0EsQ0FBQztJQUFFQyxLQUFLO0lBQUVDLEtBQUs7SUFBRUMs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
