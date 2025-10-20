import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';

export const useNotifications = (marketData) => {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  const sendNotification = useCallback((title, options) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/crypto-icon.png',
        badge: '/crypto-icon.png',
        ...options,
      });
    }
  }, [permission]);

  const checkAlerts = useCallback(() => {
    if (!marketData.length) return;

    const alerts = storageService.getAlerts();
    const prefs = storageService.getPreferences();

    if (!prefs.notifications) return;

    alerts.forEach(alert => {
      if (alert.triggered) return;

      const coin = marketData.find(c => c.id === alert.coinId);
      if (!coin) return;

      let triggered = false;
      let message = '';

      if (alert.type === 'above' && coin.current_price >= alert.price) {
        triggered = true;
        message = `${coin.symbol.toUpperCase()} is now above $${alert.price}!`;
      } else if (alert.type === 'below' && coin.current_price <= alert.price) {
        triggered = true;
        message = `${coin.symbol.toUpperCase()} dropped below $${alert.price}!`;
      }

      if (triggered) {
        sendNotification(`Price Alert: ${coin.name}`, {
          body: message,
          tag: alert.id,
        });
        storageService.updateAlert(alert.id, { triggered: true });
      }
    });
  }, [marketData, sendNotification]);

  useEffect(() => {
    checkAlerts();
  }, [checkAlerts]);

  return { permission, requestPermission, sendNotification };
};
