import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#2D3748',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#3B87FA',
    paddingBottom: 20,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A365D',
    letterSpacing: 1,
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A365D',
    marginBottom: 4,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
  },
  infoBox: {
    width: '45%',
  },
  label: {
    fontSize: 7,
    color: '#718096',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
    color: '#2D3748',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1A365D',
    padding: 10,
    borderRadius: 4,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#EDF2F7',
    padding: 10,
    alignItems: 'center',
  },
  col1: { width: '65%' },
  col2: { width: '15%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  paymentDetails: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    width: '50%',
  },
  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalBox: {
    width: '40%',
    padding: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: 2,
    borderTopColor: '#1A365D',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  footerText: {
    color: '#718096',
    fontSize: 7,
    marginBottom: 4,
  },
  stamp: {
    marginTop: 10,
    color: '#38A169',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: 2,
    borderColor: '#38A169',
    padding: 5,
    width: 80,
    textAlign: 'center',
    transform: 'rotate(-5deg)',
    alignSelf: 'flex-end',
  }
});

interface InvoiceProps {
  orderData: {
    orderId: string;
    date: string;
    customerName: string;
    customerEmail: string;
    formationState?: string;
    paymentMethod?: string;
    items: Array<{
      description: string;
      amount: number;
    }>;
    totalAmount: number;
    gstAmount?: number;
    subtotalAmount?: number;
  };
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({ orderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={{ marginTop: 5, color: '#4A5568', fontSize: 10 }}>No: #{orderData.orderId}</Text>
          <View style={styles.stamp}>
            <Text>PAID</Text>
          </View>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>Crossventura LLC</Text>
          <Text style={styles.value}>16192 Coastal Highway</Text>
          <Text style={styles.value}>Lewes, Delaware 19958, USA</Text>
          <Text style={styles.value}>EIN: 98-XXXXXXX</Text>
          <Text style={[styles.value, { color: '#3B87FA' }]}>www.crossventura.com</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Bill To:</Text>
          <Text style={[styles.value, { fontWeight: 'bold', fontSize: 12 }]}>{orderData.customerName}</Text>
          <Text style={styles.value}>{orderData.customerEmail}</Text>
          <Text style={[styles.value, { marginTop: 4, color: '#718096' }]}>Nature of Service: Business Formation</Text>
        </View>
        <View style={[styles.infoBox, { textAlign: 'right' }]}>
          <Text style={styles.label}>Invoice Details:</Text>
          <Text style={styles.value}>Date: {orderData.date}</Text>
          {orderData.formationState && (
            <Text style={styles.value}>State: {orderData.formationState}</Text>
          )}
          <Text style={styles.value}>Currency: USD ($)</Text>
          <Text style={styles.value}>Payment Status: Successful</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.col1]}>Service Description</Text>
          <Text style={[styles.headerText, styles.col2]}>Qty</Text>
          <Text style={[styles.headerText, styles.col3]}>Total Amount</Text>
        </View>
        {orderData.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.value, styles.col1, { fontWeight: 'bold' }]}>
              {item.description}
            </Text>
            <Text style={[styles.value, styles.col2]}>1</Text>
            <Text style={[styles.value, styles.col3]}>
              {item.amount > 0 ? `$${item.amount.toFixed(2)}` : 'Included'}
            </Text>
          </View>
        ))}
      </View>

      {/* Payment & Totals */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={styles.paymentDetails}>
          <Text style={styles.label}>Payment Information:</Text>
          <Text style={styles.value}>Method: {orderData.paymentMethod || 'Stripe / Credit Card'}</Text>
          <Text style={[styles.value, { marginTop: 4, fontSize: 8, color: '#718096' }]}>
            Transaction secured by Stripe encryption.
          </Text>
        </View>

        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={{ color: '#718096' }}>Subtotal</Text>
            <Text>${(orderData.subtotalAmount || (orderData.totalAmount - (orderData.gstAmount || 0))).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ color: '#718096' }}>GST (19%)</Text>
            <Text>${(orderData.gstAmount || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>${orderData.totalAmount.toFixed(2)} USD</Text>
          </View>
        </View>
      </View>

      {/* Tax Note */}
      <View style={{ marginTop: 20, padding: 10, backgroundColor: '#F0FFF4', borderRadius: 4 }}>
        <Text style={{ color: '#2F855A', fontSize: 8 }}>
          Note: This invoice includes a 19% GST as per the applicable service regulations.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Crossventura LLC is a registered business in the State of Delaware, USA.</Text>
        <Text style={styles.footerText}>For any billing queries, please contact: support@crossventura.com</Text>
        <Text style={[styles.footerText, { marginTop: 10, fontSize: 6 }]}>
          This document is electronically generated and serves as an official receipt of payment.
        </Text>
      </View>
    </Page>
  </Document>
);

export default InvoiceTemplate;
